"use client";

import { useState, useEffect, useRef } from "react";
import { cleanPhoneInput, isValidMobile, isValidName } from "@/lib/form-validation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { goToBookingSuccess } from "@/lib/go-to-success";
import { ArrowLeft, Phone, CheckCircle2, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendInquiryEmail } from "@/lib/inquiry-email";
import { useFormLanguage } from "@/lib/form-language";
import { 
  validatePincode, 
  isServiceablePincode, 
  getPincodeRegion,
} from "@/lib/pincode";
import { usePincodeVerifier } from "@/hooks/use-pincode-verifier";
import { trackMetaLead } from "@/lib/meta-pixel";
import { 
  recordSubmission, 
  checkDuplicateSubmission 
} from "@/lib/submission-tracker";
import { 
  submitBookVisitToCRM, 
  estimatePlantSizeFromBill,
  type BookVisitPayload 
} from "@/lib/crm";
import Link from "next/link";

// Same values as before (CRM, WhatsApp message and plant-size estimate depend on them);
// the button labels come from the language text (English / Hindi).
const BILL_VALUES = ["< 1500", "1500 - 2500", "2500 - 5000", "> 5000"];

export default function BookVisitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  // Which field the message belongs to ("name" | "phone" | "pincode" | "bill-options" | "send").
  // Field messages show right under that field, so the rest of the form never jumps.
  const [errorField, setErrorField] = useState("");
  const clearError = () => {
    setSubmitError("");
    setErrorField("");
  };
  const fieldError = (field: string) => (errorField === field ? submitError : "");
  const [submittedWhatsappMsg, setSubmittedWhatsappMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    monthlyBill: "",
    address: "",
    preferredDate: "",
    plantSize: 3,
    customerType: "residential",
  });

  const pincodeVerifier = usePincodeVerifier(formData.pincode);
  const { lang, setLang, t } = useFormLanguage();

  // Native scrolling, no animation tricks: the photo is fixed behind and the form sheet is a normal
  // part of the page. When a field is tapped we scroll the page so the sheet sits just under a strip
  // of the photo (PHOTO_STRIP px). The sheet's min-height lets the page scroll exactly that far and no
  // further (unless the content needs it), so the heading never slides under the top bar and there
  // is no empty space. Swiping down is just normal scrolling and brings the photo back.
  const SHEET_TOP = 250;
  const PHOTO_STRIP = 110;
  const slidingUntil = useRef(0);
  const isSliding = () => Date.now() < slidingUntil.current;
  // The page moves right after a field is tapped (typing mode below); for that moment, ignore taps
  // that land on a bill option or the language button by accident.
  const startFilling = () => {
    slidingUntil.current = Date.now() + 600;
  };
  // Typing mode (iPhone + Android). Doesn't rely on measuring the keyboard (some iPhones shrink both
  // window heights together, so the keyboard can't be detected that way):
  // - As soon as a field is tapped, the page adds room at the bottom so it can always scroll,
  //   hides the (keyboard-covered) button bar, and moves the field into the TOP part of the visible
  //   area, so neither the keyboard nor the iPhone autofill / suggestion bar can cover it.
  // - Same when moving between fields.
  // - When no field is active any more, the room goes away, the bar returns and the page settles
  //   back so the photo strip, heading, subsidy line and all fields are in view.
  const [typing, setTyping] = useState(false);
  // true only while the keyboard is actually on screen (the button bar hides only then)
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [bottomRoom, setBottomRoom] = useState(0);
  const keyboardOpen = typing;
  useEffect(() => {
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    const vv = window.visualViewport;
    const visible = () => ({
      top: vv ? vv.offsetTop : 0,
      height: vv ? vv.height : window.innerHeight,
    });
    // Where the page should be scrolled so `el` sits clear of the keyboard + autofill bar, given how
    // tall the visible area is with the keyboard up. Field goes ~96px from the top, but the page never
    // lifts past the end of the form (bill options reach the bottom, no white space under them) as
    // long as the field stays at least 90px above the bottom of what's visible.
    const targetScrollFor = (el: HTMLElement, visHeight: number) => {
      const r = el.getBoundingClientRect();
      const fieldTop = r.top + window.scrollY;
      const fieldBottom = r.bottom + window.scrollY;
      let target = fieldTop - 96;
      const lastRow = document.getElementById("bill-options");
      if (lastRow) {
        const formEnd = lastRow.getBoundingClientRect().bottom + window.scrollY;
        const formEndTarget = formEnd - (visHeight - 12);
        if (formEndTarget < target && fieldTop - formEndTarget >= 76 && fieldBottom - formEndTarget <= visHeight - 90) {
          target = formEndTarget;
        }
      }
      return Math.max(0, Math.round(target));
    };
    // Visible height with the keyboard up: measured last time it opened, else a safe estimate.
    let keyboardVisibleHeight = 0;
    const expectedVisibleHeight = () => keyboardVisibleHeight || Math.round(window.innerHeight * 0.62);
    const ensureRoom = () => {
      // room at the bottom so the page can scroll far enough (set directly, before scrolling)
      const room = Math.round(Math.max(window.innerHeight, window.screen?.height || 0) * 0.55);
      const sheet = document.getElementById("booking-sheet");
      if (sheet) sheet.style.paddingBottom = `${room}px`;
      setBottomRoom(room);
    };
    // Safety net after the keyboard has settled: only moves if the field still isn't comfortably visible.
    const keepFieldVisible = () => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el.tagName !== "INPUT") return;
      const r = el.getBoundingClientRect();
      const v = visible();
      if (r.top >= v.top + 70 && r.bottom <= v.top + v.height - 80) return; // already clear
      const target = targetScrollFor(el, v.height);
      if (Math.abs(target - window.scrollY) < 4) return;
      window.scrollTo({ top: target, behavior: "smooth" });
    };
    // Tap on a field (finger lifted, not a scroll): put the field where it will end up BEFORE the
    // keyboard opens. The iPhone then sees it's already visible and doesn't do its own scroll, so
    // the page moves exactly once (no up-and-down).
    let touchStartY = 0;
    let touchStartX = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      touchStartX = e.touches[0]?.clientX ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || t.tagName !== "INPUT" || t === document.activeElement) return;
      const p = e.changedTouches[0];
      if (!p || Math.abs(p.clientY - touchStartY) > 10 || Math.abs(p.clientX - touchStartX) > 10) return; // a scroll, not a tap
      ensureRoom();
      slidingUntil.current = Date.now() + 600;
      // instant (the site's CSS makes scrolling smooth by default; here the field must already be
      // in place when the phone checks it, a split second later)
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo({ top: targetScrollFor(t, expectedVisibleHeight()), behavior: "auto" });
      html.style.scrollBehavior = prev;
    };
    // ONE smooth move, after the keyboard has finished opening and stopped resizing the screen.
    // (Moving earlier, or several times, measured the screen mid-animation and made the page
    // jump down and up.) Every new resize / focus restarts the wait, so only the last one runs.
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const keepFieldVisibleSoon = (wait = 350) => {
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(keepFieldVisible, wait);
    };
    let leaveTimer: ReturnType<typeof setTimeout> | undefined;
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || t.tagName !== "INPUT") return;
      if (leaveTimer) clearTimeout(leaveTimer);
      // enough room to lift any field to the top, whatever the keyboard size
      ensureRoom();
      setTyping(true);
      keepFieldVisibleSoon();
    };
    // End typing mode: remove the extra room, bring the button bar back, settle the page.
    let roomTimer: ReturnType<typeof setTimeout> | undefined;
    const finishTyping = () => {
      if (settleTimer) clearTimeout(settleTimer);
      setTyping(false);
      setKeyboardShown(false);
      // glide back first, THEN remove the extra room (removing it first cut the glide short)
      const target = SHEET_TOP - PHOTO_STRIP;
      if (window.scrollY > target + 4) window.scrollTo({ top: target, behavior: "smooth" });
      if (roomTimer) clearTimeout(roomTimer);
      roomTimer = setTimeout(() => {
        if (document.activeElement?.tagName === "INPUT") return; // typing again
        setBottomRoom(0);
        const sheet = document.getElementById("booking-sheet");
        if (sheet) sheet.style.paddingBottom = "";
      }, 650);
    };
    const onFocusOut = () => {
      if (leaveTimer) clearTimeout(leaveTimer);
      // small delay so jumping from one field to the next doesn't flicker
      leaveTimer = setTimeout(() => {
        const el = document.activeElement as HTMLElement | null;
        if (el && el.tagName === "INPUT") return;
        finishTyping();
      }, 220);
    };
    // Keyboard on/off, measured against the full visible height seen without a keyboard.
    // On iPhone, closing the keyboard with "Done" or a swipe keeps the field selected (no focus
    // change), so this is what ends typing mode there — otherwise the page stays "stuck" with the
    // button hidden.
    let fullHeight = vv ? vv.height : window.innerHeight;
    let width = window.innerWidth;
    let keyboardSeen = false;
    const onViewportResize = () => {
      if (!vv) return;
      if (window.innerWidth !== width) {
        // rotated: start measuring again
        width = window.innerWidth;
        fullHeight = vv.height;
        keyboardSeen = false;
        return;
      }
      const inputActive = document.activeElement?.tagName === "INPUT";
      if (!inputActive && !keyboardSeen) fullHeight = Math.max(fullHeight, vv.height);
      if (vv.height < fullHeight - 150) {
        if (!keyboardSeen) {
          keyboardSeen = true;
          setKeyboardShown(true);
        }
        if (vv.height < fullHeight - 150) {
          keyboardVisibleHeight = Math.round(vv.height); // remember for the next tap
        }
        if (inputActive) keepFieldVisibleSoon(250);
      } else if (keyboardSeen && vv.height > fullHeight - 80) {
        keyboardSeen = false;
        const el = document.activeElement as HTMLElement | null;
        if (el && el.tagName === "INPUT") el.blur(); // keyboard closed: leave the field
        finishTyping();
      }
    };
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("focusout", onFocusOut);
    vv?.addEventListener("resize", onViewportResize);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("focusout", onFocusOut);
      vv?.removeEventListener("resize", onViewportResize);
      if (settleTimer) clearTimeout(settleTimer);
      if (leaveTimer) clearTimeout(leaveTimer);
      if (roomTimer) clearTimeout(roomTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showPhoto = () => {
    if (isSliding()) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  // Load saved profile data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kailash_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          phone: parsed.phone || prev.phone,
          pincode: parsed.pincode || prev.pincode || "",
          monthlyBill: parsed.monthlyBill || prev.monthlyBill,
          address: parsed.address || prev.address || "",
          preferredDate: parsed.preferredDate || prev.preferredDate || "",
          plantSize: parsed.plantSize || prev.plantSize || 3,
        }));
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kailash_user_profile");
    let parsed = {};
    if (saved) {
      try { parsed = JSON.parse(saved); } catch (e) {}
    }
    localStorage.setItem("kailash_user_profile", JSON.stringify({ ...parsed, ...formData }));
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const trimmedName = formData.name.trim();
    const trimmedPin = formData.pincode.trim();

    // One clear message above the form + jump straight to the field that needs fixing
    const fail = (field: string, msg: string) => {
      setSubmitError(msg);
      setErrorField(field);
      if (typeof document === "undefined") return;
      const el = document.getElementById(field);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
    };

    if (!trimmedName || !isValidName(trimmedName)) return fail("name", t.nameError);
    if (!isValidMobile(formData.phone)) return fail("phone", t.phoneError);

    // PIN code validation - strictly Meerut, Modipuram & Modinagar
    const pinCheck = validatePincode(trimmedPin);
    if (!pinCheck.isValid) {
      const digits = trimmedPin.replace(/\D/g, "");
      return fail("pincode", !digits ? t.pinRequired : digits.length !== 6 ? t.pinInvalid : t.outsideRegion);
    }

    if (!formData.monthlyBill) return fail("bill-options", t.billError);

    // Check duplicate submission
    const duplicateCheck = checkDuplicateSubmission({
      phone: formData.phone,
      name: trimmedName,
      monthlyBill: formData.monthlyBill,
    });

    if (duplicateCheck.isDuplicate) {
      const dupUrl = `/booking-success?name=${encodeURIComponent(trimmedName)}&phone=${encodeURIComponent(formData.phone)}&pincode=${encodeURIComponent(trimmedPin)}&region=${encodeURIComponent(pinCheck.region || "")}&bill=${encodeURIComponent(formData.monthlyBill || "")}`;
      goToBookingSuccess(router, dupUrl);
      return;
    }

    setIsSubmitting(true);
    
    // Formulate WhatsApp message with user details including PIN Code & Region
    const formattedBill = formData.monthlyBill || 'Not specified';
    const userCity = pinCheck.region || "Meerut";
    const fullAddress = formData.address.trim() 
      ? `${formData.address.trim()}, PIN: ${trimmedPin} (${userCity})` 
      : `${trimmedPin} (${userCity})`;

    const formattedPhone = formData.phone.startsWith("+91")
      ? formData.phone
      : `+91 ${formData.phone}`;

    const calculatedPlantSize = Number(formData.plantSize) || estimatePlantSizeFromBill(formData.monthlyBill);
    
    const whatsappMessage = encodeURIComponent(
      `Hi, I want to book a FREE site visit.\n\n` +
      `Name: ${trimmedName}\n` +
      `WhatsApp: ${formData.phone}\n` +
      `PIN Code: ${trimmedPin} [${userCity}]\n` +
      `Monthly Bill: ${formattedBill}\n` +
      `Plant Capacity: ${calculatedPlantSize} kW`
    );
    setSubmittedWhatsappMsg(whatsappMessage);

    // 1. Submit lead to Zoho CRM & WhatsApp Automation API
    const crmPayload: BookVisitPayload = {
      name: trimmedName,
      phone: formattedPhone,
      city: userCity,
      address: formData.address.trim() ? formData.address.trim() : fullAddress,
      pincode: trimmedPin,
      preferred_date: formData.preferredDate || "",
      plant_size_kw: calculatedPlantSize,
      monthly_bill: formattedBill,
      source: "book_visit",
    };

    const crmResult = await submitBookVisitToCRM(crmPayload);

    if (!crmResult.success) {
      const errorMsg = (crmResult.error || "").toLowerCase().includes("mobile")
        ? t.phoneError
        : t.sendError;
      setSubmitError(errorMsg);
      setErrorField("send");
      setIsSubmitting(false);
      return;
    }

    const submissionPayload = {
      name: trimmedName,
      phone: formData.phone,
      address: fullAddress,
      monthlyBill: formattedBill,
      customerType: formData.customerType,
      leadId: crmResult.lead_id,
    };
    
    // 2. Lead is saved: fire Meta / Google / PostHog lead events right away, then the
    //    backup email in the background (it can never block or cancel the lead events).
    try {
      if (typeof window !== 'undefined') {
        import('posthog-js').then((ph) => {
          ph.default.capture('form_submitted', {
            form_name: 'book_visit_page',
            lead_type: 'book_visit',
            pincode: trimmedPin,
            region: pinCheck.region,
            lead_id: crmResult.lead_id
          });
        });
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'generate_lead',
          'form_name': 'book_visit_page',
          'lead_type': 'book_visit',
          'pincode': trimmedPin,
          'lead_id': crmResult.lead_id
        });
        trackMetaLead({ formName: 'book_visit_page', phone: formData.phone, pincode: trimmedPin, leadId: crmResult.lead_id });
      }

    } catch (e) {
      console.error("Lead tracking error:", e);
    }
    sendInquiryEmail(submissionPayload);

    // 3. Record submission to suppress popups across the site
    recordSubmission({
      name: trimmedName,
      phone: formData.phone,
      pincode: trimmedPin,
      monthlyBill: formattedBill,
    });

    if (typeof window !== "undefined") {
      sessionStorage.setItem("kailash_submitted_name", trimmedName);
      sessionStorage.setItem("kailash_submitted_phone", formData.phone);
      sessionStorage.setItem("kailash_submitted_pincode", trimmedPin);
      sessionStorage.setItem("kailash_submitted_bill", formattedBill || "");
      if (crmResult.lead_id) {
        sessionStorage.setItem("kailash_submitted_lead_id", crmResult.lead_id);
      }
    }

    const redirectUrl = `/booking-success?name=${encodeURIComponent(trimmedName)}&phone=${encodeURIComponent(formData.phone)}&pincode=${encodeURIComponent(trimmedPin)}&region=${encodeURIComponent(pinCheck.region || "")}&bill=${encodeURIComponent(formattedBill)}&msg=${whatsappMessage}${crmResult.lead_id ? `&lead_id=${encodeURIComponent(crmResult.lead_id)}` : ""}`;



    // Immediately run dedicated animated success page
    goToBookingSuccess(router, redirectUrl);
  };

  return (
    <div className="min-h-[100dvh] [-webkit-tap-highlight-color:transparent] bg-white sm:bg-muted flex flex-col items-center justify-start sm:py-8">
      
      <div className="w-full sm:max-w-[400px] relative flex flex-col min-h-[100dvh] sm:min-h-0 sm:bg-white sm:rounded-3xl sm:border sm:border-slate-200 sm:overflow-hidden">
        
        {/* Floating Native App Header (stays put while the sheet scrolls) */}
        <div className="fixed sm:absolute top-0 left-0 w-full z-50 px-4 pt-[env(safe-area-inset-top)] h-16 flex items-center justify-between pointer-events-none [&>*]:pointer-events-auto">
          <Link 
            href="/solar-company-meerut" 
            aria-label="Back to home"
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center active:scale-90 transition-all ${
              "bg-black/30 text-white"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button
            type="button"
            onClick={() => {
              if (!isSliding()) setLang(lang === "hi" ? "en" : "hi");
            }}
            aria-label={lang === "hi" ? "Switch to English" : "हिंदी में देखें"}
            className={`h-9 px-3.5 rounded-full backdrop-blur-md text-[13px] font-semibold active:scale-95 transition-all ${
              "bg-black/30 text-white"
            }`}
          >
            {t.switchTo}
          </button>
        </div>

        {/* Photo: fixed behind on phones, so the form sheet slides up over it like a native app */}
        <div onClick={showPhoto} className="fixed sm:relative top-0 left-0 z-0 h-[300px] sm:h-[220px] w-full bg-slate-200 shrink-0">
          <Image
            src="/opt/van.webp"
            alt="Kailash Solar van and team member in Meerut"
            fill
            priority
            sizes="(min-width: 640px) 640px, 100vw"
            className="object-cover object-[50%_42%]"
          />
          {/* Subtle gradient overlay for header readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Form Container (Bottom Sheet Effect) */}
        <div
          id="booking-sheet"
          lang={lang}
          className={`px-5 pt-8 mt-[250px] rounded-t-[28px] sm:pb-8 sm:-mt-8 sm:min-h-0 flex-grow flex flex-col bg-white relative z-10 ${
            bottomRoom > 0 ? "min-h-0" : "pb-[calc(7rem+env(safe-area-inset-bottom))] min-h-[calc(100dvh-110px)]"
          }`}
          style={bottomRoom > 0 ? { paddingBottom: bottomRoom } : undefined}
        >
          <div className={`w-12 h-1.5 bg-slate-200 rounded-full mx-auto absolute top-3 left-1/2 -translate-x-1/2 `} />
          
          <div className="mt-1 mb-6 sm:mb-7">
            <h1 className={`text-[clamp(22px,7vw,27px)] sm:text-[27px] leading-[1.2] tracking-[-0.01em] font-bold font-montserrat text-slate-900 mb-4 sm:mb-5`}>
              {t.headingStart}
              <span className="text-accent whitespace-nowrap">
                {"₹0"}
                {/* Small terms-and-conditions star at the top-right of the 0. Raised with relative
                    positioning (not <sup>) so it never changes the line spacing or touches other text. */}
                <span aria-hidden="true" className="relative -top-[0.75em] ml-[1px] text-[0.45em] leading-none font-bold">*</span>
                {t.headingAccent}
              </span>
              {t.headingEnd}
            </h1>
            <p className="text-[13.5px] sm:text-[14.5px] font-bold text-slate-800 leading-normal">
              {t.subStart}<span className="text-accent">{t.subAccent}</span>
            </p>
          </div>
          
          {isSuccess ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                <CheckCircle2 className="w-12 h-12 text-green-600 relative z-10" />
              </div>
              <h2 className="text-[26px] font-bold text-slate-900 mb-3 font-montserrat">Request Received!</h2>
              <p className="text-slate-500 mb-6 max-w-[280px] leading-relaxed text-sm">
                Redirecting you to WhatsApp to confirm your site visit...
              </p>
              <a 
                href={`https://wa.me/918999999654?text=${submittedWhatsappMsg || 'Hi'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[52px] px-8 rounded-[16px] bg-[#25D366] hover:bg-[#128C7E] text-white font-bold transition-all active:scale-95 items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Open WhatsApp Now
              </a>
              <Link 
                href="/solar-company-meerut"
                className="mt-6 text-sm font-semibold text-slate-500 hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                ← Return to Kailash Solar Home
              </Link>
            </div>
          ) : (
            <form id="booking-form" noValidate onSubmit={handleSubmit} onFocusCapture={startFilling} className="space-y-3.5 flex-grow flex flex-col">
              {errorField === "send" && submitError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{submitError}</span>
                </div>
              )}

              <div className="space-y-3 flex-grow">
                {/* Full Name */}
                <div>
                  <Input 
                    id="name" 
                    autoComplete="name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    placeholder={t.namePlaceholder} 
                    aria-label="Full Name"
                    required 
                    value={formData.name} 
                    onChange={e => {
                      clearError();
                      setFormData({ ...formData, name: e.target.value });
                    }} 
                    aria-invalid={!!fieldError("name")}
                    className="h-[52px] px-4 bg-slate-50 border border-slate-200 hover:border-slate-300 aria-[invalid=true]:border-destructive rounded-[14px] text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-slate-400 focus-visible:border-slate-400 focus-visible:bg-white transition-all" 
                  />
                  {fieldError("name") && <p className="mt-1.5 px-1 text-[12.5px] font-medium text-destructive animate-in fade-in duration-200">{fieldError("name")}</p>}
                </div>
                
                {/* WhatsApp Phone */}
                <div>
                <div className="relative flex items-center">
                  <div className="absolute left-0 h-[52px] flex items-center justify-center px-3.5 text-slate-600 font-bold bg-slate-100 border border-r-0 border-slate-200 rounded-l-[14px] z-10 pointer-events-none">
                    +91
                  </div>
                  <Input 
                    id="phone" 
                    autoComplete="tel-national"
                    enterKeyHint="next"
                    type="tel" 
                    inputMode="numeric"
                    maxLength={16}
                    placeholder={t.phonePlaceholder} 
                    aria-label="WhatsApp Number"
                    required 
                    value={formData.phone} 
                    onChange={e => {
                      clearError();
                      const val = cleanPhoneInput(e.target.value);
                      setFormData({ ...formData, phone: val });
                      // Full valid number: move straight on to the PIN code. Not for "91…", which may
                      // still be a +91 prefix being typed (cleanPhoneInput drops it at the 11th digit).
                      if (isValidMobile(val) && val !== formData.phone && !val.startsWith("91")) {
                        document.getElementById("pincode")?.focus();
                      }
                    }} 
                    aria-invalid={!!fieldError("phone")}
                    className="h-[52px] pl-[64px] pr-4 bg-slate-50 border border-slate-200 hover:border-slate-300 aria-[invalid=true]:border-destructive rounded-[14px] text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-slate-400 focus-visible:border-slate-400 focus-visible:bg-white transition-all w-full relative" 
                  />
                </div>
                {fieldError("phone") && <p className="mt-1.5 px-1 text-[12.5px] font-medium text-destructive animate-in fade-in duration-200">{fieldError("phone")}</p>}
                </div>

                {/* PIN Code Verification */}
                <div>
                  <div className="relative">
                    <Input 
                      id="pincode" 
                      autoComplete="postal-code"
                      enterKeyHint="done"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder={t.pinPlaceholder} 
                      aria-label="PIN Code"
                      required 
                      value={formData.pincode} 
                      onChange={e => {
                        clearError();
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setFormData({ ...formData, pincode: val });
                        // Valid PIN: close the keyboard so the bill options and button are in view
                        if (val.length === 6 && val !== formData.pincode && isServiceablePincode(val)) {
                          (e.target as HTMLInputElement).blur();
                        }
                      }} 
                      className={`h-[52px] pl-4 pr-11 bg-slate-50 border rounded-[14px] text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 transition-all ${
                        pincodeVerifier.isValid
                          ? "border-emerald-500 bg-emerald-50/20" 
                          : pincodeVerifier.isInvalid
                          ? "border-destructive bg-destructive/5" 
                          : fieldError("pincode")
                          ? "border-destructive"
                          : "border-slate-200 hover:border-slate-300 focus:border-slate-400 focus-visible:border-slate-400 focus-visible:bg-white"
                      }`}
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                      {pincodeVerifier.isChecking && (
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      )}
                      {pincodeVerifier.isValid && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-in fade-in zoom-in-75 duration-200" />
                      )}
                      {pincodeVerifier.isInvalid && (
                        <AlertCircle className="w-4 h-4 text-destructive animate-in fade-in zoom-in-75 duration-200" />
                      )}
                    </div>
                  </div>
                  {fieldError("pincode") && !pincodeVerifier.isInvalid && <p className="mt-1.5 px-1 text-[12.5px] font-medium text-destructive animate-in fade-in duration-200">{fieldError("pincode")}</p>}
                  {pincodeVerifier.isInvalid && (
                    <div className="mt-1.5 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{t.outsideRegion}</span>
                    </div>
                  )}
                </div>

                {/* Monthly Electricity Bill */}
                <div>
                  <p className={`text-[13px] font-semibold mb-2 px-1 transition-colors ${fieldError("bill-options") ? "text-destructive" : "text-slate-600"}`}>
                    {fieldError("bill-options") || t.billLabel}
                  </p>
                  <div id="bill-options" tabIndex={-1} role="radiogroup" aria-label="Monthly Electricity Bill" className="grid grid-cols-2 gap-2 outline-none">
                    {BILL_VALUES.map(value => {
                      const selected = formData.monthlyBill === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          onClick={() => {
                            if (isSliding()) return;
                            try { navigator.vibrate?.(8); } catch {}
                            clearError();
                            setFormData(prev => ({
                              ...prev,
                              monthlyBill: value,
                              plantSize: estimatePlantSizeFromBill(value),
                            }));
                          }}
                          className={`h-[48px] rounded-[14px] border text-[14px] font-semibold transition-all active:scale-[0.97] ${
                            selected
                              ? "border-primary bg-primary text-white"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {t.billOptions[value]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </form>
          )}
        </div>

          {/* App Bottom Action Bar: outside the sliding sheet so it stays pinned to the bottom of the screen */}
          <div className={`fixed sm:relative bottom-0 left-0 w-full p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-5 sm:pt-0 sm:pb-6 bg-white/95 backdrop-blur-md sm:bg-white border-t border-slate-200 sm:border-0 z-[100] flex gap-3 transition-opacity duration-150 ${
            keyboardShown ? "opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto" : "opacity-100"
          }`}>
            <Button 
              type="submit"
              form="booking-form" 
              disabled={isSubmitting}
              className="flex-grow h-[52px] rounded-[14px] text-[16px] font-bold bg-primary hover:bg-primary/90 text-white transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.submitting}</span>
                </>
              ) : (
                t.submit
              )}
            </Button>
            
            <a 
              href="tel:+918999999654"
              className="flex-shrink-0 flex items-center justify-center w-[52px] h-[52px] rounded-[14px] bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-[0.98]"
              title={t.callLabel}
              aria-label={t.callLabel}
            >
              <Phone className="w-[20px] h-[20px] fill-current" />
            </a>
          </div>
      </div>
    </div>
  );
}
