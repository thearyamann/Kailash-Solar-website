"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, CheckCircle2, MessageCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import Link from "next/link";

export default function BookVisitPage() {
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
    setSubmitError("");

    const trimmedName = formData.name.trim();
    const trimmedPin = formData.pincode.trim();

    if (!trimmedName || !/^[A-Za-z\s]+$/.test(trimmedName)) {
      setSubmitError("Name should contain only letters and spaces.");
      toast({ title: "Invalid Name", description: "Name should contain only letters and spaces.", variant: "destructive" });
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setSubmitError("Phone number must be exactly 10 digits.");
      toast({ title: "Invalid Phone", description: "Phone number must be exactly 10 digits.", variant: "destructive" });
      return;
    }

    // PIN code validation - strictly Meerut, Modipuram & Modinagar
    const pinCheck = validatePincode(trimmedPin);
    if (!pinCheck.isValid) {
      setSubmitError(pinCheck.error!);
      toast({ title: "Region Not Serviceable", description: pinCheck.error!, variant: "destructive" });
      return;
    }

    if (!formData.monthlyBill) {
      setSubmitError("Please select your monthly electricity bill.");
      toast({ title: "Required Field", description: "Please select your monthly electricity bill.", variant: "destructive" });
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
    
    // Formulate WhatsApp message with user details including PIN Code & Region
    const formattedBill = formData.monthlyBill || 'Not specified';
    const fullAddress = `${trimmedPin} (${pinCheck.region})`;
    
    const whatsappMessage = encodeURIComponent(
      `Hi, I want to book a FREE consultation.\n\n` +
      `Name: ${trimmedName}\n` +
      `WhatsApp: ${formData.phone}\n` +
      `PIN Code: ${trimmedPin} [${pinCheck.region}]\n` +
      `Monthly Bill: ${formattedBill}`
    );
    setSubmittedWhatsappMsg(whatsappMessage);

    const submissionPayload = {
      name: trimmedName,
      phone: formData.phone,
      address: fullAddress,
      monthlyBill: formattedBill,
      customerType: formData.customerType,
    };
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjikswdntqctoqqrnjkq.supabase.co';
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-inquiry-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(submissionPayload)
      });

      if (!response.ok) {
        // Fallback to supabase functions client if direct fetch has issues
        await supabase.functions.invoke(
          "send-inquiry-email",
          { body: submissionPayload }
        );
      }

      if (typeof window !== 'undefined') {
        import('posthog-js').then((ph) => {
          ph.default.capture('form_submitted', {
            form_name: 'book_visit_page',
            lead_type: 'book_visit',
            pincode: trimmedPin,
            region: pinCheck.region
          });
        });
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'generate_lead',
          'form_name': 'book_visit_page',
          'lead_type': 'book_visit',
          'pincode': trimmedPin
        });
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
      }

    } catch (e) {
      console.error("Submission inquiry error:", e);
    }

    // Record submission to suppress all popups across the site
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
    }

    const redirectUrl = `/booking-success?name=${encodeURIComponent(trimmedName)}&phone=${encodeURIComponent(formData.phone)}&pincode=${encodeURIComponent(trimmedPin)}&region=${encodeURIComponent(pinCheck.region || "")}&bill=${encodeURIComponent(formattedBill)}&msg=${whatsappMessage}`;

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
    <div className="min-h-[100dvh] bg-slate-50 sm:bg-muted flex flex-col items-center justify-start sm:py-8">
      
      <div className="w-full max-w-[400px] bg-white sm:rounded-3xl sm:shadow-2xl relative flex flex-col min-h-[100dvh] sm:min-h-0">
        
        {/* Floating Native App Header */}
        <div className="absolute top-0 w-full z-50 px-4 h-16 flex items-center justify-between">
          <Link 
            href="/solar-company-meerut" 
            aria-label="Back to home"
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Top Image Banner */}
        <div className="relative h-[220px] w-full bg-slate-200 shrink-0">
          <img 
            src="/Happyfamily.png" 
            alt="Happy family with solar" 
            fetchPriority="high"
            className="w-full h-full object-cover object-[55%_10%]"
          />
          {/* Subtle gradient overlay for header readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Form Container (Bottom Sheet Effect) */}
        <div className="px-5 pt-8 pb-32 sm:pb-8 flex-grow flex flex-col bg-white rounded-t-[32px] -mt-8 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto absolute top-3 left-1/2 -translate-x-1/2" />
          
          <div className="mb-7 mt-1">
            <h1 className="text-[25px] sm:text-[27px] leading-[1.25] font-bold font-montserrat text-slate-900 mb-4 sm:mb-5">
              Get Solar Panels at <span className="text-accent">Zero Down Payment</span>
            </h1>
            <p className="text-[13.5px] sm:text-[14.5px] font-bold text-slate-800 leading-normal">
              Book a free site visit and claim your <span className="text-accent">₹1,08,000 subsidy before it ends!</span>
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
                className="inline-flex h-[52px] px-8 rounded-[16px] bg-[#25D366] hover:bg-[#128C7E] text-white font-bold shadow-lg shadow-[#25D366]/20 transition-all active:scale-95 items-center gap-2"
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
            <form onSubmit={handleSubmit} className="space-y-3.5 flex-grow flex flex-col">
              {submitError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{submitError}</span>
                </div>
              )}

              <div className="space-y-3 flex-grow">
                <div>
                  <Input 
                    id="name" 
                    placeholder="Full Name*" 
                    aria-label="Full Name"
                    required 
                    value={formData.name} 
                    onChange={e => {
                      setSubmitError("");
                      setFormData({ ...formData, name: e.target.value });
                    }} 
                    className="h-[52px] px-4 bg-slate-50 border border-slate-200 hover:border-primary/30 rounded-[14px] text-[15px] font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all" 
                  />
                </div>
                
                <div className="relative flex items-center">
                  <div className="absolute left-0 h-[52px] flex items-center justify-center px-3.5 text-slate-600 font-bold bg-slate-100 border border-r-0 border-slate-200 rounded-l-[14px] z-10 pointer-events-none">
                    +91
                  </div>
                  <Input 
                    id="phone" 
                    type="tel" 
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="WhatsApp Number*" 
                    aria-label="WhatsApp Number"
                    required 
                    value={formData.phone} 
                    onChange={e => {
                      setSubmitError("");
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, phone: val.length <= 10 ? val : val.slice(0, 10) });
                    }} 
                    className="h-[52px] pl-[64px] pr-4 bg-slate-50 border border-slate-200 hover:border-primary/30 rounded-[14px] text-[15px] font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all w-full relative" 
                  />
                </div>

                <div>
                  <div className="relative">
                    <Input 
                      id="pincode" 
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="PIN Code (6 digits)*" 
                      aria-label="PIN Code"
                      required 
                      value={formData.pincode} 
                      onChange={e => {
                        setSubmitError("");
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setFormData({ ...formData, pincode: val });
                      }} 
                      className={`h-[52px] pl-4 pr-11 bg-slate-50 border rounded-[14px] text-[15px] font-medium placeholder:text-slate-400 focus-visible:ring-2 transition-all ${
                        pincodeVerifier.isValid
                          ? "border-emerald-500 focus-visible:ring-emerald-500 bg-emerald-50/20" 
                          : pincodeVerifier.isInvalid
                          ? "border-destructive focus-visible:ring-destructive bg-destructive/5" 
                          : "border-slate-200 hover:border-primary/30 focus-visible:ring-primary focus-visible:bg-white"
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
                  {pincodeVerifier.isInvalid && (
                    <div className="mt-1.5 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2 shadow-sm animate-in fade-in slide-in-from-top-1">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{OUTSIDE_REGION_ERROR}</span>
                    </div>
                  )}
                </div>



                <div>
                  <Select 
                    value={formData.monthlyBill} 
                    onValueChange={value => {
                      setSubmitError("");
                      setFormData({ ...formData, monthlyBill: value });
                    }}
                  >
                    <SelectTrigger 
                      aria-label="Monthly Electricity Bill"
                      className="w-full h-[52px] px-4 bg-slate-50 border border-slate-200 hover:border-primary/30 rounded-[14px] text-[15px] font-medium focus:ring-2 focus:ring-primary focus:bg-white text-slate-700 transition-all"
                    >
                      <SelectValue placeholder="Monthly Electricity Bill*" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[14px] z-[100] bg-white border-slate-200">
                      <SelectItem value="< 1500" className="text-[15px] py-2.5">Less than ₹1,500</SelectItem>
                      <SelectItem value="1500 - 2500" className="text-[15px] py-2.5">₹1,500 - ₹2,500</SelectItem>
                      <SelectItem value="2500 - 5000" className="text-[15px] py-2.5">₹2,500 - ₹5,000</SelectItem>
                      <SelectItem value="> 5000" className="text-[15px] py-2.5">More than ₹5,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* App Bottom Action Bar */}
              <div className="fixed sm:relative bottom-0 left-0 w-full p-4 sm:p-0 bg-white sm:bg-transparent border-t border-slate-100 sm:border-0 z-[100] flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] sm:shadow-none">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || pincodeVerifier.isBlocked}
                  className="flex-grow h-[52px] rounded-[14px] text-[16px] font-bold bg-primary hover:bg-primary/90 text-white transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Redirecting...</span>
                    </>
                  ) : (
                    "Book FREE Consultation"
                  )}
                </Button>
                
                <a 
                  href="tel:+918999999654"
                  className="flex-shrink-0 flex items-center justify-center w-[52px] h-[52px] rounded-[14px] bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-[0.98]"
                  title="Call Us Now"
                  aria-label="Call Us Now"
                >
                  <Phone className="w-[20px] h-[20px] fill-current" />
                </a>
              </div>
              
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
