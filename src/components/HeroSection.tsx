import { ArrowRight, FileText, Calculator, Home, User, Sun, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[100vh] lg:min-h-[85vh] flex flex-col justify-center overflow-hidden pb-12 lg:pb-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <video
          src="/herosection.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-[90%_top] lg:object-top"
        />
        <div className="absolute inset-0 bg-solar-gradient-hero" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 lg:h-1/2 bg-gradient-to-t from-black/90 via-black/40 lg:via-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 relative z-10 pt-28 pb-12 lg:pt-20 lg:pb-36 flex-grow flex flex-col justify-center">
        <div className="max-w-full md:max-w-4xl lg:max-w-5xl">

          {/* Main Headline */}
          <h1 
            className="text-[42px] leading-[1.15] sm:text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold text-primary-foreground mb-6 animate-fade-up tracking-tighter sm:tracking-tight drop-shadow-lg" 
            style={{ animationDelay: '0.1s' }}
          >
            Solar Panels. <br />
            Save 95% on Bills. <span className="text-accent drop-shadow-sm">Guaranteed.</span>
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
              <Button 
                variant="hero" 
                className="group h-14 px-8 w-full sm:w-auto text-base"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get a Free Site Visit
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="hero" 
                className="group h-14 px-8 w-full sm:w-auto text-base"
                asChild
              >
                <a href="https://app.kailashsolar.com/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto justify-center group">
                  <FileText className="mr-2 w-5 h-5 text-white" />
                  Instant Home Solar Quote
                </a>
              </Button>
            </div>
            <div>
              <Button 
                variant="heroOutline" 
                className="group h-12 px-6 w-full sm:w-auto"
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calculator className="mr-2 w-4 h-4" />
                Calculate Your Savings
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
          <div className="flex flex-col bg-black/40 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] rounded-2xl p-5 lg:p-6 w-full sm:max-w-[320px] transition-all duration-300 group">
            
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

    </section>
  );
};
export default HeroSection;
