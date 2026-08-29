import { Wallet, FileCheck, Clock, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FinancingSection = () => {
  const features = [
    {
      icon: Wallet,
      title: 'Easy EMI Options',
      description: 'Partner with leading NBFCs for flexible payment plans starting from ₹0 down payment.',
    },
    {
      icon: Building,
      title: 'Bank Tie-ups',
      description: 'Collaborate with major banks offering competitive interest rates for solar financing.',
    },
    {
      icon: FileCheck,
      title: 'Net Metering Support',
      description: 'Complete assistance with net metering applications and DISCOM approvals.',
    },
    {
      icon: Clock,
      title: 'Fastest Documentation',
      description: 'Industry-leading turnaround time for subsidy and government approval paperwork.',
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3" />
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Content & Steps */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-5 py-2 mb-6 border border-green-200">
              <Wallet className="w-4 h-4" />
              <span className="font-bold uppercase tracking-widest text-[11px]">Financing Solutions</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-montserrat tracking-tight leading-tight">
              Affordable Solar for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Every Business</span>
            </h2>
            
            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              Don't let upfront costs hold you back. With our financing partners and complete subsidy support, going solar is easier and more profitable than ever.
            </p>

            <div className="space-y-0 mb-10 pl-2">
              <div className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-green-500 group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-slate-500 font-bold font-montserrat group-hover:text-green-600 transition-colors duration-300">01</span>
                  </div>
                  <div className="w-px h-full bg-slate-200 my-2 group-hover:bg-green-200 transition-colors duration-300 min-h-[2rem]" />
                </div>
                <div className="pb-6 pt-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-montserrat group-hover:text-green-600 transition-colors duration-300">Zero Down Payment Options</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">Start generating pure savings from day one without putting down any heavy upfront capital investment.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-green-500 group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-slate-500 font-bold font-montserrat group-hover:text-green-600 transition-colors duration-300">02</span>
                  </div>
                  <div className="w-px h-full bg-slate-200 my-2 group-hover:bg-green-200 transition-colors duration-300 min-h-[2rem]" />
                </div>
                <div className="pb-6 pt-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-montserrat group-hover:text-green-600 transition-colors duration-300">EMI Less Than Electricity Bill</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">Structurally designed so your monthly EMI payments are significantly lower than your current grid electricity bill.</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 group-hover:border-green-500 group-hover:bg-green-50 transition-colors duration-300">
                    <span className="text-slate-500 font-bold font-montserrat group-hover:text-green-600 transition-colors duration-300">03</span>
                  </div>
                </div>
                <div className="pb-2 pt-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 font-montserrat group-hover:text-green-600 transition-colors duration-300">Complete Subsidy Assistance</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">We handle all bureaucratic paperwork for PM Surya Ghar Yojana and state subsidies directly on your behalf.</p>
                </div>
              </div>
            </div>

            <Button className="h-14 px-8 rounded-xl text-lg font-semibold bg-slate-900 hover:bg-green-600 text-white transition-all duration-300 group">
              Explore Financing Options
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Column: Refined Feature Grid */}
          <div className="grid sm:grid-cols-2 gap-5 relative">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group border border-slate-200 hover:border-green-500 bg-white rounded-3xl p-7 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-5 group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 font-montserrat group-hover:text-green-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default FinancingSection;
