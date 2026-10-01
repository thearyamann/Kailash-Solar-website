"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Phone, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function BookVisitModal({ children, autoOpenDelay }: { children?: React.ReactNode, autoOpenDelay?: number }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    monthlyBill: "",
    customerType: "residential",
  });

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
          address: parsed.address || parsed.pincode || prev.address,
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
      // Check if we've already auto-opened it in this session
      const hasAutoOpened = sessionStorage.getItem("kailash_modal_auto_opened");
      const hasSubmitted = localStorage.getItem("kailash_modal_submitted");
      
      if (!hasAutoOpened && !hasSubmitted) {
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
      if (!isOpen && sessionStorage.getItem("kailash_modal_auto_opened") && !localStorage.getItem("kailash_modal_submitted")) {
        
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

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      setSubmitError("Name should contain only letters and spaces.");
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      setSubmitError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!formData.monthlyBill) {
      setSubmitError("Please select your monthly electricity bill.");
      return;
    }

    setIsSubmitting(true);

    // Formulate WhatsApp message first
    const whatsappMessage = encodeURIComponent(`Hi, I want to book a FREE consultation.\n\n` + `Name: ${formData.name}\n` + `WhatsApp: ${formData.phone}\n` + `Address/PIN: ${formData.address}\n` + `Monthly Bill: ${formData.monthlyBill || 'Not specified'}`);
    
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
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Supabase request failed");
      }

      if (typeof window !== 'undefined') {
        import('posthog-js').then((ph) => {
          ph.default.capture('form_submitted', {
            form_name: 'book_visit',
            lead_type: 'book_visit'
          });
        });
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'generate_lead',
          'form_name': 'book_visit',
          'lead_type': 'book_visit'
        });
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Lead');
        }
      }

    } catch (error) {
      console.error(error);
    }

    // Delay redirect to allow tracking scripts (PostHog/Meta) to finish in WebViews
    setTimeout(() => {
      window.location.href = `https://wa.me/918999999654?text=${whatsappMessage}`;
    }, 800);
    
    setIsSuccess(true);
    toast({
      title: "Request Sent!",
      description: "Redirecting to WhatsApp..."
    });
    localStorage.setItem("kailash_modal_submitted", "true");
    setFormData({ name: "", phone: "", address: "", monthlyBill: "", customerType: "residential" });
    setIsSubmitting(false);
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
                  href={`https://wa.me/918999999654?text=Hi`}
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
                <div className="mb-3.5">
                  <h2 className="text-[22px] sm:text-[24px] leading-[1.15] font-bold font-montserrat text-slate-900 mb-2">
                    Get Solar Panels at <span className="text-primary">Zero Initial Cost</span>
                  </h2>
                  <p className="text-[13px] sm:text-[14px] font-bold text-foreground">
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
                        className="h-[42px] px-4 bg-background border-border rounded-[10px] text-[14px] focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/70" 
                      />
                    </div>
                    
                    <div>
                      <Input 
                        placeholder="PIN Code & Address*" 
                        required 
                        value={formData.address} 
                        onChange={e => setFormData({ ...formData, address: e.target.value })} 
                        className="h-[42px] px-4 bg-background border-border rounded-[10px] text-[14px] focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/70" 
                      />
                    </div>
                    
                    <div className="relative flex items-center">
                      <div className="absolute left-0 h-[42px] flex items-center justify-center px-3 text-muted-foreground font-bold bg-muted/50 border border-r-0 border-border rounded-l-[10px] z-10 pointer-events-none">
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
                        className="h-[42px] pl-[60px] pr-4 bg-background border-border rounded-[10px] text-[14px] focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/70 w-full relative" 
                      />
                    </div>

                    <div>
                      <Select value={formData.monthlyBill} onValueChange={value => setFormData({ ...formData, monthlyBill: value })}>
                        <SelectTrigger className="h-[42px] px-4 bg-background border-border rounded-[10px] text-[14px] text-muted-foreground focus:ring-primary">
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
                      disabled={isSubmitting} 
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
