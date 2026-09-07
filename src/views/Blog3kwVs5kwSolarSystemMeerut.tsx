"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, ArrowRight, CheckCircle2, Phone, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Button } from '@/components/ui/button';
import { BookVisitModal } from '@/components/BookVisitModal';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

const faqs = [
  {
    q: 'Is 3kW solar enough for a home in Meerut?',
    a: 'Yes, a 3kW system is generally enough for a home with moderate electricity consumption (300-450 units/month) running standard appliances and one air conditioner.',
  },
  {
    q: 'Is 5kW solar better than 3kW?',
    a: 'It is not inherently "better"—it simply generates more power. A 5kW system is better only if your household electricity consumption is high enough (500+ units/month) to utilize the extra generation.',
  },
  {
    q: 'How do I choose between a 3kW and 5kW solar system?',
    a: 'Check your recent summer electricity bills. If you consume around 300-400 units, 3kW is likely ideal. If you consume 600+ units, a 5kW system will serve you better.',
  },
  {
    q: 'How much electricity can a 3kW solar system generate?',
    a: 'On a clear day, a 3kW system generates approximately 12 to 15 units of electricity, totaling about 360 to 450 units per month.',
  },
  {
    q: 'How much electricity can a 5kW solar system generate?',
    a: 'A 5kW system generates roughly 20 to 25 units per day, resulting in approximately 600 to 750 units per month, depending on weather and maintenance.',
  },
  {
    q: 'How much roof space does a 3kW solar system need?',
    a: 'You will need approximately 250 to 300 square feet of shadow-free roof space for a 3kW installation.',
  },
  {
    q: 'How much roof space does a 5kW solar system need?',
    a: 'A 5kW solar system requires about 450 to 500 square feet of usable, unshaded roof area.',
  },
  {
    q: 'What is the price of a 3kW solar system in Meerut?',
    a: 'The price varies based on component quality and site conditions. For the most accurate, up-to-date pricing, we recommend requesting a customized quotation after a site survey.',
  },
  {
    q: 'What is the price of a 5kW solar system in Meerut?',
    a: 'Because it requires more panels and a larger inverter, a 5kW system costs more than a 3kW system. However, the exact cost depends on your specific roof layout and chosen brands.',
  },
  {
    q: 'Is PM Surya Ghar subsidy available for 3kW and 5kW systems?',
    a: 'Yes, eligible residential consumers can apply for the PM Surya Ghar subsidy for both system sizes.',
  },
  {
    q: 'Does a 5kW system receive the same subsidy as a 3kW system?',
    a: 'Yes. The combined PM Surya Ghar and state subsidy is capped at 3kW (maximum ₹1,08,000). Therefore, a 5kW system receives the same maximum total subsidy amount as a 3kW system.',
  },
  {
    q: 'Can I increase my solar capacity later?',
    a: 'If you install a 3kW inverter, adding more panels later requires replacing the inverter. If you anticipate higher future usage, it is wise to install a 5kW inverter initially, even if you only install 3kW of panels today.',
  },
  {
    q: 'Does rooftop solar work during cloudy weather?',
    a: 'Yes, solar panels still generate electricity on cloudy days, but the generation efficiency will be lower compared to a bright, sunny day.',
  },
  {
    q: 'How does net metering work in Meerut?',
    a: 'Net metering connects your solar system to the PVVNL grid. Excess power is exported to the grid, and you draw from the grid when needed. You are billed only for the "net" difference.',
  },
  {
    q: 'Should I get a site survey before choosing a solar system?',
    a: 'Absolutely. A physical site survey is essential to verify roof space, check for shadows, assess wiring, and provide an accurate, customized quotation.',
  }
];

const CTAButton = ({ className = '', text = "Book Your Free Survey" }: { className?: string, text?: string }) => (
  <BookVisitModal>
    <Button variant="hero" size="lg" className={className}>
      {text} <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  </BookVisitModal>
);

const H2 = ({ children, id, className = "" }: { children: React.ReactNode; id?: string, className?: string }) => (
  <h2 id={id} className={`text-2xl md:text-3xl font-bold text-slate-900 mt-12 mb-6 font-montserrat scroll-mt-24 ${className}`}>
    {children}
  </h2>
);

const P = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-slate-700 leading-relaxed mb-6 text-[17px] ${className}`}>{children}</p>
);

const Blog3kwVs5kwSolarSystemMeerut = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scroll = `${totalScroll / windowHeight}`;
        setScrollProgress(Number(scroll) * 100);
      } else {
        setScrollProgress(0);
      }
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '3kW vs 5kW Solar System in Meerut',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Mobile Header (Shows only on small screens when scrolling past main header) */}
      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center justify-between transition-transform duration-300 ${scrollProgress > 2 ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link href="/blog" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <span className="font-bold text-slate-900 text-sm truncate max-w-[200px]">3kW vs 5kW System...</span>
        <button 
          onClick={handleShare}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95"
        >
          <Share2 className="w-4 h-4 text-slate-700" />
        </button>
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-primary/20 w-full">
          <div 
            className="h-full bg-primary transition-all duration-150 ease-out" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <main className="pt-0">
        {/* Hero Area */}
        <section className="bg-slate-50 pt-12 pb-12 md:pt-16 md:pb-16 border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-accent text-sm font-bold uppercase tracking-wider">
                  Solar System Guide
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 text-slate-900 font-montserrat">
                3kW vs 5kW Solar System in Meerut: Price, Subsidy & Which Is Right for You?
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Deciding between a 3kW and 5kW solar system for your Meerut home? Compare prices, PM Surya Ghar subsidy, generation, and roof space requirements.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CTAButton className="w-full sm:w-auto h-14 px-8 text-lg rounded-full" />
                <Link href="/quote" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-14 px-8 rounded-full text-lg font-bold bg-white text-primary border-2 border-primary hover:bg-slate-50 transition-colors">
                    Solar Price Calculator <TrendingUp className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <article className="container-custom py-12 md:py-20">
          <div className="grid lg:grid-cols-[1fr_320px] gap-16">
            
            {/* Main Content */}
            <div className="max-w-[800px] w-full min-w-0">
              
              <div className="bg-blue-50/50 rounded-2xl p-6 md:p-8 border border-blue-100 mb-12">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Table of Contents</h3>
                <ul className="space-y-3">
                  <li><a href="#quick-comparison" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> 3kW vs 5kW Solar System — Quick Comparison</a></li>
                  <li><a href="#generation" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> How Much Electricity Does Each System Generate?</a></li>
                  <li><a href="#sizing" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> 3kW vs 5kW Based on Your Electricity Bill</a></li>
                  <li><a href="#price" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Price Comparison in Meerut</a></li>
                  <li><a href="#subsidy" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> PM Surya Ghar Subsidy for 3kW and 5kW</a></li>
                  <li><a href="#checklist" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Buyer's Checklist: What to Ask Before You Buy</a></li>
                </ul>
              </div>

              <div className="prose prose-slate max-w-none">
                <P>
                  If you are planning to install rooftop solar for your home in Meerut, one of the first questions you will face is whether a 3kW or 5kW system is right for you.
                </P>
                <P>
                  Many homeowners assume the answer is based entirely on the size of their house—for example, thinking a 3BHK automatically needs a 3kW system. In reality, the right system size depends heavily on your monthly electricity consumption, the appliances you use, your available roof space, and your future energy needs.
                </P>
                <P>
                  In this guide, we break down the practical differences between a 3kW and 5kW solar system in Meerut. We will compare generation capacity, roof space requirements, approximate pricing, and how the PM Surya Ghar subsidy applies to both, helping you make a practical, informed decision.
                </P>

                <H2 id="quick-comparison">3kW vs 5kW Solar System — Quick Comparison</H2>
                <P>Before diving into the details, here is a quick overview of how these two popular residential solar systems compare.</P>
                
                <div className="my-8 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <Table className="w-full">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-bold text-slate-900 p-4">Feature</TableHead>
                        <TableHead className="font-bold text-slate-900 p-4">3kW Solar System</TableHead>
                        <TableHead className="font-bold text-slate-900 p-4">5kW Solar System</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Typical Household Consumption</TableCell>
                        <TableCell className="p-4 text-slate-600">Moderate (approx. 300–400 units/month)</TableCell>
                        <TableCell className="p-4 text-slate-600">High (approx. 500–700 units/month)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Expected Generation (Daily)*</TableCell>
                        <TableCell className="p-4 text-slate-600">12 to 15 units</TableCell>
                        <TableCell className="p-4 text-slate-600">20 to 25 units</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Approximate Roof Space</TableCell>
                        <TableCell className="p-4 text-slate-600">250 – 300 sq. ft.</TableCell>
                        <TableCell className="p-4 text-slate-600">450 – 500 sq. ft.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">PM Surya Ghar Subsidy (Central + State)</TableCell>
                        <TableCell className="p-4 text-slate-600">Up to ₹1,08,000</TableCell>
                        <TableCell className="p-4 text-slate-600">Up to ₹1,08,000 (cap is reached)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Best Suited For</TableCell>
                        <TableCell className="p-4 text-slate-600">2BHK to 3BHK homes with moderate energy usage</TableCell>
                        <TableCell className="p-4 text-slate-600">Large homes running multiple ACs or heavy daytime loads</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <P className="text-sm italic mt-2 text-slate-500">*Actual generation depends on sunlight, roof orientation, shading, weather, and system maintenance.</P>

                <H2 id="generation">How Much Electricity Does Each System Generate?</H2>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 my-8">
                  <h4 className="font-bold text-slate-900 text-lg mb-2">3kW System Generation</h4>
                  <p className="text-slate-700">A 3kW on-grid solar system generates approximately 12 to 15 units of electricity per day (360 to 450 units per month). This is usually sufficient to power everyday household loads like lights, fans, a refrigerator, a television, a washing machine, and moderate usage of a single air conditioner.</p>
                </div>
                
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 my-8">
                  <h4 className="font-bold text-slate-900 text-lg mb-2">5kW System Generation</h4>
                  <p className="text-slate-700">For homes with heavier electricity consumption, a 5kW system generates about 20 to 25 units of electricity per day (600 to 750 units per month). If your home runs two or more air conditioners simultaneously or features heavy-duty water pumps, a 5kW system provides the necessary buffer.</p>
                </div>

                <H2 id="sizing">3kW vs 5kW Based on Your Electricity Bill</H2>
                <P>
                  The most accurate way to choose between a 3kW and 5kW solar system is by looking at your recent PVVNL electricity bills, rather than the square footage of your home.
                </P>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-slate-700"><strong>When a 3kW System Makes Sense:</strong> Check your average monthly consumption across the year. If you consistently consume between 300 and 450 units per month, a 3kW system is generally adequate.</span>
                  </li>
                  <li className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-slate-700"><strong>When a 5kW System Makes Sense:</strong> If your summer electricity bills show consumption climbing to 600, 700, or more units, upgrading to a 5kW system allows you to cover those heavier loads and maximize long-term savings.</span>
                  </li>
                </ul>

                <H2 id="price">Price Comparison in Meerut</H2>
                <P>
                  The exact price for both systems depends on the brand of solar panels (and their wattage), the type of inverter selected, the quality of the mounting structure, and specific site conditions.
                </P>
                <P>
                  A 5kW system naturally requires more solar panels, a higher-capacity inverter, more mounting structures, and thicker wiring. Consequently, the initial investment is higher than that of a 3kW setup. However, households with high consumption often find that the 5kW system offers a faster return on investment by cutting top-tier electricity tariff rates.
                </P>
                <P>
                  For a detailed breakdown of current costs, components, and ROI, read our comprehensive guide on <Link href="/blog/solar-panel-price-meerut" className="text-primary font-bold hover:underline">Solar Panel Price in Meerut</Link>.
                </P>

                <H2 id="subsidy">PM Surya Ghar Subsidy for 3kW and 5kW</H2>
                <P>
                  The PM Surya Ghar: Muft Bijli Yojana has made rooftop solar highly attractive for eligible residential consumers. However, it is crucial to understand how the subsidy scales:
                </P>
                <ul className="space-y-4 mb-4 list-disc pl-6 text-slate-700">
                  <li>
                    <strong>For a 3kW system:</strong> The total combined subsidy (Central + UPNEDA State) is capped at a maximum of ₹1,08,000.
                  </li>
                  <li>
                    <strong>For a 5kW system:</strong> The PM Surya Ghar subsidy maxes out at 3kW. This means even if you install a 5kW system, the maximum total combined subsidy you can claim remains ₹1,08,000.
                  </li>
                </ul>
                <P>
                  Always check current official government guidelines. For step-by-step assistance, check out our article on <Link href="/blog/pm-surya-ghar-subsidy-meerut" className="text-primary font-bold hover:underline">How to Get PM Surya Ghar Subsidy in Meerut</Link>.
                </P>

                <H2 id="checklist">Buyer's Checklist: What to Ask Before You Buy</H2>
                <P>Before finalizing a 3kW or 5kW solar system, use this helpful checklist:</P>
                <ul className="space-y-4 mb-8">
                  {[
                    "What is my average monthly electricity consumption in units?",
                    "What system size does my consumption actually justify?",
                    "How much usable, shadow-free roof space do I have?",
                    "Which solar panel technology (e.g., Mono PERC, TopCon) is being offered?",
                    "Which brand and capacity of inverter is included?",
                    "Is a sturdy, rust-resistant mounting structure included in the quote?",
                    "Are proper electrical protections (earthing, lightning arresters) included?",
                    "Who handles the PM Surya Ghar subsidy application process?",
                    "Who coordinates with the DISCOM for net-metering?",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <H2 id="conclusion">Final Takeaway</H2>
                <P>
                  Deciding between a 3kW and 5kW solar system for your home in Meerut doesn't have to be complicated. By evaluating your monthly electricity bills, understanding your roof space, and factoring in the PM Surya Ghar subsidy, you can select a system that drastically reduces your energy costs.
                </P>
                <P>
                  Still unsure whether 3kW or 5kW is right for your home? Kailash Solar can help you assess your electricity usage, roof conditions, and system requirements before you make a decision.
                </P>

                <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center my-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('/Happyfamily.png')] bg-cover bg-center" />
                  <div className="relative z-10">
                    <h3 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">Ready for a Free Roof Survey?</h3>
                    <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Book a free, no-obligation site survey with our Meerut solar experts today to find out exactly which system fits your needs.</p>
                    <BookVisitModal>
                      <Button className="h-14 px-8 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl hover:-translate-y-0.5 transition-transform">
                        Book Your Free Survey
                      </Button>
                    </BookVisitModal>
                  </div>
                </div>

                <H2>Frequently Asked Questions (FAQs)</H2>
                <div className="mt-8 mb-12">
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`item-${i}`} className="border-b border-slate-200">
                        <AccordionTrigger className="text-left font-bold text-lg text-slate-900 py-6 hover:text-primary hover:no-underline transition-colors">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600 text-base leading-relaxed pb-6">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <aside className="hidden lg:block relative">
              <div className="sticky top-24 space-y-8">
                
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" /> Need Expert Advice?
                  </h4>
                  <p className="text-slate-600 text-sm mb-6">
                    Speak directly to our Meerut solar experts for immediate guidance on sizing your system and free site surveys.
                  </p>
                  <a href="tel:+918999999654" className="block w-full">
                    <Button className="w-full font-bold bg-accent hover:bg-accent/90 text-white shadow-md">
                      Call 89999 99654
                    </Button>
                  </a>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <h4 className="font-bold text-slate-900 mb-4">Related Guides</h4>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/blog/solar-panel-price-meerut" className="group block">
                        <span className="text-sm font-bold text-primary mb-1 block">Pricing Guide</span>
                        <span className="text-slate-700 font-medium group-hover:text-primary transition-colors leading-tight block">Solar Panel Price in Meerut</span>
                      </Link>
                    </li>
                    <li className="pt-4 border-t border-slate-200">
                      <Link href="/blog/pm-surya-ghar-subsidy-meerut" className="group block">
                        <span className="text-sm font-bold text-primary mb-1 block">Subsidy Guide</span>
                        <span className="text-slate-700 font-medium group-hover:text-primary transition-colors leading-tight block">PM Surya Ghar Subsidy Process</span>
                      </Link>
                    </li>
                    <li className="pt-4 border-t border-slate-200">
                      <Link href="/blog/best-solar-company-in-meerut" className="group block">
                        <span className="text-sm font-bold text-primary mb-1 block">Company Guide</span>
                        <span className="text-slate-700 font-medium group-hover:text-primary transition-colors leading-tight block">Why Choose Kailash Solar?</span>
                      </Link>
                    </li>
                  </ul>
                </div>

              </div>
            </aside>
            
          </div>
        </article>
      </main>

      <Footer />
      <StickyCTA />
    </div>
  );
};

export default Blog3kwVs5kwSolarSystemMeerut;
