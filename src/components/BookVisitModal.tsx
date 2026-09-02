"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function BookVisitModal({ children, autoOpenDelay }: { children?: React.ReactNode, autoOpenDelay?: number }) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      
      if (!hasAutoOpened) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem("kailash_modal_auto_opened", "true");
        }, autoOpenDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [autoOpenDelay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
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
        body: JSON.stringify(formData)
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

      const whatsappMessage = encodeURIComponent(`Hi, I want to book a FREE consultation.\n\n` + `Name: ${formData.name}\n` + `WhatsApp: ${formData.phone}\n` + `Address/PIN: ${formData.address}\n` + `Monthly Bill: ${formData.monthlyBill || 'Not specified'}`);
      
      if (typeof window !== 'undefined') {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'generate_lead',
          'form_name': 'book_visit',
          'lead_type': 'book_visit'
        });
      }

      window.open(`https://wa.me/918999999654?text=${whatsappMessage}`, "_blank");
      
      toast({
        title: "Consultation Booked!",
        description: "Our engineering team will contact you shortly."
      });
      setIsOpen(false);
      setFormData({ name: "", phone: "", address: "", monthlyBill: "", customerType: "residential" });
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
            {/* Typography Section */}
            <div className="mb-3.5">
              <h1 className="text-[22px] sm:text-[28px] leading-[1.1] font-bold font-montserrat text-foreground mb-1.5">
                Go Solar at <span className="text-accent">₹0 Upfront Cost</span>
              </h1>
              <p className="text-[13px] sm:text-[14px] leading-relaxed text-muted-foreground mb-1.5">
                Govt. subsidy pays your down payment. Your electricity savings pay the EMIs.
              </p>
              <p className="text-[13px] sm:text-[14px] font-bold text-foreground">
                Book a free site visit and claim your <span className="text-primary">₹1,08,000 subsidy before it ends!</span>
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

              <div>
                <Input 
                  id="modal-name" 
                  placeholder="Full Name*" 
                  required 
                  value={formData.name} 
                  onChange={e => {
                    setSubmitError("");
                    setFormData({ ...formData, name: e.target.value });
                  }} 
                  className="h-[42px] px-4 bg-background border-border rounded-[10px] text-[14px] focus-visible:ring-primary focus-visible:border-primary" 
                />
              </div>
              
              <div>
                <Input 
                  id="modal-address" 
                  placeholder="PIN Code & Address*" 
                  required 
                  value={formData.address} 
                  onChange={e => {
                    setSubmitError("");
                    setFormData({ ...formData, address: e.target.value });
                  }} 
                  className="h-[42px] px-4 bg-background border-border rounded-[10px] text-[14px] focus-visible:ring-primary focus-visible:border-primary" 
                />
              </div>
              
              <div>
                <Input 
                  id="modal-phone" 
                  type="tel" 
                  placeholder="WhatsApp Number (10 digits)*" 
                  required 
                  maxLength={10}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                  value={formData.phone} 
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setFormData({ ...formData, phone: val });
                  }} 
                  className="h-[42px] px-4 bg-background border-border rounded-[10px] text-[14px] focus-visible:ring-primary focus-visible:border-primary" 
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

              <div className="pt-2 flex gap-2 sm:gap-3">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-grow h-[48px] rounded-[10px] text-[16px] font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? "Booking..." : "Book a FREE Consultation"}
                </Button>
                <a 
                  href="tel:+918999999654" 
                  className="flex-shrink-0 flex items-center justify-center w-[48px] h-[48px] rounded-[10px] bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors shadow-sm"
                  title="Call Us Now"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
