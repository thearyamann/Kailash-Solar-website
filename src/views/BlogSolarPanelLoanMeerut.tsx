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
  { q: "Can I get a loan for solar panels in Meerut?", a: "Yes, homeowners in Meerut can easily finance their rooftop solar installations through banks like SBI, PNB, and others using the Jan Samarth portal under the PM Surya Ghar scheme." },
  { q: "What is the SBI Surya Ghar solar loan?", a: "The SBI Surya Ghar loan is a specialized loan product designed to fund residential rooftop solar installations. It offers up to ₹6 lakh for systems up to 10 kW, with a repayment tenure of up to 10 years." },
  { q: "What is the PNB rooftop solar loan?", a: "PNB's solar loan offers up to ₹2 lakh for systems up to 3 kW, and up to ₹6 lakh for systems above 3 kW up to 10 kW, with a 10-year repayment option and varying margin requirements." },
  { q: "How much loan can I get for a 3kW solar system?", a: "For a 3kW system, you can typically get a loan covering the net cost (after expected subsidy) or up to ₹2 lakh, depending on the bank's margin requirements." },
  { q: "How much EMI is required for a 5kW solar system?", a: "As an illustration, financing ₹1,92,000 for a 5kW system over 5 years at 5.75% interest results in an EMI of around ₹3,688. This depends on the final system price, loan amount, and interest rate." },
  { q: "Can I get PM Surya Ghar subsidy if I take a solar loan?", a: "Yes, you can absolutely claim the PM Surya Ghar subsidy even if you finance the system. The loan and the subsidy are designed to work together." },
  { q: "Does the ₹1,08,000 subsidy reduce my loan amount?", a: "The ₹1,08,000 is a maximum potential subsidy for eligible consumers. Depending on your bank arrangement, you may get a loan for the net amount (price minus subsidy), or the loan may cover the full amount with the subsidy later credited to your loan account." },
  { q: "What documents are required for a solar loan?", a: "You generally need KYC documents (Aadhaar/PAN), latest electricity bill, property/ownership documents, bank statements, income proof, and the official solar quotation." },
  { q: "Is a 5-year or 10-year solar loan better financially?", a: "A 5-year loan means higher EMIs but lower total interest paid. A 10-year loan offers lower, more manageable EMIs but higher total interest over the life of the loan." },
  { q: "Is solar EMI lower than an electricity bill?", a: "Not necessarily initially. While it can be comparable or lower, it depends on your electricity consumption, tariff, loan amount, and tenure. However, once the loan is paid off, the electricity generated is essentially free for the lifespan of the panels." },
  { q: "Can commercial and industrial customers get the same PM Surya Ghar subsidy?", a: "No, the PM Surya Ghar subsidy of up to ₹1,08,000 (Central + UP State) is strictly for eligible residential consumers." },
  { q: "How do I calculate my solar EMI?", a: "EMI is calculated using the formula: P × r × (1+r)^n / ((1+r)^n − 1). P is the principal, r is the monthly interest rate, and n is the tenure in months." },
  { q: "Can I apply for a solar loan through Jan Samarth?", a: "Yes, the National Portal for PM Surya Ghar integrates with Jan Samarth to help you apply for solar financing smoothly." },
  { q: "What happens to the subsidy after solar installation?", a: "After successful installation, net metering, and joint inspection, the final commissioning report is generated. Once approved, the subsidy is disbursed according to the scheme's rules, often directly to the consumer's linked bank account or adjusted against the loan account." }
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

const H3 = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-xl md:text-2xl font-bold text-slate-800 mt-8 mb-4 font-montserrat ${className}`}>
    {children}
  </h3>
);

const P = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-slate-700 leading-relaxed mb-6 text-[17px] ${className || ''}`}>{children}</p>
);

const BlogSolarPanelLoanMeerut = () => {
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
          title: 'Solar Panel Loan & EMI in Meerut',
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

      <div className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 h-14 flex items-center justify-between transition-transform duration-300 ${scrollProgress > 2 ? 'translate-y-0' : '-translate-y-full'}`}>
        <Link href="/solar-company-meerut" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <span className="font-bold text-slate-900 text-sm truncate max-w-[200px]">Solar Loan & EMI Guide</span>
        <button 
          onClick={handleShare}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95"
        >
          <Share2 className="w-4 h-4 text-slate-700" />
        </button>
        <div className="absolute bottom-0 left-0 h-[2px] bg-primary/20 w-full">
          <div 
            className="h-full bg-primary transition-all duration-150 ease-out" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>

      <main className="pt-0">
        <section className="bg-slate-50 pt-12 pb-12 md:pt-16 md:pb-16 border-b border-slate-200">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
                <span className="text-accent text-sm font-bold uppercase tracking-wider">
                  Financial Guide (2026 Updated)
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-6 text-slate-900 font-montserrat">
                Solar Panel Loan in Meerut: EMI, SBI & PNB Loan Options, Subsidy & Costs
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
                Learn how to finance a 3kW, 4kW, or 5kW solar system in Meerut. Compare bank loans, calculate EMI, and understand how the PM Surya Ghar subsidy really works.
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
            
            <div className="max-w-[800px] w-full min-w-0">

              <div className="mb-10 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <img 
                  src="/loansolar.png" 
                  alt="Solar Panel Loan and EMI Options in Meerut" 
                  className="w-full h-auto object-cover max-h-[450px]" 
                />
              </div>
              
              <div className="bg-blue-50/50 rounded-2xl p-6 md:p-8 border border-blue-100 mb-12">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Table of Contents</h3>
                <ul className="space-y-3">
                  <li><a href="#intro" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Why Finance Your Solar System?</a></li>
                  <li><a href="#process" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> How Solar Loan + Subsidy Works</a></li>
                  <li><a href="#subsidy" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> PM Surya Ghar Subsidy Calculation</a></li>
                  <li><a href="#sbi" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> SBI Surya Ghar Solar Loan</a></li>
                  <li><a href="#pnb" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> PNB Rooftop Solar Loan</a></li>
                  <li><a href="#emi-3kw" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> 3kW Solar System EMI Example</a></li>
                  <li><a href="#emi-4kw" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> 4kW Solar System EMI Example</a></li>
                  <li><a href="#emi-5kw" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> 5kW Solar System EMI Example</a></li>
                  <li><a href="#emi-vs-bill" className="text-primary font-medium hover:underline flex items-center gap-2"><ArrowRight className="w-4 h-4" /> EMI vs Electricity Bill Comparison</a></li>
                </ul>
              </div>

              <div className="prose prose-slate max-w-none">
                <H2 id="intro">The Upfront Cost Challenge</H2>
                <P>
                  A solar system can significantly reduce dependence on grid electricity, but the biggest barrier for many homeowners is the upfront installation cost. 
                </P>
                <P>
                  Instead of paying the entire amount at once, eligible homeowners may finance the installation through a solar loan and pay it through monthly EMIs. 
                </P>
                <P>
                  Depending on the system cost, electricity consumption, subsidy, tariff, and loan terms, the monthly solar savings may offset a significant portion of the EMI. In this guide, we break down exactly how solar financing in Meerut and Western Uttar Pradesh works.
                </P>

                <H2 id="process">How Solar Loan + Subsidy Works</H2>
                <P>
                  Getting a solar loan isn't entirely separate from the installation process—they run parallel. Here is the complete process:
                </P>
                <ol className="space-y-3 mb-6">
                  <li><strong>Choose capacity:</strong> Finalize the required solar capacity based on your electricity bill.</li>
                  <li><strong>Get a quotation:</strong> Receive a quotation from an eligible/empanelled vendor like Kailash Solar.</li>
                  <li><strong>Apply for subsidy:</strong> Apply through the National Portal for PM Surya Ghar.</li>
                  <li><strong>Apply for financing:</strong> Apply for an eligible solar loan through a bank or via the Jan Samarth portal.</li>
                  <li><strong>Installation:</strong> Complete installation and all DISCOM/net-metering requirements.</li>
                  <li><strong>Verification:</strong> The installation undergoes joint inspection and a commissioning report is generated.</li>
                  <li><strong>Subsidy processing:</strong> Eligible subsidy/CFA is processed according to the scheme rules.</li>
                </ol>
                <P>
                  <strong>Important Note:</strong> Subsidy eligibility, approval, and disbursement are subject to government rules and the applicable process. In some financing arrangements, the subsidy may subsequently be credited or adjusted against the loan account, or transferred according to the bank's internal process.
                </P>

                <H2 id="subsidy">PM Surya Ghar Subsidy Calculation</H2>
                <P>
                  To understand your loan amount, you must first understand the subsidy. For eligible residential consumers, the central PM Surya Ghar Muft Bijli Yojana provides:
                </P>
                <ul className="space-y-2 mb-4">
                  <li><strong>1 kW</strong> → ₹30,000 central subsidy</li>
                  <li><strong>2 kW</strong> → ₹60,000 central subsidy</li>
                  <li><strong>3 kW</strong> → ₹78,000 central subsidy</li>
                  <li><strong>Above 3 kW</strong> → central subsidy remains capped at ₹78,000</li>
                </ul>
                <P>
                  Additionally, the Uttar Pradesh government (UPNEDA) offers an additional state subsidy of <strong>₹15,000 per kW up to 2 kW</strong> (maximum ₹30,000) for eligible households. 
                </P>
                <P>
                  Therefore, an eligible UP household installing a 3kW or larger system can potentially receive:
                  <br/>• Central subsidy: ₹78,000
                  <br/>• UP additional subsidy: ₹30,000
                  <br/><strong>Total potential benefit: ₹1,08,000</strong>
                </P>
                <p className="text-sm text-slate-500 italic mb-6">
                  *Note: Eligibility conditions apply. This is exclusively for residential consumers. Subsidy rules can change, and this subsidy is not a guaranteed upfront discount from a vendor's quotation. Commercial and industrial systems do not receive this residential subsidy.
                </p>
                
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 my-8">
                  <h4 className="font-bold text-slate-900 text-lg mb-2">Important: Don't Misunderstand the ₹1,08,000 Subsidy</h4>
                  <p className="text-slate-700">₹1,08,000 is a maximum potential combined subsidy figure for an eligible residential consumer in Uttar Pradesh under the applicable central and state subsidy structure. It is not a universal cash discount available to every solar buyer. The subsidy requires government approval, proper net-metering installation, and verification before disbursement.</p>
                </div>

                <H2 id="sbi">SBI Surya Ghar Loan for Solar Rooftop</H2>
                <P>
                  The State Bank of India offers a dedicated residential rooftop solar financing product. 
                </P>
                <ul className="space-y-2 mb-6">
                  <li><strong>Loan Amount:</strong> Up to ₹6 lakh.</li>
                  <li><strong>System Capacity:</strong> For systems up to 10 kW.</li>
                  <li><strong>Tenure:</strong> Repayment period up to 120 months (10 years).</li>
                  <li><strong>Interest Rate:</strong> Generally starting around 5.75% for loans up to ₹2 lakh, and around 7.90% for larger amounts.</li>
                  <li><strong>Application:</strong> Applications can be routed through the Jan Samarth portal.</li>
                  <li><strong>Margin:</strong> Margin/down-payment requirements and co-borrower rules apply based on the specific loan amount.</li>
                </ul>
                <P className="text-sm font-semibold text-slate-600">
                  *Interest rates, eligibility, loan amount, margin, and other terms are subject to the bank's current policy and applicant profile.
                </P>

                <H2 id="pnb">PNB Rooftop Solar Loan</H2>
                <P>
                  Punjab National Bank also provides robust financing options for residential rooftop systems under the PM Surya Ghar scheme.
                </P>
                <ul className="space-y-2 mb-6">
                  <li><strong>Loan Amount:</strong> Up to ₹2 lakh for systems up to 3 kW, and up to ₹6 lakh for systems above 3 kW (up to 10 kW).</li>
                  <li><strong>Tenure:</strong> Maximum tenure of 10 years.</li>
                  <li><strong>Margin:</strong> Typically a 10% margin is required for loans up to ₹2 lakh, and 20% for loans exceeding ₹2 lakh.</li>
                  <li><strong>Interest Rate:</strong> Generally floating rates starting in the range of 6.5% to 9.25%, depending on the amount and borrower profile.</li>
                  <li><strong>Application:</strong> Jan Samarth application route is supported.</li>
                </ul>
                <P className="text-sm font-semibold text-slate-600">
                  *Final approval, exact interest rates, CIBIL, and income requirements depend on the bank's assessment at the time of application.
                </P>

                <H2 id="comparison">SBI vs PNB: A Quick Comparison</H2>
                <div className="my-8 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <Table className="w-full">
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-bold text-slate-900 p-4">Feature</TableHead>
                        <TableHead className="font-bold text-slate-900 p-4">SBI Surya Ghar</TableHead>
                        <TableHead className="font-bold text-slate-900 p-4">PNB Rooftop Solar Loan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Maximum Loan</TableCell>
                        <TableCell className="p-4 text-slate-600">Up to ₹6 lakh</TableCell>
                        <TableCell className="p-4 text-slate-600">Up to ₹6 lakh</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Maximum Tenure</TableCell>
                        <TableCell className="p-4 text-slate-600">120 months (10 years)</TableCell>
                        <TableCell className="p-4 text-slate-600">10 years</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-bold text-slate-700 p-4">Application Route</TableCell>
                        <TableCell className="p-4 text-slate-600">Jan Samarth / Branch</TableCell>
                        <TableCell className="p-4 text-slate-600">Jan Samarth / Branch</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <P>
                  Which option is suitable depends on your loan amount, CIBIL profile, income, existing relationship with the bank, and the bank's current terms.
                </P>

                <H2 id="emi-3kw">3kW Solar System EMI Example</H2>
                <P>
                  Let's look at a realistic, illustrative example for a 3kW system. 
                </P>
                <div className="bg-emerald-50 p-6 md:p-8 rounded-2xl border-2 border-emerald-200 mb-6 shadow-lg shadow-emerald-900/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Example</div>
                  <h4 className="font-bold text-emerald-900 text-lg mb-4 font-montserrat">3kW Cost Breakdown</h4>
                  <ul className="space-y-3 text-emerald-950 text-base md:text-lg mb-6">
                    <li className="flex justify-between items-center pb-3 border-b border-emerald-200/60">
                      <span>Illustrative System Price</span> <strong>₹2,00,000</strong>
                    </li>
                    <li className="flex justify-between items-center pb-3 border-b border-emerald-200/60">
                      <span className="text-emerald-700">Eligible Subsidy (Max)</span> <strong className="text-emerald-600">-₹1,08,000</strong>
                    </li>
                    <li className="flex justify-between items-center pt-2">
                      <span className="font-bold">Net Loan Amount</span> <strong className="text-2xl text-primary font-bold">₹92,000</strong>
                    </li>
                  </ul>
                  
                  <div className="bg-white rounded-xl p-5 border border-emerald-100 mb-4">
                    <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">How the EMI Actually Works (at 5.75%)</p>
                    <p className="text-sm text-slate-600 mb-4">Banks usually disburse the full project cost initially. When your subsidy arrives (usually in 20-30 days), it gets deposited into the loan account, and your EMI drops.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 mb-1 uppercase">Step 1: Initial EMI</span>
                        <span className="block text-xs text-slate-500 mb-2">(Calculated on full ₹2,00,000 for 5 yrs)</span>
                        <strong className="text-2xl text-slate-400 line-through">₹3,842<span className="text-sm font-normal text-slate-400">/mo</span></strong>
                      </div>
                      <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200 relative overflow-hidden">
                        <span className="block text-xs font-bold text-emerald-700 mb-1 uppercase">Step 2: Revised EMI</span>
                        <span className="block text-xs text-emerald-600 mb-2">(After ₹1,08,000 subsidy drops in)</span>
                        <strong className="text-3xl text-emerald-700">₹1,767<span className="text-base font-normal text-emerald-600">/mo</span></strong>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                  <em>Illustrative EMI — actual EMI depends on sanctioned loan amount, interest rate, tenure, margin, and bank charges.</em>
                </p>

                <H2 id="emi-4kw">4kW Solar System EMI Example</H2>
                <P>
                  For a 4kW system, remember that the central subsidy remains capped at ₹78,000. For eligible UP consumers, adding the state subsidy (capped at ₹30,000) brings the maximum potential subsidy to ₹1,08,000.
                </P>
                <div className="bg-blue-50 p-6 md:p-8 rounded-2xl border-2 border-blue-200 mb-6 shadow-lg shadow-blue-900/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Example</div>
                  <h4 className="font-bold text-blue-900 text-lg mb-4 font-montserrat">4kW Cost Breakdown</h4>
                  <ul className="space-y-3 text-blue-950 text-base md:text-lg mb-6">
                    <li className="flex justify-between items-center pb-3 border-b border-blue-200/60">
                      <span>Illustrative System Price</span> <strong>₹2,50,000</strong>
                    </li>
                    <li className="flex justify-between items-center pb-3 border-b border-blue-200/60">
                      <span className="text-blue-700">Eligible Subsidy (Max)</span> <strong className="text-emerald-600">-₹1,08,000</strong>
                    </li>
                    <li className="flex justify-between items-center pt-2">
                      <span className="font-bold">Net Loan Amount</span> <strong className="text-2xl text-primary font-bold">₹1,42,000</strong>
                    </li>
                  </ul>
                  
                  <div className="bg-white rounded-xl p-5 border border-blue-100">
                    <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">How the EMI Actually Works (at 5.75%)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 mb-1 uppercase">Step 1: Initial EMI</span>
                        <span className="block text-xs text-slate-500 mb-2">(Calculated on full ₹2,50,000 for 5 yrs)</span>
                        <strong className="text-2xl text-slate-400 line-through">₹4,803<span className="text-sm font-normal text-slate-400">/mo</span></strong>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 relative overflow-hidden">
                        <span className="block text-xs font-bold text-blue-700 mb-1 uppercase">Step 2: Revised EMI</span>
                        <span className="block text-xs text-blue-600 mb-2">(After ₹1,08,000 subsidy drops in)</span>
                        <strong className="text-3xl text-blue-700">₹2,728<span className="text-base font-normal text-blue-600">/mo</span></strong>
                      </div>
                    </div>
                  </div>
                </div>

                <H2 id="emi-5kw">5kW Solar System EMI Example</H2>
                <div className="bg-violet-50 p-6 md:p-8 rounded-2xl border-2 border-violet-200 mb-6 shadow-lg shadow-violet-900/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-violet-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Example</div>
                  <h4 className="font-bold text-violet-900 text-lg mb-4 font-montserrat">5kW Cost Breakdown</h4>
                  <ul className="space-y-3 text-violet-950 text-base md:text-lg mb-6">
                    <li className="flex justify-between items-center pb-3 border-b border-violet-200/60">
                      <span>Illustrative System Price</span> <strong>₹3,00,000</strong>
                    </li>
                    <li className="flex justify-between items-center pb-3 border-b border-violet-200/60">
                      <span className="text-violet-700">Eligible Subsidy (Max)</span> <strong className="text-emerald-600">-₹1,08,000</strong>
                    </li>
                    <li className="flex justify-between items-center pt-2">
                      <span className="font-bold">Net Loan Amount</span> <strong className="text-2xl text-primary font-bold">₹1,92,000</strong>
                    </li>
                  </ul>
                  
                  <div className="bg-white rounded-xl p-5 border border-violet-100">
                    <p className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">How the EMI Actually Works (at 5.75%)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <span className="block text-xs font-bold text-slate-500 mb-1 uppercase">Step 1: Initial EMI</span>
                        <span className="block text-xs text-slate-500 mb-2">(Calculated on full ₹3,00,000 for 5 yrs)</span>
                        <strong className="text-2xl text-slate-400 line-through">₹5,764<span className="text-sm font-normal text-slate-400">/mo</span></strong>
                      </div>
                      <div className="bg-violet-50 p-4 rounded-lg border-2 border-violet-200 relative overflow-hidden">
                        <span className="block text-xs font-bold text-violet-700 mb-1 uppercase">Step 2: Revised EMI</span>
                        <span className="block text-xs text-violet-600 mb-2">(After ₹1,08,000 subsidy drops in)</span>
                        <strong className="text-3xl text-violet-700">₹3,688<span className="text-base font-normal text-violet-600">/mo</span></strong>
                      </div>
                    </div>
                  </div>
                </div>

                <H2 id="large">6kW and Larger Systems</H2>
                <P>
                  As system sizes increase to 6kW, 8kW, or 10kW, the economics change. It is critical to understand that beyond 3kW, the central residential subsidy is capped at ₹78,000. UP state subsidy is also capped based on applicable rules. Therefore, for larger systems, a higher percentage of the total cost will need to be financed or paid upfront.
                </P>

                <H2 id="emi-vs-bill">EMI vs Electricity Bill: The Real Comparison</H2>
                <P>
                  Should you finance? Consider this scenario:
                </P>
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                  <p className="text-slate-800 mb-2"><strong>Current electricity bill:</strong> ₹4,000/month (Annual: ₹48,000)</p>
                  <p className="text-slate-800 mb-2"><strong>Illustrative Solar loan EMI:</strong> ₹3,500/month (Annual: ₹42,000)</p>
                  <p className="text-slate-800"><strong>Potential electricity savings:</strong> Drastic reduction in utility grid charges.</p>
                </div>
                <P>
                  However, you should not simply compare the EMI with today's electricity bill. The correct comparison should consider: expected solar generation, electricity tariff inflation, self-consumption, net metering export rules, degradation, maintenance, loan interest, and loan tenure. 
                </P>
                <P>
                  For some households, the expected monthly electricity savings can be comparable to or greater than the EMI, depending on system size, consumption, and financing terms. But remember: electricity tariffs tend to rise over a 10-year period, whereas your loan EMI remains fixed.
                </P>

                <H2>Why Financing Can Make Solar Easier</H2>
                <ul className="space-y-3 mb-6">
                  <li><strong>Lower upfront burden:</strong> You don't need to empty your savings.</li>
                  <li><strong>Predictable payments:</strong> Fixed monthly EMIs are easier to budget.</li>
                  <li><strong>Flexibility:</strong> A 5-year loan results in a higher EMI but lower total interest. A 10-year loan gives a lower EMI but higher total interest over time. Homeowners can choose a balance that fits their cash flow.</li>
                </ul>

                <H2>Example Summary: 3kW vs 4kW vs 5kW</H2>
                <div className="my-10 rounded-2xl border-[3px] border-primary/20 overflow-hidden shadow-xl shadow-primary/5">
                  <Table className="w-full">
                    <TableHeader className="bg-primary">
                      <TableRow className="hover:bg-primary border-b-primary/20">
                        <TableHead className="font-bold text-primary-foreground p-4">Metric</TableHead>
                        <TableHead className="font-bold text-primary-foreground p-4">3 kW</TableHead>
                        <TableHead className="font-bold text-primary-foreground p-4">4 kW</TableHead>
                        <TableHead className="font-bold text-primary-foreground p-4">5 kW</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="bg-white">
                        <TableCell className="font-bold text-slate-800 p-4 border-r border-slate-100">Typical Use</TableCell>
                        <TableCell className="p-4 text-slate-600">1-2 ACs</TableCell>
                        <TableCell className="p-4 text-slate-600 border-x border-slate-100 bg-slate-50/50">2-3 ACs</TableCell>
                        <TableCell className="p-4 text-slate-600">3+ ACs</TableCell>
                      </TableRow>
                      <TableRow className="bg-white border-t border-slate-100">
                        <TableCell className="font-bold text-slate-800 p-4 border-r border-slate-100">Max Subsidy</TableCell>
                        <TableCell className="p-4 text-emerald-600 font-semibold">₹1,08,000</TableCell>
                        <TableCell className="p-4 text-emerald-600 font-semibold border-x border-slate-100 bg-slate-50/50">₹1,08,000</TableCell>
                        <TableCell className="p-4 text-emerald-600 font-semibold">₹1,08,000</TableCell>
                      </TableRow>
                      <TableRow className="bg-primary/5 border-t border-primary/10">
                        <TableCell className="font-bold text-primary p-4 border-r border-primary/10">Example EMI (5 Yrs)*</TableCell>
                        <TableCell className="p-4 font-bold text-slate-900">₹1,383</TableCell>
                        <TableCell className="p-4 font-bold text-slate-900 border-x border-primary/10 bg-primary/5">₹2,535</TableCell>
                        <TableCell className="p-4 font-bold text-slate-900">₹3,688</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <P className="text-sm text-slate-500">
                  *Estimated generation and pricing. Actual output depends on irradiation, roof orientation, shading, inverter performance, and weather in Meerut/Western UP.
                </P>

                <H2>Documents Required for a Solar Loan</H2>
                <P>
                  Typical documentation includes: Aadhaar/KYC, PAN (where applicable), latest electricity bill, property/ownership documents, income documents (ITR/Form 16/Bank statements), and the technical solar quotation from your vendor. Exact documentation depends on the bank and loan amount.
                </P>

                <H2>Who Should Consider a Solar Loan?</H2>
                <P>
                  Financing makes sense for homeowners who have a high electricity bill, plan to stay in their property for several years, have suitable rooftop space, and want to avoid a large upfront payment while utilizing subsidy benefits. Those with ready capital might prefer paying upfront to avoid interest charges entirely.
                </P>

                <H2>How Kailash Solar Helps</H2>
                <P>
                  As an established solar company in Meerut, Kailash Solar does more than just install panels. We guide our customers through the entire journey: from initial system sizing and a <Link href="/quote" className="text-primary hover:underline">transparent quotation</Link>, to PM Surya Ghar subsidy guidance, net-metering assistance, and directing you toward financing options.
                </P>
                <P className="font-bold text-lg mb-8">
                  Want to know whether a 3kW, 4kW or 5kW solar system makes sense for your home? Book a free solar site visit with Kailash Solar and get a personalised quotation based on your electricity consumption, roof area and solar requirements.
                </P>

                <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 text-center my-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('/Happyfamily.png')] bg-cover bg-center" />
                  <div className="relative z-10">
                    <h3 className="text-3xl md:text-4xl font-bold font-montserrat mb-4">Calculate Your True Solar Cost</h3>
                    <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Book a free site survey. We'll analyze your bill and explain the exact subsidies and loan options available for your Meerut home.</p>
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

                <p className="text-xs text-slate-400 mt-12">
                  <em>Last updated: September 2026. Disclaimer: The interest rates, loan terms, subsidies, and system prices mentioned are illustrative and based on official information available at the time of writing. Always verify current terms with your chosen bank and official government portals.</em>
                </p>

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
                      Call 8-999-999-654
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
                      <Link href="/blog/3kw-vs-5kw-solar-system-meerut" className="group block">
                        <span className="text-sm font-bold text-primary mb-1 block">System Sizing</span>
                        <span className="text-slate-700 font-medium group-hover:text-primary transition-colors leading-tight block">3kW vs 5kW Solar System</span>
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

export default BlogSolarPanelLoanMeerut;
