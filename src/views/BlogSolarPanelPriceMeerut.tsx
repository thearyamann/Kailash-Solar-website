"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, ArrowRight, CheckCircle2, MapPin, Zap, TrendingUp, IndianRupee, ShieldCheck, Phone } from 'lucide-react';
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

const SITE_URL = 'https://kailashsolar.com';
const SLUG = '/blog/solar-panel-price-meerut';

const faqs = [
  {
    q: 'What is the price of a 3kW solar system in Meerut?',
    a: 'A high-quality 3kW solar system with Tier-1 panels typically costs between ₹1,60,000 and ₹1,80,000 before subsidy. After the central and UP state subsidy (up to ₹1,08,000 combined), your out-of-pocket cost is significantly lower.',
  },
  {
    q: 'How much subsidy is available in Uttar Pradesh?',
    a: 'Under the PM Surya Ghar Yojana, you can get up to ₹78,000 from the central government and an additional ₹30,000 from the UP state government, totaling a massive ₹1,08,000 subsidy for residential installations of 3kW or more.',
  },
  {
    q: 'How many panels are needed for a 5kW system?',
    a: 'With modern high-efficiency panels (like 540W or 550W Mono PERC or TOPCon), a 5kW system generally requires about 9 to 10 panels.',
  },
  {
    q: 'Is net metering free in Meerut?',
    a: 'Net metering is not completely free; you must pay a standard application and meter fee to PVVNL (the local DISCOM). However, Kailash Solar handles all the required documentation and coordination for you.',
  },
  {
    q: 'Can I install solar on any roof?',
    a: 'Solar panels need a shadow-free area that ideally faces south for maximum sunlight. If you have an RCC roof, tin shed, or open terrace in Meerut, our engineers can design a custom mounting structure tailored to your property.',
  },
  {
    q: 'How long do solar panels last?',
    a: 'Top-tier solar panels come with a 25-year performance warranty. However, because they have no moving parts, a well-maintained system can continue generating electricity for 25 to 30 years or more.',
  },
  {
    q: 'What is the payback period for rooftop solar?',
    a: 'For most residential setups in Meerut, the payback period (ROI) ranges from 3 to 4.5 years. After you recover your initial investment through electricity savings, the power generated for the next 20+ years is practically free.',
  },
  {
    q: 'Do I still get an electricity bill after installing solar?',
    a: 'If your solar system produces as much or more electricity than you consume over the billing cycle, your bill for energy usage will be zero. You will only pay the minimal fixed connection charges set by PVVNL.',
  },
  {
    q: 'Does weather affect solar panel generation?',
    a: 'Yes. Solar panels generate the most power on clear, sunny days. During cloudy or rainy days, generation drops but does not stop entirely. Over the course of a year, the sunny days in Meerut more than compensate for the monsoon season.',
  },
  {
    q: 'Are loans available for solar installation?',
    a: 'Absolutely! Several nationalized and private banks offer collateral-free solar loans with attractive interest rates, making it incredibly easy to switch to solar with zero or minimal upfront investment.',
  },
  {
    q: 'How often do I need to clean the solar panels?',
    a: 'In Meerut, where dust can accumulate, we recommend cleaning the panels with plain water every 15 to 20 days. Keeping them clean ensures they operate at maximum efficiency.',
  },
  {
    q: 'Do I need a battery with my on-grid solar system?',
    a: 'No, an on-grid system does not require a battery. The PVVNL grid acts as your virtual battery—you export excess power during the day and import it at night, settled via net metering.',
  },
  {
    q: 'What happens to my solar system during a power cut?',
    a: 'For safety reasons, standard on-grid inverters automatically shut down during a grid power cut (anti-islanding). If Meerut experiences frequent power cuts in your area, you might consider a hybrid system.',
  },
  {
    q: 'Can I run an AC on a 3kW solar system?',
    a: 'Yes! A 3kW system generates around 360-400 units a month, which is easily enough to offset the consumption of a 1.5-ton inverter AC used mostly at night, along with basic household appliances.',
  },
  {
    q: 'What brand of panels and inverters do you use?',
    a: 'We use Tier-1 ALMM-approved panels like Adani Solar, Waaree, and Vikram Solar, alongside highly reliable inverters from brands like Growatt, Solis, and Havells.',
  },
  {
    q: 'Does installing solar increase my property value?',
    a: 'Yes. Homes equipped with a fully functional rooftop solar system are highly sought after because they guarantee extremely low electricity bills for the next 25 years.',
  },
  {
    q: 'How much area is required for a 10kW commercial solar system?',
    a: 'A 10kW system generally requires about 700 to 1,000 square feet of shadow-free rooftop space, depending on the type and efficiency of the panels used.',
  },
  {
    q: 'Are there any hidden maintenance costs?',
    a: 'There are practically zero hidden maintenance costs. Besides regular cleaning with water, there are no moving parts to replace. Inverters may require replacement after 10-15 years, but the panels themselves are maintenance-free.',
  },
  {
    q: 'Is it safe to install solar panels on an older roof?',
    a: 'During our free site survey, our structural engineers evaluate the integrity of your roof. We only proceed if the roof can safely bear the weight and wind load of the solar mounting structure.',
  },
  {
    q: 'How do I track how much electricity my solar panels generate?',
    a: 'Your solar inverter comes with a smart Wi-Fi dongle that connects to a mobile app. You can monitor your daily, monthly, and lifetime power generation directly from your smartphone from anywhere in the world.',
  }
];

const CTAButton = ({ className = '', text = "Get Free Site Visit" }: { className?: string, text?: string }) => (
  <BookVisitModal>
    <Button variant="hero" size="lg" className={className}>
      {text} <ArrowRight className="ml-2 w-4 h-4" />
    </Button>
  </BookVisitModal>
);

const ComparisonTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) => (
  <div className="my-8 rounded-xl border border-border overflow-x-auto shadow-sm">
    <Table className="min-w-[600px]">
      <TableHeader>
        <TableRow className="bg-primary/5">
          {headers.map((h) => (
            <TableHead key={h} className="font-bold text-slate-800 py-4">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r, i) => (
          <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
            {r.map((c, j) => (
              <TableCell key={j} className={`py-4 ${j === 0 ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                {c}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const H2 = ({ children, id }: { children: React.ReactNode, id?: string }) => (
  <h2 id={id} className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mt-14 mb-6 leading-tight tracking-tight font-montserrat">{children}</h2>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mt-10 mb-4">{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-600 text-[17px] leading-[1.8] mb-6">{children}</p>
);

const BlogSolarPanelPriceMeerut = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile App-like Header */}
      <div className={`md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md z-50 border-b border-slate-200 flex items-center justify-between px-4 shadow-sm transition-transform duration-300 ${scrollProgress > 2 ? "translate-y-0" : "-translate-y-full"}`}>
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <span className="font-bold text-sm truncate px-3 text-slate-800">Solar Price Guide</span>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Solar Panel Price Guide 2025',
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
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <main className="pt-0">
        {/* Hero Area */}
        <section className="bg-slate-50 pt-24 pb-12 md:pt-32 md:pb-16 border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-accent text-sm font-bold uppercase tracking-wider">
                  Solar Price Guide 2025
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 text-slate-900 font-montserrat">
                Solar Panel Price in Meerut (2025): Costs, Subsidies & ROI Complete Guide
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Discover the exact solar panel cost in Meerut for residential and commercial systems. Learn how to calculate your savings, claim the PM Surya Ghar subsidy, and say goodbye to expensive electricity bills forever.
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
                <ul className="space-y-3 text-primary font-medium">
                  <li><a href="#introduction" className="hover:underline">1. The Rise of Rooftop Solar in Meerut</a></li>
                  <li><a href="#prices" className="hover:underline">2. Solar Panel Price in Meerut by System Size</a></li>
                  <li><a href="#factors" className="hover:underline">3. What Affects Solar Panel Installation Cost?</a></li>
                  <li><a href="#subsidy" className="hover:underline">4. PM Surya Ghar Yojana Subsidy in Meerut</a></li>
                  <li><a href="#roi" className="hover:underline">5. Cost vs. Savings: The Financial Breakdown</a></li>
                  <li><a href="#decision-guide" className="hover:underline">6. Which System Size Should You Choose?</a></li>
                  <li><a href="#process" className="hover:underline">7. The Step-by-Step Installation Process</a></li>
                  <li><a href="#why-kailash" className="hover:underline">8. Why Choose Kailash Solar?</a></li>
                </ul>
              </div>

              {/* Section 1 */}
              <H2 id="introduction">1. The Rise of Rooftop Solar in Meerut</H2>
              <P>
                If you live in Meerut, you are probably familiar with two things: abundant sunshine throughout the year, and constantly rising electricity tariffs from PVVNL. Over the last few years, electricity prices have surged significantly, putting an unnecessary financial burden on middle-class families, large joint households, and local businesses alike.
              </P>
              <P>
                Fortunately, homeowners are fighting back. The adoption of rooftop solar in areas like Shastri Nagar, Ganga Nagar, Modipuram, and Pallavpuram is skyrocketing. Why? Because installing solar panels is no longer an expensive luxury; it is a smart, highly subsidized financial investment. With the launch of the PM Surya Ghar Muft Bijli Yojana, transitioning to green energy has never been more affordable.
              </P>
              <P>
                At <Link href="/" className="text-primary font-bold hover:underline">Kailash Solar</Link>, the leading <Link href="/solar-company-meerut" className="text-primary font-bold hover:underline">Solar Company in Meerut</Link>, our mission is to provide transparent, premium, and hassle-free solar EPC (Engineering, Procurement, and Construction) services. In this comprehensive guide, we will break down exactly what you can expect to pay for a solar system in Meerut in 2025, how the subsidy works, and how much money you will ultimately save.
              </P>
              
              <div className="w-full aspect-[16/9] bg-slate-200 rounded-2xl flex items-center justify-center my-10 border border-slate-300">
                <span className="text-slate-500 font-medium text-center px-4 text-sm md:text-base">[Image Placeholder: High-quality photo of a recent residential solar installation in Meerut by Kailash Solar]</span>
              </div>

              {/* Section 2 */}
              <H2 id="prices">2. Solar Panel Price in Meerut by System Size</H2>
              <P>
                When homeowners search for <strong>Solar Panel Price in Meerut</strong> or <strong>Solar System Price Meerut</strong>, they often find confusing or conflicting information online. The truth is that the final price depends on the capacity of the system (measured in kilowatts or kW), the quality of the components used, and the type of structure required for your specific roof.
              </P>
              <P>
                Below is a detailed, transparent comparison table of the estimated market prices for premium, on-grid solar installations in Meerut. Keep in mind that these are approximate costs <em>before</em> the massive government subsidy is applied.
              </P>

              <ComparisonTable 
                headers={["System Size", "Approx. Cost (Before Subsidy)", "Avg. Monthly Generation", "Suitable For Monthly Bill", "Space Required"]}
                rows={[
                  ["2kW System", "₹1,10,000 - ₹1,30,000", "240 - 260 Units", "₹1,500 - ₹2,500", "150 - 200 sq.ft"],
                  ["3kW System", "₹1,60,000 - ₹1,80,000", "360 - 400 Units", "₹2,500 - ₹3,500", "250 - 300 sq.ft"],
                  ["5kW System", "₹2,60,000 - ₹2,90,000", "600 - 650 Units", "₹4,000 - ₹6,000", "450 - 500 sq.ft"],
                  ["7kW System", "₹3,50,000 - ₹3,90,000", "840 - 900 Units", "₹7,000 - ₹9,000", "650 - 700 sq.ft"],
                  ["10kW System", "₹4,80,000 - ₹5,50,000", "1200 - 1300 Units", "₹10,000+", "900 - 1000 sq.ft"],
                ]}
              />

              <H3>The 3kW Solar System Price in Meerut</H3>
              <P>
                The 3kW setup is overwhelmingly the most popular choice for standard independent houses and small joint families in Meerut. It is powerful enough to handle basic lighting, fans, a refrigerator, a washing machine, and one 1.5-ton inverter AC (mostly used during the evening/night). The <strong>3kW Solar System Price in Meerut</strong> generally hovers around ₹1.7 Lakhs, but this becomes drastically cheaper once you factor in the incredible ₹1,08,000 combined central and state subsidy.
              </P>

              <H3>The 5kW Solar System Price in Meerut</H3>
              <P>
                For larger, multi-story homes in areas like Shastri Nagar or Kanker Khera running multiple air conditioners, a 5kW system is highly recommended. The <strong>5kW Solar System Price in Meerut</strong> is an excellent investment because it practically wipes out monthly bills that typically range from ₹5,000 to ₹7,000 during peak UP summers.
              </P>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 my-10 text-center">
                <h4 className="text-xl font-bold text-slate-900 mb-3">Want an exact quote for your roof?</h4>
                <p className="text-slate-600 mb-6">Use our smart calculator to get an instant, personalized cost estimate based on your actual electricity consumption.</p>
                <Link href="/quote">
                  <Button className="h-12 px-8 rounded-full text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-md transition-transform active:scale-95">
                    Open Solar Calculator
                  </Button>
                </Link>
              </div>

              {/* Section 3 */}
              <H2 id="factors">3. What Affects Solar Panel Installation Cost in Meerut?</H2>
              <P>
                When comparing quotes from different vendors, you might notice price variations. It is crucial to understand that not all solar installations are built equal. Here are the key technical and logistical factors that influence the final <strong>Solar Installation Cost in Meerut</strong>:
              </P>

              <ul className="space-y-6 my-8">
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Solar Panel Technology</h4>
                    <p className="text-slate-600">The market is currently shifting from standard Polycrystalline to highly efficient Mono PERC Half-Cut and advanced TOPCon panels. While TOPCon panels are slightly more expensive upfront, they generate significantly more electricity in low-light conditions and degrade slower over 25 years.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Inverter Quality</h4>
                    <p className="text-slate-600">The solar inverter is the brain of your system. Premium inverters (like Growatt, Solis, or Deye) provide higher efficiency, better grid synchronization, and advanced Wi-Fi monitoring capabilities.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Mounting Structure & Roof Condition</h4>
                    <p className="text-slate-600">A standard flush mount on a flat RCC roof is cheaper than a high-raised structure designed to allow you to walk under the panels. Galvanized Iron (GI) structures with appropriate rust-proofing add to the initial cost but guarantee the structural integrity against heavy storms.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Balance of System (BOS)</h4>
                    <p className="text-slate-600">This includes DC/AC cables, junction boxes (AJB/DCDB), earthing kits, and lightning arresters. Cutting corners on BOS components is dangerous. Kailash Solar only uses premium, fire-retardant cables and robust safety switches.</p>
                  </div>
                </li>
              </ul>

              <P>
                As a homeowner, always ensure your installer is using Tier-1 ALMM-approved panels. Unapproved or degraded "B-grade" panels might seem cheaper initially, but they disqualify you from government subsidies and will fail to produce adequate power after a few years.
              </P>

              {/* Section 4 */}
              <H2 id="subsidy">4. PM Surya Ghar Yojana Subsidy in Meerut</H2>
              <P>
                The biggest catalyst for rooftop solar adoption in India right now is the incredible financial support provided by the government. Through the <Link href="/blog/pm-surya-ghar-subsidy-meerut" className="text-primary font-bold hover:underline">PM Surya Ghar: Muft Bijli Yojana</Link>, homeowners in Meerut can receive substantial subsidies deposited directly into their bank accounts.
              </P>
              <P>
                In Uttar Pradesh, the financial incentive is even sweeter. On top of the central government subsidy, the UP State Government provides an additional state-level subsidy, making Uttar Pradesh one of the most lucrative states in the country to go solar.
              </P>

              <ComparisonTable 
                headers={["System Capacity", "Central Subsidy", "UP State Subsidy", "Total Subsidy Available"]}
                rows={[
                  ["1 kW", "₹30,000", "₹15,000", "₹45,000"],
                  ["2 kW", "₹60,000", "₹30,000", "₹90,000"],
                  ["3 kW to 10 kW+", "₹78,000", "₹30,000", "₹1,08,000"],
                ]}
              />

              <H3>How to Apply & Claim Your Subsidy</H3>
              <P>
                To be eligible, you must own the home, have a valid electricity bill in your name from PVVNL, and the installation must be carried out by a registered, MNRE-approved vendor.
              </P>
              <P>
                <strong>The Kailash Solar Advantage:</strong> Navigating government portals, submitting technical documents, and chasing DISCOM officials for net metering can be a massive headache for the average homeowner. When you choose Kailash Solar, our dedicated backend team handles 100% of the paperwork. From the initial national portal registration to the final joint inspection and net meter installation, we ensure your subsidy is processed smoothly and swiftly.
              </P>

              {/* Mermaid Chart Placeholder - Markdown for visual flow */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 my-8 overflow-x-auto">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">Subsidy Process Flow</h4>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full md:w-1/4">
                    <p className="font-bold text-slate-800 text-sm">1. Registration</p>
                    <p className="text-xs text-slate-500 mt-1">Portal signup & feasibility approval</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-accent hidden md:block" />
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full md:w-1/4">
                    <p className="font-bold text-slate-800 text-sm">2. Installation</p>
                    <p className="text-xs text-slate-500 mt-1">System installed by Kailash Solar</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-accent hidden md:block" />
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full md:w-1/4">
                    <p className="font-bold text-slate-800 text-sm">3. Net Metering</p>
                    <p className="text-xs text-slate-500 mt-1">PVVNL inspection & meter swap</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-accent hidden md:block" />
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-full md:w-1/4">
                    <p className="font-bold text-slate-800 text-sm">4. Subsidy Credit</p>
                    <p className="text-xs text-slate-500 mt-1">Funds transferred to your bank</p>
                  </div>
                </div>
              </div>

              {/* Section 5 */}
              <H2 id="roi">5. Cost vs. Savings: The Financial Breakdown</H2>
              <P>
                Let us look at a practical, real-world financial breakdown to understand why rooftop solar is often considered a better investment than mutual funds or fixed deposits. We will use a standard <strong>3kW system</strong> as an example.
              </P>
              
              <ul className="space-y-4 mb-8 text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <li><strong className="text-slate-900">Estimated Project Cost:</strong> ₹1,70,000</li>
                <li><strong className="text-slate-900">Total Subsidy (Central + State):</strong> ₹1,08,000</li>
                <li><strong className="text-slate-900">Net Investment by Homeowner:</strong> ₹62,000</li>
                <li><strong className="text-slate-900">Average Monthly Generation:</strong> 360 Units</li>
                <li><strong className="text-slate-900">Average Monthly Savings (at ₹7.5/unit):</strong> ₹2,700</li>
                <li><strong className="text-slate-900">Annual Savings:</strong> ₹32,400</li>
              </ul>

              <P>
                At an annual savings rate of ₹32,400, your net investment of ₹62,000 is fully recovered in less than <strong>2 years</strong>! Even if you opt for premium elevated structures or slightly higher-capacity premium TOPCon panels that bring your net cost closer to ₹80,000, your payback period (ROI) is still an incredible <strong>2.5 to 3 years</strong>.
              </P>
              <P>
                Once the system has paid for itself, the electricity it generates for the remaining 22+ years of its warranted life is completely free. Over a 25-year period, a 3kW system will easily save you over <strong>₹8 Lakhs to ₹10 Lakhs</strong>, completely protecting you against future electricity tariff hikes.
              </P>

              {/* Section 6 */}
              <H2 id="decision-guide">6. Which System Size Should You Choose?</H2>
              <P>
                Choosing the right system size is critical. If you install a system that is too small, you will still receive high electricity bills. If you install a system that is too large, you are over-investing upfront (though you will have room to add heavy appliances like EVs or ACs later).
              </P>
              <P>
                Here is a quick decision matrix based on your average monthly electricity bill in Meerut:
              </P>

              <div className="grid md:grid-cols-2 gap-6 my-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-accent font-bold text-xl mb-2">Monthly Bill: ~₹2,000</div>
                  <div className="text-slate-900 font-bold text-lg mb-2">Recommended: 2kW System</div>
                  <p className="text-slate-600 text-sm">Perfect for small homes running basic lights, fans, a fridge, a TV, and perhaps a small cooler. Wipes out the bill completely.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-primary">
                  <div className="text-accent font-bold text-xl mb-2">Monthly Bill: ~₹3,500</div>
                  <div className="text-slate-900 font-bold text-lg mb-2">Recommended: 3kW System</div>
                  <p className="text-slate-600 text-sm">The most popular choice. Can easily handle standard household loads plus one 1.5-ton inverter air conditioner used at night.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-accent font-bold text-xl mb-2">Monthly Bill: ~₹6,000</div>
                  <div className="text-slate-900 font-bold text-lg mb-2">Recommended: 5kW System</div>
                  <p className="text-slate-600 text-sm">Ideal for multi-story homes or joint families running 2 to 3 air conditioners, heavy water pumps, and microwaves.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-accent font-bold text-xl mb-2">Monthly Bill: ₹10,000+</div>
                  <div className="text-slate-900 font-bold text-lg mb-2">Recommended: 10kW System</div>
                  <p className="text-slate-600 text-sm">Best for very large residential villas, EV owners, or small-scale commercial establishments and clinics.</p>
                </div>
              </div>

              {/* Section 7 */}
              <H2 id="process">7. The Step-by-Step Installation Process</H2>
              <P>
                Many homeowners hesitate because they assume installing solar is a long, highly disruptive construction process. With an experienced EPC company, it is actually incredibly fast and clean. Here is how we do it at Kailash Solar:
              </P>

              <ol className="space-y-6 my-8">
                <li className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0">1</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Free Site Visit & Consultation</h4>
                    <p className="text-slate-600">Our engineers visit your property in Meerut, assess your roof space, analyze your shading profile, and review your historical electricity bills.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0">2</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Design & Custom Quotation</h4>
                    <p className="text-slate-600">We create a 3D structural design tailored to your roof and provide a highly transparent quotation breaking down the <strong>Solar Panel Price in Meerut</strong>, taxes, and expected subsidies.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0">3</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Fast, Safe Installation</h4>
                    <p className="text-slate-600">Once approved, our in-house installation crew mounts the GI structures, secures the panels, and wires the inverter. The physical installation usually takes just 1 to 2 days.</p>
                  </div>
                </li>
                <li className="flex gap-5">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shrink-0">4</div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Net Metering & Subsidy</h4>
                    <p className="text-slate-600">We liaison with PVVNL officials to get your bi-directional net meter installed and submit the final commissioning report to the national portal so your subsidy is released directly to your bank account.</p>
                  </div>
                </li>
              </ol>
              
              <div className="w-full aspect-[16/9] bg-slate-200 rounded-2xl flex items-center justify-center my-10 border border-slate-300">
                <span className="text-slate-500 font-medium text-center px-4 text-sm md:text-base">[Image Placeholder: Infographic showing the timeline of a typical solar installation]</span>
              </div>

              {/* Section 8 */}
              <H2 id="why-kailash">8. Why Choose Kailash Solar in Meerut?</H2>
              
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 mb-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Meerut's #1 Choice & Most Trusted Solar Company</h3>
                <p className="text-slate-700 leading-relaxed">
                  With hundreds of successful residential and commercial installations across the city, Kailash Solar has proudly earned the reputation as the <strong>most trusted and #1 solar company in Meerut</strong>. We do not just sell panels; we build 25-year relationships with our customers by prioritizing strict engineering standards, transparent pricing, and unparalleled after-sales service.
                </p>
              </div>

              <P>
                As a homeowner, you are making an investment meant to last over two decades. Choosing a fly-by-night installer offering unrealistically cheap rates is a massive risk that often leads to rejected subsidies, poor wiring, and zero support when things break down. Here is why locals consistently choose us:
              </P>
              
              <ul className="grid sm:grid-cols-2 gap-4 my-8">
                <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">MNRE & UP State Approved Vendor</span>
                </li>
                <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">100% In-House Professional Engineers</span>
                </li>
                <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Premium Tier-1 Panels Only (Adani, Waaree)</span>
                </li>
                <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">End-to-End Net Metering Liaison</span>
                </li>
                <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Transparent Pricing (No Hidden Fees)</span>
                </li>
                <li className="bg-white border border-slate-200 p-4 rounded-xl flex items-start gap-3 shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">Local Meerut Support for 25 Years</span>
                </li>
              </ul>

              <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center my-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/Happyfamily.png')] bg-cover bg-center" />
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">Stop Paying Huge Bills Today</h3>
                  <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Book a free, no-obligation site survey with our solar experts today. Find out exactly how much you can save.</p>
                  <CTAButton className="h-14 px-10 text-lg rounded-full bg-accent hover:bg-accent/90 text-white" text="Book Free Site Visit" />
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-16 pt-12 border-t border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-100">
                      <AccordionTrigger className="text-left font-bold text-lg py-5 hover:text-primary transition-colors hover:no-underline">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 leading-relaxed pb-5 text-base">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block space-y-8 sticky top-28 h-fit">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xl mb-4">Calculate Your Savings</h4>
                <p className="text-slate-600 text-sm mb-6">Enter your monthly bill and see how much a solar system will save you over 25 years.</p>
                <Link href="/quote">
                  <Button className="w-full font-bold bg-primary hover:bg-primary/90 text-white">
                    Open Calculator
                  </Button>
                </Link>
              </div>

              <div className="bg-accent/10 p-6 rounded-2xl border border-accent/20">
                <h4 className="font-bold text-slate-900 text-xl mb-4">Need Help?</h4>
                <p className="text-slate-700 text-sm mb-6">Speak directly to a solar expert in Meerut for immediate guidance on pricing and subsidies.</p>
                <a href="tel:+918999999654">
                  <Button className="w-full font-bold bg-white text-accent border border-accent hover:bg-accent hover:text-white transition-colors">
                    <Phone className="w-4 h-4 mr-2" /> 89999 99654
                  </Button>
                </a>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl text-white">
                <h4 className="font-bold text-lg mb-3">PM Surya Ghar Subsidy</h4>
                <p className="text-white/80 text-sm mb-4">Learn everything about the massive ₹1,08,000 UP government subsidy scheme.</p>
                <Link href="/blog/pm-surya-ghar-subsidy-meerut" className="text-accent text-sm font-bold flex items-center hover:underline">
                  Read Full Guide <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </main>

      <StickyCTA />
      <Footer />
    </div>
  );
};

export default BlogSolarPanelPriceMeerut;
