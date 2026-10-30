import { NextRequest, NextResponse } from "next/server";
import { findZohoLeadByPhone, addNoteToZohoLead, addTagToZohoLead } from "@/lib/zoho";

/**
 * WhatsApp Website Visit Tracking Endpoint
 * When customer taps "Visit Website" button in WhatsApp, it redirects through here:
 * 1. Logs website visit into Zoho CRM lead notes
 * 2. Tags the lead as 'Visited Website' in Zoho CRM
 * 3. Immediately redirects customer to https://kailashsolar.com
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");
  const leadId = searchParams.get("lead_id");
  const targetUrl = searchParams.get("dest") || "https://kailashsolar.com/";

  if (phone || leadId) {
    try {
      let targetLeadId = leadId;
      if (!targetLeadId && phone) {
        const lead = await findZohoLeadByPhone(phone);
        if (lead && lead.id) {
          targetLeadId = lead.id;
        }
      }

      if (targetLeadId) {
        const nowStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        await addNoteToZohoLead(
          targetLeadId,
          "Website Visit from WhatsApp",
          `Customer clicked "Visit Website" button on WhatsApp and visited website on ${nowStr}. Scheduled for website follow-up.`
        );
        await addTagToZohoLead(targetLeadId, "Visited Website");
        console.log(`✓ Tracked website visit for Zoho Lead ID ${targetLeadId}`);
      }
    } catch (err) {
      console.error("Failed to log website visit to Zoho CRM:", err);
    }
  }

  // Redirect to official website
  return NextResponse.redirect(new URL(targetUrl), 302);
}
