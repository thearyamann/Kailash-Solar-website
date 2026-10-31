/**
 * Signed website-visit references for WhatsApp "Book Free Visit" buttons.
 * The button links to /api/track/website?r=<leadId>.<signature>; the signature stops anyone from
 * guessing lead IDs and faking visits (each fake visit would trigger a paid follow-up message).
 */
import crypto from "crypto";
import { readEnv } from "@/lib/env";

function trackingSecret(): string {
  return readEnv("TRACKING_SECRET") || readEnv("CRON_SECRET");
}

export function hasTrackingSecret(): boolean {
  return Boolean(trackingSecret());
}

function signature(leadId: string): string {
  return crypto.createHmac("sha256", trackingSecret()).update(`visit:${leadId}`).digest("hex").slice(0, 12);
}

/** Returns "<leadId>.<signature>", or "" if no secret is configured. */
export function signVisitRef(leadId: string): string {
  return hasTrackingSecret() ? `${leadId}.${signature(leadId)}` : "";
}

/** Returns the lead ID if the reference is genuine, otherwise null. */
export function verifyVisitRef(ref: string | null): string | null {
  const m = (ref || "").match(/^(\d{6,25})\.([0-9a-f]{12})$/);
  if (!m || !hasTrackingSecret()) return null;
  const a = Buffer.from(signature(m[1]));
  const b = Buffer.from(m[2]);
  return a.length === b.length && crypto.timingSafeEqual(a, b) ? m[1] : null;
}
