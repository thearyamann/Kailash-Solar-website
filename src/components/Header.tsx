"use client";
import { useState, useEffect } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/kailash-logo.png";

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Setting target to March 31, 2027
    const targetDate = new Date('2027-03-31T23:59:59').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  return (
    <>
      {/* Desktop View: Fancy Boxes */}
      <div className="hidden md:flex items-center gap-1 ml-3 lg:ml-5 shrink-0">
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-100 rounded-[4px] px-2 py-1 min-w-[36px] shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
          <span className="text-[12px] font-black pt-[4px] font-mono leading-none tracking-widest text-[#194A94]">{formatNum(timeLeft.days)}</span>
          <span className="text-[6px] tracking-widest uppercase text-[#194A94]/70 -mt-[1px] font-bold">Days</span>
        </div>
        <span className="text-[12px] font-bold text-white/60 animate-pulse pb-1 drop-shadow-md">:</span>
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-100 rounded-[4px] px-2 py-1 min-w-[36px] shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
          <span className="text-[12px] font-black pt-[4px] font-mono leading-none tracking-widest text-[#194A94]">{formatNum(timeLeft.hours)}</span>
          <span className="text-[6px] tracking-widest uppercase text-[#194A94]/70 -mt-[1px] font-bold">Hrs</span>
        </div>
        <span className="text-[12px] font-bold text-white/60 animate-pulse pb-1 drop-shadow-md">:</span>
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-100 rounded-[4px] px-2 py-1 min-w-[36px] shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
          <span className="text-[12px] font-black pt-[4px] font-mono leading-none tracking-widest text-[#194A94]">{formatNum(timeLeft.mins)}</span>
          <span className="text-[6px] tracking-widest uppercase text-[#194A94]/70 -mt-[1px] font-bold">Min</span>
        </div>
        <span className="text-[12px] font-bold text-white/60 animate-pulse pb-1 drop-shadow-md">:</span>
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#FFAE00] to-[#E69D00] rounded-[4px] px-2 py-1 min-w-[36px] shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
          <span className="text-[12px] font-black pt-[4px] font-mono leading-none tracking-widest text-white">{formatNum(timeLeft.secs)}</span>
          <span className="text-[6px] tracking-widest uppercase text-white/90 -mt-[1px] font-bold">Sec</span>
        </div>
      </div>

      {/* Mobile View: Sleek Inline Pill */}
      <div className="md:hidden flex items-center ml-2 text-[10px] shrink-0 bg-black/20 px-2 py-[2px] rounded-full border border-white/10 shadow-inner">
        <span className="text-white flex items-center gap-[3px]">
          <span className="text-accent font-black tracking-widest font-mono text-[11px]">{formatNum(timeLeft.days)}</span><span className="text-white/70 text-[7px] font-bold uppercase mr-1">D</span>
          <span className="text-white/40 animate-pulse pb-0.5">:</span>
          <span className="text-accent font-black tracking-widest font-mono text-[11px]">{formatNum(timeLeft.hours)}</span><span className="text-white/70 text-[7px] font-bold uppercase mr-1">H</span>
          <span className="text-white/40 animate-pulse pb-0.5">:</span>
          <span className="text-accent font-black tracking-widest font-mono text-[11px]">{formatNum(timeLeft.mins)}</span><span className="text-white/70 text-[7px] font-bold uppercase mr-1">M</span>
          <span className="text-white/40 animate-pulse pb-0.5">:</span>
          <span className="text-accent font-black tracking-widest font-mono text-[11px]">{formatNum(timeLeft.secs)}</span><span className="text-white/70 text-[7px] font-bold uppercase">S</span>
        </span>
      </div>
    </>
  );
};
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const navLinks = [
    { href: "/#residential", label: "Home Solar" },
    { href: "/#services", label: "Services" },
    { href: "/#calculator", label: "Calculator" },
    { href: "/blog/pm-surya-ghar-subsidy-meerut", label: "Blogs", external: true },
    { href: "/#about", label: "About Us" },
    { href: "/#contact", label: "Contact" },
  ];
  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 border-b border-white/10">
        <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0 text-sm">
          <div className="hidden md:flex items-center gap-6">
            <a href="tel:+918999999654" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone size={14} />
              <span>+91 8999999654</span>
            </a>
            <a
              href="mailto:sales@kailashsolar.com"
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <Mail size={14} />
              <span>sales@kailashsolar.com</span>
            </a>
          </div>

          <div className="flex items-center justify-center w-full md:w-auto text-xs py-1 md:py-0 relative min-h-[28px]">
            {/* Desktop Static Badge */}
            <div className="hidden md:flex items-center">
              <span className="bg-accent text-accent-foreground font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px] mr-2 shadow-sm">
                Alert
              </span>
              <span className="font-medium text-primary-foreground">
                ₹1,08,000 PM Surya Ghar Subsidy ends March 2027. <span className="text-accent font-bold ml-1">Claim fast!</span>
              </span>
              <Countdown />
            </div>

            {/* Mobile Continuous Edge-to-Edge Marquee */}
            <div className="md:hidden absolute inset-0 -mx-4 w-[100vw] overflow-hidden flex items-center">
              <div className="flex items-center w-max animate-marquee">
                {/* Copy 1 */}
                <div className="flex items-center whitespace-nowrap px-4">
                  <span className="bg-accent text-accent-foreground font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px] mr-2 shadow-sm">
                    Alert
                  </span>
                  <span className="font-medium text-primary-foreground">
                    ₹1,08,000 PM Surya Ghar Subsidy ends March 2027. <span className="text-accent font-bold ml-1">Claim fast!</span>
                  </span>
                  <Countdown />
                </div>
                {/* Copy 2 */}
                <div className="flex items-center whitespace-nowrap px-4">
                  <span className="bg-accent text-accent-foreground font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider text-[10px] mr-2 shadow-sm">
                    Alert
                  </span>
                  <span className="font-medium text-primary-foreground">
                    ₹1,08,000 PM Surya Ghar Subsidy ends March 2027. <span className="text-accent font-bold ml-1">Claim fast!</span>
                  </span>
                  <Countdown />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-card ${isScrolled ? "border-b border-border shadow-sm" : ""}`}
      >
        <div className="container-custom">
          <nav className={`flex items-center justify-between transition-all duration-500 ease-out ${isScrolled ? "h-14 md:h-16 lg:h-16" : "h-16 md:h-20"}`}>
            {/* Logo */}
            <a href="/" className={`flex-shrink-0 transition-transform duration-500 ease-out origin-left ${isScrolled ? "scale-75 md:scale-90" : "scale-100"}`}>
              <img src={logo.src} alt="Kailash Solar - Top Solar Panel Installers in Meerut UP" width={200} height={56} className="h-14 w-auto object-contain border-0" fetchPriority="high" decoding="async" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-foreground/80 hover:text-primary font-medium transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Free Quote
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border animate-fade-in">
            <div className="container-custom py-4 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block py-2 text-foreground/80 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button 
                variant="hero" 
                className="w-full mt-4"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Free Quote
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
export default Header;
