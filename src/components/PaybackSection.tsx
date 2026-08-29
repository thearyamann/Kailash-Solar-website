import { TrendingUp, Leaf, IndianRupee, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

const PaybackSection = () => {
  const highlights = [
    {
      icon: Clock,
      value: '3-5',
      unit: 'Years',
      label: 'Typical Payback Period',
      description: 'Quick return on your solar investment',
    },
    {
      icon: TrendingUp,
      value: '25%+',
      unit: 'ROI',
      label: 'Average Annual Returns',
      description: 'Better than most traditional investments',
    },
    {
      icon: IndianRupee,
      value: '70%',
      unit: 'Savings',
      label: 'Reduce Electricity Bills',
      description: 'Slash your monthly energy costs',
    },
    {
      icon: Leaf,
      value: '1000+',
      unit: 'Tonnes',
      label: 'CO₂ Reduced Annually',
      description: 'Make your business sustainable',
    },
  ];

  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-foreground/20 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary-foreground mb-6 tracking-tight">
            Solar Investment That <span className="text-accent">Pays For Itself</span>
          </h2>
          <p className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed font-light">
            Whether it's a 3 kW home rooftop under PM Surya Ghar Yojana or a multi-MW industrial plant, solar offers exceptional returns with minimal risk.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-md border border-white/10 p-8 text-center group hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 rounded-2xl shadow-none"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent/40 transition-all duration-300">
                <item.icon className="w-8 h-8 text-accent group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-3">
                <span className="text-4xl lg:text-5xl font-bold text-primary-foreground tracking-tight">{item.value}</span>
                <span className="text-lg lg:text-xl text-accent font-semibold">{item.unit}</span>
              </div>
              <h3 className="text-primary-foreground font-semibold mb-2 text-lg">{item.label}</h3>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">{item.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PaybackSection;
