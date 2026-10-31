import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { addNoteToZohoLead, addTagsToZohoLead, createZohoLead, findZohoLeadByPhone, hasZohoCredentials, zohoTagNames } from "@/lib/zoho";
import { sendCustomerAcknowledgement, sendTeamLeadAlert, teamWhatsappNumber } from "@/lib/whatsapp";
import { istNowString, readEnv, toWhatsappNumber } from "@/lib/env";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const OPT_OUT_PATTERN = /^\s*(stop|unsubscribe|band karo|mat bhejo|no more messages)\s*[.!]*\s*$/i;

// Meta retries webhooks it thinks failed; remember recent message IDs so retries don't create duplicate alerts.
const seenMessageIds = new Map<string, number>();
function alreadySeen(messageId: string | undefined): boolean {
  if (!messageId) return false;
  const now = Date.now();
  if (seenMessageIds.size > 2000) {
    seenMessageIds.forEach((at, id) => {
      if (now - at > 6 * 3600_000) seenMessageIds.delete(id);
    });
  }
  if (seenMessageIds.has(messageId)) return true;
  seenMessageIds.set(messageId, now);
  return false;
}

/** Verifies Meta's X-Hub-Signature-256 header when META_APP_SECRET is configured. */
function hasValidSignature(rawBody: string, signature: string | null): boolean {
  const appSecret = readEnv("META_APP_SECRET");
  if (!appSecret) return true;
  if (!signature?.startsWith("sha256=")) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function messageText(msg: any): string {
  return (
    msg.text?.body ||
    msg.button?.text ||
    msg.button?.payload ||
    msg.interactive?.button_reply?.title ||
    msg.interactive?.list_reply?.title ||
    msg.image?.caption ||
    msg.document?.caption ||
    (msg.type ? `[${msg.type} message]` : "")
  );
}

/**
 * Meta Webhook Verification (GET)
 * Meta calls this endpoint with hub.mode, hub.challenge, and hub.verify_token
 * to verify ownership of the callback URL.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");
  const verifyToken = readEnv("META_WEBHOOK_VERIFY_TOKEN", "kailash_solar_webhook_verify_2026");

  if (mode === "subscribe" && token === verifyToken) {
    console.log("✓ Meta WhatsApp Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

async function handleIncomingMessage(msg: any, contacts: any[]) {
  const fromPhone = toWhatsappNumber(msg.from) || String(msg.from || "");
  const text = messageText(msg);
  console.log(`[Incoming WhatsApp] From: +${fromPhone} | Type: ${msg.type} | Text: "${text}"`);

  // Messages from our own team number (e.g. to keep the 24h alert window open) are not leads.
  if (fromPhone === teamWhatsappNumber()) {
    console.log("[Incoming WhatsApp] Message from team number — ignored.");
    return;
  }

  const profileName = contacts.find((c) => c.wa_id === msg.from)?.profile?.name || contacts[0]?.profile?.name || "Customer";
  const isOptOut = OPT_OUT_PATTERN.test(text);
  const isInterestedClick = (msg.type === "button" || msg.type === "interactive") && /interest|book/i.test(text);
  const nowStr = istNowString();

  let lead: any = null;
  let leadId: string | null = null;
  let isNewLead = false;
  let wasAlreadyHot = false;

  if (hasZohoCredentials()) {
    try {
      lead = await findZohoLeadByPhone(fromPhone);
      leadId = lead?.id || null;

      if (isOptOut) {
        if (leadId) {
          await addTagsToZohoLead(leadId, ["Opted Out"]);
          await addNoteToZohoLead(leadId, "WhatsApp: Opted out", `Customer sent "${text}" on ${nowStr}. No more automated messages.`);
        }
        console.log(`✓ +${fromPhone} opted out of WhatsApp follow-ups`);
        return;
      }

      if (leadId) {
        wasAlreadyHot = zohoTagNames(lead).some((t) => t.toLowerCase() === "hot lead - interested");
        await addNoteToZohoLead(
          leadId,
          `WhatsApp: "${text.slice(0, 40)}"`,
          `Customer replied/sent on WhatsApp on ${nowStr}.\nMessage: ${text}\nSender: +${fromPhone}`
        );
        await addTagsToZohoLead(leadId, ["Hot Lead - Interested"]);
      } else {
        // Unknown number: automatically create a new Lead in Zoho CRM
        leadId = await createZohoLead({
          Last_Name: profileName,
          Full_Name: profileName,
          Phone: `+${fromPhone}`,
          Lead_Source: "Inbound WhatsApp Inquiry",
          Lead_Status: "Attempted to Contact",
          Description: `New inbound WhatsApp message received on ${nowStr}: "${text}".`,
        });
        isNewLead = true;
        await addTagsToZohoLead(leadId, ["Active Lead", "Hot Lead - Interested", "Inbound WhatsApp"]);
        console.log(`✓ Created new Zoho Lead for inbound WhatsApp from ${profileName} (ID: ${leadId})`);
      }
    } catch (crmErr) {
      // Never lose the lead: the team alert below still goes out even if Zoho is down.
      console.error("Failed to sync WhatsApp message to Zoho CRM:", crmErr);
    }
  } else if (isOptOut) {
    return;
  }

  await sendTeamLeadAlert({
    name: lead?.Full_Name || profileName,
    phone: fromPhone,
    city: lead?.City,
    pincode: lead?.Zip_Code,
    address: lead?.Street,
    message: text,
    source: isInterestedClick ? `WhatsApp – tapped "${text}"` : "WhatsApp message",
    leadId,
    isNewLead,
  });

  // Acknowledge the customer once (first contact / first time they show interest), not on every message.
  if (!wasAlreadyHot) {
    const ack = await sendCustomerAcknowledgement(fromPhone);
    if (ack.ok) console.log(`✓ Sent acknowledgement to +${fromPhone}`);
    else console.error(`✗ Acknowledgement to +${fromPhone} failed: ${ack.error}`);
  }
}

/**
 * Meta Webhook Receiver (POST)
 * Receives delivery receipts (sent, delivered, read, failed) and incoming customer messages/button taps.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!hasValidSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    console.warn("[Webhook] Rejected request with invalid X-Hub-Signature-256");
    return new NextResponse("INVALID_SIGNATURE", { status: 401 });
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new NextResponse("BAD_REQUEST", { status: 400 });
  }

  if (body?.object !== "whatsapp_business_account") {
    return new NextResponse("NOT_FOUND", { status: 404 });
  }

  const team = teamWhatsappNumber();
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value;
      if (!value) continue;

      for (const msg of value.messages || []) {
        if (alreadySeen(msg.id)) {
          console.log(`[Webhook] Duplicate delivery of message ${msg.id} ignored`);
          continue;
        }
        try {
          await handleIncomingMessage(msg, value.contacts || []);
        } catch (err) {
          console.error("[Webhook] Error handling message:", err);
        }
      }

      for (const status of value.statuses || []) {
        if (status.status === "failed") {
          const e = status.errors?.[0];
          const toTeam = status.recipient_id === team;
          console.error(
            `[Delivery FAILED] Message ${status.id} to +${status.recipient_id}${toTeam ? " (TEAM ALERT)" : ""}: ${e?.code} ${e?.title || ""} ${e?.error_data?.details || ""}` +
              (toTeam && e?.code === 131047
                ? " → The team phone must send any WhatsApp message to the Kailash Solar business number at least once every 24 hours to receive free-form alerts."
                : "")
          );
        } else {
          console.log(`[Delivery Status] Message ID: ${status.id} | Status: ${status.status} | Recipient: +${status.recipient_id}`);
        }
      }
    }
  }

  // Always acknowledge so Meta doesn't retry (retries would cause duplicate alerts).
  return new NextResponse("EVENT_RECEIVED", { status: 200 });
}
