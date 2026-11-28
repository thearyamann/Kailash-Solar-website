"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import CelebrationConfetti from "@/components/CelebrationConfetti";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Phone, ArrowLeft, MessageCircle, Check } from "lucide-react";
import { getLastSubmission } from "@/lib/submission-tracker";
import { getPincodeRegion } from "@/lib/pincode";
import { useToast } from "@/hooks/use-toast";
import { useFormLanguage } from "@/lib/form-language";

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

const REDIRECT_SECONDS = 12;

function BookingSuccessAppContent() {
  const searchParams = useSearchParams();
  const { dismiss } = useToast();

  // Never show a toast/popup over the success screen
  useEffect(() => {
    dismiss();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
    }, 300);
    return () => clearTimeout(t);
  }, []);

  // After a short look at the confirmation, take the visitor back to the home page.
  // Stops if they tap Stay / WhatsApp / Call, so we never pull them away mid-action.
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState<number | null>(REDIRECT_SECONDS);
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      router.replace("/solar-company-meerut");
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, router]);
  const stopRedirect = () => setSecondsLeft(null);

  const { lang, t } = useFormLanguage();
  const tickRef = useRef<HTMLDivElement>(null);
  const firstWord = details.name ? details.name.split(" ")[0] : "";
  const firstName = firstWord ? firstWord.charAt(0).toUpperCase() + firstWord.slice(1) : "";
  const rows = [
    details.name && { label: t.rowName, value: <span className="capitalize">{details.name}</span> },
    details.phone && { label: t.rowWhatsapp, value: `+91 ${details.phone.slice(-10)}` },
    details.pincode && { label: t.rowPin, value: details.pincode },
    details.bill && { label: t.rowBill, value: t.billOptions[details.bill] || details.bill },
    details.leadId && { label: t.rowBooking, value: `#${details.leadId.replace(/^ks_lead_/, "")}` },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const steps = t.steps;

  return (
    <div lang={lang} className="min-h-[100dvh] bg-white sm:bg-slate-100 flex justify-center sm:items-center sm:py-10 select-none font-sans success-screen">
      <div className="w-full sm:max-w-[420px] bg-white min-h-[100dvh] sm:min-h-0 sm:rounded-[28px] sm:border sm:border-slate-200 relative flex flex-col">

        <CelebrationConfetti originRef={tickRef} delay={320} />

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

        <main className="success-content flex-1 px-6 pt-14 pb-[calc(7.5rem+env(safe-area-inset-bottom))] sm:pb-6 flex flex-col items-center overscroll-contain">

          {/* 3D success tick (same as CFOH site) */}
          {/* 132px image = 96px visible circle, same size as the previous tick */}
          <div ref={tickRef} className="relative mt-4 mb-2 w-[132px] h-[132px] shrink-0 success-pop">
            <img
              src="/images/success-check-3d.png"
              alt="Success"
              width={132}
              height={132}
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-8 success-rise" style={{ animationDelay: "0.42s" }}>
            <h1 className="text-[24px] leading-tight font-bold font-montserrat text-slate-900 tracking-tight">
              {t.booked}
            </h1>
            <p className="text-[14.5px] text-slate-500 mt-2 max-w-[290px] mx-auto leading-relaxed">
              {t.thanks(firstName)}
              {t.callSoon}
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
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[12.5px] font-semibold text-accent">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                {t.subsidyLine}
              </div>
            </section>
          )}

          {/* What happens next */}
          <section className="w-full mt-8 success-rise" style={{ animationDelay: "0.62s" }}>
            <h2 className="text-[12px] uppercase tracking-[0.08em] font-semibold text-slate-400 mb-4">
              {t.nextTitle}
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
        <div className="fixed sm:sticky bottom-0 left-0 right-0 sm:max-w-[420px] mx-auto px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-5 bg-white/90 backdrop-blur-xl border-t border-slate-100 sm:rounded-b-[28px] z-30 success-dock">
          {secondsLeft !== null && (
            <div className="mb-2.5 flex items-center justify-center gap-2 text-[12.5px] text-slate-500">
              <span>{t.goingHome(secondsLeft)}</span>
              <button type="button" onClick={stopRedirect} className="font-semibold text-[#133B76] underline underline-offset-2">
                {t.stayHere}
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <a
              href={`https://wa.me/918999999654?text=${details.whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={stopRedirect}
              className="flex-[1.6] h-[52px] rounded-2xl bg-[#133B76] active:bg-[#0E2C59] active:scale-[0.98] text-white font-semibold text-[15px] flex items-center justify-center gap-2 transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              {t.chatWhatsapp}
            </a>
            <a
              href="tel:+918999999654"
              onClick={stopRedirect}
              className="flex-1 h-[52px] rounded-2xl bg-slate-100 active:bg-slate-200 active:scale-[0.98] text-slate-900 font-semibold text-[15px] flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-[18px] h-[18px]" />
              {t.callUs}
            </a>
          </div>
        </div>

      </div>

      {/* Success animation */}
      <style jsx global>{`
        /* No transform on the wrapper: it would make the fixed bottom bar scroll with the page */
        .success-screen {
          animation: sFade 0.3s ease-out both;
        }
        .success-content {
          animation: sScreen 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .success-pop {
          opacity: 0;
          animation: sPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s forwards;
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
        @keyframes sScreen {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes sFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes sPop {
          0% { opacity: 0; transform: scale(0.3); }
          65% { opacity: 1; transform: scale(1.12); }
          85% { transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes sRise {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes sDock { to { transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          .success-screen, .success-content, .success-pop, .success-rise, .success-dock {
            animation: none !important; opacity: 1 !important; transform: none !important;
          }
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
