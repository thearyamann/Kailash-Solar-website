"use client";
import { useState } from 'react';
import { 
  Calculator, Sun, Zap, TrendingUp, Leaf, Share2, FileText, 
  IndianRupee, MapPin, Building2, Wallet, CalendarDays, 
  BatteryCharging, ShieldCheck, Percent, Coins 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface CalculatorResults {
  systemSize: number;
  totalCost: number;
  subsidy: number;
  netCost: number;
  monthlyGeneration: number;
  yearlyGeneration: number;
  lifetimeGeneration: number;
  monthlySavings: number;
  yearlySavings: number;
  paybackPeriod: number;
  roi: number;
  co2Reduction: number;
}

const SolarCalculator = () => {
  const { toast } = useToast();
  const [monthlyBill, setMonthlyBill] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [customerType, setCustomerType] = useState<string>('');
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalForm, setProposalForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });

  const ELECTRICITY_COST = 7.5; // ₹ per kWh
  const GENERATION_PER_KW = 4; // units per kW per day
  const CAPEX_PER_KW_RESIDENTIAL = 60000; // ₹ per kW for residential
  const CAPEX_PER_KW_COMMERCIAL = 35000; // ₹ per kW for commercial/industrial
  const DAYS_IN_YEAR = 365;
  const SYSTEM_LIFETIME = 30; // years

  const calculateSubsidy = (systemSizeKw: number): number => {
    if (customerType !== 'residential') return 0;
    if (systemSizeKw <= 1) return 30000 + 15000; // ₹45,000
    if (systemSizeKw <= 2) return 60000 + 30000; // ₹90,000
    return 78000 + 30000; // ₹1,08,000 for 3 kW & above
  };

  const calculateSolar = () => {
    if (!monthlyBill || !customerType) {
      toast({
        title: "Missing Information",
        description: "Please fill in your monthly bill and select customer type.",
        variant: "destructive",
      });
      return;
    }

    const bill = parseFloat(monthlyBill);
    const systemSize = Math.ceil(bill / 1500);
    const capexPerKw = customerType === 'residential' ? CAPEX_PER_KW_RESIDENTIAL : CAPEX_PER_KW_COMMERCIAL;
    const totalCost = systemSize * capexPerKw;
    const subsidy = calculateSubsidy(systemSize);
    const netCost = totalCost - subsidy;
    
    const dailyGeneration = systemSize * GENERATION_PER_KW;
    const monthlyGeneration = dailyGeneration * 30;
    const yearlyGeneration = dailyGeneration * DAYS_IN_YEAR;
    const lifetimeGeneration = yearlyGeneration * SYSTEM_LIFETIME;
    
    const monthlySavings = monthlyGeneration * ELECTRICITY_COST;
    const yearlySavings = monthlySavings * 12;
    
    const paybackPeriod = netCost / yearlySavings;
    const totalLifetimeSavings = yearlySavings * SYSTEM_LIFETIME;
    const roi = ((totalLifetimeSavings - netCost) / netCost) * 100;
    
    const co2Reduction = (yearlyGeneration * 0.82) / 1000; // tonnes

    setResults({
      systemSize,
      totalCost,
      subsidy,
      netCost,
      monthlyGeneration,
      yearlyGeneration,
      lifetimeGeneration,
      monthlySavings,
      yearlySavings,
      paybackPeriod,
      roi,
      co2Reduction,
    });
    
    // Update URL to reflect system size
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('kw', `${systemSize}kw`);
      window.history.pushState({}, '', newUrl.toString());
    }
  };

  const shareOnWhatsApp = () => {
    if (!results) return;
    const message = `🌞 My Solar Savings Estimate from Kailash Solar:

📊 System Size: ${results.systemSize} kW
💰 Investment: ₹${results.netCost.toLocaleString()}
${results.subsidy > 0 ? `🎁 Subsidy: ₹${results.subsidy.toLocaleString()}` : ''}
⚡ Monthly Generation: ${results.monthlyGeneration.toFixed(0)} kWh
💵 Monthly Savings: ₹${results.monthlySavings.toLocaleString()}
📈 Payback Period: ${results.paybackPeriod.toFixed(1)} years
🌱 CO₂ Reduction: ${results.co2Reduction.toFixed(1)} tonnes/year

Calculate your savings: ${window.location.href}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    import('posthog-js').then((ph) => {
      ph.default.capture('form_submitted', {
        form_name: 'solar_calculator_proposal',
        lead_type: 'proposal'
      });
    });
    toast({
      title: "Request Submitted!",
      description: "Our team will contact you within 24 hours with a detailed proposal.",
    });
    setShowProposalForm(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <section id="calculator" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-5 py-2 mb-6 border border-blue-200">
            <Calculator className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest text-[11px]">Solar Saver Calculator</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-montserrat tracking-tight">
            Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Solar Savings</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Get an instant, customized estimate of your solar investment, lifetime savings, and environmental impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Calculator Input */}
          <Card className="border border-slate-200 rounded-[2rem] overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-8">
              <CardTitle className="text-slate-800 flex items-center gap-3 text-2xl font-bold">
                <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl text-blue-600">
                  <Sun className="w-6 h-6" />
                </div>
                Enter Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="monthlyBill" className="text-slate-700 font-semibold text-sm">Average Monthly Electricity Bill (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="monthlyBill"
                    type="number"
                    placeholder="e.g., 5000"
                    value={monthlyBill}
                    onChange={(e) => setMonthlyBill(e.target.value)}
                    className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-xl text-lg focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="location" className="text-slate-700 font-semibold text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Location
                </Label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-xl text-base">
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="meerut">Meerut</SelectItem>
                    <SelectItem value="delhi">Delhi NCR</SelectItem>
                    <SelectItem value="noida">Noida / Greater Noida</SelectItem>
                    <SelectItem value="ghaziabad">Ghaziabad</SelectItem>
                    <SelectItem value="haridwar">Haridwar</SelectItem>
                    <SelectItem value="other">Other UP City</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="customerType" className="text-slate-700 font-semibold text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  Customer Type
                </Label>
                <Select value={customerType} onValueChange={setCustomerType}>
                  <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-xl text-base">
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                  </SelectContent>
                </Select>
                {customerType === 'residential' && (
                  <div className="mt-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3 animate-fade-in">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-emerald-800 font-medium leading-relaxed">
                      Eligible for PM Surya Ghar + UP state subsidy (up to <span className="font-bold">₹1,08,000</span>). Disbursed directly to your bank account.
                    </p>
                  </div>
                )}
              </div>

              <Button 
                onClick={calculateSolar} 
                className="w-full h-14 text-lg rounded-xl hover:-translate-y-0.5 transition-all bg-blue-600 hover:bg-blue-700"
              >
                <Calculator className="mr-2 w-5 h-5" />
                Calculate My Savings
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className={`border border-slate-200 rounded-[2rem] overflow-hidden transition-all duration-700 ${results ? 'opacity-100 scale-100 bg-white' : 'opacity-60 scale-[0.98] bg-slate-50/50'}`}>
            <CardHeader className={`${results ? 'bg-gradient-to-r from-blue-600 to-cyan-500' : 'bg-slate-200'} p-8 transition-colors duration-500`}>
              <CardTitle className={`flex items-center gap-3 text-2xl font-bold ${results ? 'text-white' : 'text-slate-400'}`}>
                <div className={`${results ? 'bg-white/20' : 'bg-white/50'} p-2.5 rounded-xl backdrop-blur-sm`}>
                  <TrendingUp className="w-6 h-6" />
                </div>
                Your Solar Estimate
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              {results ? (
                <div className="space-y-8 animate-fade-in">
                  {/* Primary Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Sun className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                      <div className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{results.systemSize} kW</div>
                      <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1">Recommended Size</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Wallet className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                      <div className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{formatCurrency(results.netCost)}</div>
                      <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mt-1">Net Investment</div>
                    </div>
                  </div>

                  {/* Detailed Stats */}
                  <div className="space-y-1 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center py-3 border-b border-slate-200/60 last:border border-slate-200">
                      <span className="text-slate-600 font-medium flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Available Subsidy
                      </span>
                      <span className="font-bold text-emerald-600">
                        {results.subsidy > 0 ? formatCurrency(results.subsidy) : "₹0 (Not Applicable)"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200/60 last:border border-slate-200">
                      <span className="text-slate-600 font-medium flex items-center gap-3">
                        <BatteryCharging className="w-4 h-4 text-amber-500" />
                        Monthly Generation
                      </span>
                      <span className="font-bold text-slate-800">{results.monthlyGeneration.toFixed(0)} kWh</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200/60 last:border border-slate-200">
                      <span className="text-slate-600 font-medium flex items-center gap-3">
                        <Coins className="w-4 h-4 text-cyan-500" />
                        Monthly Savings
                      </span>
                      <span className="font-bold text-slate-800">{formatCurrency(results.monthlySavings)}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200/60 last:border border-slate-200">
                      <span className="text-slate-600 font-medium flex items-center gap-3">
                        <CalendarDays className="w-4 h-4 text-indigo-500" />
                        Payback Period
                      </span>
                      <span className="font-bold text-indigo-600">{results.paybackPeriod.toFixed(1)} Years</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200/60 last:border border-slate-200">
                      <span className="text-slate-600 font-medium flex items-center gap-3">
                        <Percent className="w-4 h-4 text-violet-500" />
                        30-Year ROI
                      </span>
                      <span className="font-bold text-violet-600">{results.roi.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-200/60 last:border border-slate-200">
                      <span className="text-slate-600 font-medium flex items-center gap-3">
                        <Leaf className="w-4 h-4 text-green-500" />
                        CO₂ Reduction
                      </span>
                      <span className="font-bold text-slate-800">{results.co2Reduction.toFixed(1)} tonnes/yr</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-2">
                    <Button variant="outline" onClick={shareOnWhatsApp} className="h-12 rounded-xl font-semibold border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900">
                      <Share2 className="w-4 h-4 mr-2 text-slate-500 group-hover:text-slate-700 transition-colors" />
                      Share Estimate
                    </Button>
                    <Dialog open={showProposalForm} onOpenChange={setShowProposalForm}>
                      <DialogTrigger asChild>
                        <Button className="h-12 rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-white">
                          <FileText className="w-4 h-4 mr-2" />
                          Get Detailed Proposal
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold">Get a Detailed Proposal</DialogTitle>
                          <DialogDescription className="text-base">
                            Fill in your details and our solar engineers will send you a customized, highly accurate proposal within 24 hours.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleProposalSubmit} className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              required
                              value={proposalForm.name}
                              onChange={(e) => setProposalForm({ ...proposalForm, name: e.target.value })}
                              className="h-12 rounded-xl bg-slate-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Company Name (Optional)</Label>
                            <Input
                              id="company"
                              value={proposalForm.company}
                              onChange={(e) => setProposalForm({ ...proposalForm, company: e.target.value })}
                              className="h-12 rounded-xl bg-slate-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={proposalForm.email}
                              onChange={(e) => setProposalForm({ ...proposalForm, email: e.target.value })}
                              className="h-12 rounded-xl bg-slate-50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              required
                              value={proposalForm.phone}
                              onChange={(e) => setProposalForm({ ...proposalForm, phone: e.target.value })}
                              className="h-12 rounded-xl bg-slate-50"
                            />
                          </div>
                          <Button type="submit" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg mt-2">
                            Request Proposal
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 px-6">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to see your savings?</h3>
                  <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Enter your monthly electricity bill and location on the left to generate your instant solar estimate.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SolarCalculator;
