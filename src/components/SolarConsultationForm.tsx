"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Info, Check, Calculator, Zap, IndianRupee, ArrowRight, Phone, CheckCircle2, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  validatePincode, 
  isServiceablePincode, 
  getPincodeRegion, 
  OUTSIDE_REGION_ERROR 
} from "@/lib/pincode";
import { usePincodeVerifier } from "@/hooks/use-pincode-verifier";
import { 
  recordSubmission, 
  checkDuplicateSubmission 
} from "@/lib/submission-tracker";

export function SolarConsultationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedWhatsappMsg, setSubmittedWhatsappMsg] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    monthlyBill: "",
    customerType: "residential",
  });

  const pincodeVerifier = usePincodeVerifier(formData.pincode);

  const billOptions = [
    "Less than ₹1500",
    "₹1500 - ₹2500",
    "₹2500 - ₹4000",
    "₹4000 - ₹8000",
    "More than ₹8000"
  ];

  useEffect(() => {
    const saved = localStorage.getItem("kailash_user_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          phone: parsed.phone || prev.phone,
          pincode: parsed.pincode || "",
        }));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("kailash_user_profile");
    let parsed = {};
    if (saved) {
      try { parsed = JSON.parse(saved); } catch(e) {}
    }
    localStorage.setItem("kailash_user_profile", JSON.stringify({ ...parsed, ...formData }));
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const trimmedName = formData.name.trim();
    const trimmedPin = formData.pincode.trim();

    if (!trimmedName || !/^[A-Za-z\s]+$/.test(trimmedName)) {
      setSubmitError("Name should contain only letters and spaces.");
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setSubmitError("Phone number must be exactly 10 digits.");
      return;
    }

    const pinCheck = validatePincode(trimmedPin);
    if (!pinCheck.isValid) {
      setSubmitError(pinCheck.error!);
      return;
    }

    if (!formData.monthlyBill) {
      setSubmitError("Please select your monthly electricity bill.");
      return;
    }

    // Check duplicate submission
    const duplicateCheck = checkDuplicateSubmission({
      phone: formData.phone,
      name: trimmedName,
      monthlyBill: formData.monthlyBill,
    });

    if (duplicateCheck.isDuplicate) {
      toast({
        title: "Request Already Received",
        description: duplicateCheck.message,
      });
      const dupUrl = `/booking-success?name=${encodeURIComponent(trimmedName)}&phone=${encodeURIComponent(formData.phone)}&pincode=${encodeURIComponent(trimmedPin)}&region=${encodeURIComponent(pinCheck.region || "")}&bill=${encodeURIComponent(formData.monthlyBill || "")}`;
      if (typeof window !== "undefined") {
        window.location.assign(dupUrl);
      } else {
        router.push(dupUrl);
      }
      return;
    }

    setIsSubmitting(true);

    const fullAddress = `${trimmedPin} (${pinCheck.region})`;

    // Formulate WhatsApp message
    const whatsappMessage = encodeURIComponent(
      `Hi, I want to book a FREE consultation.\n\n` +
      `Name: ${trimmedName}\n` +
      `WhatsApp: ${formData.phone}\n` +
      `PIN Code: ${trimmedPin} [${pinCheck.region}]\n` +
      `Monthly Bill: ${formData.monthlyBill || 'Not specified'}`
    );
    setSubmittedWhatsappMsg(whatsappMessage);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjikswdntqctoqqrnjkq.supabase.co';
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-inquiry-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          ...formData,
          name: trimmedName,
          address: fullAddress,
        })
      });

      if (!response.ok) {
        throw new Error("Supabase request failed");
      }

      if (typeof window !== 'undefined') {
        import('posthog-js').then((ph) => {
          ph.default.capture('form_submitted', {
            form_name: 'inline_consultation',
            lead_type: 'book_visit',
            pincode: trimmedPin,
            region: pinCheck.region
          });
        });
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'generate_lead',
          'form_name': 'inline_consultation',
          'lead_type': 'book_visit',
          'pincode': trimmedPin
        });
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
      }

    } catch (error) {
      console.error(error);
    } 

    // Record submission to suppress all popups across the site
    recordSubmission({
      name: trimmedName,
      phone: formData.phone,
      pincode: trimmedPin,
      monthlyBill: formData.monthlyBill,
    });

    if (typeof window !== "undefined") {
      sessionStorage.setItem("kailash_submitted_name", trimmedName);
      sessionStorage.setItem("kailash_submitted_phone", formData.phone);
      sessionStorage.setItem("kailash_submitted_pincode", trimmedPin);
      sessionStorage.setItem("kailash_submitted_bill", formData.monthlyBill || "");
    }

    const redirectUrl = `/booking-success?name=${encodeURIComponent(trimmedName)}&phone=${encodeURIComponent(formData.phone)}&pincode=${encodeURIComponent(trimmedPin)}&region=${encodeURIComponent(pinCheck.region || "")}&bill=${encodeURIComponent(formData.monthlyBill || "")}&msg=${whatsappMessage}`;

    toast({
      title: "Consultation Booked!",
      description: "Redirecting to your confirmation..."
    });

    // Immediately run dedicated animated success page
    if (typeof window !== "undefined") {
      window.location.assign(redirectUrl);
    } else {
      router.push(redirectUrl);
    }
  };

  return (
    <div className="bg-card rounded-t-[32px] rounded-b-none md:rounded-[20px] p-6 pt-5 md:pt-7 sm:p-7 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl relative z-20 w-full md:max-w-md mx-auto border-t md:border border-border/50">
      
      {/* Mobile drag handle */}
      <div className="w-12 h-1.5 bg-border/60 rounded-full mx-auto mb-6 md:hidden" />

      <div className="mb-6">
        <h2 className="text-[22px] sm:text-[24px] font-bold font-montserrat text-foreground mb-1.5">
          Book a FREE Consultation
        </h2>
        <p className="text-[14px] sm:text-[15px] text-muted-foreground font-medium mb-3">
          Claim your <span className="font-extrabold text-accent">₹1,08,000 subsidy</span> today.
        </p>
        <div className="md:hidden inline-flex items-center gap-1.5 text-accent font-bold text-xs bg-accent/10 px-2.5 py-1 rounded-md">
          <Zap className="w-3.5 h-3.5 fill-accent" /> &quot;Fastest Subsidy Approval in UP&quot;
        </div>
      </div>

      {isSuccess ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center py-10 animate-in fade-in zoom-in duration-500 relative z-10 min-h-[300px]">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5 relative">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
            <CheckCircle2 className="w-10 h-10 text-green-600 relative z-10" />
          </div>
          <h2 className="text-[24px] font-bold text-slate-900 mb-2 font-montserrat">Request Received!</h2>
          <p className="text-slate-500 mb-6 max-w-[280px] leading-relaxed text-sm">
            Redirecting you to WhatsApp to confirm your details...
          </p>
          <a 
            href={`https://wa.me/918999999654?text=${submittedWhatsappMsg || 'Hi'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[48px] px-6 rounded-[12px] bg-[#25D366] hover:bg-[#128C7E] text-white font-bold shadow-lg shadow-[#25D366]/20 transition-all active:scale-95 items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Open WhatsApp Now
          </a>
        </div>
      ) : (
        <>
          {submitError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-[12px] text-sm font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          <form 
            onSubmit={handleSubmit} 
            className="space-y-3.5 relative z-10"
            onFocusCapture={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.setItem("kailash_modal_auto_opened", "true");
                localStorage.setItem("kailash_modal_submitted", "true");
              }
            }}
          >
            <div>
              <Input 
                placeholder="Full Name*" 
                className="h-[52px] px-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/70"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                required
              />
            </div>

            <div>
              <div className="relative">
                <Input 
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="PIN Code (6 digits)*" 
                  className={`h-[52px] pl-4 pr-11 bg-background border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/70 transition-all ${
                    pincodeVerifier.isValid
                      ? "border-emerald-500 focus-visible:ring-emerald-500 bg-emerald-50/20" 
                      : pincodeVerifier.isInvalid
                      ? "border-destructive focus-visible:ring-destructive bg-destructive/5" 
                      : "border-border"
                  }`}
                  value={formData.pincode}
                  onChange={(e) => {
                    setSubmitError("");
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setFormData(prev => ({...prev, pincode: val}));
                  }}
                  required
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
              {pincodeVerifier.isInvalid && (
                <div className="mt-1.5 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2 shadow-sm animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{OUTSIDE_REGION_ERROR}</span>
                </div>
              )}
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-0 h-[52px] flex items-center justify-center px-4 text-muted-foreground font-bold bg-muted/50 border border-r-0 border-border rounded-l-[12px] z-10 pointer-events-none">
                +91
              </div>
              <Input 
                type="tel" 
                placeholder="WhatsApp Number*" 
                className="h-[52px] pl-[68px] pr-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/70 w-full relative"
                value={formData.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({...prev, phone: val.length <= 10 ? val : val.slice(0, 10)}));
                }}
                required
              />
            </div>

            <div>
              <Select value={formData.monthlyBill} onValueChange={value => setFormData({ ...formData, monthlyBill: value })}>
                <SelectTrigger className="w-full h-[52px] px-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground disabled:cursor-not-allowed">
                  <SelectValue placeholder="Monthly Electricity Bill*" />
                </SelectTrigger>
                <SelectContent className="rounded-[12px]">
                  <SelectItem value="< 1500" className="text-[15px] py-2">Less than ₹1,500</SelectItem>
                  <SelectItem value="1500 - 2500" className="text-[15px] py-2">₹1,500 - ₹2,500</SelectItem>
                  <SelectItem value="2500 - 5000" className="text-[15px] py-2">₹2,500 - ₹5,000</SelectItem>
                  <SelectItem value="> 5000" className="text-[15px] py-2">More than ₹5,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 flex gap-3">
              <Button 
                type="submit" 
                disabled={isSubmitting || pincodeVerifier.isBlocked}
                className="flex-grow h-[56px] rounded-[14px] text-[16px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all   active:scale-[0.98]"
              >
                {isSubmitting ? "Redirecting..." : "Book FREE Consultation"}
              </Button>
              <a href="tel:+918999999654" className="flex items-center justify-center w-[56px] h-[56px] shrink-0 bg-blue-600 border border-blue-700 rounded-[14px] text-white hover:bg-blue-700 transition-all  active:scale-[0.98]">
                <Phone className="w-[22px] h-[22px] fill-current" />
              </a>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
