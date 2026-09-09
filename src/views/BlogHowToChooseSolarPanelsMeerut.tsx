"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Button } from '@/components/ui/button';
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

const SITE_URL = 'https://kailashsolar.com';
const SLUG = '/blog/how-to-choose-solar-panels-home-meerut';

const faqs = [
  {
    q: 'What is the best solar panel for a home in Meerut?',
    a: 'The best solar panel depends on your budget, roof space, and energy needs. Monocrystalline and N-type panels are highly recommended for residential rooftops due to their high efficiency and better performance in hot weather.',
  },
  {
    q: 'How many solar panels are needed for a 5kW system?',
    a: 'The exact number depends on the wattage of the panels. For a 5kW (5000W) system, you would typically need about 9 to 10 panels if each panel is rated at 540W to 550W.',
  },
  {
    q: 'Are N-type solar panels good for homes?',
    a: 'Yes, N-type solar panels are excellent for homes. They offer higher efficiency, lower degradation rates over time, and better performance in high-temperature conditions compared to older panel technologies.',
  },
  {
    q: 'How long do solar panels last?',
    a: 'High-quality solar panels typically last for 25 to 30 years. Most reputable manufacturers provide a 25-year or 30-year linear performance warranty to guarantee they will continue producing a high percentage of their original power.',
  },
  {
    q: 'What should I check in a solar panel warranty?',
    a: 'You should check both the product warranty (covering manufacturing defects, usually 10-15 years) and the performance warranty (guaranteeing power output over 25-30 years). Also, confirm who will provide the local service support if something goes wrong.',
  },
  {
    q: 'Does rooftop solar work during Meerut\'s hot summers?',
    a: 'Yes. While extreme heat can slightly reduce a solar panel\'s efficiency, modern panels with a good temperature coefficient are designed to handle high summer temperatures. Proper system sizing ensures you generate enough power even on very hot days.',
  },
  {
    q: 'How much rooftop space is required for solar?',
    a: 'Generally, you need about 80 to 100 square feet of shadow-free rooftop space per kilowatt (kW) of solar capacity. A standard 3kW system requires roughly 250 to 300 square feet of available space.',
  },
  {
    q: 'Can I get PM Surya Ghar subsidy for rooftop solar?',
    a: 'Yes, eligible homeowners in Meerut can claim up to ₹1,08,000 in combined central and UP state subsidies under the PM Surya Ghar: Muft Bijli Yojana. Kailash Solar assists with the complete application and net metering process.',
  },
  {
    q: 'How do I choose a reliable solar company in Meerut?',
    a: 'Look for a local EPC company that handles the complete process from site survey and design to installation, net metering, and after-sales support. Avoid companies that only sell equipment without taking responsibility for the final system performance.',
  },
];

const articleStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Choose the Right Solar Panel for Your Home in Meerut',
  description: 'A complete guide for homeowners in Meerut on choosing the best solar panels. Learn about efficiency, warranty, types, and how to select a reliable installer.',
  author: { '@type': 'Organization', name: 'Kailash Solar' },
  publisher: {
    '@type': 'Organization',
    name: 'Kailash Solar',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.png` },
  },
  mainEntityOfPage: `${SITE_URL}${SLUG}`,
  datePublished: '2025-01-01',
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const CTAButton = ({ className = '' }: { className?: string }) => (
  <Button asChild variant="hero" size="lg" className={className}>
    <a href="/book-visit">
      Get Free Site Visit <ArrowRight className="ml-2 w-4 h-4" />
    </a>
  </Button>
);

const ChecklistTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) => (
  <div className="my-6 rounded-xl border border-border overflow-x-auto">
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow className="bg-primary/5">
          {headers.map((h) => (
            <TableHead key={h} className="font-bold text-foreground">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i}>
            {r.map((c, j) => (
              <TableCell key={j} className={j === 0 ? 'font-semibold' : ''}>
                {c}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-4">{children}</h2>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-3">{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-foreground/85 leading-relaxed mb-4">{children}</p>
);

const BlogHowToChooseSolarPanelsMeerut = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile App-like Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md z-50 border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <span className="font-bold text-sm truncate px-3 text-slate-800">Choosing Solar Panels</span>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'How to Choose Solar Panels for Home in Meerut',
                url: window.location.href
              }).catch(console.error);
            }
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95"
        >
          <Share2 className="w-4 h-4 text-slate-700" />
        </button>
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-primary/20 w-full">
          <div 
            className="h-full bg-primary transition-all duration-150 ease-out" 
            style={{ width: \`\${scrollProgress}%\` }}
          />
        </div>
      </div>

      <main className="pt-14 md:pt-0">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground md:mt-12">
          <div className="container-custom py-12 md:py-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-accent text-sm font-semibold uppercase tracking-wide">
                  Solar Guide · Meerut
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                How to Choose the Right Solar Panel for Your Home in Meerut
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-3xl">
                A complete homeowner's guide to solar efficiency, warranties, technology types, and choosing a trustworthy local installation partner.
              </p>
              <CTAButton />
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="container-custom py-12 md:py-16">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            <div className="max-w-3xl">
              <H2>Introduction</H2>
              <P>
                Deciding to install <Link href="/solar-company-meerut" className="text-primary font-medium hover:underline">solar panels for your home in Meerut</Link> is a great step toward energy independence and lower electricity bills. However, choosing the right solar panels is not simply about buying the panel with the highest wattage or the lowest price tag.
              </P>
              <P>
                Homeowners in Meerut must consider several factors to ensure they make a smart long-term investment. From efficiency and available rooftop space to panel technology, warranty terms, degradation rates, and inverter compatibility, every aspect plays a crucial role. Furthermore, considering our local climate, temperature performance and installation quality are vital for ensuring long-term reliability.
              </P>
              <P>
                The right choice ultimately depends on your home's unique electricity consumption, roof size, budget, and desired solar system capacity.
              </P>

              <H2>What Should You Check Before Choosing Solar Panels for Your Home?</H2>
              <P>
                Before finalizing any quotation, it's essential to understand the technical specifications that determine a panel's performance over its 25-year lifespan. Here are the most important factors to check:
              </P>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-foreground/85">
                <li><strong>Panel Technology:</strong> Is it polycrystalline, monocrystalline, or advanced N-type? The technology dictates the efficiency and longevity.</li>
                <li><strong>Efficiency:</strong> How well does the panel convert sunlight into electricity? Higher efficiency means more power from less space.</li>
                <li><strong>Wattage:</strong> The power output of a single panel, which determines how many panels you need for your total system size.</li>
                <li><strong>Temperature Performance:</strong> How well the panel performs on extremely hot summer days. Look for a low temperature coefficient.</li>
                <li><strong>Warranty:</strong> Ensure you have both a solid product warranty and a long-term performance warranty.</li>
                <li><strong>Degradation Rate:</strong> All panels lose a tiny fraction of their efficiency each year. Lower degradation means more power generated over decades.</li>
                <li><strong>Manufacturer Reliability:</strong> Choose brands with a proven track record and local service presence.</li>
                <li><strong>Installation Quality:</strong> Even the best panels will underperform if the mounting and wiring are substandard.</li>
                <li><strong>Inverter Compatibility:</strong> The panels must match the voltage and current requirements of your chosen inverter.</li>
                <li><strong>After-Sales Support:</strong> Your installer should provide robust post-installation service and maintenance.</li>
              </ul>
              <P>
                When comparing quotations, always look beyond the bottom line. Ask your <Link href="/solar-company-meerut" className="text-primary font-medium hover:underline">solar company in Meerut</Link> to explain these specifications clearly.
              </P>

              <H2>Which Type of Solar Panel Is Best for a Home?</H2>
              <P>
                The solar industry has evolved rapidly, and modern residential rooftop solar installations typically rely on advanced panel technologies. We do not claim that one single technology is universally the "best," as the right choice depends on your specific project, budget, and space constraints. However, two technologies stand out for home installations.
              </P>

              <H3>Monocrystalline Solar Panels</H3>
              <P>
                Monocrystalline panels are made from a single, pure silicon crystal structure. They are highly recognizable by their sleek, uniform black appearance. Because of their purity, they offer excellent efficiency—usually between 19% and 22%. They are highly suitable for residential rooftops in Meerut, especially when roof space is limited, as they generate more electricity per square foot compared to older polycrystalline panels.
              </P>

              <H3>N-Type Solar Panels</H3>
              <P>
                N-type technology is the latest advancement in solar manufacturing. Unlike standard P-type panels, N-type panels are built with negatively doped silicon, making them highly resistant to Light Induced Degradation (LID). This means newer N-type panels offer advantages such as higher overall efficiency (often exceeding 22%), better low-light performance, and much lower degradation rates over their lifespan. While they may have a slightly higher upfront cost, their long-term energy yield makes them an excellent investment for many homes.
              </P>

              <H2>Why Solar Panel Efficiency Matters</H2>
              <P>
                Solar panel efficiency refers to the percentage of sunlight hitting the panel that is successfully converted into usable electricity. If a panel has an efficiency of 21%, it means 21% of the sun's energy is turned into power.
              </P>
              <P>
                Efficiency is particularly useful when rooftop space is limited. For example, if your roof is small but your electricity consumption is high, installing high-efficiency panels allows you to generate the required power without running out of space. 
              </P>
              <P>
                However, homeowners should not judge a panel <em>only</em> by its efficiency percentage. You must also consider the physical panel size, overall wattage, degradation rate, warranty, temperature coefficient, and the overall system design. A perfectly designed system with 20% efficiency panels will always outperform a poorly installed system using 22% efficiency panels.
              </P>

              <H2>How Many Solar Panels Do You Need for a 3kW or 5kW Home Solar System?</H2>
              <P>
                A common question we receive is about the number of panels required. The exact count depends entirely on the wattage of the selected panels. Today, most high-quality residential solar panels range from 500W to 550W.
              </P>
              <P>
                Here are practical examples based on standard 540W to 550W panels:
              </P>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-foreground/85">
                <li><strong><Link href="/blog/3kw-vs-5kw-solar-system-meerut" className="text-primary font-medium hover:underline">3kW rooftop system</Link>:</strong> Approximately 5 to 6 panels.</li>
                <li><strong>5kW rooftop system:</strong> Approximately 9 to 10 panels.</li>
                <li><strong>7kW rooftop system:</strong> Approximately 13 to 14 panels.</li>
                <li><strong>10kW rooftop system:</strong> Approximately 18 to 19 panels.</li>
              </ul>
              <P>
                Keep in mind that the final panel count and system design must be calculated based on the actual panel specifications and your site requirements. 
              </P>

              <H2>Solar Panel Warranty: What Should Homeowners Look For?</H2>
              <P>
                When evaluating <Link href="/blog/solar-panel-price-meerut" className="text-primary font-medium hover:underline">solar panel prices in Meerut</Link>, always factor in the warranty. There are two distinct types of warranties you need to understand:
              </P>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-foreground/85">
                <li><strong>Product Warranty:</strong> Covers manufacturing defects, premature wear and tear, and environmental issues. This usually ranges from 10 to 15 years.</li>
                <li><strong>Performance Warranty:</strong> Guarantees that the panels will produce a certain percentage of their rated power after 25 to 30 years (factoring in the expected degradation rate).</li>
              </ul>
              <P>
                Do not look only at the number of years. Understand exactly what the warranty covers and, most importantly, ask who will provide support. A local EPC company is vital here to facilitate any replacements smoothly.
              </P>

              <H2>Does Meerut's Weather Affect Solar Panel Performance?</H2>
              <P>
                Yes, the local environment plays a significant role in solar generation. Meerut experiences intense high summer temperatures, dust, and occasionally heavy pollution.
              </P>
              <P>
                High temperatures can slightly lower a solar panel's voltage, reducing overall power output on the hottest days. This is why choosing a panel with a good "temperature coefficient" is important. Additionally, accumulated dust and pollution can block sunlight, making regular cleaning essential for optimal performance. Shading from nearby trees, buildings, or water tanks, as well as the rooftop orientation and installation angle, will heavily dictate your daily generation.
              </P>
              <P>
                Proper site assessment and professional system design are crucial for Meerut homeowners to ensure the system is customized for their specific roof profile and local weather patterns.
              </P>

              <H2>How to Compare Solar Panel Quotations From Different Companies</H2>
              <P>
                Comparing quotations can be confusing. Use this practical checklist to evaluate different proposals:
              </P>
              <ChecklistTable 
                headers={['Factor', 'What to check for']}
                rows={[
                  ['Panel Brand & Technology', 'Monocrystalline, N-type, TopCon?'],
                  ['Panel Wattage & Efficiency', 'Is it high enough for your limited roof space?'],
                  ['Inverter details', 'Brand, capacity, and warranty terms.'],
                  ['Mounting Structure', 'Is it GI or Aluminum? Does it withstand high wind speeds?'],
                  ['Protection Equipment', 'Are proper AC/DC distribution boxes, MCBs, and earthing included?'],
                  ['Subsidy Assistance', 'Does the installer handle the PM Surya Ghar application?'],
                  ['Net Metering', 'Who manages the PVVNL documentation and net meter installation?'],
                  ['After-Sales Service', 'Is free AMC provided for the first few years?']
                ]}
              />
              <P>
                The cheapest quotation is not necessarily the best long-term option. Cutting corners on wiring, earthing, or structural stability to reduce the upfront <Link href="/blog/solar-panel-price-meerut" className="text-primary font-medium hover:underline">solar panel price</Link> can lead to major safety and performance issues down the line.
              </P>

              <H2>Why Choosing the Right Solar Installer Matters</H2>
              <P>
                Even the highest quality solar panels will underperform if the system is poorly designed or installed. Choosing the right installer is just as important as choosing the panel itself.
              </P>
              <P>
                A professional installation requires a comprehensive site survey, precise shadow analysis, accurate system sizing, and a structural assessment of your roof. Proper mounting, strict electrical safety protocols, and correct inverter selection are non-negotiable. Furthermore, navigating the PVVNL net metering process and applying for government subsidies requires administrative expertise.
              </P>
              <P>
                This is why working with a dedicated local solar EPC company in Meerut, focused on complete system planning rather than simply selling boxes of panels, is highly recommended.
              </P>

              <H2>Why Choose Kailash Solar for Rooftop Solar in Meerut?</H2>
              <P>
                Kailash Solar is a professional, trusted local solar EPC company based in Meerut, Uttar Pradesh. We specialize in providing end-to-end solar solutions, ensuring our clients receive a system that is safe, efficient, and built to last.
              </P>
              <P>
                Our core services include:
              </P>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-foreground/85">
                <li>Residential rooftop solar installations</li>
                <li>Commercial and industrial solar EPC</li>
                <li>Customized solar system design based on 3D shadow analysis</li>
                <li>Professional, safety-first installation</li>
                <li>Complete <Link href="/blog/pm-surya-ghar-subsidy-meerut" className="text-primary font-medium hover:underline">PM Surya Ghar subsidy</Link> assistance</li>
                <li>Hassle-free PVVNL net metering assistance</li>
                <li>Financing and EMI options to reduce upfront costs</li>
                <li>Dedicated after-sales and AMC support</li>
              </ul>
              <P>
                We do not just sell solar panels; we engineer complete energy solutions. Our team provides transparent advice, free site visits, and customized quotations to help you make an informed decision.
              </P>

              <H2>Frequently Asked Questions</H2>
              <Accordion type="single" collapsible className="w-full mb-12">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={\`item-\${i}\`}>
                    <AccordionTrigger className="text-left font-semibold text-lg">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/85 leading-relaxed text-base">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="bg-primary/5 rounded-2xl p-6 md:p-10 border border-primary/10 mt-12 mb-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Planning to Install Solar Panels at Your Home in Meerut?
                </h3>
                <p className="text-foreground/80 mb-8 max-w-2xl mx-auto">
                  Don't rely solely on generic online prices to design your home's energy future. Encourage proper planning by getting a professional site assessment. Let our engineers evaluate your roof space, shading, and electricity load to recommend the perfect solar system.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                    <Link href="/book-visit">
                      Book a Free Site Visit
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base font-bold border-2">
                    <a href="tel:+918999999654">
                      <Phone className="w-4 h-4 mr-2" /> +91 89999 99654
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block relative">
              <div className="sticky top-24 space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-lg mb-4">Ready to go solar?</h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Get a free site survey and customized quotation for your home in Meerut.
                  </p>
                  <Button asChild className="w-full font-bold shadow-md">
                    <Link href="/book-visit">Book Free Consultation</Link>
                  </Button>
                </div>
                
                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                  <h3 className="font-bold text-lg mb-4 text-primary">PM Surya Ghar Yojana</h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Claim up to ₹1,08,000 in government subsidy for your rooftop solar installation.
                  </p>
                  <Link 
                    href="/blog/pm-surya-ghar-subsidy-meerut" 
                    className="text-sm font-bold text-primary hover:underline flex items-center"
                  >
                    Read Subsidy Guide <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <StickyCTA />
      <Footer />
    </div>
  );
};

export default BlogHowToChooseSolarPanelsMeerut;
