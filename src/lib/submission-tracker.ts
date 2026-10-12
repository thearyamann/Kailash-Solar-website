/**
 * Form Submission & Duplicate Prevention Tracker
 * 
 * Manages client-side submission recording, prevents auto-modal popups
 * once a user has already submitted any form, and detects duplicate submissions.
 */

export interface SubmissionData {
  name: string;
  phone: string;
  pincode: string;
  monthlyBill?: string;
  timestamp: number;
}

const STORAGE_KEY_FORM_SUBMITTED = "kailash_form_submitted";
const STORAGE_KEY_MODAL_SUBMITTED = "kailash_modal_submitted";
const STORAGE_KEY_LAST_SUBMISSION = "kailash_last_submission";
const STORAGE_KEY_AUTO_OPENED = "kailash_modal_auto_opened";

// 24 hours in milliseconds for duplicate suppression window
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

/**
 * Returns true if the user has already submitted ANY form on the website.
 */
export function isPopupSuppressed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      localStorage.getItem(STORAGE_KEY_FORM_SUBMITTED) === "true" ||
      localStorage.getItem(STORAGE_KEY_MODAL_SUBMITTED) === "true" ||
      localStorage.getItem(STORAGE_KEY_LAST_SUBMISSION) !== null
    );
  } catch {
    return false;
  }
}

/**
 * Retrieves the most recent submission details stored locally.
 */
export function getLastSubmission(): SubmissionData | null {
  if (typeof window === "undefined") return null;
  try {
    const rawSession = sessionStorage.getItem(STORAGE_KEY_LAST_SUBMISSION);
    if (rawSession) return JSON.parse(rawSession) as SubmissionData;
    const rawLocal = localStorage.getItem(STORAGE_KEY_LAST_SUBMISSION);
    if (rawLocal) return JSON.parse(rawLocal) as SubmissionData;
    return null;
  } catch {
    return null;
  }
}

/**
 * Checks whether the current submission is an exact duplicate of a recent submission
 * (same phone number or identical details within the duplicate window).
 */
export function checkDuplicateSubmission(data: {
  phone: string;
  name?: string;
  monthlyBill?: string;
}): { isDuplicate: boolean; message?: string } {
  const last = getLastSubmission();
  if (!last) return { isDuplicate: false };

  const currentPhone = data.phone.trim().replace(/\D/g, "").slice(-10);
  const lastPhone = last.phone.trim().replace(/\D/g, "").slice(-10);

  const isRecent = Date.now() - (last.timestamp || 0) < DUPLICATE_WINDOW_MS;

  if (isRecent && currentPhone && currentPhone === lastPhone) {
    return {
      isDuplicate: true,
      message:
        "You have already submitted a consultation request with this phone number. Our engineering team has received it and is already processing your request!",
    };
  }

  return { isDuplicate: false };
}

/**
 * Records a successful submission globally across localStorage and sessionStorage.
 * Suppresses all future auto-open modals and logs the submission details.
 */
export function recordSubmission(data: {
  name: string;
  phone: string;
  pincode: string;
  monthlyBill?: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    const payload: SubmissionData = {
      name: data.name.trim(),
      phone: data.phone.trim().replace(/\D/g, "").slice(-10),
      pincode: data.pincode.trim(),
      monthlyBill: data.monthlyBill,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY_FORM_SUBMITTED, "true");
    localStorage.setItem(STORAGE_KEY_MODAL_SUBMITTED, "true");
    localStorage.setItem(STORAGE_KEY_LAST_SUBMISSION, JSON.stringify(payload));
    sessionStorage.setItem(STORAGE_KEY_AUTO_OPENED, "true");
    sessionStorage.setItem(STORAGE_KEY_LAST_SUBMISSION, JSON.stringify(payload));
  } catch {
    // Ignore storage quota/security errors
  }
}
