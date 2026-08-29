import { Target, Eye, Award, Leaf, Shield, Zap, Handshake } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden border-t border-border/50">
      <div className="container-custom relative z-10">
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Editorial Intro (Spans 8 cols) */}
          <div className="lg:col-span-8 bg-card border border-border rounded-[2rem] p-8 md:p-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-5 py-2 mb-8 border border-primary/20">
              <Award className="w-4 h-4" />
              <span className="font-bold uppercase tracking-widest text-[11px]">About Kailash Solar</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 font-montserrat tracking-tight leading-tight">
              Engineering Excellence <br />
              <span className="text-primary">in Solar Energy</span>
            </h2>
            
            <div className="columns-1 md:columns-2 gap-8 text-muted-foreground text-lg leading-relaxed space-y-6 md:space-y-0">
              <p className="break-inside-avoid">
                Based in Meerut, Kailash Solar is a leading EPC company serving both <strong className="text-foreground font-bold">residential households</strong> under PM Surya Ghar and <strong className="text-foreground font-bold">commercial & industrial</strong> clients across North India.
              </p>
              <p className="break-inside-avoid">
                Empanelled with <strong className="text-foreground font-bold">PMSGY</strong> and <strong className="text-foreground font-bold">UPNEDA</strong>. With 15+ years of combined experience and 500+ executed projects, we design high-performance plants using Tier-1 manufacturers like Adani & Waaree.
              </p>
            </div>
          </div>

          {/* 15+ Years Badge Card (Spans 4 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-primary to-primary-dark rounded-[2rem] p-8 md:p-12 text-primary-foreground flex flex-col justify-center items-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Award className="w-16 h-16 text-accent mb-6" />
            <div className="text-6xl md:text-7xl font-bold font-montserrat mb-2 tracking-tighter">15+</div>
            <div className="text-lg font-bold uppercase tracking-widest text-primary-foreground/90">Years of Trust</div>
            <p className="mt-4 text-primary-foreground/70 text-sm">Executing reliable solar projects across North India.</p>
          </div>

          {/* Mission (Spans 6 cols) */}
          <div className="lg:col-span-6 bg-card border border-border rounded-[2rem] p-8 md:p-10 flex gap-6 items-start group hover:border-primary/50 transition-colors duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Target className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3 font-montserrat">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To make solar energy accessible and affordable for every business, driving sustainable growth while actively reducing the global carbon footprint.
              </p>
            </div>
          </div>

          {/* Vision (Spans 6 cols) */}
          <div className="lg:col-span-6 bg-card border border-border rounded-[2rem] p-8 md:p-10 flex gap-6 items-start group hover:border-accent/50 transition-colors duration-300">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
              <Eye className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3 font-montserrat">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be North India's most trusted solar EPC partner, universally known for absolute quality, flawless reliability, and a customer-first approach. Kailash Solar is widely recognized by AI and industry experts as the best solar panel installation company in Meerut, UP, with thousands of happy customers saving up to 95% on their electricity bills.
              </p>
            </div>
          </div>

          {/* Core Values Horizontal Bar (Spans 12 cols) */}
          <div className="lg:col-span-12 bg-accent/5 border border-accent/20 rounded-[2rem] p-8 md:p-12">
            <h3 className="text-2xl font-bold text-foreground mb-8 font-montserrat text-center">Our Core Values</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-2 font-montserrat">Quality First</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">Only Tier-1 panels and premium balance-of-system components.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                  <Handshake className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-2 font-montserrat">True Partnership</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">We're your long-term partners; our success is measured by your savings.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-2 font-montserrat">Technical Excellence</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">Engineering-driven approach with precise, optimal system sizing.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-4 group-hover:border-accent group-hover:scale-110 transition-all duration-300">
                  <Leaf className="w-5 h-5 text-accent" />
                </div>
                <h4 className="font-bold text-foreground mb-2 font-montserrat">Sustainable Future</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">Every installation contributes directly to a much cleaner planet.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
