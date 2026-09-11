"use client";

import { useState } from "react";
import { ArrowLeft, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BookVisitPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    monthlyBill: "",
    customerType: "residential",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Formulate WhatsApp message first
    const whatsappMessage = encodeURIComponent(`Hi, I want to book a FREE consultation.\n\n` + `Name: ${formData.name}\n` + `WhatsApp: ${formData.phone}\n` + `Address/PIN: ${formData.address}\n` + `Monthly Bill: ${formData.monthlyBill || 'Not specified'}`);
    
    // Always trigger tracking
    if (typeof window !== 'undefined') {
      import('posthog-js').then((ph) => {
        ph.default.capture('form_submitted', {
          form_name: 'book_visit_page',
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

    // Attempt to send to Supabase but don't block the user if it fails
    try {
      await supabase.functions.invoke(
        "send-inquiry-email",
        { body: formData }
      ).catch(e => console.error("Background sync error:", e));
    } catch (e) {
      console.error(e);
    }

    // Open WhatsApp instantly for the high intent lead
    window.location.href = `https://wa.me/918999999654?text=${whatsappMessage}`;
    
    toast({
      title: "Consultation Booked!",
      description: "Redirecting to WhatsApp..."
    });
    
    setIsSubmitting(false);
    router.push("/");
  };

  return (
    <div className="min-h-[100dvh] bg-background sm:bg-muted flex flex-col items-center justify-start sm:py-8">
      
      <div className="w-full max-w-[400px] bg-card sm:rounded-xl sm:shadow-2xl overflow-hidden relative flex flex-col min-h-[100dvh] sm:min-h-0">
        
        {/* Native App Header (Mobile Only) */}
        <div className="sm:hidden sticky top-0 z-50 bg-card border-b border-border/40 px-4 h-14 flex items-center shadow-sm">
          <Link href="/" className="flex items-center text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5 mr-3" />
            <span className="font-bold text-[15px]">Book Site Visit</span>
          </Link>
        </div>

        {/* Top Image Banner */}
        <div className="relative h-[180px] w-full bg-slate-200 shrink-0">
          <img 
            src="/Happyfamily.png" 
            alt="Happy family with solar" 
            className="w-full h-full object-cover object-[55%_10%]"
          />
          <Link href="/" className="hidden sm:flex absolute top-4 right-4 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-black/60 transition-colors">
            <X className="w-5 h-5" />
          </Link>
        </div>

        <div className="p-5 sm:p-7 flex-grow flex flex-col bg-card">
          <div className="mb-5">
            <h1 className="text-[26px] sm:text-[28px] leading-[1.1] font-bold font-montserrat text-foreground mb-3">
              Go Solar at <span className="text-accent">₹0 Upfront Cost</span>
            </h1>
            <p className="text-[14px] leading-relaxed text-muted-foreground mb-4">
              Govt. subsidy pays your down payment. Your electricity savings pay the EMIs.
            </p>
            <p className="text-[14px] font-bold text-foreground">
              Book a free site visit and claim your <span className="text-primary">₹1,08,000 subsidy before it ends!</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
            <div className="space-y-3.5 pb-6 sm:pb-0 flex-grow">
              <div>
                <Input 
                  id="name" 
                  placeholder="Full Name*" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  className="h-[52px] px-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary" 
                />
              </div>
              
              <div>
                <Input 
                  id="address" 
                  placeholder="PIN Code & Address*" 
                  required 
                  value={formData.address} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })} 
                  className="h-[52px] px-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary" 
                />
              </div>
              
              <div>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="WhatsApp Number*" 
                  required 
                  value={formData.phone} 
                  onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                  className="h-[52px] px-4 bg-background border-border rounded-[12px] text-[15px] focus-visible:ring-primary focus-visible:border-primary" 
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
            </div>

            <div className="relative mt-2 sm:mt-auto z-10 w-full">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-[56px] rounded-[14px] text-[16px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg shadow-primary/20"
              >
                {isSubmitting ? "Redirecting..." : "Book a FREE Consultation"}
              </Button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
