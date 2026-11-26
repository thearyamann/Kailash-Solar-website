import { NextRequest, NextResponse } from "next/server";
import {
  addNoteToZohoLead,
  addTagsToZohoLead,
  createZohoLead,
  findZohoLeadByPhone,
  hasZohoCredentials,
  updateZohoLead,
} from "@/lib/zoho";
import { sendCustomerAcknowledgement, sendTeamLeadAlert } from "@/lib/whatsapp";
import { istNowString, toWhatsappNumber } from "@/lib/env";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Which website form the lead came from. Only "book_visit" counts as a booked site visit.
const SOURCES: Record<string, { label: string; leadSource: string }> = {
  book_visit: { label: "Website – Book Free Site Visit", leadSource: "Website Book Visit Form" },
  consultation: { label: "Website – Free Consultation form", leadSource: "Website Consultation Form" },
  quote: { label: "Website – Solar Quote / Book Installation", leadSource: "Website Quote Form" },
  contact: { label: "Website – Contact Us form", leadSource: "Website Contact Form" },
};

const str = (v: unknown) => (v === undefined || v === null ? "" : String(v).trim());

// Short Zoho tags per channel (Zoho tag names must stay short); other channels go in the notes only.
const CHANNEL_TAGS: Record<string, string> = {
  "Google Ads": "Google Ads Lead",
  "Meta Ads (Facebook/Instagram)": "Meta Ads Lead",
  "Google Search (free)": "Google Organic Lead",
};

/**
 * Turns the browser's attribution (see lib/attribution.ts) into lines for Zoho / the team alert.
 * Everything is treated as untrusted text: only known fields, clipped, single-line.
 */
function describeAttribution(raw: unknown): { channel: string; lines: string[]; tag?: string } | null {
  if (!raw || typeof raw !== "object") return null;
  const clean = (v: unknown, max = 120) => str(v).replace(/[\r\n\t]+/g, " ").slice(0, max);
  const touch = (t: any) => (t && typeof t === "object" ? t : null);
  const a = raw as { first?: unknown; last?: unknown };
  const last = touch(a.last) || touch(a.first);
  const first = touch(a.first);
  if (!last) return null;

  const channel = clean(last.channel, 60) || "Direct / Unknown";
  const lines = [
    `Lead Source (ad/channel): ${channel}`,
    clean(last.utm_campaign) && `Campaign: ${clean(last.utm_campaign)}`,
    clean(last.utm_term) && `Keyword: ${clean(last.utm_term)}`,
    clean(last.utm_content) && `Ad: ${clean(last.utm_content)}`,
    clean(last.utm_source) && `UTM: ${clean(last.utm_source)} / ${clean(last.utm_medium) || "-"}`,
    clean(last.landing_page) && `Landing page: ${clean(last.landing_page)}`,
    clean(last.referrer, 200) && `Came from: ${clean(last.referrer, 200)}`,
    clean(last.gclid, 300) && `GCLID: ${clean(last.gclid, 300)}`,
    clean(last.gbraid, 300) && `GBRAID: ${clean(last.gbraid, 300)}`,
    clean(last.wbraid, 300) && `WBRAID: ${clean(last.wbraid, 300)}`,
    clean(last.fbclid, 300) && `FBCLID: ${clean(last.fbclid, 300)}`,
    first && first !== last && clean(first.channel, 60) && clean(first.channel, 60) !== channel
      ? `First visit came from: ${clean(first.channel, 60)}`
      : "",
  ].filter(Boolean) as string[];

  return { channel, lines, tag: CHANNEL_TAGS[channel] };
}

/**
 * Website Lead Endpoint: POST /api/book-visit
 * Used by every website form (Book Visit page/modal, Consultation, Quote, Contact):
 * 1. Creates or updates the lead in Zoho CRM (name, phone, PIN code, address)
 * 2. Tags it 'Hot Lead - Interested' / 'Website Lead' (+ 'Site Visit Booked' for bookings) so cold follow-ups STOP
 * 3. Sends an instant free-form WhatsApp alert with the lead's details to the Kailash Solar team number
 * 4. Sends the approved "request received" acknowledgement template to the customer
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const sourceKey = SOURCES[str(body.source)] ? str(body.source) : "book_visit";
    const source = SOURCES[sourceKey];
    const isBooking = sourceKey === "book_visit";

    const name = str(body.name || body.customer_name || body.fullName) || "Customer";
    const rawPhone = str(body.phone || body.mobile || body.phone1);
    const city = str(body.city) || "Meerut";
    const address = str(body.address);
    const pincode = str(body.pincode || body.pin_code || body.zip).replace(/\D/g, "").slice(0, 6);
    const preferredDate = str(body.preferred_date || body.visit_date || body.date);
    const plantSize = str(body.plant_size_kw || body.recommended_plant_size_kw);
    const monthlyBill = str(body.monthly_bill || body.monthlyBill);
    const message = str(body.message).slice(0, 500);

    if (!rawPhone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400, headers: corsHeaders });
    }
    const waPhone = toWhatsappNumber(rawPhone);
    if (!waPhone) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number" },
        { status: 400, headers: corsHeaders }
      );
    }

    const nowStr = istNowString();
    const details = [
      `Form: ${source.label}`,
      preferredDate && `Preferred Date: ${preferredDate}`,
      pincode && `PIN Code: ${pincode}`,
      address && `Address: ${address}`,
      plantSize && `Plant Size: ${plantSize} kW`,
      monthlyBill && `Monthly Bill: ${monthlyBill}`,
      message && `Message: ${message}`,
    ].filter(Boolean) as string[];
    const attribution = describeAttribution(body.attribution);
    if (attribution) details.push("", ...attribution.lines);

    let leadId: string | undefined;
    let isNewLead = false;

    if (hasZohoCredentials()) {
      try {
        const existingLead = await findZohoLeadByPhone(waPhone);
        leadId = existingLead?.id;

        if (!leadId) {
          leadId = await createZohoLead({
            Last_Name: name,
            Full_Name: name,
            Phone: `+${waPhone}`,
            City: city,
            Street: address || undefined,
            Zip_Code: pincode || undefined,
            Lead_Source: source.leadSource,
            Lead_Status: isBooking ? "Site Visit Scheduled" : "Not Contacted",
            Description: `${source.label} submitted on ${nowStr}.\n${details.join("\n")}`,
          });
          isNewLead = true;
          console.log(`✓ Created new lead in Zoho CRM for ${name} (ID: ${leadId})`);
        } else {
          console.log(`✓ Found existing lead in Zoho CRM for ${name} (ID: ${leadId})`);
          const updates: Record<string, string> = {};
          if (pincode) updates.Zip_Code = pincode;
          if (address) updates.Street = address;
          if (isBooking) updates.Lead_Status = "Site Visit Scheduled";
          if (Object.keys(updates).length) await updateZohoLead(leadId, updates);
        }

        // Tag in Zoho CRM to immediately stop cold follow-ups
        await addTagsToZohoLead(leadId, [
          ...(isBooking
            ? ["Hot Lead - Interested", "Website Lead", "Site Visit Booked", "Site Visit Scheduled"]
            : ["Hot Lead - Interested", "Website Lead"]),
          ...(attribution?.tag ? [attribution.tag] : []),
        ]);
        await addNoteToZohoLead(
          leadId,
          isBooking ? "Website Site Visit Booked" : `Website Lead: ${source.label}`,
          `Customer submitted ${source.label} on ${nowStr}.\n${details.join("\n")}`
        );
      } catch (zohoErr) {
        // The team alert below still goes out so the lead is never lost.
        console.error("Zoho CRM sync error:", zohoErr);
      }
    } else {
      console.log("[Local / Mock Mode] Zoho credentials not provided, generating mock lead ID.");
    }

    // Instant free-form alert to the Kailash Solar team number
    await sendTeamLeadAlert({
      name,
      phone: waPhone,
      city,
      pincode,
      address,
      message,
      extra: [
        preferredDate && `📅 *Preferred Visit Date:* ${preferredDate}`,
        plantSize && `⚡ *Solar Plant:* ${plantSize} kW`,
        monthlyBill && `💡 *Monthly Bill:* ${monthlyBill}`,
        attribution &&
          `📣 *Came from:* ${attribution.channel}` +
            (attribution.lines.find((l) => l.startsWith("Keyword: "))
              ? ` (${attribution.lines.find((l) => l.startsWith("Keyword: "))})`
              : ""),
      ]
        .filter(Boolean)
        .join("\n"),
      source: source.label,
      leadId,
      isNewLead,
    });

    // Customer confirmation via the approved UTILITY template (free-form text would not be delivered
    // because the customer has not messaged us in the last 24 hours).
    const ack = await sendCustomerAcknowledgement(waPhone);
    if (!ack.ok) console.error(`✗ Customer acknowledgement to +${waPhone} failed: ${ack.error}`);

    return NextResponse.json(
      {
        success: true,
        message: "Lead received and synced to Zoho CRM",
        lead_id: leadId || `ks_lead_${Date.now()}`,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("Book visit handler error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}

/**
 * Handle CORS preflight options request
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
