/**
 * Meta WhatsApp Cloud API (v21.0) helpers for Kailash Solar.
 * Every outgoing message goes through `sendWhatsapp`, which enforces the optional
 * WHATSAPP_ALLOWED_RECIPIENTS safety allowlist (used for testing so nobody else gets messaged).
 */
import { readEnv, istNowString, toWhatsappNumber } from "@/lib/env";

export type SendResult = { ok: boolean; messageId?: string; error?: string };

const DEFAULT_TEAM_NUMBER = "918999999654";

/** Official Kailash Solar team WhatsApp number that receives lead alerts. */
export function teamWhatsappNumber(): string {
  return toWhatsappNumber(readEnv("TEAM_WHATSAPP_NUMBER") || readEnv("WHATSAPP_NUMBER") || DEFAULT_TEAM_NUMBER) || DEFAULT_TEAM_NUMBER;
}

export function hasWhatsappCredentials(): boolean {
  return Boolean(readEnv("META_WHATSAPP_TOKEN") && readEnv("META_PHONE_NUMBER_ID"));
}

function allowedRecipients(): string[] | null {
  const list = readEnv("WHATSAPP_ALLOWED_RECIPIENTS");
  if (!list) return null;
  return list.split(",").map((n) => toWhatsappNumber(n)).filter(Boolean);
}

async function sendWhatsapp(to: string, payload: Record<string, any>): Promise<SendResult> {
  const token = readEnv("META_WHATSAPP_TOKEN");
  const phoneId = readEnv("META_PHONE_NUMBER_ID");
  if (!token || !phoneId) return { ok: false, error: "Meta WhatsApp credentials not set" };

  const recipient = toWhatsappNumber(to);
  if (!recipient) return { ok: false, error: `Invalid phone number: ${to}` };

  const allowlist = allowedRecipients();
  if (allowlist && !allowlist.includes(recipient)) {
    console.warn(`[WhatsApp] Blocked send to +${recipient} (not in WHATSAPP_ALLOWED_RECIPIENTS)`);
    return { ok: false, error: "Blocked by WHATSAPP_ALLOWED_RECIPIENTS" };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: recipient, ...payload }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    const messageId = data?.messages?.[0]?.id;
    if (res.ok && messageId) return { ok: true, messageId };
    return { ok: false, error: data?.error?.message || `Meta API error (${res.status})` };
  } catch (err: any) {
    return { ok: false, error: err?.message || "Network error" };
  }
}

/**
 * Free-form text message. Meta only delivers these inside the 24-hour customer-service window
 * (the recipient must have messaged our WhatsApp number in the last 24 hours).
 */
export function sendWhatsappText(to: string, body: string): Promise<SendResult> {
  return sendWhatsapp(to, { type: "text", text: { body, preview_url: false } });
}

export function sendWhatsappTemplate(
  to: string,
  name: string,
  language: string,
  components: any[] = []
): Promise<SendResult> {
  return sendWhatsapp(to, { type: "template", template: { name, language: { code: language }, components } });
}

/** Approved UTILITY template: "Thank you! Aapki request humein receive ho gayi hai..." (works outside the 24h window). */
export function sendCustomerAcknowledgement(to: string): Promise<SendResult> {
  return sendWhatsappTemplate(to, "kailash_interested_ack", "en");
}

export type LeadAlert = {
  name: string;
  phone: string;
  source: string;
  city?: string | null;
  pincode?: string | null;
  address?: string | null;
  message?: string | null;
  extra?: string | null;
  leadId?: string | null;
  isNewLead?: boolean;
};

export function buildTeamLeadAlert(lead: LeadAlert): string {
  const phone = toWhatsappNumber(lead.phone);
  const lines = [
    `🔥 *INTERESTED LEAD – Kailash Solar*`,
    ``,
    `This person is interested. Please contact them now.`,
    ``,
    `👤 *Name:* ${lead.name || "Customer"}`,
    `📞 *Phone:* ${phone ? `+${phone}` : lead.phone}`,
  ];
  if (lead.pincode) lines.push(`📮 *PIN Code:* ${lead.pincode}`);
  if (lead.city) lines.push(`📍 *City:* ${lead.city}`);
  if (lead.address) lines.push(`🏠 *Address:* ${lead.address}`);
  if (lead.extra) lines.push(lead.extra);
  if (lead.message) lines.push(`💬 *Message:* "${lead.message.slice(0, 300)}"`);
  lines.push(`🔗 *Source:* ${lead.source}${lead.isNewLead ? " (new lead)" : ""}`);
  if (lead.leadId) lines.push(`🆔 *Zoho Lead ID:* ${lead.leadId}`);
  lines.push(`🕒 ${istNowString()}`);
  if (phone) lines.push(``, `👉 Call: +${phone}`, `👉 WhatsApp: https://wa.me/${phone}`);
  return lines.join("\n");
}

/** Sends the interested-lead alert to the official team WhatsApp number as a free-form (non-marketing) message. */
export async function sendTeamLeadAlert(lead: LeadAlert): Promise<SendResult> {
  const team = teamWhatsappNumber();
  const result = await sendWhatsappText(team, buildTeamLeadAlert(lead));
  if (result.ok) {
    console.log(`✓ Team lead alert sent to +${team} for ${lead.name} (+${toWhatsappNumber(lead.phone)})`);
  } else {
    console.error(`✗ Team lead alert to +${team} failed: ${result.error}`);
  }
  return result;
}
