"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Language for the booking form and success screen.
 *
 * - Hindi shows automatically ONLY when the phone's own language is Hindi.
 *   Everyone else (most visitors) sees English, as before.
 * - A small "हिंदी / English" switch lets anyone change it; that choice is remembered.
 * - `?lang=hi` / `?lang=en` in the URL forces a language (handy for previews and ads).
 *
 * Hindi wording is pending the owner's approval.
 */
export type FormLang = "en" | "hi";

const STORAGE_KEY = "kailash_lang";

function detectLang(): FormLang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("lang");
    if (fromUrl === "hi" || fromUrl === "en") return fromUrl;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "hi" || saved === "en") return saved;
    // The phone's main language decides. "hi", "hi-IN" → Hindi; "en-IN", "en-US" etc. → English.
    const primary = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return primary.toLowerCase().startsWith("hi") ? "hi" : "en";
  } catch {
    return "en";
  }
}

export function useFormLanguage() {
  const [lang, setLangState] = useState<FormLang>("en");

  useEffect(() => {
    setLangState(detectLang());
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = lang === "hi" ? "hi" : "en";
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((next: FormLang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return { lang, setLang, t: FORM_TEXT[lang] };
}

export const FORM_TEXT = {
  en: {
    switchTo: "हिंदी",
    headingStart: "Get Solar Panels at ",
    // Same line as the ads: "₹0 down payment"; the page draws "₹0" with a small star on top of the 0
    headingAccent: " Down Payment",
    headingEnd: "",
    subStart: "Book a free site visit and claim your ",
    subAccent: "₹1,08,000 subsidy before it ends!",
    namePlaceholder: "Full Name*",
    phonePlaceholder: "WhatsApp Number*",
    pinPlaceholder: "PIN Code (6 digits)*",
    billLabel: "Monthly electricity bill*",
    billOptions: {
      "< 1500": "Below ₹1,500",
      "1500 - 2500": "₹1,500 – 2,500",
      "2500 - 5000": "₹2,500 – 5,000",
      "> 5000": "Above ₹5,000",
    } as Record<string, string>,
    submit: "Book FREE Consultation",
    submitting: "Booking your visit...",
    callLabel: "Call Us Now",
    nameError: "Please enter your name (letters only).",
    phoneError: "Please enter a valid 10-digit mobile number.",
    pinRequired: "PIN code is required. Please enter your 6-digit PIN code.",
    pinInvalid: "Please enter a valid 6-digit PIN code.",
    outsideRegion: "We currently serve only Meerut, Modipuram, and Modinagar, but we will expand to your area soon.",
    billError: "Please choose your monthly electricity bill.",
    sendError: "Couldn't send right now. Please tap the button again, or call / WhatsApp us on 89999 99654.",
    // Success screen
    booked: "Site visit booked",
    thanks: (first: string) => (first ? `Thanks, ${first}. ` : "Thank you. "),
    callSoon: "Our engineer will call you within 30 minutes.",
    rowName: "Name",
    rowWhatsapp: "WhatsApp",
    rowPin: "PIN code",
    rowBill: "Monthly bill",
    rowBooking: "Booking ID",
    subsidyLine: "Eligible for up to ₹1,08,000 PM Surya Ghar subsidy",
    nextTitle: "What happens next",
    steps: [
      { title: "Confirmation call", text: "Our engineer confirms your visit on WhatsApp." },
      { title: "Free site survey", text: "We check your rooftop and size the right system." },
      { title: "Subsidy & installation", text: "We handle the subsidy, loan and net-meter paperwork." },
    ],
    goingHome: (s: number) => `Going to the home page in ${s}s`,
    stayHere: "Stay here",
    chatWhatsapp: "Chat on WhatsApp",
    callUs: "Call Us",
  },
  hi: {
    switchTo: "English",
    headingStart: "सोलर पैनल लगवाएं ",
    headingAccent: " डाउन पेमेंट",
    headingEnd: " पर",
    subStart: "फ्री साइट विज़िट बुक करें और ",
    subAccent: "₹1,08,000 की सब्सिडी पाएं, खत्म होने से पहले!",
    namePlaceholder: "पूरा नाम*",
    phonePlaceholder: "WhatsApp नंबर*",
    pinPlaceholder: "पिन कोड (6 अंक)*",
    billLabel: "हर महीने का बिजली बिल*",
    billOptions: {
      "< 1500": "₹1,500 से कम",
      "1500 - 2500": "₹1,500 – 2,500",
      "2500 - 5000": "₹2,500 – 5,000",
      "> 5000": "₹5,000 से ज़्यादा",
    } as Record<string, string>,
    submit: "फ्री विज़िट बुक करें",
    submitting: "बुक हो रहा है...",
    callLabel: "अभी कॉल करें",
    nameError: "कृपया अपना नाम लिखें (सिर्फ़ अक्षर)।",
    phoneError: "कृपया सही 10 अंकों का मोबाइल नंबर लिखें।",
    pinRequired: "पिन कोड ज़रूरी है। कृपया 6 अंकों का पिन कोड लिखें।",
    pinInvalid: "कृपया सही 6 अंकों का पिन कोड लिखें।",
    outsideRegion: "अभी हम सिर्फ़ मेरठ, मोदीपुरम और मोदीनगर में सेवा देते हैं, जल्द ही आपके इलाके में भी आएंगे।",
    billError: "कृपया अपना महीने का बिजली बिल चुनें।",
    sendError: "अभी भेजा नहीं जा सका। कृपया बटन फिर से दबाएं, या 89999 99654 पर कॉल / WhatsApp करें।",
    booked: "साइट विज़िट बुक हो गई",
    thanks: (first: string) => (first ? `धन्यवाद, ${first}। ` : "धन्यवाद। "),
    callSoon: "हमारे इंजीनियर 30 मिनट में आपको कॉल करेंगे।",
    rowName: "नाम",
    rowWhatsapp: "WhatsApp",
    rowPin: "पिन कोड",
    rowBill: "महीने का बिल",
    rowBooking: "बुकिंग ID",
    subsidyLine: "₹1,08,000 तक की PM सूर्य घर सब्सिडी के लिए योग्य",
    nextTitle: "आगे क्या होगा",
    steps: [
      { title: "कन्फ़र्मेशन कॉल", text: "हमारे इंजीनियर WhatsApp पर आपकी विज़िट कन्फ़र्म करेंगे।" },
      { title: "फ्री साइट सर्वे", text: "हम आपकी छत देखकर सही सिस्टम तय करेंगे।" },
      { title: "सब्सिडी और इंस्टॉलेशन", text: "सब्सिडी, लोन और नेट-मीटर का सारा काम हम करेंगे।" },
    ],
    goingHome: (s: number) => `${s} सेकंड में होम पेज पर जा रहे हैं`,
    stayHere: "यहीं रुकें",
    chatWhatsapp: "WhatsApp पर बात करें",
    callUs: "कॉल करें",
  },
};

export type FormText = (typeof FORM_TEXT)["en"];
