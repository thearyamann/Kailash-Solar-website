"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, Building2, User, IndianRupee, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pincode: "",
    monthlyBill: "",
    customerType: "",
    message: ""
  });

  const pincodeVerifier = usePincodeVerifier(formData.pincode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      toast({ title: "Invalid Name", description: "Name should contain only letters and spaces.", variant: "destructive" });
      return;
    }
    
    if (!/^\d{10}$/.test(formData.phone)) {
      toast({ title: "Invalid Phone", description: "Phone number must be exactly 10 digits.", variant: "destructive" });
      return;
    }

    const trimmedPin = formData.pincode.trim();
    const pinCheck = validatePincode(trimmedPin);
    if (!pinCheck.isValid) {
      toast({ title: "Region Not Serviceable", description: pinCheck.error!, variant: "destructive" });
      return;
    }

    if (!formData.monthlyBill) {
      toast({ title: "Required Field", description: "Please enter your average monthly bill.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const fullAddress = `${trimmedPin} (${pinCheck.region})`;

    try {
      const { error: fnError } = await supabase.functions.invoke(
        "send-inquiry-email",
        { body: { ...formData, address: fullAddress } }
      );
      
      if (fnError) {
        if (process.env.NODE_ENV !== 'production') {
          console.error("Submit error:", fnError);
        }
        throw new Error("Failed to submit inquiry");
      }

      const whatsappMessage = encodeURIComponent(
        `Hi, I'm interested in solar installation.\n\n` +
        `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `PIN Code: ${trimmedPin} [${pinCheck.region}]\n` +
        `Monthly Bill: ₹${formData.monthlyBill || 'Not specified'}\n` +
        `Customer Type: ${formData.customerType || 'Not specified'}\n` +
        `Message: ${formData.message || 'No additional message'}`
      );
      
      if (typeof window !== 'undefined') {
        import('posthog-js').then((ph) => {
          ph.default.capture('form_submitted', {
            form_name: 'contact_us',
            lead_type: 'contact_us',
            pincode: trimmedPin,
            region: pinCheck.region
          });
        });
        (window as any).dataLayer = (window as any).dataLayer || [];
        (window as any).dataLayer.push({
          'event': 'generate_lead',
          'form_name': 'contact_us',
          'lead_type': 'contact_us',
          'pincode': trimmedPin
        });
      }

      // Delay redirect to allow tracking scripts (PostHog/Meta) to finish in WebViews
      setTimeout(() => {
        window.location.href = `https://wa.me/918999999654?text=${whatsappMessage}`;
      }, 800);
      
      toast({
        title: "Inquiry Submitted!",
        description: "Your inquiry has been saved and sent. Our team will contact you within 24 hours."
      });
      
      setFormData({
        name: "",
        phone: "",
        pincode: "",
        monthlyBill: "",
        customerType: "",
        message: ""
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error("Submission error:", error);
      }
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi, I'm interested in solar installation for my business. Please share more details.");
    window.open(`https://wa.me/918999999654?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="py-24 bg-background border-t border-border/50 relative overflow-hidden">
      <div className="container-custom relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#133B76]/10 text-[#133B76] rounded-full px-5 py-2 mb-6 border border-[#133B76]/20">
            <Phone className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest text-[11px]">Get In Touch</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-montserrat tracking-tight">
            Ready to Go <span className="text-[#133B76]">Solar?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Get a free consultation and exact site assessment. Our engineering team will help you find the perfect solar solution for maximum ROI.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 max-w-7xl mx-auto items-center">
          
          {/* Left: Contact Info (Spans 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <h3 className="text-3xl font-bold font-montserrat mb-4 text-foreground">We'd love to hear from you</h3>
            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              Whether you have a question about solar installation, pricing, or government subsidies, our expert team is ready to answer all your questions.
            </p>
            
            <div className="space-y-8">
              <div className="flex gap-5 items-start group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-[#133B76]/10 border border-[#133B76]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#133B76] group-hover:text-white transition-colors duration-300">
                  <Phone className="w-6 h-6 text-[#133B76] group-hover:text-white transition-colors" />
                </div>
                <div className="pt-1.5">
                  <h4 className="text-sm font-bold text-foreground mb-1 font-montserrat uppercase tracking-wider">Call Us Directly</h4>
                  <a href="tel:+918999999654" className="text-accent font-bold text-lg hover:opacity-80 transition-opacity block">
                    8-999-999-654
                  </a>
                </div>
              </div>

              <div className="flex gap-5 items-start group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                  <Mail className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors" />
                </div>
                <div className="pt-1.5">
                  <h4 className="text-sm font-bold text-foreground mb-1 font-montserrat uppercase tracking-wider">Send an Email</h4>
                  <a href="mailto:sales@kailashsolar.com" className="text-muted-foreground text-lg hover:text-accent transition-colors block">
                    sales@kailashsolar.com
                  </a>
                </div>
              </div>

              <div className="flex gap-5 items-start group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-[#133B76]/10 border border-[#133B76]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#133B76] group-hover:text-white transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-[#133B76] group-hover:text-white transition-colors" />
                </div>
                <div className="pt-1.5">
                  <h4 className="text-sm font-bold text-foreground mb-1 font-montserrat uppercase tracking-wider">Visit our Office</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    62, Sec 3, Industrial Area,<br />
                    Shatabdi Nagar, Meerut,<br />
                    Uttar Pradesh - 250103
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-border/50">
              <Button onClick={openWhatsApp} className="w-full sm:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white h-14 px-8 rounded-xl text-lg font-bold transition-all shadow-none">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat on WhatsApp
              </Button>
            </div>
          </div>

          {/* Right: Form Block (Spans 7 cols) */}
          <div className="lg:col-span-7 bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-[#133B76]/5">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-full bg-[#133B76]/10 flex items-center justify-center text-[#133B76]">
                <Send className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold font-montserrat text-foreground tracking-tight">
                Request a Free Consultation
              </h3>
            </div>
            
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              onFocusCapture={() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem("kailash_modal_auto_opened", "true");
                  localStorage.setItem("kailash_modal_submitted", "true");
                }
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-bold text-sm">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#133B76] transition-colors" />
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      required 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      className="pl-12 h-14 bg-muted/50 border-border rounded-xl text-base focus-visible:ring-[#133B76]" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-bold text-sm">Phone Number</Label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 h-14 flex items-center justify-center px-4 text-muted-foreground font-bold bg-muted border border-r-0 border-border rounded-l-xl z-10 pointer-events-none">
                      +91
                    </div>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="WhatsApp Number*" 
                      required 
                      value={formData.phone} 
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, phone: val.length <= 10 ? val : val.slice(0, 10) })
                      }} 
                      className="h-14 pl-[72px] pr-4 bg-muted/50 border-border rounded-xl text-base focus-visible:ring-[#133B76] w-full relative" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-foreground font-bold text-sm">PIN Code (6 digits)*</Label>
                <div className="relative group">
                  <Input 
                    id="pincode" 
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="e.g. 250001" 
                    required 
                    value={formData.pincode} 
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setFormData({ ...formData, pincode: val });
                    }} 
                    className={`h-14 pl-4 pr-12 bg-muted/50 border rounded-xl text-base focus-visible:ring-[#133B76] transition-all ${
                      pincodeVerifier.isValid
                        ? "border-emerald-500 focus-visible:ring-emerald-500 bg-emerald-50/20" 
                        : pincodeVerifier.isInvalid
                        ? "border-destructive focus-visible:ring-destructive bg-destructive/5" 
                        : "border-border"
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                    {pincodeVerifier.isChecking && (
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    )}
                    {pincodeVerifier.isValid && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-in fade-in zoom-in-75 duration-200" />
                    )}
                    {pincodeVerifier.isInvalid && (
                      <AlertCircle className="w-5 h-5 text-destructive animate-in fade-in zoom-in-75 duration-200" />
                    )}
                  </div>
                </div>
                {pincodeVerifier.isInvalid && (
                  <div className="mt-1.5 px-3.5 py-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2 shadow-sm animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{OUTSIDE_REGION_ERROR}</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="monthlyBill" className="text-foreground font-bold text-sm">Average Monthly Bill (₹)</Label>
                  <div className="relative group">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-[#133B76] transition-colors" />
                    <Input 
                      id="monthlyBill" 
                      type="number" 
                      placeholder="e.g., 5000" 
                      value={formData.monthlyBill} 
                      onChange={e => setFormData({ ...formData, monthlyBill: e.target.value })} 
                      className="pl-12 h-14 bg-muted/50 border-border rounded-xl text-base focus-visible:ring-[#133B76]" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customerType" className="text-foreground font-bold text-sm">Customer Type</Label>
                  <Select value={formData.customerType} onValueChange={value => setFormData({ ...formData, customerType: value })}>
                    <SelectTrigger className="h-14 bg-muted/50 border-border rounded-xl text-base focus:ring-[#133B76]">
                      <div className="flex items-center">
                        <Building2 className="w-5 h-5 text-muted-foreground mr-3" />
                        <SelectValue placeholder="Select type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-bold text-sm">Additional Message (Optional)</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us more about your specific requirements..." 
                  value={formData.message} 
                  onChange={e => setFormData({ ...formData, message: e.target.value })} 
                  className="p-4 min-h-[120px] bg-muted/50 border-border rounded-xl text-base focus-visible:ring-[#133B76] resize-y" 
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || pincodeVerifier.isBlocked}
                className="w-full h-14 rounded-xl text-lg font-bold bg-[#133B76] hover:bg-[#133B76]/90 text-white transition-all duration-300 mt-4 shadow-none"
              >
                <Send className="w-5 h-5 mr-2" />
                {isSubmitting ? "Submitting Inquiry..." : "Submit Inquiry"}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;