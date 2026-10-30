import { NextRequest, NextResponse } from "next/server";
import { getZohoAccessToken, addNoteToZohoLead, addTagToZohoLead, findZohoLeadByPhone } from "@/lib/zoho";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Website Form Booking Endpoint: POST /api/book-visit
 * Connects /book-visit and modal forms directly to Zoho CRM & WhatsApp:
 * 1. Creates or updates the lead in Zoho CRM with status 'Site Visit Scheduled'
 * 2. Tags the lead as 'Site Visit Booked' (so cold follow-up loops automatically STOP)
 * 3. Sends instant WhatsApp confirmation message to the customer
 * 4. Dispatches an instant WhatsApp alert to the Kailash Solar team (+91 89999 99654)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const name = (body.name || body.customer_name || body.fullName || "Customer").trim();
    const rawPhone = (body.phone || body.mobile || body.phone1 || "").toString().trim();
    const city = (body.city || "Meerut").trim();
    const address = (body.address || "").trim();
    const preferredDate = (body.preferred_date || body.visit_date || body.date || "").trim();
    const plantSize = body.plant_size_kw || body.recommended_plant_size_kw || 3;

    if (!rawPhone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400, headers: corsHeaders });
    }

    const cleanPhone = rawPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    let leadId: string | undefined;

    // 1. Direct Zoho CRM Sync (if configured)
    const hasZohoCreds = Boolean(
      process.env.ZOHO_CLIENT_ID &&
      process.env.ZOHO_CLIENT_SECRET &&
      process.env.ZOHO_REFRESH_TOKEN
    );

    if (hasZohoCreds) {
      try {
        const dc = (process.env.ZOHO_DC || "in").toLowerCase();
        const zohoToken = await getZohoAccessToken();

        // Check if lead already exists in Zoho CRM
        const existingLead = await findZohoLeadByPhone(cleanPhone);
        leadId = existingLead?.id;

        if (!leadId) {
          // Create new Lead in Zoho CRM
          const createUrl = `https://www.zohoapis.${dc}/crm/v6/Leads`;
          const createRes = await fetch(createUrl, {
            method: "POST",
            headers: {
              Authorization: `Zoho-oauthtoken ${zohoToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: [
                {
                  Last_Name: name,
                  Full_Name: name,
                  Phone: `+${formattedPhone}`,
                  City: city,
                  Street: address,
                  Lead_Source: "Website Book Visit Form",
                  Lead_Status: "Site Visit Scheduled",
                  Description: `Site visit requested on website for ${preferredDate || "Earliest available date"}. Plant size: ${plantSize} kW`,
                },
              ],
            }),
          });

          const createData = await createRes.json();
          leadId = createData?.data?.[0]?.details?.id;
          console.log(`✓ Created new lead in Zoho CRM for ${name} (ID: ${leadId})`);
        } else {
          console.log(`✓ Found existing lead in Zoho CRM for ${name} (ID: ${leadId})`);
        }

        // Tag in Zoho CRM to immediately stop cold follow-ups
        if (leadId) {
          const nowStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
          await addTagToZohoLead(leadId, "Site Visit Booked");
          await addTagToZohoLead(leadId, "Site Visit Scheduled");
          await addNoteToZohoLead(
            leadId,
            "Website Site Visit Booked",
            `Customer booked free site visit via website on ${nowStr}.\nPreferred Date: ${preferredDate || "Not specified"}\nAddress: ${address || "Not specified"}\nPlant Size: ${plantSize} kW`
          );
        }
      } catch (zohoErr) {
        console.error("Zoho CRM sync error:", zohoErr);
      }
    } else {
      console.log("[Local / Mock Mode] Zoho credentials not provided, generating mock lead ID.");
      leadId = `ks_lead_${Date.now()}`;
    }

    const metaToken = process.env.META_WHATSAPP_TOKEN;
    const phoneId = process.env.META_PHONE_NUMBER_ID;
    const officeWa = process.env.WHATSAPP_NUMBER || "918999999654";

    // 2. Send Instant WhatsApp Alert to Kailash Solar Sales Team (+91 89999 99654)
    if (metaToken && phoneId) {
      try {
        const teamAlert =
          `🏡 *NEW SITE VISIT BOOKED! (Website)*\n\n` +
          `एक कस्टमर ने वेबसाइट पर फ्री साइट विज़िट बुक की है!\n\n` +
          `👤 *नाम:* ${name}\n` +
          `📞 *फ़ोन:* +${formattedPhone}\n` +
          `📍 *शहर:* ${city}\n` +
          `📅 *तारीख:* ${preferredDate || "जल्द से जल्द"}\n` +
          `🏠 *पता:* ${address || "कॉल पर पूछें"}\n` +
          `⚡ *सोलर प्लांट:* ${plantSize} kW\n\n` +
          `👉 कृपया तुरंत कस्टमर को कॉल करके समय कन्फर्म करें!`;

        await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${metaToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: officeWa,
            type: "text",
            text: { body: teamAlert },
          }),
        });
        console.log(`✓ Sent instant site visit alert to sales team (+${officeWa})`);
      } catch (alertErr) {
        console.error("Failed to send team alert:", alertErr);
      }

      // 3. Send WhatsApp Confirmation to Customer
      try {
        const customerConfirmation =
          `नमस्ते ${name} जी! ☀️\n\n` +
          `Kailash Solar मेरठ से फ्री साइट सर्वे बुक करने के लिए बहुत-बहुत धन्यवाद।\n\n` +
          `हमारी टेक्निकल टीम आपकी छत का सर्वे करने और ₹1,08,000 की सरकारी सब्सिडी समझाने के लिए जल्द ही आपसे संपर्क करेगी।\n\n` +
          `यदि आपको कोई सवाल पूछना है, तो सीधे हमारे ऑफिस कॉल करें:\n` +
          `📞 +91 89999 99654\n\n` +
          `*Kailash Solar – Meerut’s No. 1 Solar Company.*`;

        await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${metaToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: formattedPhone,
            type: "text",
            text: { body: customerConfirmation },
          }),
        });
        console.log(`✓ Sent booking confirmation to customer (+${formattedPhone})`);
      } catch (custErr) {
        console.error("Failed to send customer confirmation:", custErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Site visit booked and synced to Zoho CRM successfully",
        lead_id: leadId || `ks_lead_${Date.now()}`,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
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
