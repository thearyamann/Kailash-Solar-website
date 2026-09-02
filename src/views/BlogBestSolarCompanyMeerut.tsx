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
  { q: "Which is the best solar company in Meerut?", a: "Choosing the best solar company depends on transparency, in-house installation quality, and after-sales support. Kailash Solar is highly trusted in Meerut because we offer premium components and end-to-end net metering and subsidy assistance." },
  { q: "Is it better to choose a local solar company?", a: "Yes. A local company based in Meerut offers faster site surveys, better understanding of local DISCOM procedures, and quicker after-sales service compared to national brands operating from distant cities." },
  { q: "Does Kailash Solar use its own installation team?", a: "Yes, a key differentiator is our 100% in-house trained installation team, ensuring strict quality control and safety without relying on third-party daily-wage subcontractors." },
  { q: "Does Kailash Solar help with PM Surya Ghar subsidy?", a: "Yes, as an empanelled vendor, we assist our customers through the entire PM Surya Ghar process, from national portal registration to final documentation." }
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

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-700 leading-relaxed mb-6 text-[17px]">{children}</p>
);

const BlogBestSolarCompanyMeerut = () => {
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
          title: 'Why Kailash Solar Is a Leading Solar Company in Meerut',
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
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center justify-between">
        <Link href="/solar-company-meerut" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <span className="font-bold text-slate-900 text-sm truncate max-w-[200px]">Leading Solar Company...</span>
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

      <main className="pt-14 md:pt-0">
        {/* Hero Area */}
        <section className="bg-slate-50 pt-24 pb-12 md:pt-32 md:pb-16 border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-accent text-sm font-bold uppercase tracking-wider">
                  Meerut Homeowner Guide
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 text-slate-900 font-montserrat">
                Why Kailash Solar Is a Leading Solar Company in Meerut
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Discover why hundreds of Meerut homeowners choose Kailash Solar for premium panels, expert in-house installation, and seamless PM Surya Ghar subsidy support.
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
                  <li><a href="#reliable" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> What Makes a Solar Company Truly Reliable in Meerut?</a></li>
                  <li><a href="#comparison" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Kailash Solar vs Other Solar Buying Options</a></li>
                  <li><a href="#survey" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Free Home Visit & Solar Survey</a></li>
                  <li><a href="#quality" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Quality Components Matter</a></li>
                  <li><a href="#inhouse" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> 100% In-House Installation</a></li>
                  <li><a href="#subsidy" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Solar Subsidy Support in Meerut</a></li>
                </ul>
              </div>

              <div className="prose prose-slate max-w-none">
                <P>
                  When a Meerut homeowner decides to install rooftop solar, the hardest decision is often not choosing between a 3kW and 5kW system. It is choosing the company that will still answer the phone after the panels are installed.
                </P>
                <P>
                  Homeowners are not simply buying glass and metal. They are buying a complete 25-year energy solution. This includes professional system design, premium equipment, structural safety, seamless subsidy assistance, net metering support, financing guidance, and most importantly—long-term accountability.
                </P>

                <H2 id="reliable">What Makes a Solar Company Truly Reliable in Meerut?</H2>
                <P>
                  The solar industry in Western Uttar Pradesh is growing rapidly. With the launch of the PM Surya Ghar Yojana, many new vendors have appeared overnight. But installing rooftop solar is a highly technical electrical and structural project.
                </P>
                <ul className="space-y-4 mb-8">
                  {[
                    "Local Presence: A team that is physically accessible when you need support.",
                    "Genuine Credentials: MNRE, UPNEDA, and PM Surya Ghar empanelment.",
                    "Product Transparency: Clear documentation of panel brands, inverter technology, and mounting structures.",
                    "Accountability: In-house installation teams rather than outsourced daily-wage laborers.",
                    "End-to-End Support: Handling the complex DISCOM (PVVNL) net-metering paperwork for you."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <H2 id="comparison">Kailash Solar vs Other Options: What Is Actually Different?</H2>
                <div className="my-8 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <Table className="w-full">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-bold text-slate-900 p-4">Feature</TableHead>
                        <TableHead className="font-bold text-slate-900 p-4">Small Local Vendor</TableHead>
                        <TableHead className="font-bold text-slate-900 p-4">Large National Provider</TableHead>
                        <TableHead className="font-bold text-slate-900 p-4 bg-primary/10">Kailash Solar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Installation</TableCell>
                        <TableCell className="p-4 text-slate-600">Often outsourced</TableCell>
                        <TableCell className="p-4 text-slate-600">Relies on subcontractors</TableCell>
                        <TableCell className="p-4 bg-primary/5 font-bold text-primary">100% in-house trained team</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Site Survey</TableCell>
                        <TableCell className="p-4 text-slate-600">Skipped or via WhatsApp</TableCell>
                        <TableCell className="p-4 text-slate-600">Outsourced third-party</TableCell>
                        <TableCell className="p-4 bg-primary/5 font-bold text-primary">Free physical engineering survey</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Net Metering</TableCell>
                        <TableCell className="p-4 text-slate-600">Homeowner does paperwork</TableCell>
                        <TableCell className="p-4 text-slate-600">Centralized, slow processing</TableCell>
                        <TableCell className="p-4 bg-primary/5 font-bold text-primary">End-to-end PVVNL coordination</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 my-8">
                  <h4 className="font-bold text-slate-900 text-lg mb-2">We Are From Meerut — And We Serve Meerut</h4>
                  <p className="text-slate-700">Kailash Solar is proudly rooted in Meerut. We are not a faceless national corporation operating through call centers. We understand the specific challenges Meerut homeowners face—from local rooftop designs in Shastri Nagar to the exact procedures of the local PVVNL offices.</p>
                </div>

                <H2 id="survey">1. We Don't Start With a Sales Pitch — We Start With Your Roof</H2>
                <P>
                  Every roof in Meerut is different. Before we ever discuss pricing, we offer a Free Home Visit & Solar Survey. Our engineering team will physically visit your property to check the rooftop dimensions, analyze shadow-free areas, evaluate structural integrity, and understand your electricity consumption.
                </P>

                <H2 id="quality">2. Quality Components Matter More Than a Cheap Quotation</H2>
                <P>
                  The components placed on your roof will endure extreme summer heat, heavy monsoon rains, and high winds for the next 25 years. Kailash Solar prioritizes premium Tier-1 components. We frequently utilize advanced Adani N-Type TOPCon panels that feature bifacial technology, backed by up to a 30-year performance warranty.
                </P>

                <H2 id="inhouse">3. 100% In-House Installation — Why Does It Matter?</H2>
                <P>
                  One of the most critical reasons homeowners consider us a trusted solar installer in Meerut is our commitment to 100% In-House Installation. Many solar companies outsource the actual rooftop labor to third-party subcontractors. With Kailash Solar, the technicians climbing your roof are our direct, trained employees.
                </P>

                <H2 id="netmetering">4. From Installation to Net Metering — One Team, One Number</H2>
                <P>
                  Our philosophy is simple: One Team. One Number. From Survey to Solar. Getting your bi-directional net meter installed involves coordinating with PVVNL officials, submitting technical diagrams, and passing joint inspections. Kailash Solar's dedicated backend team handles this entire coordination for you.
                </P>

                <H2 id="subsidy">5. Solar Subsidy Support in Meerut</H2>
                <P>
                  The government is currently offering massive financial assistance through the PM Surya Ghar Muft Bijli Yojana—providing up to ₹1,08,000 in combined central and UP state assistance for eligible residential installations. Because we are a registered and empanelled vendor, we guide our customers through the entire subsidy maze.
                </P>
                <P>
                  *(Actual assistance depends on eligibility, system size, and current scheme rules. <a href="/blog/pm-surya-ghar-subsidy-meerut" className="text-primary font-bold underline hover:no-underline">Read our detailed PM Surya Ghar subsidy guide for Meerut</a>).*
                </P>

                <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center my-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('/Happyfamily.png')] bg-cover bg-center" />
                  <div className="relative z-10">
                    <h3 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">Ready for a Free Roof Survey?</h3>
                    <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Book a free, no-obligation site survey with our Meerut solar experts today. Find out exactly how much you can save.</p>
                    <BookVisitModal>
                      <Button className="h-14 px-8 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-xl hover:-translate-y-0.5 transition-transform">
                        Book Your Free Survey
                      </Button>
                    </BookVisitModal>
                  </div>
                </div>

                <H2>Frequently Asked Questions</H2>
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
                    Speak directly to our Meerut solar experts for immediate guidance on pricing, subsidies, and free site surveys.
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
                        <span className="text-slate-700 font-medium group-hover:text-primary transition-colors leading-tight block">Solar Panel Price in Meerut (2025)</span>
                      </Link>
                    </li>
                    <li className="pt-4 border-t border-slate-200">
                      <Link href="/blog/pm-surya-ghar-subsidy-meerut" className="group block">
                        <span className="text-sm font-bold text-primary mb-1 block">Subsidy Guide</span>
                        <span className="text-slate-700 font-medium group-hover:text-primary transition-colors leading-tight block">PM Surya Ghar Subsidy Process</span>
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

export default BlogBestSolarCompanyMeerut;
