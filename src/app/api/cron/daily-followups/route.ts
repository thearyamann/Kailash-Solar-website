import { NextRequest, NextResponse } from "next/server";
import { getZohoAccessToken, addNoteToZohoLead, addTagToZohoLead } from "@/lib/zoho";

const TEMPLATE_CONFIGS = {
  // Message #1: Initial Short Follow-up Card with Flyer
  inquiry_initial: {
    name: "kailash_short_followup",
    language: "en",
    hasHeader: true,
    mediaId: "1826165885362638",
  },
  // Message #3: Website Visitor Follow-up (1-2 days after visiting website without booking)
  website_followup: {
    name: "kailash_visit_booking_followup",
    language: "en",
    hasHeader: false,
  },
  // Message #4: Gentle Re-engagement / Last Reminder (3-4 days if no action)
  last_reminder: {
    name: "kailash_last_reminder",
    language: "en",
    hasHeader: false,
  },
  // Won Customer Referral Rewards
  refer_and_earn: {
    name: "kailash_refer_and_earn",
    language: "hi",
    imageUrl:
      "https://scontent.whatsapp.net/v/t61.29466-34/869701833_1045199618541379_8865236857511946707_n.png?ccb=1-7&_nc_sid=8b1bef&_nc_ohc=0NS8DBXJaU4Q7kNvwFvl4iL&_nc_oc=Adp8VGvKneLi4T32GU9OtU5aFVogxam5HSCJbBUIEHo8vOPA1Fg3zxvmidsiCvcLcB4&_nc_zt=3&_nc_ht=scontent.whatsapp.net&edm=AH51TzQEAAAA&_nc_gid=_9kDy2dYUDQCRdxRO-WMwA&_nc_tpa=Q5bMBQI7Xkw_PxKZwdc0kXBH1c5mLqt-yug2GRAxajFt-n9ddLTz7oNed9Rf9-hDboUHJz3RHGr3nHZNDQ&oh=01_Q5Aa5wHLW8A0gjhwyU5tcwko9BoOOMvXItEWrMmkvCaJqMESAw&oe=6B0A8916",
    hasHeader: true,
  },
};

/**
 * Daily Automated WhatsApp Follow-up Cron
 * Runs automatically every morning at 10:00 AM IST (configured in vercel.json)
 */
export async function GET(request: NextRequest) {
  // Verify Cron Secret if set (for security)
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const metaToken = process.env.META_WHATSAPP_TOKEN?.replace(/^["']|["']$/g, "").trim();
  const phoneId = process.env.META_PHONE_NUMBER_ID?.replace(/^["']|["']$/g, "").trim();
  const dc = (process.env.ZOHO_DC || "in").toLowerCase().replace(/^["']|["']$/g, "").trim();

  if (!metaToken || !phoneId) {
    return NextResponse.json({ error: "Meta WhatsApp credentials not set" }, { status: 500 });
  }

  const results: {
    timestamp: string;
    token_debug?: { hasToken: boolean; prefix?: string; length?: number; phoneId?: string };
    total_evaluated: number;
    dispatched: number;
    failed: number;
    details: Array<{ lead_id: string; name: string; phone: string; template: string; status: string }>;
  } = {
    timestamp: new Date().toISOString(),
    token_debug: {
      hasToken: Boolean(metaToken),
      prefix: metaToken ? metaToken.slice(0, 8) + "..." : undefined,
      length: metaToken ? metaToken.length : 0,
      phoneId,
    },
    total_evaluated: 0,
    dispatched: 0,
    failed: 0,
    details: [],
  };

  try {
    const zohoToken = await getZohoAccessToken();
    const leadsUrl = `https://www.zohoapis.${dc}/crm/v6/Leads?fields=Full_Name,Phone,Tag,Description,City&per_page=20`;

    const crmResp = await fetch(leadsUrl, {
      headers: { Authorization: `Zoho-oauthtoken ${zohoToken}` },
    });

    if (!crmResp.ok) {
      throw new Error(`Zoho API responded with status ${crmResp.status}`);
    }

    const crmData = await crmResp.json();
    const leads = crmData?.data || [];
    results.total_evaluated = leads.length;

    for (const lead of leads) {
      const phone = lead.Phone;
      if (!phone) continue;

      const cleanPhone = phone.replace(/\D/g, "");
      const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      const firstName = (lead.Full_Name || "Customer").trim().split(" ")[0];

      // Multi-Branch Intelligence Loop:
      const tags: string[] = (lead.Tag || []).map((t: any) => (typeof t === "string" ? t : t.name));
      const isWon = tags.includes("Won Customer");
      const hasReplied = tags.includes("Hot Lead - Interested") || tags.includes("Replied - Interested") || tags.includes("Replied");
      const hasBooked = tags.includes("Site Visit Scheduled") || tags.includes("Site Visit Booked") || tags.includes("Site Visit Completed");
      const visitedWebsite = tags.includes("Visited Website");
      const followUp1Sent = tags.includes("Follow-up 1 Sent");
      const websiteFollowUpSent = tags.includes("Website Follow-up Sent");
      const lastReminderSent = tags.includes("Last Reminder Sent");

      // Stop if engaged, already booked, or already completed full cycle
      if (hasReplied || hasBooked || lastReminderSent) {
        continue;
      }

      let targetTemplateKey: keyof typeof TEMPLATE_CONFIGS = "inquiry_initial";
      let stepTagToAdd = "Follow-up 1 Sent";

      if (isWon) {
        targetTemplateKey = "refer_and_earn";
        stepTagToAdd = "Referral Offer Sent";
      } else if (visitedWebsite && !websiteFollowUpSent) {
        // Branch 2: Customer visited website 1-2 days ago without booking
        targetTemplateKey = "website_followup";
        stepTagToAdd = "Website Follow-up Sent";
      } else if ((followUp1Sent || websiteFollowUpSent) && !lastReminderSent) {
        // Branch 3: Customer received outreach 3-4 days ago without action
        targetTemplateKey = "last_reminder";
        stepTagToAdd = "Last Reminder Sent";
      } else if (!followUp1Sent) {
        // Branch 1: Initial Short Follow-up Card with Flyer
        targetTemplateKey = "inquiry_initial";
        stepTagToAdd = "Follow-up 1 Sent";
      } else {
        continue;
      }

      const tmpl = TEMPLATE_CONFIGS[targetTemplateKey];

      // Build Meta API components
      const components: any[] = [];
      if (tmpl.hasHeader) {
        if ((tmpl as any).mediaId) {
          components.push({
            type: "header",
            parameters: [{ type: "image", image: { id: (tmpl as any).mediaId } }],
          });
        } else if ((tmpl as any).imageUrl) {
          components.push({
            type: "header",
            parameters: [{ type: "image", image: { link: (tmpl as any).imageUrl } }],
          });
        }
      }
      components.push({
        type: "body",
        parameters: [{ type: "text", text: firstName }],
      });

      // Dispatch to Meta
      const metaPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "template",
        template: {
          name: tmpl.name,
          language: { code: tmpl.language },
          components,
        },
      };

      try {
        const metaRes = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${metaToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metaPayload),
        });

        const metaData = await metaRes.json();

        if (metaData.messages && metaData.messages.length > 0) {
          results.dispatched++;
          results.details.push({
            lead_id: lead.id,
            name: lead.Full_Name,
            phone: formattedPhone,
            template: tmpl.name,
            status: "sent",
          });

          // Log follow-up Note & Update Stage Tag in Zoho CRM
          const noteTitle = `Automated WhatsApp: ${tmpl.name}`;
          const noteBody = `Automated message sent: ${tmpl.name}\nStep: ${stepTagToAdd}\nDate: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`;
          await addNoteToZohoLead(lead.id, noteTitle, noteBody);
          await addTagToZohoLead(lead.id, stepTagToAdd);
        } else {
          results.failed++;
          results.details.push({
            lead_id: lead.id,
            name: lead.Full_Name,
            phone: formattedPhone,
            template: tmpl.name,
            status: metaData.error?.message || "error",
          });
        }
      } catch (sendErr: any) {
        results.failed++;
        results.details.push({
          lead_id: lead.id,
          name: lead.Full_Name,
          phone: formattedPhone,
          template: tmpl.name,
          status: sendErr.message,
        });
      }
    }

    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err.message, results }, { status: 500 });
  }
}
