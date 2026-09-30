import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface InquiryEmailRequest {
  name: string;
  phone: string;
  address: string;
  monthlyBill: string;
  customerType: string;
  message: string;
}

function validateInput(data: unknown): {
  valid: boolean;
  error?: string;
  data?: InquiryEmailRequest;
} {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid request body" };
  }
  const { name, phone, address, monthlyBill, customerType, message } =
    data as Record<string, unknown>;

  if (!name || typeof name !== "string" || name.trim().length === 0)
    return { valid: false, error: "Name is required" };
  if (name.length > 100)
    return { valid: false, error: "Name must be less than 100 characters" };

  if (!phone || typeof phone !== "string" || phone.trim().length === 0)
    return { valid: false, error: "Phone is required" };
  if (phone.length > 20)
    return { valid: false, error: "Phone must be less than 20 characters" };
  if (!/^[+\d\s()-]+$/.test(phone))
    return { valid: false, error: "Invalid phone format" };

  if (!address || typeof address !== "string" || address.trim().length === 0)
    return { valid: false, error: "Address is required" };
  if (address.length > 500)
    return { valid: false, error: "Address must be less than 500 characters" };

  if (monthlyBill !== undefined && monthlyBill !== null && monthlyBill !== "") {
    if (typeof monthlyBill !== "string" || monthlyBill.length > 20)
      return { valid: false, error: "Invalid monthly bill value" };
  }
  if (customerType !== undefined && customerType !== null && customerType !== "") {
    if (
      typeof customerType !== "string" ||
      !["industrial", "commercial", "residential"].includes(customerType)
    )
      return { valid: false, error: "Invalid customer type" };
  }
  if (message !== undefined && message !== null && message !== "") {
    if (typeof message !== "string" || message.length > 2000)
      return { valid: false, error: "Message must be less than 2000 characters" };
  }

  return {
    valid: true,
    data: {
      name: (name as string).trim(),
      phone: (phone as string).trim(),
      address: (address as string).trim(),
      monthlyBill: typeof monthlyBill === "string" ? monthlyBill.trim() : "",
      customerType: typeof customerType === "string" ? customerType : "",
      message: typeof message === "string" ? message.trim() : "",
    },
  };
}

// Persistent per-IP rate limiting: max 5 inquiries per IP per 10 minutes
const RATE_LIMIT_WINDOW_MIN = 10;
const RATE_LIMIT_MAX = 5;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // DB-backed rate limit (persistent across instances and cold starts)
    if (clientIp && clientIp !== "unknown") {
      const since = new Date(
        Date.now() - RATE_LIMIT_WINDOW_MIN * 60 * 1000
      ).toISOString();
      const { count, error: countError } = await supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("ip_address", clientIp)
        .gte("created_at", since);

      if (!countError && (count ?? 0) >= RATE_LIMIT_MAX) {
        return new Response(
          JSON.stringify({
            error: "Too many requests. Please try again later.",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
    }

    let rawData: unknown;
    try {
      rawData = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const validation = validateInput(rawData);
    if (!validation.valid || !validation.data) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { name, phone, address, monthlyBill, customerType, message } =
      validation.data;

    // Record inquiry server-side with IP (source of truth for rate limiting)
    const { error: insertError } = await supabase.from("inquiries").insert({
      name,
      phone,
      address,
      monthly_bill: monthlyBill || null,
      customer_type: customerType || null,
      message: message || null,
      ip_address: clientIp,
    });
    if (insertError) {
      console.error("DB insert error:", insertError.message);
      return new Response(
        JSON.stringify({ error: "Failed to save inquiry." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const whatsappText = `New Solar Lead Received!
Name: ${name}
Phone: ${phone}
Address: ${address}
Monthly Bill: ₹${monthlyBill || "Not specified"}
Customer Type: ${customerType || "Not specified"}
Message: ${message || "No additional message"}`;

    const whatsappUrl = `https://wa.me/918999999654?text=${encodeURIComponent(whatsappText)}`;

    await resend.emails.send({
      from: "Kailash Solar <onboarding@resend.dev>",
      to: ["sales@kailashsolar.com"],
      subject: `New Solar Inquiry from ${escapeHtml(name)}`,
      html: `
        <h1>New Solar Inquiry Received</h1>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(phone)}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Address</td><td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(address)}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Monthly Bill</td><td style="padding: 10px; border: 1px solid #ddd;">₹${escapeHtml(monthlyBill) || "Not specified"}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Customer Type</td><td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(customerType) || "Not specified"}</td></tr>
          <tr><td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 10px; border: 1px solid #ddd;">${escapeHtml(message) || "No additional message"}</td></tr>
        </table>
        <div style="margin-top: 30px;">
          <a href="${whatsappUrl}" style="background-color: #25D366; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Forward Lead to Team WhatsApp
          </a>
        </div>
        <p style="margin-top: 20px; color: #666;">This inquiry was submitted via the Kailash Solar website.</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error(
      "Error in send-inquiry-email function:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return new Response(
      JSON.stringify({ error: "Failed to send. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
