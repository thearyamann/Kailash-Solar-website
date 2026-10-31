import { NextRequest, NextResponse } from "next/server";
import { findZohoLeadByPhone, addNoteToZohoLead, addTagToZohoLead, getZohoAccessToken } from "@/lib/zoho";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "kailash_solar_webhook_verify_2026";

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

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✓ Meta WhatsApp Webhook verified successfully!");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * Meta Webhook Receiver (POST)
 * Receives delivery receipts (sent, delivered, read) and incoming customer replies.
 * Automatically logs incoming replies into Zoho CRM lead notes.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a WhatsApp status update or incoming message
    if (body.object === "whatsapp_business_account") {
      const entries = body.entry || [];
      for (const entry of entries) {
        const changes = entry.changes || [];
        for (const change of changes) {
          const value = change.value;
          if (!value) continue;

          // 1. Handle incoming customer messages & button replies
          if (value.messages && value.messages.length > 0) {
            for (const msg of value.messages) {
              const fromPhone = msg.from;
              const msgType = msg.type;
              const text =
                msg.text?.body ||
                msg.interactive?.button_reply?.title ||
                msg.button?.text ||
                msg.button?.payload ||
                "";
              
              console.log(`[Incoming WhatsApp] From: +${fromPhone} | Type: ${msgType} | Text: "${text}"`);
              
              // Find lead in Zoho CRM or automatically create new inbound lead
              const profileName = value.contacts?.[0]?.profile?.name || "Customer";
              let leadName = profileName;
              let leadCity = "Meerut";
              const nowStr = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

              try {
                const lead = await findZohoLeadByPhone(fromPhone);
                if (lead && lead.id) {
                  leadName = lead.Full_Name || profileName || "Customer";
                  leadCity = lead.City || "Meerut";
                  const noteTitle = `WhatsApp: "${text.slice(0, 40)}"`;
                  const noteContent = `Customer replied/sent on WhatsApp on ${nowStr}.\nMessage: ${text}\nSender: +${fromPhone}`;
                  await addNoteToZohoLead(lead.id, noteTitle, noteContent);
                  await addTagToZohoLead(lead.id, "Hot Lead - Interested");
                  console.log(`✓ Attached note and tagged 'Hot Lead - Interested' to Zoho Lead ID ${lead.id} (${lead.Full_Name})`);
                } else {
                  // Lead doesn't exist yet: automatically create a new Lead in Zoho CRM!
                  const dc = (process.env.ZOHO_DC || "in").toLowerCase().replace(/^["']|["']$/g, "").trim();
                  const zohoToken = await getZohoAccessToken();
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
                          Last_Name: profileName,
                          Full_Name: profileName,
                          Phone: `+${fromPhone}`,
                          City: "Meerut",
                          Lead_Source: "Inbound WhatsApp Inquiry",
                          Lead_Status: "Attempted to Contact",
                          Description: `New inbound WhatsApp message received on ${nowStr}: "${text}".`,
                        },
                      ],
                    }),
                  });
                  const createData = await createRes.json();
                  const newLeadId = createData?.data?.[0]?.details?.id;
                  if (newLeadId) {
                    await addTagToZohoLead(newLeadId, "Active Lead");
                    await addTagToZohoLead(newLeadId, "Hot Lead - Interested");
                    await addTagToZohoLead(newLeadId, "Inbound WhatsApp");
                    console.log(`✓ Automatically created new Zoho Lead for inbound WhatsApp inquiry from ${profileName} (ID: ${newLeadId})`);
                  }
                }
              } catch (crmErr) {
                console.error("Failed to sync WhatsApp reply to Zoho CRM:", crmErr);
              }

              const metaToken = process.env.META_WHATSAPP_TOKEN?.replace(/^["']|["']$/g, "").trim();
              const phoneId = process.env.META_PHONE_NUMBER_ID?.replace(/^["']|["']$/g, "").trim();
              const officeWa = (process.env.WHATSAPP_NUMBER || "918999999654").replace(/\D/g, "");

              // Send Instant WhatsApp Alert to Kailash Solar Sales Team Phone (+91 89999 99654)
              if (metaToken && phoneId) {
                try {
                  const isButton = text.toLowerCase().includes("interested");
                  const alertMsg =
                    `🚨 *HOT LEAD ALERT! (Kailash Solar)*\n\n` +
                    (isButton
                      ? `एक कस्टमर ने WhatsApp पर *"Yes, I'm Interested"* पर क्लिक किया है!\n\n`
                      : `एक कस्टमर ने WhatsApp पर नया मैसेज भेजा है!\n\n`) +
                    `👤 *नाम:* ${leadName}\n` +
                    `📞 *फ़ोन:* +${fromPhone}\n` +
                    `📍 *शहर:* ${leadCity}\n` +
                    `💬 *मैसेज / ऐक्शन:* "${text}"\n\n` +
                    `👉 कृपया कस्टमर को तुरंत कॉल करें और साइट विज़िट बुक करें!`;

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
                      text: { body: alertMsg },
                    }),
                  });
                  console.log(`✓ Dispatched instant hot-lead alert to team phone (+${officeWa})`);
                } catch (alertErr) {
                  console.error("Failed to send team alert:", alertErr);
                }
              }

              // Customer Auto-Response (When they tap "Yes, I'm Interested")
              if (metaToken && phoneId && text.trim().toUpperCase() !== "STOP") {
                try {
                  const replyMsg =
                    `Thank you! 😊\n\n` +
                    `Aapki request humein receive ho gayi hai. Hamari team aapse bahut jald contact karegi.\n\n` +
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
                      to: fromPhone,
                      type: "text",
                      text: { body: replyMsg },
                    }),
                  });
                  console.log(`✓ Sent customer auto-response to +${fromPhone}`);
                } catch (replyErr) {
                  console.error("Failed to send customer auto-reply:", replyErr);
                }
              }
            }
          }

          // 2. Handle delivery statuses (sent, delivered, read, failed)
          if (value.statuses && value.statuses.length > 0) {
            for (const status of value.statuses) {
              console.log(`[Delivery Status] Message ID: ${status.id} | Status: ${status.status} | Recipient: +${status.recipient_id}`);
            }
          }
        }
      }
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    }

    return new NextResponse("NOT_FOUND", { status: 404 });
  } catch (err: any) {
    console.error("Meta Webhook processing error:", err);
    return new NextResponse("INTERNAL_ERROR", { status: 500 });
  }
}
