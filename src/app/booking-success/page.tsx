"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Phone, ArrowLeft, Home, MessageCircle, Clock, Check } from "lucide-react";
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

  return (
    <div className="min-h-[100dvh] bg-slate-50 sm:bg-slate-100 flex flex-col items-center justify-start sm:justify-center sm:py-6 select-none font-sans">
      
      {/* Native App Shell Frame */}
      <div className="w-full max-w-[420px] bg-white min-h-[100dvh] sm:min-h-0 sm:max-h-[92vh] sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-200 relative flex flex-col overflow-hidden">
        
        {/* Fixed Top Header (Permanently locked in place - does not scroll) */}
        <header className="fixed top-0 left-0 right-0 max-w-[420px] mx-auto z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 h-14 flex items-center justify-between shrink-0">
          <Link
            href="/solar-company-meerut"
            aria-label="Back to home"
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center text-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <span className="text-[15px] font-bold font-montserrat text-slate-900 tracking-tight">
            Booking Confirmed
          </span>

          {/* Spacer to keep title centered */}
          <div className="w-9 h-9" />
        </header>

        {/* Scrollable Content (pt-16 ensures clearance below fixed navbar) */}
        <main className="flex-1 w-full overflow-y-auto px-5 pt-16 pb-36 flex flex-col items-center">
          
          {/* Clean 3D Circular Tick Badge */}
          <div className="relative my-4 shrink-0 flex items-center justify-center">
            {/* Tactile subtle ripple ring */}
            <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-emerald-100/70 pointer-events-none anim-ripple" />

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center tick-3d-badge relative z-10">
              <svg 
                className="w-12 h-12 sm:w-14 sm:h-14" 
                viewBox="0 0 56 56" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M 15 29 L 24 38 L 41 19" 
                  stroke="#FFFFFF" 
                  strokeWidth="5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="anim-check-stroke"
                />
              </svg>
            </div>
          </div>

          {/* Typography & Details with smooth stagger */}
          <div className="w-full flex flex-col items-center anim-content-fade">
            <div className="text-center mt-2 mb-6">
              <h1 className="text-[22px] font-bold font-montserrat text-slate-900 tracking-tight">
                Site Visit Scheduled!
              </h1>
              <p className="text-[14px] text-slate-600 mt-1 max-w-[300px] mx-auto leading-relaxed">
                Thank you{details.name ? <>, <span className="font-bold text-slate-900 capitalize">{details.name}</span></> : ""}! Our engineer will contact you shortly.
              </p>
            </div>

          {/* Single Clean Details Card */}
          <div className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left space-y-3 text-[13px] mb-5">
            {details.name && (
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/70">
                <span className="text-slate-500">Customer Name</span>
                <span className="text-slate-900 font-bold capitalize">
                  {details.name}
                </span>
              </div>
            )}

            {details.phone && (
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/70">
                <span className="text-slate-500">WhatsApp Number</span>
                <span className="text-slate-900 font-semibold font-mono">
                  +91 {details.phone.slice(-10)}
                </span>
              </div>
            )}

            {details.pincode && (
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/70">
                <span className="text-slate-500">Service Location</span>
                <span className="text-slate-900 font-semibold">
                  {details.pincode} ({details.region || "Meerut"})
                </span>
              </div>
            )}

            {details.bill && (
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/70">
                <span className="text-slate-500">Monthly Bill</span>
                <span className="text-slate-900 font-semibold">{details.bill}</span>
              </div>
            )}

            {details.leadId && (
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/70">
                <span className="text-slate-500">Lead Reference ID</span>
                <span className="text-slate-900 font-mono font-semibold text-xs bg-slate-100 px-2 py-0.5 rounded">
                  #{details.leadId.replace(/^ks_lead_/, '')}
                </span>
              </div>
            )}

            <div className="pt-0.5 flex items-center justify-between text-xs">
              <span className="text-slate-500">PM Surya Ghar Subsidy</span>
              <span className="text-accent font-bold">Eligible for ₹1,08,000</span>
            </div>
          </div>

          {/* Clean "What Happens Next" Section */}
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 text-left mb-4">
            <h2 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-3">
              What Happens Next
            </h2>

            <div className="space-y-3 text-[12.5px]">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#133B76] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Engineer WhatsApp Confirmation</p>
                  <p className="text-slate-500 text-[11.5px] leading-tight">We verify your rooftop parameters and confirm site availability.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#133B76] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Site Survey</p>
                  <p className="text-slate-500 text-[11.5px] leading-tight">Accurate rooftop evaluation & customized solar system sizing.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#133B76] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Subsidy & Zero Down Payment Approval</p>
                  <p className="text-slate-500 text-[11.5px] leading-tight">Complete net-metering and bank subsidy paperwork handled by us.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1 pb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Average response time: within 30 minutes</span>
          </div>

        </div>

      </main>

        {/* Fixed Bottom Action Dock (Clean Native App Bar - Does not scroll) */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-slate-100 z-50 flex flex-col gap-2.5 shrink-0">
          
          {/* Primary Action Button: WhatsApp */}
          <a
            href={`https://wa.me/918999999654?text=${details.whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Secondary Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:+918999999654"
              className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span>Call Us</span>
            </a>

            <Link
              href="/solar-company-meerut"
              className="h-11 rounded-xl bg-[#133B76] hover:bg-[#0e2c59] active:scale-[0.98] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

        </div>

      </div>

      {/* 3D Tick Styling and Animation */}
      <style jsx global>{`
        .tick-3d-badge {
          background-color: #10B981;
          box-shadow: 
            0 16px 32px -4px rgba(16, 185, 129, 0.45),
            0 6px 12px -2px rgba(16, 185, 129, 0.25),
            inset 0 4px 6px rgba(255, 255, 255, 0.52),
            inset 0 -5px 8px rgba(4, 120, 87, 0.7);
          animation: badgePop 0.52s cubic-bezier(0.175, 0.885, 0.32, 1.25) forwards;
          transform-origin: center center;
        }

        .anim-ripple {
          animation: ripplePop 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          opacity: 0;
        }

        .anim-check-stroke {
          stroke-dasharray: 52;
          stroke-dashoffset: 52;
          animation: drawCheck 0.38s cubic-bezier(0.2, 0.8, 0.25, 1) 0.22s forwards;
        }

        .anim-content-fade {
          animation: contentFade 0.45s ease-out 0.35s both;
        }

        @keyframes badgePop {
          0% {
            transform: scale(0.35);
            opacity: 0;
          }
          65% {
            transform: scale(1.12);
            opacity: 1;
          }
          82% {
            transform: scale(0.96);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes ripplePop {
          0% {
            transform: scale(0.65);
            opacity: 0.75;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes drawCheck {
          0% {
            stroke-dashoffset: 52;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes contentFade {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
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
