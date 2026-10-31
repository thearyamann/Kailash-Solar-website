import { NextRequest, NextResponse } from "next/server";
import { addNoteToZohoLead, addTagsToZohoLead } from "@/lib/zoho";
import { verifyVisitRef } from "@/lib/tracking";
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
 * The "Book Free Visit" button of the tracked Day 4 template links here with ?r=<leadId>.<signature>:
 * 1. Logs the website visit into the lead's Zoho notes
 * 2. Tags the lead as 'Visited Website' (the daily cron then sends the one-time website follow-up)
 * 3. Immediately redirects the customer to the website
 * Unsigned links only redirect, so nobody can fake visits and trigger paid messages.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const leadId = verifyVisitRef(searchParams.get("r"));
  const targetUrl = safeDestination(searchParams.get("dest"));

  if (leadId) {
    try {
      const tagged = await addTagsToZohoLead(leadId, ["Visited Website"]);
      await addNoteToZohoLead(
        leadId,
        "Website Visit from WhatsApp",
        `Customer tapped "Book Free Visit" on WhatsApp and opened the website on ${istNowString()}. Scheduled for website follow-up.`
      );
      if (tagged) console.log(`✓ Tracked website visit for Zoho Lead ID ${leadId}`);
    } catch (err) {
      console.error("Failed to log website visit to Zoho CRM:", err);
    }
  }

  return NextResponse.redirect(targetUrl, 302);
}
