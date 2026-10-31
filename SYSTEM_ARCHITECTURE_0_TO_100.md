# Kailash Solar — Complete System Architecture & Automation Blueprint (0 to 100)

> **Last Updated:** October 31, 2026  
> **Status:** 100% Live & Operational in Production (`https://www.kailashsolar.com`)  
> **Target Audience:** Developers, AI Engineering Assistants, CRM Operators

---

## 1. Executive Summary & Purpose

**Kailash Solar** is a leading residential and commercial rooftop solar installation company based in **Meerut, Western Uttar Pradesh**, operating under the **PM Surya Ghar Muft Bijli Yojana** (offering up to ₹1,08,000 in government subsidies).

This system provides a **fully autonomous, zero-software-subscription lead capture and intelligent follow-up engine** connecting:
1. **Public Marketing Website** ([`kailashsolar.com`](https://www.kailashsolar.com))
2. **Zoho CRM v6** (India Data Center `in`)
3. **Meta WhatsApp Cloud API v21.0** (Wholesale messaging rates: ~₹0.86 / marketing message; 1,000 free inbound/month)
4. **Vercel Serverless & Cron** (India Mumbai edge region `bom1`)

---

## 2. Codebase & Directory Structure

There are two primary directories on the machine:

```
/Users/aryamanchaudhary/
├── Downloads/
│   └── Kailash Solar Website/        # [PRODUCTION REPO] Deployed to kailashsolar.com on Vercel
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/
│       │   │   │   ├── book-visit/route.ts          # Website booking endpoint (POST)
│       │   │   │   ├── cron/daily-followups/route.ts # 10 AM Automated Daily Follow-up Engine (GET)
│       │   │   │   ├── whatsapp/webhook/route.ts    # Bilateral Meta Webhook (GET/POST)
│       │   │   │   └── track/website/route.ts       # Website visit click tracker
│       │   │   ├── book-visit/page.tsx              # Public site-visit booking page
│       │   │   └── booking-success/page.tsx         # Booking confirmation with CRM Lead ID
│       │   ├── components/
│       │   │   └── BookVisitModal.tsx               # Site-wide popup visit booking modal
│       │   └── lib/
│       │       ├── crm.ts                           # Client-side CRM submission helper
│       │       └── zoho.ts                          # Zoho CRM OAuth2 & Lead Management SDK
│       ├── public/marketing/
│       │   ├── kailash_followup_flyer.png           # Official Flyer 1 (Van, Technician, UP15 plate)
│       │   └── newk2.png                            # Official Flyer 2 (Day 4/10 "0 Down Payment")
│       └── vercel.json                              # Vercel Cron configuration (10:00 AM IST daily)
│
└── kailashsolar/                             # [BACKEND & CRM ENGINE] Local engine & data pipelines
    ├── public/data/
    │   ├── kailash-leads-2026-10-29.csv      # Raw source leads CSV (333 records)
    │   ├── kailash-orders-2026-10-29.csv     # Raw source orders CSV (30 records)
    │   └── staged/
    │       ├── cleaned_leads.csv             # Deduplicated & normalized leads (315 records)
    │       ├── migration_audit_report.json   # Full audit report of migration
    │       └── zoho_migration_log.json       # Migration execution logs
    ├── scripts/
    │   ├── zoho_client.py                    # Python Zoho CRM API client with OAuth2
    │   ├── zoho_whatsapp_automation.py       # Standalone WhatsApp dispatch engine
    │   ├── register_short_template.py        # Meta template registration for Flyer 1
    │   ├── register_day4_template.py         # Meta template registration for newk2.png
    │   └── create_meta_templates.py          # Meta template batch submission tool
    └── src/lib/zoho.ts                       # Shared TypeScript Zoho SDK
```

---

## 3. CRM Lead Database & Contact Inventory

### Total Leads in Zoho CRM: **316 Records**

| Segment / Tag | Lead Count | Automation Behavior | Safety Rules |
| :--- | :---: | :--- | :--- |
| **`Won Customer`** | **73** | **NO SALES PITCHES.** Strictly excluded from cold messages and site surveys. Only eligible for Referral Rewards (₹3,000 Refer-and-Earn). | **Strictly Protected** |
| **`Lost Lead`** | **206** | Past inquiries who dropped off or went cold. Primary target for the automated 3-stage re-engagement loop. | Enforces strict cooling-off gaps |
| **`Active Lead`** | **35** | Ongoing prospects currently in conversation or recently added (e.g. Ashwani, Ritik). | Monitored daily |
| **`Site Visit Scheduled`** | **2+** | Customers who booked a free roof assessment via website (e.g., Sanjeev Madan). | Stops cold follow-ups immediately |

### Core Lead Fields Stored in Zoho CRM:
* **`Full_Name` / `Last_Name`**: Customer full name.
* **`Phone`**: Formatted with country code `+91XXXXXXXXXX`.
* **`City`**: Defaults to `Meerut` (or customer entered town).
* **`Street`**: Full installation address or landmark.
* **`Lead_Status`**: `Attempted to Contact`, `Site Visit Scheduled`, `Pre-Qualified`, `Lost Lead`.
* **`Tag`**: Array of stage tags (`Follow-up 1 Sent`, `Day 4 Reminder Sent`, `Day 10 Final Reminder Sent`, `Hot Lead - Interested`, `Inbound WhatsApp`).
* **`Description`**: Audit log of plant size (kW), preferred inspection dates, and inbound messages.

---

## 4. End-to-End Automation Flows (0 to 100)

```mermaid
flowchart TD
    A["Customer on Website / Inbound WhatsApp"] -->|Fills /book-visit Form| B["POST /api/book-visit"]
    A -->|Texts 'Hi' on WhatsApp| C["POST /api/whatsapp/webhook"]
    
    B --> D["Create / Update Lead in Zoho CRM"]
    D --> E["Tag: 'Site Visit Booked' + 'Site Visit Scheduled'"]
    E --> F["Send Instant WhatsApp Confirmation to Customer"]
    E --> G["Send Instant WhatsApp Alert to Team (+91 89999 99654)"]
    
    C --> H{"Does Lead Exist in Zoho?"}
    H -->|No: Unknown Number| I["Auto-Create New Lead in Zoho CRM"]
    H -->|Yes: Existing Lead| J["Attach Timestamped Note to Lead"]
    I --> K["Tag: 'Hot Lead - Interested' + 'Inbound WhatsApp'"]
    J --> K
    K --> L["Send Instant WhatsApp Alert to Team (+91 89999 99654)"]
    K --> M["Send Auto-Reply to Customer"]

    N["Daily 10:00 AM IST Cron"] --> O["GET /api/cron/daily-followups"]
    O --> P["Fetch Active Leads from Zoho CRM"]
    P --> Q{"Evaluate Lead Status & Tags"}
    Q -->|Won Customer| R["Excluded from Sales Pitch"]
    Q -->|Hot Lead / Already Booked| S["Stop Automation Forever"]
    Q -->|Fresh Lead| T["Send Message #1 (Flyer 1 + 3 Buttons)"]
    Q -->|4 Days (96h) Silent Gap Passed| U["Send Day 4 Reminder (newk2.png + 3 Buttons)"]
    Q -->|6 More Days (Day 10 Total) Passed| V["Send Day 10 Final Reminder (newk2.png)"]
    Q -->|After Day 10| W["Close Sequence (Zero Spam)"]
```

---

### Flow 1: Website Site-Visit Booking (`/book-visit`)

1. **Trigger:** Customer visits [`kailashsolar.com/book-visit`](https://www.kailashsolar.com/book-visit) or clicks a popup modal and submits:
   * Name
   * Phone number (10 digits)
   * City
   * Address / Landmark
   * Preferred Visit Date
   * Estimated Solar Plant Capacity (kW)
2. **Execution (`src/app/api/book-visit/route.ts`):**
   * Validates required phone and name.
   * Checks Zoho CRM via `findZohoLeadByPhone(cleanPhone)`.
   * If not found, creates a new lead with `Lead_Status: "Site Visit Scheduled"`.
   * Automatically adds tags: **`Site Visit Booked`** and **`Site Visit Scheduled`** (this permanently prevents cold sales messages).
   * Appends an audit note with date, preferred appointment, and capacity.
3. **Instant Team Alert Dispatched:**
   * Dispatches WhatsApp text alert to company sales phone (**`+91 89999 99654`**):
     ```text
     🏡 *NEW SITE VISIT BOOKED! (Website)*
     एक कस्टमर ने वेबसाइट पर फ्री साइट विज़िट बुक की है!

     👤 *नाम:* Sanjay Saini
     📞 *फ़ोन:* +919412886609
     📍 *शहर:* Meerut
     📅 *तारीख:* 2026-11-05
     🏠 *पता:* Modipuram Metro Station Road
     ⚡ *सोलर प्लांट:* 3 kW

     👉 कृपया तुरंत कस्टमर को कॉल करके समय कन्फर्म करें!
     ```
4. **Customer Confirmation Dispatched:**
   * Sends branded confirmation message to customer's WhatsApp welcoming them and giving office phone `+91 89999 99654`.
5. **UI Redirect:**
   * Redirects customer to [`kailashsolar.com/booking-success`](https://www.kailashsolar.com/booking-success) displaying their Zoho Lead Reference ID (`#148489100...`).

---

### Flow 2: Multi-Stage Automated Follow-Up Engine (Cron)

* **Trigger:** Vercel Cron executes **`GET /api/cron/daily-followups`** every morning at **10:00 AM IST** (`schedule: "30 4 * * *"`). Requires `Authorization: Bearer $CRON_SECRET` (or Vercel's cron user-agent if no secret is set).
* **Code:** schedule rules in `src/lib/followups.ts` (pure, unit-testable); route in `src/app/api/cron/daily-followups/route.ts`.
* **Reads ALL leads** (paginated, newest first) plus the last 60 days of Zoho notes.
* **State:** the Zoho **tag** records which step was sent; the cron's own **note** (`WA Follow-up: <step> (...)`) records the date.
  Tags are saved with the v6 JSON body `{"tags":[{"name":...}]}` (the old `?tag_names=` call silently did nothing, which caused daily re-sends).

| Step | When (IST calendar days) | Template | Tag |
| :--- | :--- | :--- | :--- |
| Day 1 | **OFF** (`SEND_DAY1 = false`). All leads created on/before **2026-10-30** count as Day 1 = 2026-10-30 (`DAY1_BATCH_DATE`); later leads are not messaged by the cron | `kailash_short_followup` + flyer 1 | `Follow-up 1 Sent` |
| Day 4 | 3 days after Day 1 | `kailash_day4_reminder` + newk2 | `Day 4 Reminder Sent` |
| Day 10 | **OFF** (`SEND_DAY10 = false`, budget). Would be 9 days after Day 1 | `kailash_day4_reminder` + newk2 | `Day 10 Final Reminder Sent` |
| Website visit | once, next run after a tracked visit (`Visited Website` tag) | `kailash_visit_booking_followup` | `Website Follow-up Sent` |

* **Current calendar:** Day 4 → **2026-11-02** (151 leads, ≈ ₹130), then nothing more (Day 10 is off). Preview any day with `?dry_run=1&as_of=YYYY-MM-DD`.
* **Never sends** to: `Won Customer`, `Hot Lead - Interested`, `Replied*`, `Site Visit *`, `Website Lead`, `Opted Out` tags; `Junk Lead` / `Not Qualified` / `Site Visit Scheduled` status; `Lost Reason: not_interested / competitor / not_feasible` in the Description; invalid numbers; the team number.
* **At most one automated message per lead per day.** After Day 10 the sequence is closed forever.
* If a step tag exists without a recorded date, the cron records today's date and sends nothing (conservative).
* If Zoho fails to save a tag after a send, the run aborts so nobody can be messaged twice.
* Flyer headers use public links (`https://www.kailashsolar.com/marketing/...`), because uploaded Meta media IDs expire after 30 days.
* "Visited Website" only works through a tracked link (`/api/track/website?lead_id=...`); no current template button uses it yet.

---

### Team Lead Alerts (all entry points)

Every interested lead (any website form, any inbound WhatsApp message, any "Yes, I'm Interested" tap) triggers a **free-form text** alert
to the team number `TEAM_WHATSAPP_NUMBER` (918999999654) with name, phone, PIN code, city, address, message, source and Zoho Lead ID
(`sendTeamLeadAlert` in `src/lib/whatsapp.ts`). The alert is sent even if Zoho is down, so no lead is lost.

> [!IMPORTANT]
> Meta only delivers free-form messages inside the 24-hour window: the team phone must send any WhatsApp message to the business number
> **+1 711-709-9679** at least once every 24 hours. Failed deliveries are logged by the webhook as `[Delivery FAILED] ... (TEAM ALERT)`.

Website forms: Book Visit page + modal (`source: book_visit`), Consultation (`consultation`), Quote (`quote`), Contact (`contact`) all POST to `/api/book-visit`.
Customers get the approved UTILITY template `kailash_interested_ack` (works outside the 24h window).

### Flow 3: Incoming Inbound Messages & "Hi" Handler (`/api/whatsapp/webhook`)

* Verifies `X-Hub-Signature-256` when `META_APP_SECRET` is set; ignores duplicate deliveries of the same message ID; always returns 200.
* Messages from the team number are ignored (not turned into leads).
* `STOP` / `unsubscribe` → tag `Opted Out`, no alert, no reply.
* The customer acknowledgement is sent only the first time a lead becomes hot, not on every message.


When any user sends a message or taps a button, Meta sends a `POST` event to `https://www.kailashsolar.com/api/whatsapp/webhook`:

1. **If Sender is an UNKNOWN Number (Not in Zoho CRM):**
   * Webhook extracts WhatsApp profile name (`value.contacts[0].profile.name`).
   * Automatically calls Zoho CRM API to **create a new Lead**:
     * `Full_Name`: WhatsApp profile name (e.g. "Aryamann Chaudhary").
     * `Phone`: `+` + sender digits.
     * `Lead_Source`: `Inbound WhatsApp Inquiry`.
     * `Lead_Status`: `Attempted to Contact`.
     * Tags: `Active Lead`, `Hot Lead - Interested`, `Inbound WhatsApp`.
   * Sends instant alert to sales team (`+91 89999 99654`).
   * Sends auto-reply confirmation to the customer.
2. **If Sender is an EXISTING Lead:**
   * Finds existing lead in Zoho CRM.
   * Appends timestamped note: `WhatsApp: "[text]"`.
   * Adds tag: `Hot Lead - Interested`.
   * Alerts sales team immediately.
   * Sends Message #2 auto-reply:
     ```text
     Thank you! 😊

     Aapki request humein receive ho gayi hai. Hamari team aapse bahut jald contact karegi.

     *Kailash Solar – Meerut’s No. 1 Solar Company.*
     ```

---

## 5. Official Approved Meta WhatsApp Templates Reference

| Template Name | Meta Template ID | Category | Language | Header Asset | Action Buttons |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`kailash_short_followup`** | `1643471687509249` | MARKETING | `en` | Flyer 1 (`1826165885362638`) | 1. Yes, I'm Interested<br>2. 📞 Call Kailash Solar<br>3. 🌐 Visit Website |
| **`kailash_day4_reminder`** | `1450442823886300` | MARKETING | `en` | newk2 (`1104441709052746`) | 1. Yes, I'm Interested<br>2. 📞 Call Us<br>3. 📅 Book Free Visit |
| **`kailash_visit_booking_followup`** | `1584660602988422` | MARKETING | `en` | None (Text) | 1. 📅 Book FREE Visit<br>2. 📞 Call Us Now |
| **`kailash_last_reminder`** | `1097443139761110` | MARKETING | `en` | None (Text) | 1. 📅 Book FREE Visit<br>2. 📞 Call Us |
| **`hello_world`** | `1001901805497707` | UTILITY | `en_US` | None (Text) | Default test |

---

## 6. Environment Variables Reference

These keys are configured in **Vercel** (`kailashsolar.com` Project Settings > Environment Variables) and locally in `.env`:

```bash
# NEVER commit real values. Real keys live only in Vercel env settings and .env.local (gitignored).
# ------------------------------------------------------------------------------
# Zoho CRM v6 API Credentials (India Data Center)
# ------------------------------------------------------------------------------
ZOHO_CLIENT_ID=<from Zoho API console>
ZOHO_CLIENT_SECRET=<secret>
ZOHO_REFRESH_TOKEN=<secret>
ZOHO_DC=in

# ------------------------------------------------------------------------------
# Meta WhatsApp Cloud API Credentials (v21.0)
# ------------------------------------------------------------------------------
META_WHATSAPP_TOKEN=<secret – permanent System User token>
META_PHONE_NUMBER_ID=1395399633652482
META_WABA_ID=1081302808240379
META_APP_SECRET=<secret – enables X-Hub-Signature-256 webhook verification>
META_WEBHOOK_VERIFY_TOKEN=<secret>

# ------------------------------------------------------------------------------
# Company Contact, Team Alerts & Automation Settings
# ------------------------------------------------------------------------------
COMPANY_PHONE=+918999999654
NEXT_PUBLIC_COMPANY_PHONE=+918999999654
WHATSAPP_NUMBER=918999999654
NEXT_PUBLIC_WHATSAPP_NUMBER=918999999654
TEAM_WHATSAPP_NUMBER=918999999654        # receives every interested-lead alert (free-form text)
CRON_SECRET=<secret>                     # Vercel sends it to the cron automatically
FOLLOWUP_DAILY_NEW_LIMIT=25              # max NEW leads that get the Day 1 message per day
# WHATSAPP_ALLOWED_RECIPIENTS=919084355705  # TESTING ONLY: blocks every send to numbers not listed
```

> [!NOTE]
> All serverless endpoints automatically sanitize strings with `.replace(/^["']|["']$/g, "").trim()` to prevent accidental quote copy-paste errors from invalidating Meta tokens.

---

## 7. Meta WhatsApp Cloud API Setup Summary

* **Business Portfolio:** Kailash Solar
* **WABA ID:** `1081302808240379`
* **App ID:** `1616719780240656` (Subscribed to WABA via `POST /1081302808240379/subscribed_apps` ✅)
* **Phone Number ID:** `1395399633652482`
* **Verified Sender Name:** `Kailash Solar` (Quality: GREEN, Status: CONNECTED, Mode: LIVE)
* **Billing / Payment:** Active & Verified (Credit card attached in Meta Business Manager).
* **Webhook Callback URL:** `https://www.kailashsolar.com/api/whatsapp/webhook`
* **Subscribed Webhook Field:** `messages`

---

## 8. AI Handoff & Troubleshooting Protocol

If another AI assistant or engineer is reviewing this project in the future, follow this checklist:

1. **Testing the Webhook:**
   ```bash
   curl -i "https://www.kailashsolar.com/api/whatsapp/webhook?hub.mode=subscribe&hub.challenge=test_123&hub.verify_token=$META_WEBHOOK_VERIFY_TOKEN"
   ```
   *Expected Response:* `HTTP 200` returning `test_123`.

2. **Testing the Follow-up Engine (DRY RUN – sends nothing, writes nothing):**
   ```bash
   curl -s -H "Authorization: Bearer $CRON_SECRET" "https://www.kailashsolar.com/api/cron/daily-followups?dry_run=1"
   ```
   *Expected Response:* JSON `summary` of every lead (send / wait / skip + reason). Without `dry_run=1` this sends real messages.
   `?only_phone=XXXXXXXXXX` restricts a run to one lead.

3. **Testing Website Lead Form:** ⚠️ This creates/updates a Zoho lead AND sends real WhatsApp messages
   (team alert + customer acknowledgement). Only test locally with `WHATSAPP_ALLOWED_RECIPIENTS` set.
   ```bash
   curl -i -X POST "http://localhost:3000/api/book-visit" \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Lead","phone":"9084355705","pincode":"250001","city":"Meerut","address":"Test Street","preferred_date":"2026-11-05","plant_size_kw":3,"source":"book_visit"}'
   ```
   *Expected Response:* `HTTP 200` with `{"success": true, "lead_id": "148489..."}`.

4. **Deploying Code Updates:**
   ```bash
   cd "/Users/aryamanchaudhary/Downloads/Kailash Solar Website"
   git push origin main
   ```
   *Vercel deploys automatically within 60 seconds.*
