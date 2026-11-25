/**
 * Client-side Meta Pixel helpers.
 *
 * trackMetaLead() is the ONLY place that should fire the Meta "Lead" event, and only
 * after a form has been successfully saved (so Meta counts real leads, not clicks).
 * It sends:
 *  - an eventID (lead_<crm id>) so the same lead is never counted twice and can later be
 *    matched to a Conversions API / Zoho event,
 *  - advanced matching data (phone, PIN code, country). The Meta Pixel hashes these
 *    (SHA-256) in the browser before sending; raw values never leave the page.
 */
export const META_PIXEL_ID = "1071029479055771";

type LeadInfo = {
  formName: string;
  phone?: string;
  pincode?: string;
  leadId?: string | null;
};

function toE164India(phone?: string): string {
  const digits = (phone || "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return "";
}

export function trackMetaLead({ formName, phone, pincode, leadId }: LeadInfo): void {
  if (typeof window === "undefined") return;
  const fbq = (window as any).fbq;
  if (typeof fbq !== "function") return;

  const userData: Record<string, string> = { country: "in" };
  const ph = toE164India(phone);
  if (ph) userData.ph = ph;
  const zp = (pincode || "").replace(/\D/g, "");
  if (zp.length === 6) userData.zp = zp;

  try {
    // Re-init with advanced matching so this Lead carries hashed phone/PIN.
    fbq("init", META_PIXEL_ID, userData);
  } catch {
    /* never block the lead flow on tracking */
  }

  const eventID = leadId
    ? `lead_${leadId}`
    : `lead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  try {
    fbq("track", "Lead", { content_name: formName }, { eventID });
  } catch {
    /* ignore */
  }
}
