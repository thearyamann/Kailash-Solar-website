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
  { q: "How should I choose a solar company in Meerut?", a: "Look beyond the lowest price. Always check if the company uses Tier-1 panels, provides a Hot-Dipped Galvanized structure, uses in-house installers, and handles the PVVNL net metering paperwork for you." },
  { q: "Is it better to choose a local solar company?", a: "Yes. A local company based in Meerut offers faster site surveys, better understanding of local DISCOM procedures, and quicker after-sales service compared to national brands operating from distant cities." },
  { q: "Does Kailash Solar provide a free site survey?", a: "Yes, our engineers provide a completely free, no-obligation physical roof assessment for homeowners in Meerut to recommend the perfect system size." },
  { q: "Can I send my electricity bill for a solar estimate?", a: "Absolutely. Send your latest PVVNL electricity bill to us on WhatsApp (89999 99654), and we will provide a free estimate of your required system size and potential savings." },
  { q: "Does Kailash Solar help with PM Surya Ghar subsidy?", a: "Yes, as an empanelled vendor, we assist our customers through the entire PM Surya Ghar process, from national portal registration to final documentation." },
  { q: "Does Kailash Solar help with net metering?", a: "Yes. We handle the complete PVVNL net metering coordination, including application submission and joint inspections, so you don't have to visit government offices." },
  { q: "What panels does Kailash Solar use?", a: "We prioritize premium Tier-1 ALMM-approved panels, including advanced Adani N-Type TOPCon bifacial modules for maximum efficiency and longevity." },
  { q: "Does Kailash Solar use its own installation team?", a: "Yes, a key differentiator is our 100% in-house trained installation team, ensuring strict quality control and safety without relying on third-party daily-wage subcontractors." },
  { q: "How quickly can solar material be delivered?", a: "Thanks to our local Meerut warehousing, we can often deliver solar materials to your home within 2 to 3 days of finalizing your agreement (subject to stock availability)." },
  { q: "Does Kailash Solar offer EMI/finance assistance?", a: "Yes, we partner with leading institutions to offer competitive solar financing options, helping you switch to solar with easy EMIs." },
  { q: "How much can rooftop solar reduce my electricity bill?", a: "A properly sized system can significantly reduce, and in many cases entirely eliminate, your monthly electricity usage charges. Final savings depend on your specific consumption and system size." },
  { q: "How long does solar installation take?", a: "The physical mounting of panels and wiring usually takes just 1 to 2 days. The complete process, including net metering approvals from the government, takes a few weeks." },
  { q: "What support is available after installation?", a: "We provide long-term service support, warranty coordination, and remote system monitoring via a Wi-Fi app to ensure your system performs perfectly for decades." }
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
          title: 'How to Choose the Best Solar Company in Meerut',
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

      <main className="pt-0">
        {/* Hero Area */}
        <section className="bg-slate-50 pt-12 pb-12 md:pt-16 md:pb-16 border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-accent text-sm font-bold uppercase tracking-wider">
                  Meerut Homeowner Guide
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 text-slate-900 font-montserrat">
                How to Choose the Best Solar Company in Meerut (Buyer's Guide)
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
                  When a Meerut homeowner decides to install rooftop solar, they are making a significant 25-year investment. Yet, the solar market in Uttar Pradesh is crowded. From small local vendors offering heavily discounted, imported panels to massive national companies running call centers hundreds of kilometers away, choosing the right solar partner can feel overwhelming.
                </P>
                <P>
                  <strong>Kailash Solar</strong> has built a reputation as a highly trusted, locally rooted solar EPC company serving Meerut. But what exactly makes us different? 
                </P>
                <P>
                  In this detailed guide, we are pulling back the curtain to explain our exact processes, our component choices, and why hundreds of Meerut homeowners choose Kailash Solar as their solar partner.
                </P>

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
                  Every roof in Meerut is different. Some face perfectly south, while others have shading from adjacent water tanks or tall neighboring buildings. 
                </P>
                <P>
                  Before we ever discuss pricing, we offer a <strong>Free Home Visit & Solar Survey</strong>. Our engineering team will physically visit your property to check the rooftop dimensions, analyze shadow-free areas, and evaluate structural integrity. This ensures our proposed system will actually perform as promised.
                </P>

                <H2 id="bill">2. Your Electricity Bill Helps Us Understand Your Solar Requirement</H2>
                <P>
                  We don't believe in pushing a 5kW system if a 3kW system covers your needs. By sending us your latest PVVNL electricity bill, our team can quickly conduct a <strong>Free Solar Bill Check</strong>. 
                </P>
                <P>
                  We will analyze your connected load and monthly consumption to estimate the recommended solar size, your expected monthly savings, and the applicable government assistance you can claim. 
                </P>

                <H2 id="quality">3. Quality Components Matter More Than a Cheap Quotation</H2>
                <P>
                  The components placed on your roof will endure extreme summer heat, heavy monsoon rains, and high winds for the next 25 years. 
                </P>
                <P>
                  Kailash Solar prioritizes premium <strong>Tier-1 components</strong>. We frequently utilize advanced Adani N-Type TOPCon panels that feature bifacial technology, capturing sunlight from both sides to maximize generation, backed by up to a 30-year performance warranty. We pair these panels with highly efficient, globally recognized inverters and robust safety protection equipment (ACDB/DCDB). 
                </P>

                <H2 id="structure">4. Built Right: Our Hot-Dipped Galvanized Solar Structure</H2>
                <P>
                  Solar panels are only as safe as the structure holding them. We use heavy-duty <strong>Hot-Dipped Galvanized (HDG)</strong> mounting structures. 
                </P>
                <P>
                  These structures are pre-cut and pre-drilled in a factory environment, meaning there is no dangerous cutting or welding required on your roof. This meticulous approach ensures maximum corrosion resistance and guarantees your panels remain securely mounted during heavy UP thunderstorms.
                </P>

                <H2 id="inhouse">5. 100% In-House Installation — Why Does It Matter?</H2>
                <P>
                  One of the most critical reasons homeowners consider us a trusted solar installer in Meerut is our commitment to <strong>100% In-House Installation</strong>. 
                </P>
                <P>
                  Many solar companies outsource the actual rooftop labor to third-party subcontractors. While outsourcing is common, it severely impacts accountability. With Kailash Solar, the technicians climbing your roof are our direct, trained employees. This ensures consistent installation standards, rigorous safety protocols, and a much cleaner finish. 
                </P>

                <H2 id="netmetering">6. From Installation to Net Metering — One Team, One Number</H2>
                <P>
                  Our philosophy is simple: <strong>One Team. One Number. From Survey to Solar.</strong> 
                </P>
                <P>
                  When your panels are mounted, the job is only halfway done. Getting your bi-directional net meter installed involves coordinating with PVVNL officials, submitting technical diagrams, and passing joint inspections. Customers who choose budget vendors often find themselves running to government offices for months. Kailash Solar's dedicated backend team handles this entire coordination for you.
                </P>

                <H2 id="subsidy">7. Solar Subsidy Support in Meerut</H2>
                <P>
                  The government is currently offering massive financial assistance through the PM Surya Ghar Muft Bijli Yojana—providing <strong>up to ₹1,08,000</strong> in combined central and UP state assistance for eligible residential installations. 
                </P>
                <P>
                  Because we are a registered and empanelled vendor, we guide our customers through the entire subsidy maze. From the initial national portal registration to the final commissioning report required for your payout, we ensure your subsidy is processed smoothly. 
                </P>
                <P>
                  *(Actual assistance depends on eligibility, system size, and current scheme rules. <Link href="/blog/pm-surya-ghar-subsidy-meerut" className="text-primary font-bold underline hover:no-underline">Read our detailed PM Surya Ghar subsidy guide for Meerut</Link> for a complete breakdown).*
                </P>

                <H2 id="financing">8. Financing and EMI Assistance</H2>
                <P>
                  We believe everyone should have access to clean energy. Kailash Solar provides assistance with solar financing, helping you access low-EMI loan options with simple documentation. 
                </P>
                <P>
                  With interest rates starting from highly competitive brackets, many homeowners find that their new solar EMI is actually lower than their old electricity bill. 
                  *(Note: Interest rates and final approval are strictly subject to lender terms and your financial eligibility).*
                </P>

                <H2 id="delivery">9. Fast Delivery and Faster Local Coordination</H2>
                <P>
                  Because our warehousing and operations are based right here in Meerut, our material delivery timelines are incredibly swift—often within 2 to 3 days of finalizing the agreement (subject to current stock availability). 
                </P>
                <P>
                  While the complete process (including government net metering and subsidy processing) requires patience, our localized supply chain ensures that your physical installation happens rapidly without unnecessary delays.
                </P>

                <H2 id="aftersales">10. What Happens After Your Solar System Is Installed?</H2>
                <P>
                  A 25-year investment requires long-term service. Our relationship does not end when your panels are switched on. 
                </P>
                <P>
                  We provide reliable service support, warranty coordination, and remote troubleshooting. Your solar inverter will be connected to a mobile app via Wi-Fi, allowing both you and our technical team to monitor generation data and spot any anomalies immediately. 
                </P>

                <H2 id="cheapest">11. Why Choosing the Cheapest Solar Quote Can Be Expensive</H2>
                <P>
                  If you collect three quotations for a 5kW solar system in Meerut, you will likely see a vast difference in price. 
                </P>
                <P>
                  <strong>Why?</strong> Because two 5kW systems are rarely identical. The cheapest quote almost always involves compromising on crucial elements: using outdated Polycrystalline panels instead of TOPCon, thin non-galvanized iron structures that rust within two years, cheap DC cables that pose fire risks, and a complete lack of after-sales or net-metering support.
                </P>
                <P>
                  When evaluating a solar quotation in Meerut, look beyond the final number. Ask what is actually included in that price. 
                </P>

                <H2 id="checklist">12. What Should You Check Before Choosing a Solar Company in Meerut?</H2>
                <P>
                  To help you make an informed decision, use this practical checklist before signing any solar agreement:
                </P>
                <ul className="space-y-4 mb-8">
                  {[
                    "Is the company officially MNRE / PM Surya Ghar empanelled?",
                    "Do they conduct a free, physical site survey?",
                    "Do they clearly explain system sizing based on your actual bill?",
                    "Have they specified the exact panel brand and technology (e.g., Adani N-Type)?",
                    "Are they using a Hot-Dipped Galvanized (HDG) mounting structure?",
                    "Do they use their own in-house installation team?",
                    "Does the quotation explicitly include net metering assistance?",
                    "Does the company handle the subsidy documentation?",
                    "Is the quotation transparent with no hidden fees?",
                    "Is the company locally accessible for long-term service?"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <H2 id="whyus">Why Meerut Homeowners Choose a Company Like Kailash Solar</H2>
                <P>
                  When homeowners search for a residential solar company in Meerut, they want peace of mind. Kailash Solar provides that through a blend of deep local roots, premium Tier-1 components, and a refusal to compromise on installation quality. 
                </P>
                <P>
                  We do not cut corners. We offer free home visits, we use our own trained staff, we handle the frustrating DISCOM paperwork, and we remain accountable long after your system goes live. 
                </P>

                <H2 id="process">Kailash Solar: From Survey to Solar, Under One Team</H2>
                <P>
                  Our streamlined process ensures you never feel lost:
                </P>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {[
                    "Contact Us via phone or WhatsApp",
                    "Bill Analysis for a free basic estimate",
                    "Free Home Visit for roof assessment",
                    "System Design to recommend perfect size",
                    "Transparent Quotation with no hidden fees",
                    "Finance & Subsidy Guidance",
                    "In-House Installation (safe and fast)",
                    "Net Metering coordination with PVVNL",
                    "System Live (start generating free electricity)",
                    "After-Sales Support just a phone call away"
                  ].map((step, i) => (
                    <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-slate-700 font-medium text-sm">{step}</span>
                    </div>
                  ))}
                </div>

                <H2 id="conclusion">Is Kailash Solar the Right Solar Company for Your Home in Meerut?</H2>
                <P>
                  We do not simply declare ourselves the "No.1" option. We let our engineering quality, our transparent processes, and our satisfied customers do the talking. 
                </P>
                <P>
                  If you are looking for a company that prioritizes safety, premium technology, and long-term relationships over quick, cheap sales, we believe Kailash Solar is exactly what you are looking for. 
                </P>
                <P>
                  If you are comparing solar companies in Meerut, don't choose solely on the lowest quotation. Compare what is included, who installs it, who handles the paperwork, and who will answer the phone five years from now. Kailash Solar was built around that complete journey—from the first roof survey to installation and ongoing support.
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
