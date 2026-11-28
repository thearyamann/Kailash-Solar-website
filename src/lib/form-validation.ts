/**
 * Shared checks for the website's lead forms.
 */

/**
 * Cleans what a visitor types or pastes into a 10-digit mobile field.
 * "+91 98765 43210", "09876543210" and "98765-43210" all become "9876543210",
 * instead of being cut to a wrong number like "9198765432".
 */
export function cleanPhoneInput(raw: string): string {
  let digits = (raw || "").replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length > 10 && digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** A real Indian mobile number: 10 digits starting with 6, 7, 8 or 9. */
export function isValidMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export const PHONE_ERROR = "Please enter a valid 10-digit mobile number.";

/**
 * Accepts names in English or Hindi, with spaces, dots and apostrophes
 * (e.g. "R.K. Sharma", "राहुल कुमार"). Rejects digits and other symbols.
 */
let NAME_RE: RegExp;
try {
  // Built at runtime: the project's TS target (es5) can't compile a /u regex literal.
  NAME_RE = new RegExp("^[\\p{L}\\p{M}][\\p{L}\\p{M}\\s.']*$", "u");
} catch {
  // Very old browsers without Unicode regex support: allow English + Hindi letters.
  NAME_RE = /^[A-Za-zऀ-ॿ][A-Za-zऀ-ॿ\s.']*$/;
}

export function isValidName(name: string): boolean {
  const n = (name || "").trim();
  return n.length >= 2 && n.length <= 60 && NAME_RE.test(n);
}

export const NAME_ERROR = "Please enter your name (letters only).";
