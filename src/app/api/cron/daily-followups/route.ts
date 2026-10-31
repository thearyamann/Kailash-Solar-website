import { NextRequest, NextResponse } from "next/server";
import { addNoteToZohoLead, addTagsToZohoLead, fetchAllZohoLeads, fetchRecentLeadNotes, zohoTagNames } from "@/lib/zoho";
import { hasWhatsappCredentials, isTemplateApproved, sendWhatsappTemplate, teamWhatsappNumber } from "@/lib/whatsapp";
import { signVisitRef } from "@/lib/tracking";
import { istDate, istNowString, readEnv, toWhatsappNumber } from "@/lib/env";
import {
  FOLLOWUP_NOTE_PREFIX,
  FOLLOWUP_STEPS,
  FollowUpDates,
  FollowUpStep,
  planFollowUp,
  stepFromNoteTitle,
} from "@/lib/followups";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Max number of NEW leads that get the Day 1 message per day (reminders for leads already in the sequence are not capped).
const DEFAULT_DAILY_NEW_LIMIT = 25;
const NOTE_LOOKBACK_DAYS = 60;
const SEND_CONCURRENCY = 5;

type Detail = { lead_id: string; name: string; phone: string; step?: string; template?: string; status: string };

function isAuthorized(request: NextRequest): boolean {
  const secret = readEnv("CRON_SECRET");
  if (secret) return request.headers.get("authorization") === `Bearer ${secret}`;
  // Without CRON_SECRET, only accept Vercel's own cron invoker.
  return (request.headers.get("user-agent") || "").startsWith("vercel-cron/");
}

function firstNameOf(lead: any): string {
  const name = String(lead.Full_Name || lead.Last_Name || "").replace(/[\n\t]+/g, " ").trim();
  const first = name.split(/\s+/)[0] || "";
  return /[A-Za-zऀ-ॿ]/.test(first) ? first.slice(0, 30) : "Customer";
}

/** Rebuilds the IST send date of each follow-up step per lead from the cron's own Zoho notes. */
function buildSendDates(notes: Array<{ leadId: string; title: string; createdTime: string }>): Map<string, FollowUpDates> {
  const byLead = new Map<string, FollowUpDates>();
  // Oldest first so the first matching note wins for each step
  for (const note of [...notes].reverse()) {
    const step = stepFromNoteTitle(note.title);
    if (!step) continue;
    const dates = byLead.get(note.leadId) || {};
    const day = istDate(new Date(note.createdTime));
    if (step === "legacy_day4_template") {
      // The old cron used the same template for Day 4 and Day 10
      if (!dates.day4) dates.day4 = day;
      else if (!dates.day10) dates.day10 = day;
    } else if (!dates[step]) {
      dates[step] = day;
    }
    byLead.set(note.leadId, dates);
  }
  return byLead;
}

/**
 * Daily Automated WhatsApp Follow-up Cron
 * Runs automatically every morning at 10:00 AM IST (configured in vercel.json).
 *
 * Query params (all require auth):
 *   ?dry_run=1        → evaluate every lead and report what WOULD be sent; sends nothing, writes nothing
 *   ?only_phone=98..  → restrict the run to a single phone number (for testing)
 *   ?as_of=YYYY-MM-DD → (dry run only) evaluate as if today were that date
 */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get("dry_run") === "1";
  const onlyPhone = toWhatsappNumber(searchParams.get("only_phone"));
  // Dry runs can simulate a future day, e.g. ?dry_run=1&as_of=2026-11-02
  const asOf = searchParams.get("as_of");
  if (asOf && (!dryRun || !/^\d{4}-\d{2}-\d{2}$/.test(asOf))) {
    return NextResponse.json({ error: "as_of (YYYY-MM-DD) is only allowed with dry_run=1" }, { status: 400 });
  }
  const dailyNewLimit = Number(readEnv("FOLLOWUP_DAILY_NEW_LIMIT")) || DEFAULT_DAILY_NEW_LIMIT;

  if (!dryRun && !hasWhatsappCredentials()) {
    return NextResponse.json({ error: "Meta WhatsApp credentials not set" }, { status: 500 });
  }

  const today = asOf || istDate();
  const results = {
    timestamp: new Date().toISOString(),
    today_ist: today,
    dry_run: dryRun,
    total_leads: 0,
    daily_new_limit: dailyNewLimit,
    day1_already_sent_today: 0,
    dispatched: 0,
    failed: 0,
    aborted: null as string | null,
    summary: {} as Record<string, number>,
    details: [] as Detail[],
  };
  const count = (key: string) => (results.summary[key] = (results.summary[key] || 0) + 1);

  try {
    const [allLeads, notes] = await Promise.all([
      fetchAllZohoLeads(["Full_Name", "Last_Name", "Phone", "Mobile", "Tag", "Lead_Status", "Created_Time", "Description"]),
      fetchRecentLeadNotes(new Date(Date.now() - NOTE_LOOKBACK_DAYS * 86_400_000)),
    ]);
    const leads = onlyPhone
      ? allLeads.filter((l) => toWhatsappNumber(l.Phone || l.Mobile) === onlyPhone)
      : allLeads;
    results.total_leads = leads.length;

    const sendDates = buildSendDates(notes);
    sendDates.forEach((dates) => {
      if (dates.day1 === today) results.day1_already_sent_today++;
    });
    let day1Budget = Math.max(0, dailyNewLimit - results.day1_already_sent_today);

    const teamNumber = teamWhatsappNumber();
    const queue: Array<{ lead: any; step: FollowUpStep }> = [];

    for (const lead of leads) {
      const phone = lead.Phone || lead.Mobile || "";
      const decision = planFollowUp(
        {
          id: lead.id,
          phone,
          status: lead.Lead_Status,
          tags: zohoTagNames(lead),
          createdDate: lead.Created_Time ? istDate(new Date(lead.Created_Time)) : null,
          description: lead.Description,
        },
        sendDates.get(lead.id) || {},
        today,
        { teamNumber }
      );

      if (decision.action === "skip" || decision.action === "wait") {
        count(`${decision.action}: ${decision.reason.replace(/\d+ day\(s\)/, "N day(s)")}`);
        continue;
      }

      if (decision.action === "backfill") {
        // A step tag exists without a recorded date: record today as its date instead of guessing (never sends a message).
        count(`backfill: ${decision.step}`);
        if (!dryRun) {
          await addNoteToZohoLead(
            lead.id,
            `${FOLLOWUP_NOTE_PREFIX} ${decision.step} (date recorded, no message sent)`,
            `${decision.reason}. Recorded ${istNowString()} so the next reminder is timed from today.`
          );
        }
        continue;
      }

      if (decision.step === "day1") {
        if (day1Budget <= 0) {
          count("wait: daily new-lead limit reached");
          continue;
        }
        day1Budget--;
      }
      queue.push({ lead, step: decision.step });
    }

    // Use the tracked version of a template (personal "Book Free Visit" link) only once Meta has approved it.
    const trackedNames = new Set(
      Object.values(FOLLOWUP_STEPS).flatMap((cfg) => (cfg.trackedTemplate ? [cfg.trackedTemplate.name] : []))
    );
    const approvedTracked = new Set<string>();
    await Promise.all(
      Array.from(trackedNames).map(async (name) => {
        if (await isTemplateApproved(name)) approvedTracked.add(name);
      })
    );

    const dispatch = async ({ lead, step }: { lead: any; step: FollowUpStep }) => {
      const cfg = FOLLOWUP_STEPS[step];
      const phone = toWhatsappNumber(lead.Phone || lead.Mobile);
      const visitRef = signVisitRef(lead.id);
      const tracked = cfg.trackedTemplate && visitRef && approvedTracked.has(cfg.trackedTemplate.name) ? cfg.trackedTemplate : null;
      const template = tracked ? tracked.name : cfg.template;
      const detail: Detail = { lead_id: lead.id, name: lead.Full_Name, phone, step, template, status: "" };
      results.details.push(detail);
      count(`send: ${step}`);

      if (dryRun) {
        detail.status = "dry_run";
        return;
      }
      if (results.aborted) {
        detail.status = "not sent (run aborted)";
        return;
      }

      const components: any[] = [];
      if (cfg.headerImageUrl) {
        components.push({ type: "header", parameters: [{ type: "image", image: { link: cfg.headerImageUrl } }] });
      }
      components.push({ type: "body", parameters: [{ type: "text", text: firstNameOf(lead) }] });
      if (tracked) {
        components.push({
          type: "button",
          sub_type: "url",
          index: String(tracked.urlButtonIndex),
          parameters: [{ type: "text", text: visitRef }],
        });
      }

      const sent = await sendWhatsappTemplate(phone, template, cfg.language, components);
      if (!sent.ok) {
        results.failed++;
        detail.status = `failed: ${sent.error}`;
        if (/access token|OAuthException|session has expired/i.test(sent.error || "")) {
          results.aborted = `Meta token problem: ${sent.error}`;
        }
        return;
      }

      results.dispatched++;
      // Tag first: the tag is what stops the same step from being sent again tomorrow.
      const tagged = await addTagsToZohoLead(lead.id, [cfg.tag]);
      const noted = await addNoteToZohoLead(
        lead.id,
        `${FOLLOWUP_NOTE_PREFIX} ${step} (${template})`,
        `Automated WhatsApp sent: ${template}\nStep: ${cfg.tag}\nMeta message ID: ${sent.messageId}\nDate: ${istNowString()}`
      );
      detail.status = tagged && noted ? "sent" : `sent, but Zoho update failed (tag: ${tagged}, note: ${noted})`;
      if (!tagged) {
        // If Zoho can't record the step, stop the run so nobody is messaged twice.
        results.aborted = `Zoho tag update failed for lead ${lead.id}; stopped to prevent duplicate messages`;
      }
    };

    for (let i = 0; i < queue.length && !results.aborted; i += SEND_CONCURRENCY) {
      await Promise.all(queue.slice(i, i + SEND_CONCURRENCY).map(dispatch));
    }

    console.log(
      `[Follow-up Cron] ${dryRun ? "DRY RUN " : ""}leads=${results.total_leads} sent=${results.dispatched} failed=${results.failed}` +
        (results.aborted ? ` ABORTED: ${results.aborted}` : "")
    );
    return NextResponse.json(results);
  } catch (err: any) {
    console.error("[Follow-up Cron] Error:", err);
    return NextResponse.json({ error: err.message, results }, { status: 500 });
  }
}
