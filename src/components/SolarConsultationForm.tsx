"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Info, Check, Calculator, Zap, IndianRupee, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export function SolarConsultationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    monthlyBill: "",
    customerType: "residential",
  });

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
          address: parsed.address || parsed.pincode || prev.address,
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
    setIsSubmitting(true);
    try {
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

      const whatsappMessage = encodeURIComponent(`Hi, I want to book a FREE consultation.\n\n` + `Name: ${formData.name}\n` + `WhatsApp: ${formData.phone}\n` + `PIN Code: ${formData.address}\n` + `Monthly Bill: ${formData.monthlyBill || 'Not specified'}`);
      
      if (typeof window !== 'undefined') {
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'generate_lead',
          'form_name': 'inline_consultation',
          'lead_type': 'book_visit'
        });
      }

      window.open(`https://wa.me/918999999654?text=${whatsappMessage}`, "_blank");
      
      toast({
        title: "Consultation Booked!",
        description: "Our engineering team will contact you shortly."
      });
      setFormData({ name: "", phone: "", address: "", monthlyBill: "", customerType: "residential" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit request.";
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
          Lock in your <span className="font-bold text-foreground">₹1,08,000 subsidy</span> today.
        </p>
        <div className="md:hidden inline-flex items-center gap-1.5 text-accent font-bold text-xs bg-accent/10 px-2.5 py-1 rounded-md">
          <Zap className="w-3.5 h-3.5 fill-accent" /> &quot;Fastest Subsidy Approval in UP&quot;
        </div>
      </div>

      {submitError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-[12px] text-sm font-medium">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
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
          <Input 
            placeholder="WhatsApp Number*" 
            type="tel"
            className="h-[52px] px-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/70"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
            required 
          />
        </div>

        <div>
          <Input 
            placeholder="PIN Code & Address*" 
            className="h-[52px] px-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary placeholder:text-muted-foreground/70"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
            required 
          />
        </div>

        <div>
          <select
            className="w-full h-[52px] px-4 bg-background border border-border rounded-[12px] text-[15px] focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-foreground disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
            value={formData.monthlyBill}
            onChange={(e) => setFormData(prev => ({...prev, monthlyBill: e.target.value}))}
            required
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
          >
            <option value="" disabled className="text-muted-foreground">Monthly Electricity Bill*</option>
            <option value="< 1500">Less than ₹1,500</option>
            <option value="1500 - 2500">₹1,500 - ₹2,500</option>
            <option value="2500 - 5000">₹2,500 - ₹5,000</option>
            <option value="> 5000">More than ₹5,000</option>
          </select>
        </div>

        <div className="pt-2 flex gap-3">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-grow h-[56px] rounded-[14px] text-[16px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
          >
            {isSubmitting ? "Booking..." : "Book a FREE Consultation"}
          </Button>
          <a href="tel:+918999999654" className="flex items-center justify-center w-[56px] h-[56px] shrink-0 bg-blue-600 border border-blue-700 rounded-[14px] text-white hover:bg-blue-700 transition-all shadow-sm active:scale-[0.98]">
            <Phone className="w-[22px] h-[22px] fill-current" />
          </a>
        </div>
      </form>
    </div>
  );
}
