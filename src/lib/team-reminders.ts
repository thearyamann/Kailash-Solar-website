/**
 * Free WhatsApp lead reminders for the team.
 *
 * Paid reminder templates to customers are switched off. Instead, when the team number
 * (TEAM_WHATSAPP_NUMBER, default 89999 99654) sends any message ("Hi") to the business
 * WhatsApp, the webhook replies with today's follow-up list. That reply is inside WhatsApp's
 * 24-hour customer-service window, so it is free. No "Hi" that day = nothing sent, no charge.
 *
 * Each lead appears once per reminder step; after it has been on a list it is tagged in Zoho,
 * so the next list moves on.
 */
import { addNoteToZohoLead, addTagsToZohoLead, fetchAllZohoLeads, zohoTagNames } from "@/lib/zoho";
import { sendWhatsappText } from "@/lib/whatsapp";
import { istDate, istNowString, toWhatsappNumber } from "@/lib/env";
import { daysBetween, lostReasonOf } from "@/lib/followups";

export type TeamReminderStep = "new" | "day4" | "day10" | "website";

const STEP_TAG: Record<TeamReminderStep, string> = {
  new: "Team Reminder: New",
  day4: "Team Reminder: Day 4",
  day10: "Team Reminder: Day 10",
  website: "Team Reminder: Website",
};
const STEP_LABEL: Record<TeamReminderStep, string> = {
  new: "🆕 New lead – call today",
  day4: "📞 Day 4 – follow up",
  day10: "⏰ Day 10 – final call",
  website: "👀 Saw the website, didn't book",
};
const STEP_ORDER: TeamReminderStep[] = ["new", "website", "day4", "day10"];

// Customers, people who booked / replied / opted out, junk: never on the reminder list.
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
const STOP_LOST_REASONS = ["not_interested", "competitor", "not_feasible"];
// Older leads have finished their reminders; only leads from the last 14 days are considered.
const MAX_AGE_DAYS = 14;
// Keep each WhatsApp reply readable; the rest come on the next "Hi".
const MAX_PER_LIST = 25;

export function planTeamReminder(
  lead: { phone: string; status?: string | null; tags: string[]; createdDate: string | null; description?: string | null },
  today: string,
  teamNumber: string
): TeamReminderStep | null {
  const phone = toWhatsappNumber(lead.phone);
  if (!phone || phone === teamNumber) return null;
  const tags = new Set(lead.tags.map((t) => t.trim().toLowerCase()));
  if (STOP_TAGS.some((t) => tags.has(t))) return null;
  if (STOP_STATUSES.includes((lead.status || "").trim().toLowerCase())) return null;
  const lost = lostReasonOf(lead.description);
  if (lost && STOP_LOST_REASONS.includes(lost)) return null;

  const done = (s: TeamReminderStep) => tags.has(STEP_TAG[s].toLowerCase());
  if (tags.has("visited website") && !done("website")) return "website";
  if (!lead.createdDate) return null;
  const age = daysBetween(lead.createdDate, today);
  if (age < 0 || age > MAX_AGE_DAYS) return null;
  if (age >= 9) return done("day10") ? null : "day10";
  if (age >= 3) return done("day4") ? null : "day4";
  return done("new") ? null : "new";
}

/** Builds today's list, sends it to the team number, and marks the listed leads in Zoho. */
export async function sendTeamReminderList(teamNumber: string): Promise<{ sent: number; listed: number; error?: string }> {
  const today = istDate();
  const leads = await fetchAllZohoLeads([
    "Full_Name", "Last_Name", "Phone", "Mobile", "Tag", "Lead_Status", "Created_Time", "Description", "Zip_Code", "City", "Lead_Source",
  ]);

  const due: Array<{ lead: any; step: TeamReminderStep }> = [];
  for (const lead of leads) {
    const step = planTeamReminder(
      {
        phone: lead.Phone || lead.Mobile || "",
        status: lead.Lead_Status,
        tags: zohoTagNames(lead),
        createdDate: lead.Created_Time ? istDate(new Date(lead.Created_Time)) : null,
        description: lead.Description,
      },
      today,
      teamNumber
    );
    if (step) due.push({ lead, step });
  }
  due.sort((a, b) => STEP_ORDER.indexOf(a.step) - STEP_ORDER.indexOf(b.step));
  const listed = due.slice(0, MAX_PER_LIST);

  if (!listed.length) {
    const r = await sendWhatsappText(teamNumber, `✅ No leads waiting for follow-up right now (${today}).\n\nNew website leads still come to you instantly.`);
    return { sent: r.ok ? 1 : 0, listed: 0, error: r.error };
  }

  const lines: string[] = [`📋 *Leads to follow up – ${today}* (${due.length})`, ""];
  let current: TeamReminderStep | null = null;
  listed.forEach(({ lead, step }, i) => {
    if (step !== current) {
      current = step;
      lines.push(`*${STEP_LABEL[step]}*`);
    }
    const name = String(lead.Full_Name || lead.Last_Name || "Customer").replace(/\s+/g, " ").trim().slice(0, 40);
    const phone = toWhatsappNumber(lead.Phone || lead.Mobile);
    const place = [lead.City, lead.Zip_Code].filter(Boolean).join(" ");
    lines.push(`${i + 1}. ${name} – +${phone}${place ? ` – ${place}` : ""}`);
    lines.push(`   wa.me/${phone}`);
  });
  if (due.length > listed.length) lines.push("", `…and ${due.length - listed.length} more. Send "Hi" again for the next ones.`);

  // WhatsApp text limit is 4096 characters: split into parts if needed.
  const parts: string[] = [];
  let part = "";
  for (const line of lines) {
    if ((part + "\n" + line).length > 3800) {
      parts.push(part);
      part = line;
    } else {
      part = part ? `${part}\n${line}` : line;
    }
  }
  if (part) parts.push(part);

  let sent = 0;
  for (const p of parts) {
    const r = await sendWhatsappText(teamNumber, p);
    if (!r.ok) return { sent, listed: 0, error: r.error };
    sent++;
  }

  // Mark only after the list was delivered, so a failed send never hides a lead.
  const now = istNowString();
  await Promise.all(
    listed.map(async ({ lead, step }) => {
      await addTagsToZohoLead(lead.id, [STEP_TAG[step]]);
      await addNoteToZohoLead(lead.id, `${STEP_TAG[step]} (sent to team)`, `Listed in the team's WhatsApp follow-up list on ${now}. Please call the customer.`);
    })
  );
  return { sent, listed: listed.length };
}
