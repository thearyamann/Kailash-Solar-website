/**
 * Lead attribution: remembers where a visitor came from (Google Ads, Meta ads, Google search, ...)
 * so every form lead can tell the team which ad, campaign and keyword brought it in.
 *
 * Captured on landing from the URL (gclid / gbraid / wbraid / fbclid / utm_*) and the referrer,
 * stored in localStorage for 90 days. "first" = first visit we saw, "last" = most recent visit
 * that came from somewhere identifiable (an ad click or another site).
 */

export interface Touch {
  channel: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;
  landing_page?: string;
  ts: number;
}

export interface Attribution {
  first?: Touch;
  last?: Touch;
}

const STORAGE_KEY = "kailash_attribution";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;
const PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const clip = (v: string | null | undefined, max = 150) => (v ? v.trim().slice(0, max) : undefined);

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

/** Human-readable channel for the team ("Google Ads", "Meta Ads", "Google Search", ...). */
export function channelFor(t: Omit<Touch, "channel" | "ts">): string {
  const src = (t.utm_source || "").toLowerCase();
  const medium = (t.utm_medium || "").toLowerCase();
  if (t.gclid || t.gbraid || t.wbraid) return "Google Ads";
  if (src.includes("google") && /cpc|ppc|paid/.test(medium)) return "Google Ads";
  if (t.fbclid || /facebook|instagram|meta|^fb$|^ig$/.test(src)) return "Meta Ads (Facebook/Instagram)";
  if (src.includes("whatsapp")) return "WhatsApp";
  if (src) return `Campaign: ${t.utm_source}`;
  const ref = hostOf(t.referrer || "");
  if (!ref) return "Direct / Unknown";
  if (/(^|\.)google\./.test(ref)) return "Google Search (free)";
  if (/(^|\.)(bing|yahoo|duckduckgo)\./.test(ref)) return "Other Search Engine";
  if (/facebook|instagram|fb\.|l\.instagram/.test(ref)) return "Facebook/Instagram (free)";
  if (/whatsapp|wa\.me/.test(ref)) return "WhatsApp";
  if (/youtube|youtu\.be/.test(ref)) return "YouTube";
  return `Website: ${ref}`;
}

function read(): Attribution {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const a = JSON.parse(raw) as Attribution;
    const fresh = (t?: Touch) => (t && Date.now() - (t.ts || 0) < MAX_AGE_MS ? t : undefined);
    return { first: fresh(a.first), last: fresh(a.last) };
  } catch {
    return {};
  }
}

/** Call once per full page load. Safe to call repeatedly. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const touch: Omit<Touch, "channel" | "ts"> = {};
    for (const p of PARAMS) {
      const v = clip(url.searchParams.get(p), p.endsWith("clid") || p.endsWith("braid") ? 300 : 150);
      if (v) touch[p] = v;
    }
    const ref = document.referrer && hostOf(document.referrer) !== hostOf(window.location.href) ? document.referrer : "";
    if (ref) touch.referrer = clip(ref, 200);
    touch.landing_page = clip(url.pathname, 120);

    const hasSignal = PARAMS.some((p) => touch[p]) || Boolean(touch.referrer);
    const current = read();
    const full: Touch = { ...touch, channel: channelFor(touch), ts: Date.now() };

    const next: Attribution = { ...current };
    if (!current.first) next.first = full;
    // Only overwrite "last" with a visit that came from somewhere; plain internal page loads keep the ad click.
    if (hasSignal || !current.last) next.last = full;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode etc.) — attribution is best-effort.
  }
}

/** The stored attribution, to send along with a lead. */
export function getAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;
  const a = read();
  return a.first || a.last ? a : undefined;
}
