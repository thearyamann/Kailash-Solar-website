"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Calculator, Sun, IndianRupee, Leaf, Zap, Loader2, BatteryCharging, ShieldCheck, CheckCircle2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "@/assets/kailash-logo.png";
import { QuoteActionModal } from "@/components/QuoteActionModal";

interface CalculatorResults {
  systemSize: number;
  totalCost: number;
  subsidy: number;
  netCost: number;
  monthlyGeneration: number;
  yearlySavings: number;
  paybackPeriod: number;
  co2Reduction: number;
  phase: string;
  spaceRequired: number;
}

export default function QuotePage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const generateResults = (systemSize: number, type: string): CalculatorResults => {
    const ELECTRICITY_COST = 7.5;
    
    const totalCost = type === 'residential' ? (50000 + systemSize * 50000) : (systemSize * 45000);
    const subsidy = type === 'residential' ? (systemSize >= 3 ? 108000 : systemSize * 30000 + 15000) : 0;
    const netCost = totalCost - subsidy;
    
    const dailyGeneration = systemSize * 4; 
    const monthlyGeneration = dailyGeneration * 30;
    const monthlySavings = monthlyGeneration * ELECTRICITY_COST;
    const yearlySavings = monthlySavings * 12;
    
    const paybackPeriod = netCost / yearlySavings;
    const co2Reduction = (dailyGeneration * 365 * 0.82) / 1000; 
    const spaceRequired = systemSize * 100; // 100 sq ft per kW
    const phase = systemSize > 5 ? "Three Phase" : "Single Phase";

    return {
      systemSize,
      totalCost,
      subsidy,
      netCost,
      monthlyGeneration,
      yearlySavings,
      paybackPeriod,
      co2Reduction,
      phase,
      spaceRequired
    };
  };

  const getInitialUrlState = () => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const kwParam = searchParams.get('kw');
      if (kwParam) {
        const systemSize = parseFloat(kwParam);
        if (!isNaN(systemSize) && systemSize > 0) {
          const savedType = localStorage.getItem("kailash_customerType") || "residential";
          return { step: "results" as const, results: generateResults(systemSize, savedType) };
        }
      }
    }
    return { step: "input" as const, results: null };
  };

  const [step, setStep] = useState<"input" | "calculating" | "results">("input");
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [monthlyBill, setMonthlyBill] = useState("");
  const [customerType, setCustomerType] = useState("residential");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved progress and handle URL params
  useEffect(() => {
    const savedBill = localStorage.getItem("kailash_monthlyBill");
    if (savedBill) setMonthlyBill(savedBill);
    const savedType = localStorage.getItem("kailash_customerType");
    if (savedType) setCustomerType(savedType);

    const initialState = getInitialUrlState();
    if (initialState.step === "results") {
      setStep("results");
      setResults(initialState.results);
    }
    
    setIsInitialized(true);
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem("kailash_monthlyBill", monthlyBill);
  }, [monthlyBill]);

  useEffect(() => {
    localStorage.setItem("kailash_customerType", customerType);
  }, [customerType]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!monthlyBill) {
      toast({ title: "Please enter your monthly bill" });
      return;
    }

    setStep("calculating");

    setTimeout(() => {
      const bill = parseFloat(monthlyBill);
      const systemSize = Math.max(1, Math.ceil(bill / 1500));
      
      setResults(generateResults(systemSize, customerType));
      setStep("results");
      
      // Update URL to reflect system size, e.g., ?kw=5kw
      if (typeof window !== 'undefined') {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('kw', `${systemSize}kw`);
        window.history.replaceState({}, '', newUrl.toString());
      }
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-[100dvh] overflow-hidden bg-background flex flex-col">
      
      {/* Container - Full screen on mobile AND desktop */}
      <div className="w-full h-[100dvh] bg-card flex flex-col md:flex-row">
        
        {/* Left Panel - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex md:w-5/12 relative bg-primary flex-col justify-center p-12 lg:p-20 text-primary-foreground overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img src="/Happyfamily.png" alt="Happy family with solar" className="w-full h-full object-cover object-[55%_10%]" fetchPriority="high" />
            <div className="absolute inset-0 bg-slate-900/20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 -translate-y-8">
            <Link href="/" className="inline-block mb-10 bg-white px-5 py-3 rounded-2xl shadow-xl">
              <img src={logo.src} alt="Kailash Solar" className="h-8 md:h-10 w-auto object-contain" />
            </Link>
            <h2 className="text-4xl lg:text-5xl font-bold font-montserrat leading-tight mb-6 drop-shadow-lg text-white">
              Your Journey to Zero Electricity Bills.
            </h2>
            <p className="text-white/95 font-medium leading-relaxed text-lg lg:text-xl mb-10 drop-shadow-md">
              Discover how much you can save by switching to solar. Get an instant, highly accurate estimate of your system size, cost, and government subsidies.
            </p>
            
            <div className="space-y-5 text-lg text-white drop-shadow-md font-medium">
              <div className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-accent mr-4 drop-shadow-sm" />
                <span>Instant ROI & Payback analysis</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-accent mr-4 drop-shadow-sm" />
                <span>Real-time PM Surya Ghar Subsidy</span>
              </div>
              <div className="flex items-center">
                <CheckCircle2 className="w-6 h-6 text-accent mr-4 drop-shadow-sm" />
                <span>No hidden costs or obligations</span>
              </div>
            </div>
            
            {/* Desktop Call Box */}
            <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 self-start">
              <p className="text-white/80 font-medium text-sm mb-1.5">Questions? Talk to an expert</p>
              <a href="tel:+918999999654" className="flex items-center text-white text-2xl md:text-3xl font-bold font-montserrat hover:text-accent transition-colors">
                <Phone className="w-6 h-6 md:w-7 md:h-7 mr-3 text-accent" />
                8-999-999-654
              </a>
            </div>
          </div>
        </div>

        {/* Right Panel - Mobile App View / Desktop Form View */}
        <div className="w-full md:w-7/12 flex flex-col h-[100dvh] relative">
          
          {/* Native App Header (Mobile Only) */}
          <div className="md:hidden sticky top-0 z-50 bg-card border-b border-border/40 px-4 h-14 flex items-center justify-between shadow-sm shrink-0">
            {step === "input" ? (
              <Link href="/" className="flex items-center text-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-5 h-5 mr-3" />
                <span className="font-bold text-[16px]">Instant Quote</span>
              </Link>
            ) : step === "results" ? (
              <button onClick={() => setStep("input")} className="flex items-center text-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-5 h-5 mr-3" />
                <span className="font-bold text-[16px]">Your Solar Plan</span>
              </button>
            ) : (
              <div className="flex items-center text-foreground">
                <span className="font-bold text-[16px] ml-8">Analyzing...</span>
              </div>
            )}
            
            {/* Logo on the right side of mobile header */}
            <div className="flex items-center">
              <img src={logo.src} alt="Kailash Solar" className="h-9 w-auto object-contain" />
            </div>
          </div>

          {!isInitialized && (
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center mt-0 md:mt-12 h-full">
              <Loader2 className="w-10 h-10 animate-spin text-primary/60 mb-4" />
              <p className="text-muted-foreground font-medium animate-pulse">Loading your solar journey...</p>
            </div>
          )}

          {isInitialized && step === "input" && (
            <div className="flex-grow flex flex-col p-6 md:p-10 pb-32 md:pb-32 overflow-y-auto mt-0 md:mt-12">
              <div className="w-full max-w-[440px] md:max-w-[480px] mx-auto flex-grow md:flex-grow-0 flex flex-col">
                <div className="mb-8 md:mb-10">
                  <div className="md:hidden w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-[28px] md:text-[34px] leading-[1.2] font-bold font-montserrat text-foreground mb-3">
                    Calculate Your Home Solar Requirement
                  </h1>
                  <p className="text-[15px] md:text-[16px] text-muted-foreground leading-relaxed">
                    Enter your details to instantly see how much you can save, your recommended system size, and eligible govt subsidies.
                  </p>
                </div>
                
                <form onSubmit={handleCalculate} className="space-y-6 flex-grow flex flex-col">
                  <div className="space-y-5 pb-24 md:pb-0 flex-grow">
                    
                    <div className="space-y-2.5">
                      <Label className="text-[14px] md:text-[15px] font-semibold text-foreground/80">Average Monthly Electricity Bill (₹)</Label>
                      <Input 
                        type="number"
                        placeholder="e.g. 2500" 
                        required 
                        value={monthlyBill} 
                        onChange={e => setMonthlyBill(e.target.value)} 
                        className="h-[52px] md:h-[56px] px-4 bg-background border-border rounded-[12px] text-[16px]" 
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-[14px] md:text-[15px] font-semibold text-foreground/80">Property Type</Label>
                      <Select value={customerType} onValueChange={setCustomerType}>
                        <SelectTrigger className="h-[52px] md:h-[56px] px-4 bg-background border-border rounded-[12px] text-[16px]">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[12px] md:text-[16px]">
                          <SelectItem value="residential">Residential Home</SelectItem>
                          <SelectItem value="commercial">Commercial/Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2.5">
                      <Label className="text-[14px] md:text-[15px] font-semibold text-foreground/80">When are you planning to install?</Label>
                      <Select defaultValue="immediate">
                        <SelectTrigger className="h-[52px] md:h-[56px] px-4 bg-background border-border rounded-[12px] text-[16px]">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[12px] md:text-[16px]">
                          <SelectItem value="immediate">Immediately (ASAP)</SelectItem>
                          <SelectItem value="1-3months">Within 1-3 Months</SelectItem>
                          <SelectItem value="researching">Just exploring my options</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Sticky CTA Mobile / Standard Desktop */}
                  <div className="fixed md:relative bottom-0 left-0 right-0 p-4 md:p-0 bg-card border-t border-border/40 md:border-t-0 z-50 md:mt-auto md:pt-4 flex gap-3">
                    <Button 
                      type="submit" 
                      className="flex-grow h-[56px] rounded-[14px] text-[16px] font-bold shadow-lg md:shadow-none"
                    >
                      Calculate Now <Zap className="w-5 h-5 ml-2 fill-current" />
                    </Button>
                    <a 
                      href="tel:+918999999654" 
                      className="md:hidden flex-shrink-0 flex items-center justify-center w-[56px] h-[56px] rounded-[14px] bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Phone className="w-6 h-6" />
                    </a>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === "calculating" && (
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  {/* Rotating Sun */}
                  <g className="animate-[spin_4s_linear_infinite] origin-[50%_45%]">
                    <circle cx="50" cy="45" r="21" className="fill-accent" />
                    {/* 8 rays */}
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
                  
                  {/* Static Solar Panels in Foreground */}
                  <g transform="translate(0, 52)">
                    <polygon points="30,0 60,0 50,15 20,15" className="fill-primary" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    <polygon points="62,0 92,0 82,15 52,15" className="fill-primary" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    <polygon points="19,17 49,17 39,32 9,32" className="fill-primary" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                    <polygon points="51,17 81,17 71,32 41,32" className="fill-primary" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  </g>
                </svg>
              </div>
              <h2 className="text-[22px] md:text-[26px] font-bold font-montserrat mb-2">Calculating your savings...</h2>
              <p className="text-muted-foreground animate-pulse text-[15px]">Finding the best solar system for you...</p>
            </div>
          )}

          {step === "results" && results && (
            <div className="flex-grow flex flex-col bg-slate-50/50 md:bg-white relative h-[100dvh]">
              
              <div className="p-4 md:p-6 pb-32 md:pb-32 flex-grow overflow-y-auto mt-0 md:mt-12">
                <div className="w-full max-w-[440px] md:max-w-[480px] mx-auto">
                  {/* Hero Summary Card */}
                  <div className="bg-primary text-primary-foreground rounded-2xl p-5 md:p-6 mb-4 md:mb-5 relative overflow-hidden shadow-lg border border-primary/10">
                    <div className="absolute right-6 top-6 opacity-10"><Sun className="w-20 h-20 md:w-28 md:h-28" /></div>
                    
                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <h2 className="text-[14px] md:text-[15px] font-medium text-primary-foreground/90 mb-1">Recommended System</h2>
                        <div className="text-[40px] md:text-[48px] font-bold leading-none mb-1 tracking-tight">{results.systemSize} <span className="text-[18px] md:text-[22px] font-medium opacity-80">kW</span></div>
                        <p className="text-[13px] md:text-[14px] text-accent font-medium">{results.phase} Connection Required</p>
                      </div>
                    </div>
                  </div>

                  {/* Grid Stats */}
                  <div className="grid grid-cols-2 gap-2.5 md:gap-3 mb-4 md:mb-5">
                    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                      <IndianRupee className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mb-1.5 md:mb-2" />
                      <p className="text-[11px] md:text-[12px] text-slate-500 font-medium mb-0.5 uppercase tracking-wider">Yearly Savings</p>
                      <p className="text-[16px] md:text-[20px] font-bold text-slate-900">{formatCurrency(results.yearlySavings)}</p>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                      <BatteryCharging className="w-4 h-4 md:w-5 md:h-5 text-blue-500 mb-1.5 md:mb-2" />
                      <p className="text-[11px] md:text-[12px] text-slate-500 font-medium mb-0.5 uppercase tracking-wider">Est. Generation</p>
                      <p className="text-[16px] md:text-[20px] font-bold text-slate-900">{results.monthlyGeneration.toLocaleString()} units/mo</p>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                      <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-accent mb-1.5 md:mb-2" />
                      <p className="text-[11px] md:text-[12px] text-slate-500 font-medium mb-0.5 uppercase tracking-wider">Payback Time</p>
                      <p className="text-[16px] md:text-[20px] font-bold text-slate-900">{results.paybackPeriod.toFixed(1)} Years</p>
                    </div>
                    <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200 shadow-sm">
                      <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-500 mb-1.5 md:mb-2" />
                      <p className="text-[11px] md:text-[12px] text-slate-500 font-medium mb-0.5 uppercase tracking-wider">Space Needed</p>
                      <p className="text-[16px] md:text-[20px] font-bold text-slate-900">{results.spaceRequired} sq ft</p>
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <h3 className="font-bold text-[15px] md:text-[16px] mb-2 md:mb-3 text-slate-800 px-1">Investment Breakdown</h3>
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 md:mb-5">
                    <div className="flex justify-between items-center p-3 md:p-4 border-b border-slate-100">
                      <span className="text-[13px] md:text-[15px] text-slate-600">Total System Cost</span>
                      <span className="font-semibold text-[13px] md:text-[15px] text-slate-900">{formatCurrency(results.totalCost)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 md:p-4 border-b border-slate-100 bg-emerald-50/30">
                      <span className="text-[13px] md:text-[15px] text-emerald-700 font-medium">Govt Subsidy</span>
                      <span className="font-bold text-[13px] md:text-[15px] text-emerald-600">
                        {results.subsidy > 0 ? `-${formatCurrency(results.subsidy)}` : "₹0 (Not Applicable)"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 md:p-4 bg-slate-50/80">
                      <span className="text-[14px] md:text-[16px] font-bold text-slate-900">Your Net Investment</span>
                      <span className="font-bold text-[16px] md:text-[20px] text-primary">{formatCurrency(results.netCost)}</span>
                    </div>
                  </div>

                  <div className="flex items-start p-3 md:p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-2">
                    <Leaf className="w-4 h-4 md:w-5 md:h-5 text-emerald-500 mr-2 md:mr-3 shrink-0 mt-0.5" />
                    <p className="text-[12px] md:text-[14px] text-emerald-800 leading-relaxed">
                      By installing this system, you will reduce your carbon footprint by <strong>{results.co2Reduction.toFixed(1)} tonnes</strong> of CO₂ every year!
                    </p>
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="fixed md:absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-white border-t border-border/50 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-50 rounded-b-2xl">
                <div className="w-full max-w-[440px] md:max-w-[480px] mx-auto">
                  <QuoteActionModal quoteData={results}>
                    <Button className="w-full h-[52px] md:h-[56px] rounded-[14px] text-[15px] md:text-[16px] font-bold shadow-lg shadow-accent/20 bg-accent hover:bg-accent/90 text-accent-foreground">
                      Book Solar Installation – No Payment Required
                    </Button>
                  </QuoteActionModal>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
