"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, ArrowRight, CheckCircle2, MapPin, Zap, TrendingUp, Phone,  BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Button } from '@/components/ui/button';
import { BookVisitModal } from '@/components/BookVisitModal';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
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
const SLUG = '/blog/powering-meerut-with-solar-kailash-solar';

const faqs = [
  {
    q: 'Is rooftop solar suitable for homes in Meerut?',
    a: 'Yes, Meerut receives excellent sunlight for most of the year. Rooftop solar panels are highly suitable for homes with an open terrace, tin shed, or RCC roof.',
  },
  {
    q: 'How much can I save with solar panels?',
    a: 'Your savings depend on your electricity usage and the size of your solar system. For example, a home spending ₹4,000 per month could see a significant reduction in their bill. However, actual savings vary by household and are not guaranteed to be 100%.',
  },
  {
    q: 'How many solar panels does a home need?',
    a: 'There is no fixed number. It depends entirely on your electricity consumption (monthly bill) and available roof space. We check your bill and recommend a suitable size, usually between 2kW to 5kW for most homes.',
  },
  {
    q: 'Can I install solar without paying the full amount upfront?',
    a: 'Yes, depending on eligibility and financing approval, you may have zero-upfront-cost or flexible EMI options available to make the switch to solar easier without paying everything on day one.',
  },
  {
    q: 'Does Kailash Solar provide solar installation in Meerut?',
    a: 'Yes, we are a trusted local solar company providing complete residential solar installation services across Meerut, including Ganga Nagar, Shastri Nagar, and surrounding areas.',
  },
  {
    q: 'Can solar reduce my monthly electricity bill?',
    a: 'Yes. By generating your own electricity during the day, you reduce the amount of electricity you purchase from the grid, which significantly lowers your monthly electricity expenses.',
  },
  {
    q: 'How do I know what size solar system my home needs?',
    a: 'The easiest way is to share your latest electricity bill with us. We will look at your monthly units consumed and calculate the suitable system size for your specific home.',
  },
  {
    q: 'Is government subsidy available for residential solar?',
    a: 'Yes, eligible residential homeowners can apply for subsidies under schemes like the PM Surya Ghar Yojana. We guide you through the documentation process.',
  }
];

const CTAButton = ({ text, className = '' }: { text: string, className?: string }) => {
  return (
    <DialogTrigger asChild>
      <Button className={`font-bold transition-transform active:scale-95 ${className}`}>
        {text}
      </Button>
    </DialogTrigger>
  );
};

const H2 = ({ children, id }: { children: React.ReactNode, id?: string }) => (
  <h2 id={id} className="text-2xl md:text-3xl font-bold text-slate-900 mt-12 mb-6 font-montserrat scroll-mt-24">
    {children}
  </h2>
);

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mt-8 mb-4 font-montserrat">
    {children}
  </h3>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
    {children}
  </p>
);


const ChecklistTable = ({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | React.ReactNode)[][];
}) => (
  <div className="my-8 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
    <Table className="w-full">
      <TableHeader className="bg-slate-50">
        <TableRow>
          {headers.map((h, i) => (
            <TableHead key={i} className="font-bold text-slate-900 h-12">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex} className="text-slate-700 py-4">
                {cellIndex === 0 ? <strong>{cell}</strong> : cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

const BlogPoweringMeerutWithSolar = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Powering Meerut with Solar',
          text: 'How Kailash Solar Is Helping Homes Save on Electricity Bills.',
          url: `${SITE_URL}${SLUG}`,
        });
      } else {
        await navigator.clipboard.writeText(`${SITE_URL}${SLUG}`);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/20">
      <Header />
      
      <main className="pb-16 sm:pb-24">
        {/* Hero Section */}
        <div className="bg-slate-900 pt-32 pb-16 md:pt-40 md:pb-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          </div>
          <div className="max-w-4xl mx-auto relative z-10">
            <Link 
              href="/" 
              className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors mb-8 font-medium text-white/70"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary-200 text-sm font-medium border border-primary/30 text-white">
                Solar Guide
              </span>
              <span className="text-slate-400 text-sm">Updated 2026</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.15] font-montserrat tracking-tight">
              Powering Meerut with Solar: How Kailash Solar Is Helping Homes Save on Electricity Bills
            </h1>
            
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-8">
              See how Kailash Solar is helping homes in Meerut switch to rooftop solar, reduce electricity bills, and make solar installation simple with easy options.
            </p>

            <div className="flex items-center gap-4 text-slate-400">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Article
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <article className="max-w-6xl mx-auto px-4 mt-8 md:mt-12">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            
            {/* Main Content */}
            <div className="bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-slate-200">
              
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10 shadow-sm mt-8">
                <h3 className="text-lg font-bold text-slate-900 mb-4 font-montserrat flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Table of Contents
                </h3>
                <ul className="space-y-3">
                  <li><a href="#why-solar-meerut" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Why Are More Homes Looking at Solar?</a></li>
                  <li><a href="#how-solar-helps" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> How Solar Helps Reduce Electricity Bills</a></li>
                  <li><a href="#easier-in-meerut" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Why Solar is Becoming Easier</a></li>
                  <li><a href="#show-the-numbers" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> We Show the Numbers, Not Just Panels</a></li>
                  <li><a href="#from-enquiry-to-installation" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> From First Question to Installation</a></li>
                  <li><a href="#why-choose-us" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Why Choose Kailash Solar?</a></li>
                </ul>
              </div>

              <H2 id="why-solar-meerut">Why Are More Homes in Meerut Looking at Solar?</H2>
              <P>
                Electricity is something every home needs. Fans, ACs, refrigerators, TVs, water pumps, lights and other appliances all add to monthly electricity consumption.
              </P>
              <P>
                For example, imagine a home paying:
                <br />
                <strong>₹4,000 per month × 12 months = ₹48,000 per year</strong>
              </P>
              <P>
                That means the family could spend around:
                <br />
                <strong>₹2,40,000 in 5 years</strong>
                <br />
                on electricity at the same monthly bill, without owning the system that produces that electricity.
              </P>
              <P>
                This is why many homeowners are asking: "Can I use my own rooftop to generate electricity?" The answer is yes — a rooftop solar panel system can be a practical option for many homes in Meerut.
              </P>

              <H2 id="how-solar-helps">How Rooftop Solar Can Help Reduce Your Electricity Bill</H2>
              <P>
                A rooftop solar system uses solar panels installed on your home's roof to generate electricity from sunlight. Instead of getting all your electricity from the grid, your solar system can generate electricity during the day.
              </P>
              <P>
                The amount you can save depends on several things, including:
              </P>
              <ul className="list-disc pl-6 mb-6 text-slate-600 space-y-2 text-base md:text-lg">
                <li>Your monthly electricity consumption</li>
                <li>Your electricity tariff</li>
                <li>Solar system size</li>
                <li>Available rooftop space</li>
                <li>Sunlight at your property</li>
                <li>System performance</li>
                <li>Applicable policies and billing arrangements</li>
              </ul>
              <P>
                Because of these factors, there is no single saving number that is correct for every home. 
              </P>

              <H2 id="simple-example">A Simple Electricity Bill Example</H2>
              <P>
                Suppose a family has an electricity bill of around <strong>₹4,000 per month</strong>. Their yearly electricity expense is approximately:
                <br />
                <strong>₹4,000 × 12 = ₹48,000</strong>
              </P>
              <P>
                Now imagine a properly sized solar system reduces a significant part of the electricity they need to purchase from the grid. The actual saving will depend on the home's usage and the solar system installed, but the important point is this: <strong>Solar can turn part of your monthly electricity expense into an investment in your own energy system.</strong>
              </P>

              <H2 id="easier-in-meerut">Why Solar for Home in Meerut Is Becoming Easier</H2>
              <P>
                One of the biggest problems people face is not the technology. It is understanding what system they actually need.
              </P>
              <P>
                People often ask:
              </P>
              <ul className="list-disc pl-6 mb-6 text-slate-600 space-y-2 text-base md:text-lg">
                <li>How many solar panels do I need?</li>
                <li>How much roof space is required?</li>
                <li>What will my solar system cost?</li>
                <li>How much electricity can it generate?</li>
                <li>How much can I save?</li>
                <li>What subsidy can I get?</li>
                <li>Which solar panel should I buy?</li>
                <li>Which inverter is suitable?</li>
                <li>Who will install and maintain it?</li>
              </ul>
              
              <H2 id="kailash-makes-simple">How Kailash Solar Makes Solar Simple</H2>
              <P>
                At Kailash Solar, we want to make this process easier. Instead of simply telling a customer, “Buy this many panels,” we first understand their electricity requirement and then suggest a suitable solution.
              </P>

              <H2 id="financing-options">Making Solar Easier With Flexible Payment Options</H2>
              <P>
                For many families, the biggest concern is the initial cost of a solar installation. That is why we also work to make the process easier with zero-upfront-cost or flexible financing options where applicable and available. This depends entirely on the customer's eligibility, financing arrangement, and project terms.
              </P>
              <P>
                This means homeowners may not always have to think: "I need to arrange the entire solar cost before I can start."
              </P>
              <P>
                Instead, eligible customers can explore an option that makes the initial transition to solar easier. The exact cost, financing, EMI, and eligibility should always be checked for the individual project. This is important because we don't want to make a generic promise to every customer. We want to show the customer the actual numbers for their own home.
              </P>

              <H2 id="show-the-numbers">We Show the Numbers, Not Just the Solar Panels</H2>
              <P>
                This is one of the most important parts of our approach. Before choosing a solar panel for home, customers should understand the numbers. For example, we check:
              </P>
              
              <ChecklistTable 
                headers={['What we check', 'Why it matters']}
                rows={[
                  ['Monthly electricity bill', 'Understand current spending'],
                  ['Electricity consumption', 'Decide suitable system size'],
                  ['Rooftop space', 'Check installation feasibility'],
                  ['Solar generation', 'Estimate expected energy production'],
                  ['System cost', 'Understand the investment required'],
                  ['Available subsidy', 'Understand applicable support'],
                  ['Financing/EMI options', 'Understand upfront payment'],
                  ['Expected savings', 'Compare solar with current electricity cost'],
                ]}
              />
              <P>
                This gives homeowners a much clearer picture of what they are actually getting.
              </P>

              <H2 id="from-enquiry-to-installation">From Your First Question to Solar Installation</H2>
              <P>
                Getting a residential solar system in Meerut should not feel like running from one person to another. We have made the process incredibly simple:
              </P>

              <H3>1. Share Your Electricity Bill</H3>
              <P>We first understand your current electricity consumption by reviewing your recent bill.</P>

              <H3>2. Understand Your Home's Requirement</H3>
              <P>We check your rooftop, available space, and other important requirements.</P>

              <H3>3. Get a Suitable Solar System Recommendation</H3>
              <P>We recommend a residential solar system based on your actual requirement rather than simply selling the biggest system possible.</P>

              <H3>4. Understand the Cost and Savings</H3>
              <P>You can understand the estimated system cost, generation, expected savings, and applicable options (like subsidies or EMIs).</P>

              <H3>5. Solar Installation</H3>
              <P>Our professional technical team installs the solar panels at your property safely.</P>

              <H3>6. Testing and Commissioning</H3>
              <P>The system is thoroughly checked to make sure everything is working properly before it goes live.</P>

              <H3>7. After-Sales Support</H3>
              <P>Solar is a long-term investment, so proper service and technical support are also important to keep it running smoothly.</P>

              <H2 id="why-kailash-doing-this">Why We Are Doing This</H2>
              <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 my-8 shadow-sm">
                <p className="text-slate-700 leading-relaxed italic">
                  At Kailash Solar, we believe solar should not feel complicated or out of reach for an ordinary family. A homeowner should be able to show their electricity bill, understand what system they need, see the expected cost and generation, understand available options, and make a decision with confidence. Our goal is to make this process easier for families in Meerut and help more homes generate their own clean electricity.
                </p>
              </div>

              <H2 id="helping-meerut">How Kailash Solar Is Helping Meerut Go Solar</H2>
              <P>
                For us, solar is not only about installing panels. It is about helping people make a better decision about their energy. We have helped many homeowners across Meerut, in areas like Ganga Nagar and Shastri Nagar, make the switch to a rooftop solar panel system.
              </P>
              <P>
                A family that installs solar can potentially:
                <br />
                <strong>Generate electricity → Reduce grid dependence → Reduce electricity expenses → Use their rooftop productively</strong>
              </P>
              <P>
                And when more homes start generating clean electricity, the impact becomes bigger than just one household. One home going solar is one step. Hundreds of homes going solar can start changing the way a city uses energy.
              </P>

              <H2 id="why-choose-us">Why Choose Kailash Solar for Your Home?</H2>
              <P>
                Choosing a solar company in Meerut is an important decision because a solar system is not something you install for a few months. It is a long-term investment.
              </P>
              <P>
                At Kailash Solar, we are a trusted solar company serving homeowners in Meerut. We focus on making the complete process easier for homeowners — from understanding their electricity requirement to system selection, professional installation, and after-sales support.
              </P>
              <P>
                Our focus is simple: <strong>Right system. Clear numbers. Professional installation. Long-term support.</strong>
              </P>
              <P>
                We want homeowners to understand what they are buying instead of making a decision only because someone told them that solar is good.
              </P>

              <H2 id="future-of-energy">The Future of Energy in Meerut Is Changing</H2>
              <P>
                Meerut is growing, and the energy needs of its homes are growing with it. Solar gives homeowners another way to think about electricity. Instead of only asking:
                <br />
                <em>“How much is my electricity bill this month?”</em>
                <br />
                people can start asking:
                <br />
                <em>“How much of my own electricity can I generate?”</em>
              </P>
              <P>
                That is the change we want to be part of. At Kailash Solar, we want to help more homes in Meerut use their rooftops to generate clean energy, reduce their electricity expenses where possible, and become more energy independent. We are not just installing solar panels on rooftops. We are helping Meerut move towards a smarter, cleaner and more affordable energy future — one home at a time.
              </P>

              <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center my-12 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">Ready to Check Solar for Your Home?</h3>
                  <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                    Thinking about solar for your home in Meerut? Instead of guessing the system size or cost, start with your electricity bill.
                  </p>
                  <Dialog>
                    <CTAButton className="h-14 px-10 text-lg rounded-full bg-accent hover:bg-accent/90 text-white" text="Book a Free Consultation" />
                    <BookVisitModal />
                  </Dialog>
                </div>
              </div>

              {/* FAQs */}
              <div className="mt-16 pt-12 border-t border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900 mb-8 font-montserrat">Frequently Asked Questions</h2>
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
                <p className="text-slate-600 text-sm mb-6">Enter your monthly bill and see how much a solar system will save you over the years.</p>
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
                <p className="text-white/80 text-sm mb-4">Learn everything about the government subsidy scheme available in UP.</p>
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

export default BlogPoweringMeerutWithSolar;
