import { NextRequest, NextResponse } from "next/server";
import { findZohoLeadByPhone, addNoteToZohoLead, addTagsToZohoLead } from "@/lib/zoho";
import { istNowString } from "@/lib/env";

export const dynamic = "force-dynamic";

const DEFAULT_DEST = "https://www.kailashsolar.com/";

/** Only allow redirects to our own website (prevents this endpoint being used as an open redirect). */
function safeDestination(dest: string | null): string {
  if (!dest) return DEFAULT_DEST;
  try {
    const url = new URL(dest, DEFAULT_DEST);
    return /(^|\.)kailashsolar\.com$/i.test(url.hostname) ? url.toString() : DEFAULT_DEST;
  } catch {
    return DEFAULT_DEST;
  }
}

/**
 * WhatsApp Website Visit Tracking Endpoint
 * When customer taps a tracked "Visit Website" link in WhatsApp, it redirects through here:
 * 1. Logs website visit into Zoho CRM lead notes
 * 2. Tags the lead as 'Visited Website' (the daily cron then sends the one-time website follow-up)
 * 3. Immediately redirects customer to https://www.kailashsolar.com
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  const leadId = searchParams.get("lead_id");
  const targetUrl = safeDestination(searchParams.get("dest"));

  if (phone || leadId) {
    try {
      let targetLeadId = leadId && /^\d{6,25}$/.test(leadId) ? leadId : null;
      if (!targetLeadId && phone) {
        const lead = await findZohoLeadByPhone(phone);
        if (lead && lead.id) {
          targetLeadId = lead.id;
        }
      }

      if (targetLeadId) {
        await addNoteToZohoLead(
          targetLeadId,
          "Website Visit from WhatsApp",
          `Customer clicked "Visit Website" button on WhatsApp and visited website on ${istNowString()}. Scheduled for website follow-up.`
        );
        await addTagsToZohoLead(targetLeadId, ["Visited Website"]);
        console.log(`✓ Tracked website visit for Zoho Lead ID ${targetLeadId}`);
      }
    } catch (err) {
      console.error("Failed to log website visit to Zoho CRM:", err);
    }
  }

  return NextResponse.redirect(targetUrl, 302);
}
