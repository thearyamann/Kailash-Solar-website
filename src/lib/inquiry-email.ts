import { supabase } from "@/integrations/supabase/client";
import { getAttribution } from "@/lib/attribution";

/**
 * Backup email + Supabase copy of a website lead (the send-inquiry-email function).
 *
 * The lead is already saved in Zoho CRM before this runs, so this is fire-and-forget:
 * it never throws and is not awaited. If it fails (rate limit on a shared mobile IP,
 * a Supabase hiccup), the visitor still sees the success screen and the Meta / Google
 * lead events still fire. `keepalive` lets the request finish while the page moves on.
 */
/**
 * One line saying where the lead came from, e.g.
 * "Meta Ads (Facebook/Instagram) · Campaign: new_leads · Page: /book-visit".
 */
export function describeLeadSource(): string {
  const a = getAttribution();
  const t = a?.last || a?.first;
  if (!t) return "Direct / Unknown (no ad or search click recorded)";
  const parts = [t.channel || "Direct / Unknown"];
  if (t.utm_campaign) parts.push(`Campaign: ${t.utm_campaign}`);
  if (t.utm_term) parts.push(`Keyword: ${t.utm_term}`);
  if (t.utm_content) parts.push(`Ad: ${t.utm_content}`);
  if (t.landing_page) parts.push(`Page: ${t.landing_page}`);
  const first = a?.first;
  if (first && first !== t && first.channel && first.channel !== t.channel) {
    parts.push(`First visit from: ${first.channel}`);
  }
  return parts.join(" · ").slice(0, 300);
}

export function sendInquiryEmail(body: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  // Never email a lead from a local test run (localhost / 127.0.0.1).
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)) {
    console.info("[test] backup email skipped on localhost", body);
    return;
  }
  body = { ...body, leadSource: describeLeadSource() };
  void (async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) return;
      const res = await fetch(`${supabaseUrl}/functions/v1/send-inquiry-email`, {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) console.error("send-inquiry-email failed:", res.status);
    } catch (e) {
      console.error("send-inquiry-email error:", e);
    }
  })();
}
