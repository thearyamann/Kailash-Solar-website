/**
 * Zoho CRM & WhatsApp Automation API Integration
 */

export interface BookVisitPayload {
  name: string;
  phone: string;
  city?: string;
  address?: string;
  preferred_date?: string;
  plant_size_kw?: number;
}

export interface BookVisitResponse {
  success: boolean;
  message?: string;
  lead_id?: string;
  error?: string;
}

/**
 * Returns the target CRM backend URL for /api/book-visit.
 * If NEXT_PUBLIC_CRM_API_URL is configured (e.g. "https://crm.kailashsolar.com"),
 * it calls that external domain. Otherwise, it defaults to the internal Next.js "/api/book-visit".
 */
export function getCRMVisitEndpoint(): string {
  const customUrl = process.env.NEXT_PUBLIC_CRM_API_URL?.trim();
  if (customUrl) {
    const baseUrl = customUrl.replace(/\/+$/, "");
    return `${baseUrl}/api/book-visit`;
  }
  return "/api/book-visit";
}

/**
 * Maps monthly bill ranges to estimated solar capacity (kW)
 */
export function estimatePlantSizeFromBill(monthlyBill?: string): number {
  if (!monthlyBill) return 3;
  switch (monthlyBill) {
    case "< 1500":
    case "Less than ₹1500":
      return 2;
    case "1500 - 2500":
    case "₹1500 - ₹2500":
      return 3;
    case "2500 - 5000":
    case "₹2500 - ₹4000":
      return 4;
    case "> 5000":
    case "₹4000 - ₹8000":
      return 5;
    case "More than ₹8000":
      return 8;
    default:
      return 3;
  }
}

/**
 * Submits the lead to the Zoho CRM & WhatsApp Automation API endpoint.
 */
export async function submitBookVisitToCRM(payload: BookVisitPayload): Promise<BookVisitResponse> {
  const endpoint = getCRMVisitEndpoint();

  const formattedPayload = {
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    city: payload.city || "Meerut",
    address: payload.address || "",
    preferred_date: payload.preferred_date || "",
    plant_size_kw: payload.plant_size_kw && payload.plant_size_kw > 0 ? payload.plant_size_kw : 3,
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedPayload),
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data?.success) {
      return {
        success: true,
        message: data.message || "Site visit booked and synced to Zoho CRM successfully",
        lead_id: data.lead_id,
      };
    }

    return {
      success: false,
      error: data?.error || data?.message || `API error (${res.status})`,
    };
  } catch (err: any) {
    console.error("CRM API connection error:", err);
    return {
      success: false,
      error: err?.message || "Network error communicating with CRM API",
    };
  }
}
