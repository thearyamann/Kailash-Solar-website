"use client";

import { useState } from "react";
import { ArrowLeft, Send, X, Phone } from "lucide-react";
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
    <div className="min-h-[100dvh] bg-slate-50 sm:bg-muted flex flex-col items-center justify-start sm:py-8">
      
      <div className="w-full max-w-[400px] bg-white sm:rounded-3xl sm:shadow-2xl relative flex flex-col min-h-[100dvh] sm:min-h-0">
        
        {/* Floating Native App Header */}
        <div className="absolute top-0 w-full z-50 px-4 h-16 flex items-center justify-between">
          <Link href="/" className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-transform">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>

        {/* Top Image Banner */}
        <div className="relative h-[240px] w-full bg-slate-200 shrink-0">
          <img 
            src="/Happyfamily.png" 
            alt="Happy family with solar" 
            className="w-full h-full object-cover object-[55%_10%]"
          />
          {/* Subtle gradient overlay for header readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Form Container (Bottom Sheet Effect) */}
        <div className="px-5 pt-8 pb-32 sm:pb-8 flex-grow flex flex-col bg-white rounded-t-[32px] -mt-8 relative z-10 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto absolute top-3 left-1/2 -translate-x-1/2" />
          
          <div className="mb-6 mt-1">
            <h1 className="text-[26px] sm:text-[28px] leading-[1.15] font-bold font-montserrat text-slate-900 mb-2">
              Get Solar Panels at <br/><span className="text-accent">Zero Initial Cost</span>
            </h1>
            <p className="text-[14px] leading-relaxed text-slate-500 mb-3 font-medium">
              Govt. subsidy pays your down payment. Your electricity savings pay the EMIs.
            </p>
            <p className="text-[14px] font-bold text-slate-800">
              Book a free site visit and claim your <span className="text-accent">₹1,08,000 subsidy before it ends!</span>
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
            <div className="space-y-4 flex-grow">
              <div>
                <Input 
                  id="name" 
                  placeholder="Full Name*" 
                  required 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  className="h-[56px] px-5 bg-slate-50 border border-slate-200  hover:border-primary/30 rounded-[16px] text-[15px] font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all" 
                />
              </div>
              
              <div>
                <Input 
                  id="address" 
                  placeholder="PIN Code & Address*" 
                  required 
                  value={formData.address} 
                  onChange={e => setFormData({ ...formData, address: e.target.value })} 
                  className="h-[56px] px-5 bg-slate-50 border border-slate-200  hover:border-primary/30 rounded-[16px] text-[15px] font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all" 
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
                  className="h-[56px] px-5 bg-slate-50 border border-slate-200  hover:border-primary/30 rounded-[16px] text-[15px] font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all" 
                />
              </div>

              <div>
                <Select value={formData.monthlyBill} onValueChange={value => setFormData({ ...formData, monthlyBill: value })}>
                  <SelectTrigger className="w-full h-[56px] px-5 bg-slate-50 border border-slate-200 hover:border-primary/30 rounded-[16px] text-[15px] font-medium focus:ring-2 focus:ring-primary focus:bg-white text-slate-700 transition-all">
                    <SelectValue placeholder="Monthly Electricity Bill*" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[16px] z-[100] bg-white border-slate-200">
                    <SelectItem value="< 1500" className="text-[15px] py-2.5">Less than ₹1,500</SelectItem>
                    <SelectItem value="1500 - 2500" className="text-[15px] py-2.5">₹1,500 - ₹2,500</SelectItem>
                    <SelectItem value="2500 - 5000" className="text-[15px] py-2.5">₹2,500 - ₹5,000</SelectItem>
                    <SelectItem value="> 5000" className="text-[15px] py-2.5">More than ₹5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* App Bottom Action Bar */}
            <div className="fixed sm:relative bottom-0 left-0 w-full p-4 pb-8 sm:p-0 bg-white sm:bg-transparent border-t border-slate-100 sm:border-0 z-[100] flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] sm:shadow-none">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-grow h-[56px] rounded-[16px] text-[16px] font-bold bg-primary hover:bg-primary/90 text-white transition-transform active:scale-[0.98]  "
              >
                {isSubmitting ? "Redirecting..." : "Book Consultation"}
              </Button>
              
              <a 
                href="tel:+918999999654"
                className="flex-shrink-0 flex items-center justify-center w-[56px] h-[56px] rounded-[16px] bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-[0.98]"
                title="Call Us Now"
              >
                <Phone className="w-[22px] h-[22px] fill-current" />
              </a>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
