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
    try {
      const { error: fnError } = await supabase.functions.invoke(
        "send-inquiry-email",
        { body: formData }
      );
      
      if (fnError) {
        if (process.env.NODE_ENV !== 'production') {
          console.error("Submit error:", fnError);
        }
        throw new Error("Failed to submit inquiry");
      }

      const whatsappMessage = encodeURIComponent(`Hi, I want to book a FREE consultation.\n\n` + `Name: ${formData.name}\n` + `WhatsApp: ${formData.phone}\n` + `Address/PIN: ${formData.address}\n` + `Monthly Bill: ${formData.monthlyBill || 'Not specified'}`);
      window.open(`https://wa.me/918999999654?text=${whatsappMessage}`, "_blank");
      
      toast({
        title: "Consultation Booked!",
        description: "Our engineering team will contact you shortly."
      });
      
      router.push("/");
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Submission error:", error);
      }
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            src="/happyfamily.png" 
            alt="Happy family with solar" 
            className="w-full h-full object-cover object-[55%_10%]"
          />
          {/* Close button for desktop, hidden on mobile since we have back arrow */}
          <Link href="/" className="hidden sm:flex absolute top-4 right-4 w-8 h-8 bg-black/40 backdrop-blur-md rounded-full items-center justify-center text-white hover:bg-black/60 transition-colors">
            <X className="w-5 h-5" />
          </Link>
        </div>

        <div className="p-5 sm:p-7 flex-grow flex flex-col bg-card">
          {/* Typography Section */}
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
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
            
            <div className="space-y-3.5 pb-24 sm:pb-0 flex-grow">
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
                <Select value={formData.monthlyBill} onValueChange={value => setFormData({ ...formData, monthlyBill: value })}>
                  <SelectTrigger className="h-[52px] px-4 bg-background border-border rounded-[12px] text-[15px] text-muted-foreground focus:ring-primary">
                    <SelectValue placeholder="Monthly Electricity Bill*" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[12px]">
                    <SelectItem value="< 1500">Less than ₹1,500</SelectItem>
                    <SelectItem value="1500 - 2500">₹1,500 - ₹2,500</SelectItem>
                    <SelectItem value="2500 - 5000">₹2,500 - ₹5,000</SelectItem>
                    <SelectItem value="> 5000">More than ₹5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sticky App-like Bottom Button */}
            <div className="fixed sm:relative bottom-0 left-0 right-0 p-4 sm:p-0 bg-card border-t border-border/40 sm:border-t-0 z-50 sm:mt-auto">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-[56px] rounded-[14px] text-[16px] font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all shadow-lg sm:shadow-none shadow-primary/20"
              >
                {isSubmitting ? "Booking..." : "Book a FREE Consultation"}
              </Button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
