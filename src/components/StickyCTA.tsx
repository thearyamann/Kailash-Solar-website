"use client";
import { useState, useEffect } from "react";
import { MessageCircle, Phone, ArrowUp, Calculator, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openWhatsApp = () => {
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "whatsapp_click",
      });
    }

    const message = encodeURIComponent("Hi, I'm interested in solar installation. Please share more details.");
    window.open(`https://wa.me/918999999654?text=${message}`, "_blank");
  };

  return (
    <>
      {/* Floating Action Buttons (Desktop Only) */}
      <div
        className={`hidden md:flex fixed right-4 bottom-4 z-50 flex-col gap-3 transition-all duration-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 text-foreground" />
        </button>

        {/* WhatsApp */}
        <button
          onClick={openWhatsApp}
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#128C7E] transition-colors animate-float shadow-xl shadow-[#25D366]/20"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      </div>

      {/* Premium App-style Floating Bottom Bar (Mobile Only) */}
      <div
        className={`fixed left-4 right-4 z-50 md:hidden transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-[150%] opacity-0"
        }`}
        style={{ bottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        <div className="bg-white border border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] p-1.5 flex items-center justify-between">
          
          <div className="flex items-center gap-5 sm:gap-6 px-3">
            <button onClick={scrollToTop} className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-90">
              <Home className="w-[22px] h-[22px]" />
            </button>

            <Link href="/quote" className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all active:scale-90">
              <Calculator className="w-[22px] h-[22px]" />
            </Link>

            <button onClick={openWhatsApp} className="flex items-center justify-center w-10 h-10 rounded-full text-[#1da851] hover:text-[#20bd5a] hover:bg-green-50 transition-all active:scale-90 relative">
              <MessageCircle className="w-[22px] h-[22px]" />
            </button>
          </div>

          <Link 
            href="/book-visit"
            className="h-[46px] bg-[#133B76] hover:bg-[#0f3060] text-white rounded-[1.5rem] px-4 sm:px-6 flex items-center whitespace-nowrap flex-shrink-0 justify-center gap-2 font-bold text-sm transition-transform active:scale-95"
            aria-label="Book a Site Visit"
            onClick={() => {
              if (typeof window !== 'undefined') {
                (window as any).dataLayer = (window as any).dataLayer || [];
                (window as any).dataLayer.push({
                  event: 'sticky_book_visit_click'
                });
              }
            }}
          >
            Book Visit
          </Link>
          
        </div>
      </div>
    </>
  );
};

export default StickyCTA;
