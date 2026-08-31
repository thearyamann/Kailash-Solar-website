"use client";

import { useState } from 'react';
import { ArrowRight, FileText, Calculator, Home, User, Sun, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookVisitModal } from '@/components/BookVisitModal';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const [isNavigatingToQuote, setIsNavigatingToQuote] = useState(false);
  const router = useRouter();
  
  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsNavigatingToQuote(true);
    setTimeout(() => {
      router.push('/quote');
    }, 1500);
  };

  return (
    <section id="hero" className="relative min-h-[100vh] lg:min-h-[85vh] flex flex-col justify-center overflow-hidden pb-12 lg:pb-0">
      {/* Auto-opening modal timer for page visit */}
      <BookVisitModal autoOpenDelay={3500} />

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <video
          src="/herosection.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-[90%_top] lg:object-top"
        />
        <div className="absolute inset-0 bg-solar-gradient-hero" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 lg:h-1/2 bg-gradient-to-t from-black/90 via-black/40 lg:via-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 relative z-30 pt-28 pb-12 lg:pt-20 lg:pb-36 flex-grow flex flex-col justify-center">
        <div className="max-w-full md:max-w-4xl lg:max-w-5xl">

          {/* Main Headline */}
          <h1 
            className="text-[42px] leading-[1.15] sm:text-5xl md:text-5xl lg:text-6xl font-montserrat font-bold text-primary-foreground mb-6 animate-fade-up tracking-tighter sm:tracking-tight drop-shadow-lg" 
            style={{ animationDelay: '0.1s' }}
          >
            Solar Panels. <br />
            Save 95% on Bills. <br />
            <span className="text-accent drop-shadow-sm">Guaranteed.</span>
          </h1>

          {/* Subtext */}
          <h2 
            className="text-base sm:text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed animate-fade-up max-w-2xl font-normal" 
            style={{ animationDelay: '0.2s' }}
          >
            Expert solar for Meerut homes & businesses. Claim your PM Surya Ghar: Muft Bijli Yojana subsidy and enjoy decades of almost free power.
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <BookVisitModal>
                <Button 
                  variant="hero" 
                  className="group h-14 px-8 w-full sm:w-auto text-base"
                >
                  Get a Free Site Visit
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </BookVisitModal>
              <Button 
                variant="hero" 
                className="group h-14 px-8 w-full sm:w-auto text-base"
                onClick={handleQuoteClick}
              >
                <FileText className="mr-2 w-5 h-5 text-white" />
                Instant Home Solar Quote
              </Button>
            </div>
            <div>
              <Button 
                variant="heroOutline" 
                className="group h-12 px-6 w-full sm:w-auto"
                asChild
              >
                <a href="#calculator">
                  <Calculator className="mr-2 w-4 h-4" />
                  Calculate Your Savings
                </a>
              </Button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Reference Design: Large Integrated Feature Blocks & Trust Card */}
      <div className="relative lg:absolute lg:bottom-12 w-full px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 z-20 animate-fade-in mt-8 lg:mt-0" style={{ animationDelay: '0.6s' }}>
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between w-full gap-10 lg:gap-8">
          
          {/* Left Side: Logos */}
          <div className="grid grid-cols-3 md:flex md:flex-row items-start md:items-center justify-items-center md:justify-start gap-2 md:gap-6 lg:gap-10 w-full lg:w-auto">
            
            {/* Block 1: PM Surya Ghar Vendor */}
            <div className="flex flex-col md:flex-row items-center justify-end md:justify-start gap-1.5 md:gap-4 text-center md:text-left w-full md:w-auto h-full">
              <div className="h-14 md:h-auto flex items-end justify-center">
                <img src="/pmsurya.webp" alt="PM Surya Ghar Vendor" className="h-9 md:h-8 lg:h-10 w-auto object-contain brightness-0 invert flex-shrink-0" />
              </div>
              <div className="hidden md:block w-[1px] h-8 lg:h-10 bg-white/20" />
              <div className="flex flex-col justify-center">
                <h4 className="text-white font-bold text-[11px] sm:text-[10px] lg:text-sm tracking-wide drop-shadow-md leading-tight mb-0.5">PM Surya Ghar<br/>Vendor</h4>
              </div>
            </div>

            {/* Block 2: MNRE */}
            <div className="flex flex-col md:flex-row items-center justify-end md:justify-start gap-1.5 md:gap-4 text-center md:text-left w-full md:w-auto h-full">
              <div className="h-14 md:h-auto flex items-end justify-center">
                <img src="/mnre-logo.svg" alt="MNRE" className="h-9 md:h-8 lg:h-10 w-auto object-contain brightness-0 invert flex-shrink-0" />
              </div>
              <div className="hidden md:block w-[1px] h-8 lg:h-10 bg-white/20" />
              <div className="flex flex-col justify-center">
                <h4 className="text-white font-bold text-[11px] sm:text-[10px] lg:text-sm tracking-wide drop-shadow-md leading-tight mb-0.5">MNRE<br/>Approved</h4>
              </div>
            </div>

            {/* Block 3: UPNEDA */}
            <div className="flex flex-col md:flex-row items-center justify-end md:justify-start gap-0 md:gap-4 text-center md:text-left w-full md:w-auto h-full">
              <div className="h-14 md:h-auto flex items-end justify-center">
                <img src="/upneda-white.png" alt="UPNEDA Approved" className="h-14 md:h-14 lg:h-20 w-auto object-contain flex-shrink-0 -mb-2 md:mb-0" />
              </div>
              <div className="hidden md:block w-[1px] h-8 lg:h-10 bg-white/20" />
              <div className="flex flex-col justify-center">
                <h4 className="text-white font-bold text-[11px] sm:text-[10px] lg:text-sm tracking-wide drop-shadow-md leading-tight mb-0.5">UPNEDA<br/>Approved</h4>
              </div>
            </div>

          </div>

          {/* Right Side: Trust Card */}
          <div className="flex flex-col bg-black/50 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-2xl p-5 lg:p-6 w-full sm:max-w-[320px] transition-all duration-300 group">
            
            {/* Top Row: Stat */}
            <div className="flex items-center gap-6 lg:gap-8">
              
              {/* Overlapping Icons */}
              <div className="flex items-center -space-x-3">
                <img src="/avatar1.jpg" alt="Customer" className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-white/10 object-cover z-30 shadow-lg" />
                <img src="/avatar2.jpg" alt="Customer" className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-white/10 object-cover z-20 shadow-lg" />
                <img src="/avatar3.jpg" alt="Customer" className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-white/10 object-cover z-10 shadow-lg" />
              </div>

              <div>
                <div className="text-2xl lg:text-3xl font-bold font-montserrat text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 leading-none mb-1">
                  500+
                </div>
                <div className="text-accent text-[10px] tracking-[0.2em] uppercase font-bold">
                  Homes & factories powered
                </div>
              </div>

            </div>

            {/* Divider - Highly Visible */}
            <div className="w-full h-[1px] bg-white/20 my-4 lg:my-5" />

            {/* Bottom Text */}
            <div className="text-white/90 text-xs lg:text-sm font-medium leading-relaxed">
              Join thousands reducing their electricity bills by up to <span className="text-white font-bold">95%</span> with Kailash Solar.
            </div>

          </div>

        </div>
      </div>

      {/* Floating Loading Overlay without white background */}
      {isNavigatingToQuote && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="relative w-24 h-24 mb-4 flex items-center justify-center animate-in zoom-in-95 duration-300">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-lg">
              <g className="animate-[spin_4s_linear_infinite] origin-[50%_45%]">
                <circle cx="50" cy="45" r="21" className="fill-accent" />
                <g className="stroke-accent" strokeWidth="3" strokeLinecap="round">
                  <line x1="50" y1="16" x2="50" y2="7" />
                  <line x1="50" y1="74" x2="50" y2="83" />
                  <line x1="79" y1="45" x2="88" y2="45" />
                  <line x1="21" y1="45" x2="12" y2="45" />
                  <line x1="70" y1="25" x2="77" y2="18" />
                  <line x1="30" y1="65" x2="23" y2="72" />
                  <line x1="30" y1="25" x2="23" y2="18" />
                  <line x1="70" y1="65" x2="77" y2="72" />
                </g>
              </g>
              <g transform="translate(0, 52)">
                <polygon points="30,0 60,0 50,15 20,15" className="fill-primary" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                <polygon points="62,0 92,0 82,15 52,15" className="fill-primary" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                <polygon points="19,17 49,17 39,32 9,32" className="fill-primary" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                <polygon points="51,17 81,17 71,32 41,32" className="fill-primary" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
        </div>
      )}
    </section>
  );
};
export default HeroSection;
