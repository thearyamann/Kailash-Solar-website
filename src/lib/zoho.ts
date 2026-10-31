/**
 * Zoho CRM v6 API Client for Kailash Solar
 * Automatically handles OAuth2 refresh token exchange and in-memory caching.
 */
import { readEnv } from "@/lib/env";

let cachedToken: { token: string; expiresAt: number } | null = null;

function zohoDc(): string {
  return readEnv("ZOHO_DC", "in").toLowerCase();
}

export function hasZohoCredentials(): boolean {
  return Boolean(readEnv("ZOHO_CLIENT_ID") && readEnv("ZOHO_CLIENT_SECRET") && readEnv("ZOHO_REFRESH_TOKEN"));
}

export async function getZohoAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token;
  }

  const clientId = readEnv("ZOHO_CLIENT_ID");
  const clientSecret = readEnv("ZOHO_CLIENT_SECRET");
  const refreshToken = readEnv("ZOHO_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Zoho credentials missing in environment variables.");
  }

  const tokenUrl = `https://accounts.zoho.${zohoDc()}/oauth/v2/token`;
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${tokenUrl}?${params.toString()}`, { method: "POST", cache: "no-store" });
  const data = await res.json();

  if (!data.access_token) {
    throw new Error(`Failed to refresh Zoho token: ${JSON.stringify(data)}`);
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: now + (data.expires_in || 3600) * 1000,
  };

  return cachedToken.token;
}

/** Authenticated call to the Zoho CRM v6 API. Returns parsed JSON, or {} for empty (204) responses. */
async function zohoRequest(path: string, init: RequestInit = {}): Promise<any> {
  const token = await getZohoAccessToken();
  const res = await fetch(`https://www.zohoapis.${zohoDc()}/crm/v6/${path}`, {
    ...init,
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    throw new Error(`Zoho ${init.method || "GET"} ${path.split("?")[0]} failed (${res.status}): ${text.slice(0, 300)}`);
  }
  return data;
}

export function zohoTagNames(lead: any): string[] {
  return (lead?.Tag || []).map((t: any) => (typeof t === "string" ? t : t?.name)).filter(Boolean);
}

export async function findZohoLeadByPhone(phone: string): Promise<any | null> {
  try {
    // Normalize phone number (last 10 digits)
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) return null;
    const data = await zohoRequest(`Leads/search?phone=${cleanPhone}`);
    const matches: any[] = data?.data || [];
    // Prefer an exact last-10-digit match over a partial one
    return matches.find((l) => (l.Phone || l.Mobile || "").replace(/\D/g, "").endsWith(cleanPhone)) || matches[0] || null;
  } catch (err) {
    console.error("[Zoho Search Error]", err);
    return null;
  }
}

/** Creates a Lead and returns its Zoho ID (throws if Zoho rejects it). */
export async function createZohoLead(fields: Record<string, any>): Promise<string> {
  const data = await zohoRequest("Leads", {
    method: "POST",
    body: JSON.stringify({ data: [fields] }),
  });
  const row = data?.data?.[0];
  if (row?.code !== "SUCCESS" || !row?.details?.id) {
    throw new Error(`Zoho lead create failed: ${JSON.stringify(row)}`);
  }
  return row.details.id;
}

export async function updateZohoLead(leadId: string, fields: Record<string, any>): Promise<boolean> {
  try {
    const data = await zohoRequest(`Leads/${leadId}`, {
      method: "PUT",
      body: JSON.stringify({ data: [fields] }),
    });
    return data?.data?.[0]?.code === "SUCCESS";
  } catch (err) {
    console.error("[Zoho Update Lead Error]", err);
    return false;
  }
}

export async function addNoteToZohoLead(leadId: string, title: string, content: string): Promise<boolean> {
  try {
    const data = await zohoRequest(`Leads/${leadId}/Notes`, {
      method: "POST",
      body: JSON.stringify({ data: [{ Note_Title: title, Note_Content: content }] }),
    });
    return data?.data?.[0]?.code === "SUCCESS";
  } catch (err) {
    console.error("[Zoho Add Note Error]", err);
    return false;
  }
}

/** Adds one or more tags to a lead. Zoho v6 requires tags in the JSON body (the old `tag_names` query param is ignored). */
export async function addTagsToZohoLead(leadId: string, tagNames: string[]): Promise<boolean> {
  if (!tagNames.length) return true;
  try {
    const data = await zohoRequest(`Leads/${leadId}/actions/add_tags`, {
      method: "POST",
      body: JSON.stringify({ tags: tagNames.map((name) => ({ name })) }),
    });
    return data?.data?.[0]?.code === "SUCCESS";
  } catch (err) {
    console.error("[Zoho Add Tag Error]", err);
    return false;
  }
}

/** Fetches every lead (all pages), newest first, with the requested fields. */
export async function fetchAllZohoLeads(fields: string[]): Promise<any[]> {
  const leads: any[] = [];
  let page = 1;
  let pageToken: string | undefined;
  for (let guard = 0; guard < 100; guard++) {
    const cursor = pageToken ? `page_token=${encodeURIComponent(pageToken)}` : `page=${page}`;
    const data = await zohoRequest(`Leads?fields=${fields.join(",")}&per_page=200&sort_by=Created_Time&sort_order=desc&${cursor}`);
    leads.push(...(data?.data || []));
    if (!data?.info?.more_records) break;
    pageToken = data.info.next_page_token;
    page++;
  }
  return leads;
}

/** Fetches lead notes created on or after `since`, newest first. */
export async function fetchRecentLeadNotes(since: Date): Promise<Array<{ leadId: string; title: string; createdTime: string }>> {
  const notes: Array<{ leadId: string; title: string; createdTime: string }> = [];
  for (let page = 1; page <= 50; page++) {
    const data = await zohoRequest(
      `Notes?fields=Note_Title,Parent_Id,Created_Time&per_page=200&page=${page}&sort_by=Created_Time&sort_order=desc`
    );
    const rows: any[] = data?.data || [];
    let reachedOlder = false;
    for (const n of rows) {
      if (new Date(n.Created_Time).getTime() < since.getTime()) {
        reachedOlder = true;
        break;
      }
      const leadId = n.Parent_Id?.id;
      if (leadId) notes.push({ leadId, title: n.Note_Title || "", createdTime: n.Created_Time });
    }
    if (reachedOlder || !data?.info?.more_records) break;
  }
  return notes;
}
