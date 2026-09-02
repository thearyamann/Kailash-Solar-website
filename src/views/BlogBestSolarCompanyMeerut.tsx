"use client";

import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { BookVisitModal } from "@/components/BookVisitModal";
import { Button } from "@/components/ui/button";
import { Phone, ShieldCheck, Sun, Zap, CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import MobileHeader from "@/components/MobileHeader";

const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <h2 id={id} className="text-2xl md:text-3xl font-bold text-slate-900 mt-12 mb-6 font-montserrat scroll-mt-24">
    {children}
  </h2>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-700 leading-relaxed mb-6 text-lg">{children}</p>
);

const BlogBestSolarCompanyMeerut = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MobileHeader />

      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-100 hidden md:block">
        <Progress value={scrollProgress} className="h-full bg-slate-100 [&>div]:bg-primary rounded-none" />
      </div>

      <main>
        <div className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('/panel.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
          
          <div className="container relative z-10 px-4 md:px-8 mx-auto max-w-5xl">
            <div className="inline-block bg-primary/20 text-primary-foreground font-bold px-4 py-1.5 rounded-full text-sm mb-6 border border-primary/30 backdrop-blur-sm">
              Meerut Homeowner Guide
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat leading-tight mb-6">
              Why Kailash Solar Is a Leading Solar Company in Meerut
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <span className="text-lg">☀️</span>
                </div>
                <div>
                  <div className="text-white font-bold">Kailash Solar Experts</div>
                  <div className="text-sm">Solar EPC Team</div>
                </div>
              </div>
              <div className="h-4 w-px bg-white/20 hidden md:block" />
              <div>Updated: 2025</div>
              <div className="h-4 w-px bg-white/20 hidden md:block" />
              <div>10 min read</div>
            </div>
          </div>
        </div>

        <div className="container px-4 md:px-8 mx-auto max-w-7xl py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <div className="max-w-[800px] w-full min-w-0">
                <P>
                  When a Meerut homeowner decides to install rooftop solar, the hardest decision is often not choosing between a 3kW and 5kW system. It is choosing the company that will still answer the phone after the panels are installed.
                </P>
                <P>
                  Homeowners are not simply buying glass and metal. They are buying a complete 25-year energy solution. This includes professional system design, premium equipment, structural safety, seamless subsidy assistance, net metering support, financing guidance, and most importantly—long-term accountability.
                </P>
                <P>
                  Choosing a solar installer in Meerut based solely on the lowest price often leads to rejected subsidies, poor wiring, and zero after-sales support. In this guide, we will explain exactly what goes into a high-quality solar installation, how to compare quotes, and why hundreds of families consider Kailash Solar a leading solar company in Meerut.
                </P>

                <div className="my-10">
                  <BookVisitModal>
                    <Button className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
                      Book Your Free Home Visit & Solar Survey
                    </Button>
                  </BookVisitModal>
                </div>

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
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-lg leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <H2 id="local-roots">We Are From Meerut — And We Serve Meerut</H2>
                <P>
                  Kailash Solar is proudly rooted in Meerut. We are not a faceless national corporation operating through call centers, nor are we a temporary vendor.
                </P>
                <P>
                  We understand the specific challenges Meerut homeowners face—from local rooftop designs in Shastri Nagar to the specific power cut patterns in Pallavpuram and the exact procedures of the local PVVNL offices. Being a local solar company in Meerut means we offer faster communication, local site visits, easier coordination, and true local accountability.
                </P>

                <H2 id="comparison">Kailash Solar vs Other Options: What Is Actually Different?</H2>
                <div className="overflow-x-auto my-8 pb-4">
                  <table className="w-full min-w-[700px] border-collapse bg-white shadow-sm rounded-xl overflow-hidden text-left">
                    <thead>
                      <tr className="bg-slate-900 text-white">
                        <th className="p-4 font-bold border-b border-slate-800">Feature</th>
                        <th className="p-4 font-bold border-b border-slate-800">Small Local Vendor</th>
                        <th className="p-4 font-bold border-b border-slate-800">Large National Provider</th>
                        <th className="p-4 font-bold border-b border-slate-800 bg-primary/20">Kailash Solar</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr>
                        <td className="p-4 border-b border-slate-200 font-bold">Installation</td>
                        <td className="p-4 border-b border-slate-200">Often outsourced</td>
                        <td className="p-4 border-b border-slate-200">Relies on subcontractors</td>
                        <td className="p-4 border-b border-slate-200 bg-primary/5 font-bold">100% in-house trained team</td>
                      </tr>
                      <tr>
                        <td className="p-4 border-b border-slate-200 font-bold">Site Survey</td>
                        <td className="p-4 border-b border-slate-200">Skipped or via WhatsApp</td>
                        <td className="p-4 border-b border-slate-200">Outsourced third-party</td>
                        <td className="p-4 border-b border-slate-200 bg-primary/5 font-bold">Free physical engineering survey</td>
                      </tr>
                      <tr>
                        <td className="p-4 border-b border-slate-200 font-bold">Net Metering</td>
                        <td className="p-4 border-b border-slate-200">Homeowner does paperwork</td>
                        <td className="p-4 border-b border-slate-200">Centralized, slow processing</td>
                        <td className="p-4 border-b border-slate-200 bg-primary/5 font-bold">End-to-end PVVNL coordination</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <H2 id="survey">1. We Don't Start With a Sales Pitch — We Start With Your Roof</H2>
                <P>
                  Every roof in Meerut is different. Before we ever discuss pricing, we offer a Free Home Visit & Solar Survey. Our engineering team will physically visit your property to check the rooftop dimensions, analyze shadow-free areas, evaluate structural integrity, and understand your electricity consumption.
                </P>

                <H2 id="bill-check">2. Your Electricity Bill Helps Us Understand Your Requirement</H2>
                <P>
                  We don't believe in pushing a 5kW system if a 3kW system covers your needs. By sending us your latest PVVNL electricity bill, our team can quickly conduct a Free Solar Bill Check to estimate the recommended size and potential savings.
                </P>

                <H2 id="quality">3. Quality Components Matter More Than a Cheap Quotation</H2>
                <P>
                  The components placed on your roof will endure extreme summer heat, heavy monsoon rains, and high winds for the next 25 years. Kailash Solar prioritizes premium Tier-1 components. We frequently utilize advanced Adani N-Type TOPCon panels that feature bifacial technology, backed by up to a 30-year performance warranty.
                </P>

                <H2 id="structure">4. Built Right: Our Hot-Dipped Galvanized Solar Structure</H2>
                <P>
                  Solar panels are only as safe as the structure holding them. We use heavy-duty Hot-Dipped Galvanized (HDG) mounting structures. These structures are pre-cut and pre-drilled in a factory environment, meaning there is no dangerous cutting or welding required on your roof.
                </P>

                <H2 id="inhouse">5. 100% In-House Installation — Why Does It Matter?</H2>
                <P>
                  One of the most critical reasons homeowners consider us a trusted solar installer in Meerut is our commitment to 100% In-House Installation. Many solar companies outsource the actual rooftop labor to third-party subcontractors. With Kailash Solar, the technicians climbing your roof are our direct, trained employees.
                </P>

                <H2 id="netmetering">6. From Installation to Net Metering — One Team, One Number</H2>
                <P>
                  Our philosophy is simple: One Team. One Number. From Survey to Solar. Getting your bi-directional net meter installed involves coordinating with PVVNL officials, submitting technical diagrams, and passing joint inspections. Kailash Solar's dedicated backend team handles this entire coordination for you.
                </P>

                <H2 id="subsidy">7. Solar Subsidy Support in Meerut</H2>
                <P>
                  The government is currently offering massive financial assistance through the PM Surya Ghar Muft Bijli Yojana—providing up to ₹1,08,000 in combined central and UP state assistance for eligible residential installations. Because we are a registered and empanelled vendor, we guide our customers through the entire subsidy maze.
                </P>
                <P>
                  *(Actual assistance depends on eligibility, system size, and current scheme rules. <a href="/blog/pm-surya-ghar-subsidy-meerut" className="text-primary font-bold underline hover:no-underline">Read our detailed PM Surya Ghar subsidy guide for Meerut</a>).*
                </P>

                <H2 id="financing">8. Financing and EMI Assistance</H2>
                <P>
                  Kailash Solar provides assistance with solar financing, helping you access low-EMI loan options with simple documentation. With interest rates starting from highly competitive brackets, many homeowners find that their new solar EMI is actually lower than their old electricity bill.
                </P>

                <H2 id="delivery">9. Fast Delivery and Faster Local Coordination</H2>
                <P>
                  Because our warehousing and operations are based right here in Meerut, our material delivery timelines are incredibly swift—often within 2 to 3 days of finalizing the agreement (subject to current stock availability).
                </P>

                <H2 id="aftersales">10. What Happens After Your Solar System Is Installed?</H2>
                <P>
                  A 25-year investment requires long-term service. We provide reliable service support, warranty coordination, and remote troubleshooting. Your solar inverter will be connected to a mobile app via Wi-Fi, allowing both you and our technical team to monitor generation data immediately.
                </P>

                <H2 id="faqs">Frequently Asked Questions</H2>
                <Accordion type="single" collapsible className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-12">
                  {[
                    { q: "Which is the best solar company in Meerut?", a: "Choosing the best solar company depends on transparency, in-house installation quality, and after-sales support. Kailash Solar is highly trusted in Meerut because we offer premium components and end-to-end net metering and subsidy assistance." },
                    { q: "Is it better to choose a local solar company?", a: "Yes. A local company based in Meerut offers faster site surveys, better understanding of local DISCOM procedures, and quicker after-sales service compared to national brands operating from distant cities." },
                    { q: "Does Kailash Solar use its own installation team?", a: "Yes, a key differentiator is our 100% in-house trained installation team, ensuring strict quality control and safety without relying on third-party daily-wage subcontractors." },
                    { q: "Does Kailash Solar help with PM Surya Ghar subsidy?", a: "Yes, as an empanelled vendor, we assist our customers through the entire PM Surya Ghar process, from national portal registration to final documentation." }
                  ].map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0 border-slate-100">
                      <AccordionTrigger className="text-left font-bold text-lg hover:text-primary transition-colors">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 text-base leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

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
                    <p className="mt-6 text-sm text-white/60">Or call us directly at <a href="tel:+918999999654" className="font-bold text-white hover:underline">89999 99654</a></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="sticky top-24 space-y-8 hidden lg:block">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4">Table of Contents</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a href="#reliable" className="text-slate-600 hover:text-primary transition-colors">What Makes a Company Reliable?</a></li>
                    <li><a href="#local-roots" className="text-slate-600 hover:text-primary transition-colors">We Serve Meerut</a></li>
                    <li><a href="#comparison" className="text-slate-600 hover:text-primary transition-colors">Comparison Table</a></li>
                    <li><a href="#survey" className="text-slate-600 hover:text-primary transition-colors">Free Site Survey</a></li>
                    <li><a href="#inhouse" className="text-slate-600 hover:text-primary transition-colors">100% In-House Installation</a></li>
                    <li><a href="#netmetering" className="text-slate-600 hover:text-primary transition-colors">Net Metering Support</a></li>
                    <li><a href="#subsidy" className="text-slate-600 hover:text-primary transition-colors">PM Surya Ghar Subsidy</a></li>
                  </ul>
                </div>

                <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20">
                  <h4 className="font-bold text-slate-900 text-xl mb-4">Send Your Bill</h4>
                  <p className="text-slate-700 text-sm mb-6">Send your electricity bill on WhatsApp for a quick estimate.</p>
                  <a href="tel:+918999999654">
                    <Button className="w-full font-bold bg-white text-accent border border-accent hover:bg-accent hover:text-white transition-colors">
                      <Phone className="w-4 h-4 mr-2" /> WhatsApp 89999 99654
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <StickyCTA />
    </div>
  );
};

export default BlogBestSolarCompanyMeerut;
