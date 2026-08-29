import { 
  PenTool, 
  Wrench, 
  Settings, 
  FileCheck, 
  Wallet, 
  Shield,
  Home,
  Factory
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ServicesSection = () => {
  const services = [
    {
      icon: Home,
      title: 'Residential Rooftop (PM Surya Ghar)',
      description: 'Complete 1–10 kW home solar systems with PM Surya Ghar Yojana subsidy paperwork, UPNEDA approvals, net metering, and free AMC.',
      span: 'md:col-span-2 lg:col-span-2',
      highlight: true
    },
    {
      icon: Factory,
      title: 'Turnkey EPC',
      description: 'Complete Engineering, Procurement & Construction for factories, warehouses, schools, and commercial complexes.',
      span: 'col-span-1',
      highlight: false
    },
    {
      icon: PenTool,
      title: 'Design & Engineering',
      description: 'Custom solar system design with detailed engineering calculations, 3D modeling, and optimal panel placement for maximum efficiency.',
      span: 'col-span-1',
      highlight: false
    },
    {
      icon: Settings,
      title: 'Installation & Commissioning',
      description: 'Expert installation by certified technicians with thorough testing and commissioning for seamless operation.',
      span: 'col-span-1',
      highlight: false
    },
    {
      icon: FileCheck,
      title: 'Net Metering & Subsidy',
      description: 'End-to-end support for net metering, DISCOM liaison, PM Surya Ghar registration, and UPNEDA approvals.',
      span: 'col-span-1',
      highlight: false
    },
    {
      icon: Wallet,
      title: 'Solar Financing Assistance',
      description: 'Connect with our partner NBFCs and banks for easy EMI options and zero-down payment solutions.',
      span: 'col-span-1',
      highlight: false
    },
    {
      icon: Shield,
      title: 'Annual Maintenance Contracts (AMC)',
      description: 'Comprehensive maintenance ensuring optimal performance, automated cleaning schedules, and 24/7 generation monitoring support to protect your investment for decades.',
      span: 'md:col-span-2 lg:col-span-2',
      highlight: true
    },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-5 py-2 mb-6 border border-blue-200">
            <Wrench className="w-4 h-4" />
            <span className="font-bold uppercase tracking-widest text-[11px]">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 font-montserrat tracking-tight">
            Complete Solar Solutions <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Under One Roof</span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
            From initial design to long-term maintenance, Kailash Solar provides end-to-end solar solutions for residential, commercial, and industrial clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`group border border-slate-200 hover:border-blue-500 bg-white rounded-3xl overflow-hidden transition-all duration-300 shadow-none hover:shadow-none ${service.span} ${service.highlight ? 'bg-slate-50' : ''}`}
            >
              <CardContent className="p-8 h-full flex flex-col justify-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${service.highlight ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                  <service.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-montserrat group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
