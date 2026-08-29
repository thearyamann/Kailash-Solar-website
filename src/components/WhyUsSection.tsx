import { 
  Users, 
  Handshake, 
  Award, 
  Package, 
  Clock, 
  FileText, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';

const WhyUsSection = () => {
  const reasons = [
    {
      icon: ShieldCheck,
      title: 'PMSGY & UPNEDA',
      description: 'Government-empanelled vendor under PM Surya Ghar Yojana and UP New & Renewable Energy Dev Agency.',
    },
    {
      icon: Users,
      title: 'Technical Experts',
      description: 'Our engineers bring decades of combined experience in advanced solar design and commercial installation.',
    },
    {
      icon: Handshake,
      title: 'Industry Partners',
      description: 'Direct partnerships with leading global manufacturers ensure supreme quality and highly competitive pricing.',
    },
    {
      icon: Award,
      title: 'Tier-1 Modules Only',
      description: 'We exclusively use premium, highly-efficient panels from Adani, Waaree, and other global Tier-1 manufacturers.',
    },
    {
      icon: Package,
      title: 'Premium Components',
      description: 'High-grade galvanized structures, UV-protected cables, and smart inverters designed for lasting performance.',
    },
    {
      icon: Clock,
      title: 'On-Time Execution',
      description: 'Strict project management protocols ensure your plant is delivered and commissioned within committed timelines.',
    },
    {
      icon: FileText,
      title: 'End-to-End Paperwork',
      description: 'Complete hands-free support for all government approvals, subsidies, load enhancements and net metering.',
    },
    {
      icon: Building2,
      title: 'C&I Expertise',
      description: 'From residential homes to megawatt-scale factory rooftops, we deliver proven results across every segment.',
    },
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-100 relative">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column: Sticky Header */}
          <div className="lg:w-1/3">
            <div className="sticky top-32">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent rounded-full px-4 py-2 mb-6">
                <Award className="w-4 h-4" />
                <span className="font-bold uppercase tracking-widest text-[11px]">Why Choose Us</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-montserrat tracking-tight leading-tight">
                The Kailash Solar <br />
                <span className="text-accent">Advantage</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                We're not just installers — we're your long-term solar partners, committed to engineering excellence, premium components, and maximizing your ROI.
              </p>
            </div>
          </div>

          {/* Right Column: Refined Feature List (No Cards) */}
          <div className="lg:w-2/3">
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-16">
              {reasons.map((reason, index) => (
                <div key={index} className="group relative pl-6">
                  {/* Subtle accent indicator line on hover */}
                  <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-slate-100 group-hover:bg-accent transition-colors duration-500 rounded-full" />
                  
                  <div className="mb-4">
                    <reason.icon className="w-7 h-7 text-slate-300 group-hover:text-accent transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 font-montserrat transition-colors duration-300">
                    {reason.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {reason.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Trust Badges Row */}
        <div className="mt-24 pt-16 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
            <div className="text-center group">
              <div className="text-3xl font-bold text-slate-900 mb-2 font-montserrat group-hover:text-accent transition-colors">PMSGY</div>
              <div className="text-[11px] font-bold text-slate-400 group-hover:text-accent/80 uppercase tracking-widest transition-colors">Approved Vendor</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-slate-900 mb-2 font-montserrat group-hover:text-accent transition-colors">UPNEDA</div>
              <div className="text-[11px] font-bold text-slate-400 group-hover:text-accent/80 uppercase tracking-widest transition-colors">Empanelled</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-slate-900 mb-2 font-montserrat group-hover:text-accent transition-colors">MNRE</div>
              <div className="text-[11px] font-bold text-slate-400 group-hover:text-accent/80 uppercase tracking-widest transition-colors">Compliant</div>
            </div>
            <div className="text-center group">
              <div className="text-3xl font-bold text-slate-900 mb-2 font-montserrat group-hover:text-accent transition-colors">Tier-1</div>
              <div className="text-[11px] font-bold text-slate-400 group-hover:text-accent/80 uppercase tracking-widest transition-colors">Components</div>
            </div>
            <div className="text-center group col-span-2 md:col-span-1">
              <div className="text-3xl font-bold text-slate-900 mb-2 font-montserrat group-hover:text-accent transition-colors">30 Yrs</div>
              <div className="text-[11px] font-bold text-slate-400 group-hover:text-accent/80 uppercase tracking-widest transition-colors">Performance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
