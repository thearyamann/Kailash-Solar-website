/**
 * Reads an environment variable and strips accidental surrounding quotes/whitespace
 * (a common copy-paste mistake in the Vercel dashboard that silently breaks API tokens).
 */
export function readEnv(name: string, fallback = ""): string {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw.replace(/^["']|["']$/g, "").trim() || fallback;
}

/** Normalizes any Indian phone input to WhatsApp format (91XXXXXXXXXX), or "" if invalid. */
export function toWhatsappNumber(phone: string | null | undefined): string {
  const digits = (phone || "").replace(/\D/g, "");
  const last10 = digits.slice(-10);
  if (!/^[6-9]\d{9}$/.test(last10)) return "";
  if (digits.length === 10 || (digits.length === 12 && digits.startsWith("91")) || (digits.length === 11 && digits.startsWith("0"))) {
    return `91${last10}`;
  }
  return "";
}

/** Formats a date as YYYY-MM-DD in India time. */
export function istDate(date: Date = new Date()): string {
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function istNowString(): string {
  return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}
