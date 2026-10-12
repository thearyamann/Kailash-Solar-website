"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Phone, CheckCircle2, MessageCircle, AlertCircle, Loader2 } from "lucide-react";
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
  isPopupSuppressed, 
  recordSubmission, 
  checkDuplicateSubmission 
} from "@/lib/submission-tracker";

export function BookVisitModal({ children, autoOpenDelay }: { children?: React.ReactNode, autoOpenDelay?: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
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

  // Load from local storage
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

  // Save to local storage
  useEffect(() => {
    const saved = localStorage.getItem("kailash_user_profile");
    let parsed = {};
    if (saved) {
      try { parsed = JSON.parse(saved); } catch(e) {}
    }
    localStorage.setItem("kailash_user_profile", JSON.stringify({ ...parsed, ...formData }));
  }, [formData]);

  useEffect(() => {
    if (autoOpenDelay && autoOpenDelay > 0) {
      // Check if user has already submitted ANY form or auto-opened this session
      const hasAutoOpened = sessionStorage.getItem("kailash_modal_auto_opened");
      const isSuppressed = isPopupSuppressed();
      
      if (!hasAutoOpened && !isSuppressed) {
        const timer = setTimeout(() => {
          if (!document.querySelector('[role="dialog"]')) {
            setIsOpen(true);
            sessionStorage.setItem("kailash_modal_auto_opened", "true");
          }
        }, autoOpenDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [autoOpenDelay]);

  // Handle re-triggering 15s and 40s after the modal is closed
  useEffect(() => {
    let retriggerTimer: NodeJS.Timeout;
    
    // Only run this logic for the main auto-opening instance to prevent multiple modals triggering
    if (autoOpenDelay && autoOpenDelay > 0) {
      // If the modal is closed, has been auto-opened before, and hasn't been submitted
      if (!isOpen && sessionStorage.getItem("kailash_modal_auto_opened") && !isPopupSuppressed()) {
        
        const retriggerCount = parseInt(sessionStorage.getItem("kailash_modal_retrigger_count") || "0", 10);
        
        const handleRetrigger = (nextCount: string) => {
          if (!document.querySelector('[role="dialog"]')) {
            setIsOpen(true);
          }
          // We increment the count regardless to avoid being stuck in a trigger loop forever
          sessionStorage.setItem("kailash_modal_retrigger_count", nextCount);
        };

        if (retriggerCount === 0) {
          retriggerTimer = setTimeout(() => {
            handleRetrigger("1");
          }, 15000); // First re-trigger after 15 seconds
        } else if (retriggerCount === 1) {
          retriggerTimer = setTimeout(() => {
            handleRetrigger("2");
          }, 50000); // Second re-trigger after 50 seconds
        }
        // Stop re-triggering after the second time
      }
    }
    
    return () => {
      if (retriggerTimer) clearTimeout(retriggerTimer);
    };
  }, [isOpen, autoOpenDelay]);

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
      setIsOpen(false);
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
      // Send to supabase edge function using fetch in background without blocking
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
            form_name: 'book_visit',
            lead_type: 'book_visit',
            pincode: trimmedPin,
            region: pinCheck.region
          });
        });
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'generate_lead',
          'form_name': 'book_visit',
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
    setIsOpen(false);

    // Immediately run dedicated animated success page
    if (typeof window !== "undefined") {
      window.location.assign(redirectUrl);
    } else {
      router.push(redirectUrl);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && (
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
      )}
      <DialogContent 
        className="p-0 border-none bg-transparent shadow-none max-w-md w-[95vw] sm:w-full rounded-xl overflow-hidden focus:outline-none focus-visible:outline-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="w-full bg-card rounded-xl overflow-hidden relative flex flex-col max-h-[90vh] overflow-y-auto hide-scrollbar focus:outline-none">
          {/* Top Image Banner */}
          <div className="relative h-[140px] sm:h-[160px] w-full bg-slate-200 shrink-0">
            <img 
              src="/Happyfamily.png" 
              alt="Happy family with solar" 
              className="w-full h-full object-cover object-[55%_10%]"
            />
          </div>

          <div className="p-4 sm:p-6 flex-grow flex flex-col bg-card">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-12 animate-in fade-in zoom-in duration-500 min-h-[350px]">
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
                {/* Typography Section */}
                <div className="mb-6">
                  <h2 className="text-[22px] sm:text-[24px] leading-[1.25] font-bold font-montserrat text-slate-900 mb-4">
                    Get Solar Panels at <span className="text-accent">Zero Down Payment</span>
                  </h2>
                  <p className="text-[13px] sm:text-[14px] font-bold text-foreground leading-normal">
                    Book a free site visit and claim your <span className="text-accent">₹1,08,000 subsidy before it ends!</span>
                  </p>
                </div>
                
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {submitError && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-start gap-3 mb-4 animate-in fade-in slide-in-from-top-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                      <p className="text-[14px] font-medium leading-tight">{submitError}</p>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    <div>
                      <Input 
                        placeholder="Full Name*" 
                        required 
                        value={formData.name} 
                        onChange={e => setFormData({ ...formData, name: e.target.value })} 
                        className="h-[42px] px-4 bg-background border-border rounded-[10px] text-[14px] focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 focus:border-slate-400 focus-visible:border-slate-400 placeholder:text-muted-foreground/70" 
                      />
                    </div>
                    
                    <div>
                      <div className="relative">
                        <Input 
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="PIN Code (6 digits)*" 
                          required 
                          value={formData.pincode} 
                          onChange={e => {
                            setSubmitError("");
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setFormData({ ...formData, pincode: val });
                          }} 
                          className={`h-[42px] pl-4 pr-10 bg-background border rounded-[10px] text-[14px] placeholder:text-muted-foreground/70 focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 transition-all ${
                            pincodeVerifier.isValid
                              ? "border-emerald-500 bg-emerald-50/20" 
                              : pincodeVerifier.isInvalid
                              ? "border-destructive bg-destructive/5" 
                              : "border-border focus:border-slate-400 focus-visible:border-slate-400"
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                          {pincodeVerifier.isChecking && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                          )}
                          {pincodeVerifier.isValid && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-in fade-in zoom-in-75 duration-200" />
                          )}
                          {pincodeVerifier.isInvalid && (
                            <AlertCircle className="w-3.5 h-3.5 text-destructive animate-in fade-in zoom-in-75 duration-200" />
                          )}
                        </div>
                      </div>
                      {pincodeVerifier.isInvalid && (
                        <div className="mt-1 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-medium flex items-start gap-1.5 shadow-sm animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{OUTSIDE_REGION_ERROR}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center h-[42px] bg-background border border-border rounded-[10px] overflow-hidden focus-within:border-slate-400 transition-colors">
                      <div className="h-full px-3 flex items-center justify-center text-muted-foreground font-bold bg-muted/40 border-r border-border shrink-0 select-none text-[13px]">
                        +91
                      </div>
                      <Input 
                        type="tel" 
                        placeholder="WhatsApp Number*" 
                        required 
                        value={formData.phone} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, phone: val.length <= 10 ? val : val.slice(0, 10) })
                        }} 
                        className="h-full border-0 rounded-none bg-transparent px-3 text-[14px] focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent focus:border-transparent placeholder:text-muted-foreground/70 w-full shadow-none" 
                      />
                    </div>

                    <div>
                      <Select value={formData.monthlyBill} onValueChange={value => setFormData({ ...formData, monthlyBill: value })}>
                        <SelectTrigger className="h-[42px] px-4 bg-background border-border rounded-[10px] text-[14px] text-muted-foreground focus:outline-none focus:ring-0 focus:border-slate-400">
                          <SelectValue placeholder="Monthly Electricity Bill*" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[12px] z-[100]">
                          <SelectItem value="< 1500">Less than ₹1,500</SelectItem>
                          <SelectItem value="1500 - 2500">₹1,500 - ₹2,500</SelectItem>
                          <SelectItem value="2500 - 5000">₹2,500 - ₹5,000</SelectItem>
                          <SelectItem value="> 5000">More than ₹5,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2 sm:gap-3">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || pincodeVerifier.isBlocked} 
                      className="flex-grow h-[48px] rounded-[10px] text-[16px] font-bold transition-all active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {isSubmitting ? "Booking..." : "Book FREE Consultation"}
                    </Button>
                    <a 
                      href="tel:+918999999654" 
                      className="flex-shrink-0 flex items-center justify-center w-[48px] h-[48px] rounded-[10px] bg-primary text-white hover:bg-primary/90 transition-colors"
                      title="Call Us Now"
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
