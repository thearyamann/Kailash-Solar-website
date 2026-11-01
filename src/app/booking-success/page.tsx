"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Phone, ArrowLeft, MessageCircle, Check } from "lucide-react";
import { getLastSubmission } from "@/lib/submission-tracker";
import { getPincodeRegion } from "@/lib/pincode";

function getLiveCustomerData() {
  if (typeof window === "undefined") {
    return { name: "", phone: "", pincode: "", region: "", bill: "", leadId: "", msg: "" };
  }

  let name = "";
  let phone = "";
  let pincode = "";
  let region = "";
  let bill = "";
  let leadId = "";
  let msg = "";

  // 1. Direct window.location.search (instantaneous, never stale)
  try {
    const params = new URLSearchParams(window.location.search);
    name = params.get("name") || "";
    phone = params.get("phone") || "";
    pincode = params.get("pincode") || "";
    region = params.get("region") || "";
    bill = params.get("bill") || "";
    leadId = params.get("lead_id") || "";
    msg = params.get("msg") || "";
  } catch (e) {}

  // 2. Direct session storage (recorded at form submit button tap)
  if (!name) {
    try {
      name = sessionStorage.getItem("kailash_submitted_name") || "";
    } catch (e) {}
  }
  if (!phone) {
    try {
      phone = sessionStorage.getItem("kailash_submitted_phone") || "";
    } catch (e) {}
  }
  if (!pincode) {
    try {
      pincode = sessionStorage.getItem("kailash_submitted_pincode") || "";
    } catch (e) {}
  }
  if (!bill) {
    try {
      bill = sessionStorage.getItem("kailash_submitted_bill") || "";
    } catch (e) {}
  }
  if (!leadId) {
    try {
      leadId = sessionStorage.getItem("kailash_submitted_lead_id") || "";
    } catch (e) {}
  }

  // 3. Last submission tracker
  if (!name || !phone) {
    try {
      const last = getLastSubmission();
      if (last) {
        name = name || last.name || "";
        phone = phone || last.phone || "";
        pincode = pincode || last.pincode || "";
        bill = bill || last.monthlyBill || "";
      }
    } catch (e) {}
  }

  // 4. Form keystroke profile autosave fallback
  if (!name) {
    try {
      const profile = localStorage.getItem("kailash_user_profile");
      if (profile) {
        const parsed = JSON.parse(profile);
        name = parsed.name || "";
        phone = phone || parsed.phone || "";
      }
    } catch (e) {}
  }

  if (pincode && !region) {
    region = getPincodeRegion(pincode);
  }

  return { 
    name: name.trim(), 
    phone: phone.trim(), 
    pincode: pincode.trim(), 
    region: region || "Meerut", 
    bill: bill.trim(), 
    leadId: leadId.trim(),
    msg 
  };
}

function BookingSuccessAppContent() {
  const searchParams = useSearchParams();
  const [details, setDetails] = useState({
    name: "",
    phone: "",
    pincode: "",
    region: "",
    bill: "",
    leadId: "",
    whatsappMsg: "",
  });

  useEffect(() => {
    const live = getLiveCustomerData();
    const spName = (searchParams.get("name") || "").trim();
    const spPhone = (searchParams.get("phone") || "").trim();
    const spPin = (searchParams.get("pincode") || "").trim();
    const spRegion = (searchParams.get("region") || "").trim();
    const spBill = (searchParams.get("bill") || "").trim();
    const spLeadId = (searchParams.get("lead_id") || "").trim();
    const spMsg = (searchParams.get("msg") || "").trim();

    const name = spName || live.name;
    const phone = spPhone || live.phone;
    const pincode = spPin || live.pincode;
    const region = spRegion || live.region || (pincode ? getPincodeRegion(pincode) : "") || "Meerut";
    const bill = spBill || live.bill;
    const leadId = spLeadId || live.leadId;

    const defaultMsg = encodeURIComponent(
      `Hi Kailash Solar, I just booked a site visit on your website.\n\n` +
      (name ? `Name: ${name}\n` : "") +
      (phone ? `Phone: ${phone}\n` : "") +
      (pincode ? `PIN Code: ${pincode} [${region}]\n` : "") +
      (bill ? `Monthly Bill: ${bill}\n` : "") +
      (leadId ? `Booking Ref: #${leadId}\n` : "") +
      `Please let me know when your engineer can visit.`
    );

    setDetails({
      name,
      phone,
      pincode,
      region,
      bill,
      leadId,
      whatsappMsg: spMsg || live.msg || defaultMsg,
    });
  }, [searchParams]);

  // Light success haptic, like payment apps (Android Chrome; iOS ignores it)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          navigator.vibrate?.([14, 60, 22]);
        }
      } catch (e) {}
    }, 380);
    return () => clearTimeout(t);
  }, []);

  const firstName = details.name ? details.name.split(" ")[0] : "";
  const rows = [
    details.name && { label: "Name", value: <span className="capitalize">{details.name}</span> },
    details.phone && { label: "WhatsApp", value: `+91 ${details.phone.slice(-10)}` },
    details.pincode && { label: "Location", value: `${details.region || "Meerut"} · ${details.pincode}` },
    details.bill && { label: "Monthly bill", value: details.bill },
    details.leadId && { label: "Booking ID", value: `#${details.leadId.replace(/^ks_lead_/, "")}` },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const steps = [
    { title: "Confirmation call", text: "Our engineer confirms your visit on WhatsApp." },
    { title: "Free site survey", text: "We check your rooftop and size the right system." },
    { title: "Subsidy & installation", text: "We handle the subsidy, loan and net-meter paperwork." },
  ];

  return (
    <div className="min-h-[100dvh] bg-white sm:bg-slate-100 flex justify-center sm:items-center sm:py-10 select-none font-sans">
      <div className="w-full max-w-[420px] bg-white min-h-[100dvh] sm:min-h-0 sm:rounded-[28px] sm:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] relative flex flex-col">

        {/* Minimal top bar */}
        <header className="absolute top-0 left-0 right-0 z-20 px-4 h-14 flex items-center">
          <Link
            href="/solar-company-meerut"
            aria-label="Back to home"
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-500 active:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </header>

        <main className="flex-1 px-6 pt-14 pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:pb-6 flex flex-col items-center overscroll-contain">

          {/* Animated success tick (payment-app style) */}
          <div className="relative mt-4 mb-4 shrink-0 w-36 h-36 flex items-center justify-center" aria-hidden="true">
            <div className="absolute inset-0 rounded-full success-glow" />
            <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-400/60 success-ring" />
            <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-300/50 success-ring success-ring-2" />
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full success-dot"
                style={{ "--a": `${i * 45 + 22.5}deg`, background: i % 2 ? "#F59E0B" : "#10B981" } as React.CSSProperties}
              />
            ))}
            <div className="w-24 h-24 rounded-full flex items-center justify-center success-badge relative z-10">
              <svg className="w-12 h-12" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 15 29 L 24 38 L 41 19" stroke="#FFFFFF" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" className="success-check" />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8 success-rise" style={{ animationDelay: "0.42s" }}>
            <h1 className="text-[24px] leading-tight font-bold font-montserrat text-slate-900 tracking-tight">
              Site visit booked
            </h1>
            <p className="text-[14.5px] text-slate-500 mt-2 max-w-[290px] mx-auto leading-relaxed">
              {firstName ? <>Thanks, <span className="capitalize text-slate-700 font-medium">{firstName}</span>. </> : "Thank you. "}
              Our engineer will call you within 30 minutes.
            </p>
          </div>

          {/* Booking details */}
          {rows.length > 0 && (
            <section className="w-full success-rise" style={{ animationDelay: "0.52s" }}>
              <div className="rounded-2xl bg-slate-50 px-4">
                {rows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between gap-4 py-3.5 text-[14px] ${i ? "border-t border-slate-200/70" : ""}`}
                  >
                    <span className="text-slate-500">{row.label}</span>
                    <span className="text-slate-900 font-semibold text-right truncate">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-emerald-700">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                Eligible for up to ₹1,08,000 PM Surya Ghar subsidy
              </div>
            </section>
          )}

          {/* What happens next */}
          <section className="w-full mt-8 success-rise" style={{ animationDelay: "0.62s" }}>
            <h2 className="text-[12px] uppercase tracking-[0.08em] font-semibold text-slate-400 mb-4">
              What happens next
            </h2>
            <ol className="relative">
              {steps.map((step, i) => (
                <li key={step.title} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {i < steps.length - 1 && (
                    <span className="absolute left-[11px] top-7 bottom-0 w-px bg-slate-200" aria-hidden="true" />
                  )}
                  <span className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${i === 0 ? "bg-[#133B76] text-white" : "bg-slate-100 text-slate-500"}`}>
                    {i + 1}
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[14px] font-semibold text-slate-900 leading-tight">{step.title}</p>
                    <p className="text-[13px] text-slate-500 mt-1 leading-snug">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </main>

        {/* Bottom action bar: only the two actions that matter */}
        <div className="fixed sm:sticky bottom-0 left-0 right-0 max-w-[420px] mx-auto px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-5 bg-white/90 backdrop-blur-xl border-t border-slate-100 sm:rounded-b-[28px] z-30 success-dock">
          <div className="flex gap-3">
            <a
              href={`https://wa.me/918999999654?text=${details.whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-[1.6] h-[52px] rounded-2xl bg-[#25D366] active:bg-[#1fb257] active:scale-[0.98] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-[0_8px_20px_-8px_rgba(37,211,102,0.7)] transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <a
              href="tel:+918999999654"
              className="flex-1 h-[52px] rounded-2xl bg-slate-100 active:bg-slate-200 active:scale-[0.98] text-slate-900 font-semibold text-[15px] flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-[18px] h-[18px]" />
              Call Us
            </a>
          </div>
        </div>

      </div>

      {/* Success animation */}
      <style jsx global>{`
        .success-badge {
          background: radial-gradient(circle at 32% 28%, #34D399 0%, #10B981 45%, #059669 100%);
          box-shadow:
            0 18px 36px -8px rgba(16, 185, 129, 0.5),
            inset 0 3px 6px rgba(255, 255, 255, 0.45),
            inset 0 -4px 8px rgba(4, 120, 87, 0.55);
          transform: scale(0);
          animation: sBadge 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s forwards;
          will-change: transform;
        }
        .success-check {
          stroke-dasharray: 44;
          stroke-dashoffset: 44;
          animation: sCheck 0.36s cubic-bezier(0.65, 0, 0.35, 1) 0.38s forwards;
        }
        .success-glow {
          background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0) 70%);
          opacity: 0;
          animation: sFade 0.8s ease-out 0.15s forwards;
        }
        .success-ring {
          opacity: 0;
          animation: sRing 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
          will-change: transform, opacity;
        }
        .success-ring-2 { animation-delay: 0.55s; }
        .success-dot {
          opacity: 0;
          transform: rotate(var(--a)) translateY(0) scale(0.4);
          animation: sDot 0.75s cubic-bezier(0.16, 1, 0.3, 1) 0.42s forwards;
          will-change: transform, opacity;
        }
        .success-rise {
          opacity: 0;
          animation: sRise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
          will-change: transform, opacity;
        }
        .success-dock {
          transform: translateY(110%);
          animation: sDock 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
        }
        @keyframes sBadge {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes sCheck { to { stroke-dashoffset: 0; } }
        @keyframes sFade { to { opacity: 1; } }
        @keyframes sRing {
          0% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.75); }
        }
        @keyframes sDot {
          0% { opacity: 0; transform: rotate(var(--a)) translateY(0) scale(0.4); }
          25% { opacity: 1; }
          100% { opacity: 0; transform: rotate(var(--a)) translateY(-68px) scale(1); }
        }
        @keyframes sRise {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes sDock { to { transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          .success-badge, .success-check, .success-glow, .success-rise, .success-dock {
            animation: none !important; opacity: 1 !important; transform: none !important; stroke-dashoffset: 0 !important;
          }
          .success-ring, .success-dot { display: none; }
        }
      `}</style>

    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#133B76]" />
      </div>
    }>
      <BookingSuccessAppContent />
    </Suspense>
  );
}
