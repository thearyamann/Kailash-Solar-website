/**
 * Zoho CRM v6 API Client for Kailash Solar
 * Automatically handles OAuth2 refresh token exchange and in-memory caching.
 */

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getZohoAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 60_000) {
    return cachedToken.token;
  }

  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const dc = (process.env.ZOHO_DC || "in").toLowerCase();

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Zoho credentials missing in environment variables.");
  }

  const tokenUrl = `https://accounts.zoho.${dc}/oauth/v2/token`;
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${tokenUrl}?${params.toString()}`, { method: "POST" });
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

export async function findZohoLeadByPhone(phone: string): Promise<any | null> {
  try {
    const token = await getZohoAccessToken();
    const dc = (process.env.ZOHO_DC || "in").toLowerCase();
    
    // Normalize phone number (last 10 digits)
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const url = `https://www.zohoapis.${dc}/crm/v6/Leads/search?phone=${cleanPhone}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });

    if (res.status === 204) return null; // No content
    const data = await res.json();
    return data?.data?.[0] || null;
  } catch (err) {
    console.error("[Zoho Search Error]", err);
    return null;
  }
}

export async function addNoteToZohoLead(leadId: string, title: string, content: string): Promise<boolean> {
  try {
    const token = await getZohoAccessToken();
    const dc = (process.env.ZOHO_DC || "in").toLowerCase();
    const url = `https://www.zohoapis.${dc}/crm/v6/Leads/${leadId}/Notes`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            Note_Title: title,
            Note_Content: content,
          },
        ],
      }),
    });

    const data = await res.json();
    return data?.data?.[0]?.code === "SUCCESS";
  } catch (err) {
    console.error("[Zoho Add Note Error]", err);
    return false;
  }
}

export async function addTagToZohoLead(leadId: string, tagName: string): Promise<boolean> {
  try {
    const token = await getZohoAccessToken();
    const dc = (process.env.ZOHO_DC || "in").toLowerCase();
    const encodedTag = encodeURIComponent(tagName);
    const url = `https://www.zohoapis.${dc}/crm/v6/Leads/${leadId}/actions/add_tags?tag_names=${encodedTag}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    });

    const data = await res.json();
    return data?.data?.[0]?.code === "SUCCESS";
  } catch (err) {
    console.error("[Zoho Add Tag Error]", err);
    return false;
  }
}
