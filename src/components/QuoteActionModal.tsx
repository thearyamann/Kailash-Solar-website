"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
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

interface QuoteData {
  systemSize: number;
  totalCost: number;
  subsidy: number;
  netCost: number;
}

interface QuoteActionModalProps {
  children?: React.ReactNode;
  quoteData: QuoteData;
}

export function QuoteActionModal({ children, quoteData }: QuoteActionModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
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
          pincode: parsed.pincode || parsed.address || prev.pincode, // fallback to address if they used the other modal
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

    // Check duplicate submission
    const duplicateCheck = checkDuplicateSubmission({
      phone: formData.phone,
      name: trimmedName,
      monthlyBill: `${quoteData.systemSize}kW System`,
    });

    if (duplicateCheck.isDuplicate) {
      toast({
        title: "Request Already Received",
        description: duplicateCheck.message,
      });
      setIsOpen(false);
      const dupUrl = `/booking-success?name=${encodeURIComponent(trimmedName)}&phone=${encodeURIComponent(formData.phone)}&pincode=${encodeURIComponent(trimmedPin)}&region=${encodeURIComponent(pinCheck.region || "")}&bill=${encodeURIComponent(`${quoteData.systemSize}kW System`)}`;
      if (typeof window !== "undefined") {
        window.location.assign(dupUrl);
      } else {
        router.push(dupUrl);
      }
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Send to supabase edge function using fetch for better error transparency
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tjikswdntqctoqqrnjkq.supabase.co';
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-inquiry-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          name: trimmedName,
          phone: formData.phone,
          address: `${trimmedPin} (${pinCheck.region})`,
          monthlyBill: `${quoteData.systemSize}kW System`,
          customerType: "residential"
        })
      });
      
      if (!response.ok) {
        let errorMsg = "Failed to submit inquiry";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }

      // Send to WhatsApp
      const whatsappMessage = encodeURIComponent(
        `Hi, I want to book my installation.\n\n` +
        `Name: ${trimmedName}\n` +
        `WhatsApp: ${formData.phone}\n` +
        `PIN Code: ${trimmedPin} [${pinCheck.region}]\n` +
        `---\n` +
        `*Quote Details*\n` +
        `System: ${quoteData.systemSize} kW\n` +
        `Net Cost: ₹${quoteData.netCost.toLocaleString()}`
      );
      
      if (typeof window !== 'undefined') {
        import('posthog-js').then((ph) => {
          ph.default.capture('form_submitted', {
            form_name: 'quote_booking',
            lead_type: 'quote',
            pincode: trimmedPin,
            region: pinCheck.region
          });
        });
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'generate_lead',
          'form_name': 'quote_booking',
          'lead_type': 'quote',
          'pincode': trimmedPin
        });
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
      }

      // Record submission to suppress all popups across the site
      recordSubmission({
        name: trimmedName,
        phone: formData.phone,
        pincode: trimmedPin,
        monthlyBill: `${quoteData.systemSize}kW System`,
      });

      if (typeof window !== "undefined") {
        sessionStorage.setItem("kailash_submitted_name", trimmedName);
        sessionStorage.setItem("kailash_submitted_phone", formData.phone);
        sessionStorage.setItem("kailash_submitted_pincode", trimmedPin);
        sessionStorage.setItem("kailash_submitted_bill", `${quoteData.systemSize}kW System`);
      }

      const redirectUrl = `/booking-success?name=${encodeURIComponent(trimmedName)}&phone=${encodeURIComponent(formData.phone)}&pincode=${encodeURIComponent(trimmedPin)}&region=${encodeURIComponent(pinCheck.region || "")}&bill=${encodeURIComponent(`${quoteData.systemSize}kW System`)}&msg=${whatsappMessage}`;

      toast({
        title: "Installation Request Received!",
        description: "Redirecting to your confirmation..."
      });
      setIsOpen(false);
      setFormData({ name: "", phone: "", pincode: "" });

      // Immediately run dedicated animated success page
      if (typeof window !== "undefined") {
        window.location.assign(redirectUrl);
      } else {
        router.push(redirectUrl);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit request. Please try again or contact us directly.";
      if (process.env.NODE_ENV !== 'production') {
        console.error("Submission error:", error);
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
        className="p-0 border-none bg-transparent shadow-none max-w-md w-[95vw] sm:w-full rounded-xl overflow-hidden"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="w-full bg-card rounded-xl overflow-hidden relative flex flex-col max-h-[90vh] overflow-y-auto hide-scrollbar">
          {/* Top Image Banner */}
          <div className="relative h-[160px] sm:h-[180px] w-full bg-slate-200 shrink-0">
            <img 
              src="/Happyfamily.png" 
              alt="Happy family with solar" 
              className="w-full h-full object-cover object-[55%_10%]"
            />
          </div>

          <div className="p-6 flex-grow flex flex-col bg-card">
            {/* Typography Section */}
            <div className="mb-5">
              <h1 className="text-[22px] sm:text-[25px] tracking-tight leading-[1.1] font-bold font-montserrat text-foreground mb-2">
                Claim your <span className="text-accent">₹{quoteData.subsidy.toLocaleString()}</span> Subsidy!
              </h1>
              <p className="text-[14px] leading-relaxed text-muted-foreground mb-2">
                Submit your details to book a priority site-visit for your {quoteData.systemSize}kW system.
              </p>
            </div>
            
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {submitError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl flex items-start gap-3 mb-4 animate-in fade-in slide-in-from-top-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  <p className="text-[14px] font-medium leading-tight">{submitError}</p>
                </div>
              )}

              <div>
                <Input 
                  placeholder="Full Name*" 
                  required 
                  value={formData.name} 
                  onChange={e => {
                    setSubmitError("");
                    setFormData({ ...formData, name: e.target.value });
                  }} 
                  className="h-[48px] px-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary" 
                />
              </div>
              
              <div className="relative flex items-center">
                <div className="absolute left-0 h-[48px] flex items-center justify-center px-3 text-muted-foreground font-bold bg-muted/50 border border-r-0 border-border rounded-l-[12px] z-10 pointer-events-none">
                  +91
                </div>
                <Input 
                  type="tel" 
                  placeholder="WhatsApp Number (10 digits)*" 
                  required 
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                  value={formData.phone} 
                  onChange={e => {
                    setSubmitError("");
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setFormData({ ...formData, phone: val });
                  }} 
                  className="h-[48px] pl-[60px] pr-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary w-full relative" 
                />
              </div>

              <div>
                <div className="relative">
                  <Input 
                    type="text"
                    inputMode="numeric"
                    placeholder="PIN Code (6 digits)*" 
                    required 
                    maxLength={6}
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit PIN code"
                    value={formData.pincode} 
                    onChange={e => {
                      setSubmitError("");
                      const val = e.target.value.replace(/\D/g, '');
                      if (val.length <= 6) setFormData({ ...formData, pincode: val });
                    }} 
                    className={`h-[48px] pl-4 pr-10 bg-background border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary transition-all ${
                      pincodeVerifier.isValid
                        ? "border-emerald-500 focus-visible:ring-emerald-500 bg-emerald-50/20" 
                        : pincodeVerifier.isInvalid
                        ? "border-destructive focus-visible:ring-destructive bg-destructive/5" 
                        : "border-border"
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
                  <div className="mt-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-1.5 shadow-sm animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{OUTSIDE_REGION_ERROR}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || pincodeVerifier.isBlocked}
                  className="w-full h-[52px] rounded-[14px] text-[16px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                >
                  {isSubmitting ? "Submitting..." : "Book Solar Installation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
