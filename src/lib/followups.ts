/**
 * WhatsApp follow-up schedule (pure logic, no network calls).
 *
 *   Day 1  → kailash_short_followup  (flyer 1) — currently NOT sent by the cron, see DAY1_BATCH_DATE
 *   Day 4  → kailash_day4_reminder   (3 days after Day 1)
 *   Day 10 → kailash_day4_reminder   (9 days after Day 1, at least 3 days after Day 4) — currently OFF, see SEND_DAY10
 *   Website visit → kailash_visit_booking_followup (once, only if they visited via a tracked link)
 *
 * State lives in Zoho tags (which step was sent) + Zoho notes (when it was sent).
 * A lead never receives more than one automated message per day, and the sequence ends after Day 10.
 */
import { toWhatsappNumber } from "@/lib/env";

export type FollowUpStep = "day1" | "day4" | "day10" | "website";

// Flyers are served from the website (public/marketing). Public links don't expire, unlike uploaded Meta media IDs (30 days).
const FLYER_BASE = "https://www.kailashsolar.com/marketing";
// kailash_day4_reminder with a dynamic "Book Free Visit" URL (button 3) → /api/track/website?r=<signed lead ref>
const TRACKED_DAY4 = { name: "kailash_day4_tracked", urlButtonIndex: 2 };

export const FOLLOWUP_STEPS: Record<
  FollowUpStep,
  {
    tag: string;
    template: string;
    language: string;
    headerImageUrl?: string;
    /** Same message with a personal tracked "Book Free Visit" link; used instead of `template` once Meta approves it. */
    trackedTemplate?: { name: string; urlButtonIndex: number };
  }
> = {
  day1: { tag: "Follow-up 1 Sent", template: "kailash_short_followup", language: "en", headerImageUrl: `${FLYER_BASE}/kailash_followup_flyer.png` },
  day4: { tag: "Day 4 Reminder Sent", template: "kailash_day4_reminder", language: "en", headerImageUrl: `${FLYER_BASE}/newk2.png`, trackedTemplate: TRACKED_DAY4 },
  day10: { tag: "Day 10 Final Reminder Sent", template: "kailash_day4_reminder", language: "en", headerImageUrl: `${FLYER_BASE}/newk2.png`, trackedTemplate: TRACKED_DAY4 },
  website: { tag: "Website Follow-up Sent", template: "kailash_visit_booking_followup", language: "en" },
};

/** Notes written by the cron are titled `WA Follow-up: <step>` so send dates can be recovered. */
export const FOLLOWUP_NOTE_PREFIX = "WA Follow-up:";

/**
 * Day 1 was already sent to the whole lead list on this date (outside this cron), so:
 *  - the cron never sends the Day 1 message (SEND_DAY1 = false);
 *  - every lead created on or before this date is treated as having received Day 1 on this date,
 *    so Day 4 goes out on 2026-11-02 and Day 10 on 2026-11-08;
 *  - leads created after this date are not messaged by the cron (they never got Day 1).
 */
export const DAY1_BATCH_DATE = "2026-10-30";
export const SEND_DAY1 = false;
/** Budget: Day 10 repeats the Day 4 template, so it is switched off; the sequence ends after Day 4. */
export const SEND_DAY10 = false;

export const DAY4_AFTER_DAY1 = 3;
export const DAY10_AFTER_DAY1 = 9;
export const MIN_GAP_DAY4_TO_DAY10 = 3;

// Any of these tags means the lead is a customer, engaged, booked or opted out → never send automated sales messages.
const STOP_TAGS = [
  "won customer",
  "hot lead - interested",
  "replied - interested",
  "replied",
  "site visit scheduled",
  "site visit booked",
  "site visit completed",
  "website lead",
  "opted out",
];
const STOP_STATUSES = ["junk lead", "not qualified", "site visit scheduled"];
// Budget: leads lost for these reasons (stored as "Lost Reason: <reason>" in the Zoho Description by the migration)
// already said no, bought from a competitor, or can't install — messaging them is wasted money.
const STOP_LOST_REASONS = ["not_interested", "competitor", "not_feasible"];

export function lostReasonOf(description: string | null | undefined): string | null {
  const m = (description || "").match(/Lost Reason:\s*([A-Za-z_ -]+)/i);
  return m ? m[1].trim().toLowerCase().replace(/[\s-]+/g, "_") : null;
}

export type FollowUpLead = {
  id: string;
  phone: string;
  status?: string | null;
  tags: string[];
  /** YYYY-MM-DD (IST) the lead was created in Zoho */
  createdDate?: string | null;
  description?: string | null;
};
export type FollowUpDates = Partial<Record<FollowUpStep, string>>; // YYYY-MM-DD (IST)

export type FollowUpDecision =
  | { action: "send"; step: FollowUpStep }
  | { action: "backfill"; step: FollowUpStep; reason: string }
  | { action: "wait"; reason: string }
  | { action: "skip"; reason: string };

export function daysBetween(fromYmd: string, toYmd: string): number {
  const [y1, m1, d1] = fromYmd.split("-").map(Number);
  const [y2, m2, d2] = toYmd.split("-").map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86_400_000);
}

/** Maps a Zoho note title to the follow-up step it records (also understands notes from the old cron). */
export function stepFromNoteTitle(title: string): FollowUpStep | "legacy_day4_template" | null {
  const t = title.trim();
  if (t.startsWith(FOLLOWUP_NOTE_PREFIX)) {
    const step = t.slice(FOLLOWUP_NOTE_PREFIX.length).trim().split(/\s/)[0] as FollowUpStep;
    return step in FOLLOWUP_STEPS ? step : null;
  }
  if (t === "Automated WhatsApp: kailash_short_followup" || t === "Automated WhatsApp: Day 1 Follow-up Sent") return "day1";
  if (t === "Automated WhatsApp: kailash_visit_booking_followup") return "website";
  if (t === "Automated WhatsApp: kailash_day4_reminder" || t === "Automated WhatsApp: kailash_last_reminder") {
    return "legacy_day4_template";
  }
  return null;
}

export function planFollowUp(
  lead: FollowUpLead,
  dates: FollowUpDates,
  today: string,
  opts: { teamNumber?: string } = {}
): FollowUpDecision {
  const phone = toWhatsappNumber(lead.phone);
  if (!phone) return { action: "skip", reason: "invalid phone number" };
  if (opts.teamNumber && phone === opts.teamNumber) return { action: "skip", reason: "team number" };

  const tags = new Set(lead.tags.map((t) => t.trim().toLowerCase()));
  const stopTag = STOP_TAGS.find((t) => tags.has(t));
  if (stopTag) return { action: "skip", reason: `tag: ${stopTag}` };
  const status = (lead.status || "").trim().toLowerCase();
  if (STOP_STATUSES.includes(status)) return { action: "skip", reason: `status: ${lead.status}` };
  const lostReason = lostReasonOf(lead.description);
  if (lostReason && STOP_LOST_REASONS.includes(lostReason)) return { action: "skip", reason: `lost reason: ${lostReason}` };

  if (Object.values(dates).some((d) => d === today)) return { action: "wait", reason: "already messaged today" };

  const has = (step: FollowUpStep) => tags.has(FOLLOWUP_STEPS[step].tag.toLowerCase());
  const day4Done = has("day4") || tags.has("last reminder sent");

  if (tags.has("visited website") && !has("website")) return { action: "send", step: "website" };

  if (has("day10")) return { action: "skip", reason: "sequence complete" };

  let day1Date = dates.day1;
  if (!SEND_DAY1) {
    // Day 1 went to every existing lead in the batch on DAY1_BATCH_DATE.
    if (lead.createdDate && lead.createdDate <= DAY1_BATCH_DATE) day1Date = DAY1_BATCH_DATE;
    else if (!has("day1")) return { action: "skip", reason: "created after the Day 1 batch (Day 1 sending is off)" };
  }
  if (!has("day1") && !day1Date) return { action: "send", step: "day1" };
  if (!day1Date) return { action: "backfill", step: "day1", reason: "Day 1 tag has no recorded date" };

  const sinceDay1 = daysBetween(day1Date, today);
  if (!day4Done) {
    if (sinceDay1 >= DAY4_AFTER_DAY1) return { action: "send", step: "day4" };
    return { action: "wait", reason: `Day 4 reminder due in ${DAY4_AFTER_DAY1 - sinceDay1} day(s)` };
  }
  if (!SEND_DAY10) return { action: "skip", reason: "sequence complete (Day 10 is off)" };
  if (!dates.day4) return { action: "backfill", step: "day4", reason: "Day 4 tag has no recorded date" };

  const sinceDay4 = daysBetween(dates.day4, today);
  if (sinceDay1 >= DAY10_AFTER_DAY1 && sinceDay4 >= MIN_GAP_DAY4_TO_DAY10) return { action: "send", step: "day10" };
  const wait = Math.max(DAY10_AFTER_DAY1 - sinceDay1, MIN_GAP_DAY4_TO_DAY10 - sinceDay4);
  return { action: "wait", reason: `Day 10 reminder due in ${wait} day(s)` };
}
