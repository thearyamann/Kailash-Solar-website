"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Info, Check } from "lucide-react";
import Link from "next/link";

export function SolarConsultationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [agreed, setAgreed] = useState(true);
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
    if (!agreed) {
      setSubmitError("Please agree to the Terms of Use and Privacy Policy.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
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
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-lg mx-auto relative z-20">
      <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-slate-900 mb-2">Book a FREE Solar Consultation</h2>
      <p className="text-slate-600 mb-6">And save up to ₹78,000 with subsidy</p>

      {submitError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input 
            placeholder="Full Name" 
            className="h-12 border-slate-200"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
            required 
          />
        </div>
        
        <div>
          <Input 
            placeholder="Whatsapp Number" 
            type="tel"
            className="h-12 border-slate-200"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
            required 
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-slate-700 text-sm mb-1">
            Monthly Electricity Bill <Info className="w-4 h-4 ml-1 text-slate-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {billOptions.map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setFormData(prev => ({...prev, monthlyBill: option}))}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  formData.monthlyBill === option 
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Input 
            placeholder="PIN Code" 
            className="h-12 border-slate-200"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))}
            required 
          />
        </div>

        <div className="flex items-start gap-2 pt-2">
          <button 
            type="button"
            onClick={() => setAgreed(!agreed)}
            className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
              agreed ? 'bg-[#3b82f6] border-[#3b82f6] text-white' : 'border-slate-300 bg-white'
            }`}
          >
            {agreed && <Check className="w-3.5 h-3.5" />}
          </button>
          <p className="text-xs text-slate-600">
            I agree to Kailash Solar <Link href="/terms" className="text-[#3b82f6] hover:underline">Terms of use</Link> and <Link href="/privacy" className="text-[#3b82f6] hover:underline">Privacy Policy</Link>.
          </p>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-12 md:h-14 bg-[#0B1536] hover:bg-[#122359] text-white rounded-lg text-base font-bold transition-all shadow-md active:scale-[0.98]"
          >
            {isSubmitting ? "Booking..." : "Book a FREE Consultation"}
          </Button>
        </div>
      </form>
    </div>
  );
}
