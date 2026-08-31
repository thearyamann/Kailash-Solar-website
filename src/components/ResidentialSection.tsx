import { Home, CheckCircle2, FileCheck, IndianRupee, Sun, ShieldCheck, Award, Zap, Landmark, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import residentialHero from '@/assets/residential-1.webp';
import Link from 'next/link';

const ResidentialSection = () => {
  const steps = [
    'Free site survey & system design',
    'Registration on PM Surya Ghar national portal',
    'DISCOM liaison & net metering approvals',
    'Tier-1 panel installation & commissioning',
    'Subsidy disbursal paperwork end-to-end',
    'Free AMC support after installation',
  ];

  const subsidyTiers = [
    { size: '1 kW', central: '₹30,000', state: '₹15,000', total: '₹45,000' },
    { size: '2 kW', central: '₹60,000', state: '₹30,000', total: '₹90,000' },
    { size: '3 kW & above', central: '₹78,000', state: '₹30,000', total: '₹1,08,000' },
  ];

  return (
    <section id="residential" className="pt-16 md:pt-24 lg:pt-32 pb-8 md:pb-12 bg-gradient-to-b from-background to-secondary/40">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-4 py-2 mb-4">
            <Home className="w-5 h-5 text-accent" />
            <span className="text-accent font-semibold">Residential Solar</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Go Solar at Home Under{' '}
            <span className="text-primary">PM Surya Ghar Muft Bijli Yojana</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Get up to <strong className="text-accent">₹1,08,000 in government subsidy</strong>. As a{' '}
            <strong className="text-primary">PMSGY & UPNEDA empanelled vendor</strong>, we handle the entire
            process — from registration to subsidy disbursal — so your family enjoys free, clean power without
            the paperwork.
          </p>

          {/* Approval badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <div className="inline-flex items-center gap-2 bg-primary/5 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground text-sm">PM Surya Ghar Registered Vendor</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-primary/5 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground text-sm">UPNEDA Approved</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-primary/5 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2">
              <Sun className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground text-sm">MNRE Compliant</span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-12">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={residentialHero.src}
              alt="Residential rooftop solar installation under PM Surya Ghar Yojana"
              width={1024}
              height={768}
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-sm rounded-xl p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Save up to 90% on bills</div>
                  <div className="text-sm text-muted-foreground">Payback in 3–5 years after subsidy</div>
                </div>
              </div>
            </div>
          </div>

          {/* What we do */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-4">We handle the entire process</h3>
            <p className="text-muted-foreground mb-6">
              Going solar at home shouldn't mean weeks of paperwork. As a government-empanelled installer, we
              take care of every step.
            </p>
            <ul className="space-y-3">
              {steps.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                variant="solar"
                size="lg"
                asChild
              >
                <Link href="/quote">
                  <Home className="mr-2" />
                  Get Instant Home Quote
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <FileCheck className="mr-2" />
                Check My Subsidy
              </Button>
            </div>
          </div>
        </div>

        {/* Subsidy table */}
        <Card className="border border-border">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee className="w-6 h-6 text-accent" />
              <h3 className="text-xl md:text-2xl font-bold text-foreground">
                PM Surya Ghar Yojana Subsidy (Central + UP State)
              </h3>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              Combined Government of India + UPNEDA state subsidy for residential rooftop systems in Uttar
              Pradesh. Disbursed directly to your bank account after commissioning.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="py-3 px-2 font-bold text-foreground">System Size</th>
                    <th className="py-3 px-2 font-bold text-foreground">Central Subsidy</th>
                    <th className="py-3 px-2 font-bold text-foreground">UP State Subsidy</th>
                    <th className="py-3 px-2 font-bold text-accent">Total Subsidy</th>
                  </tr>
                </thead>
                <tbody>
                  {subsidyTiers.map((tier) => (
                    <tr key={tier.size} className="border-b border-border last:border-0">
                      <td className="py-3 px-2 font-semibold text-foreground">{tier.size}</td>
                      <td className="py-3 px-2 text-foreground">{tier.central}</td>
                      <td className="py-3 px-2 text-foreground">{tier.state}</td>
                      <td className="py-3 px-2 font-bold text-accent">{tier.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              * Subsidy applicable to households in Uttar Pradesh under PM Surya Ghar Muft Bijli Yojana.
            </p>
          </CardContent>
        </Card>

        {/* Financing highlight */}
        <Card className="mt-8 border-accent/30 bg-gradient-to-r from-accent/5 to-background">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <Landmark className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">100% Solar Finance Available</h3>
                  <p className="text-muted-foreground text-sm">Get your rooftop solar installed with zero upfront cost</p>
                </div>
              </div>
              <div className="flex items-center gap-6 md:ml-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-accent font-bold text-2xl">
                    <TrendingDown className="w-5 h-5" />
                    6%
                  </div>
                  <div className="text-xs text-muted-foreground">Interest Rate</div>
                </div>
                <div className="h-10 w-px bg-border hidden md:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹0</div>
                  <div className="text-xs text-muted-foreground">Upfront Cost</div>
                </div>
                <div className="h-10 w-px bg-border hidden md:block" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">Easy</div>
                  <div className="text-xs text-muted-foreground">EMI Options</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ResidentialSection;
