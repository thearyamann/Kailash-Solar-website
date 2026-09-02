"use client";

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { ArrowLeft, Share2, ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/pm-surya-ghar-meerut-hero.webp';
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
const SLUG = '/blog/pm-surya-ghar-subsidy-meerut';

const faqs = [
  {
    q: 'Can I get subsidy on a hybrid solar system in Meerut?',
    a: 'Yes. Both on-grid and hybrid grid-connected systems are eligible for the PM Surya Ghar subsidy.',
  },
  {
    q: 'How long does the entire process take in Meerut?',
    a: 'Typically 45–75 days from registration to subsidy credit — depending on PVVNL processing speed for net metering.',
  },
  {
    q: 'Is there a loan facility available with the subsidy?',
    a: 'Yes. Nationalised banks offer collateral-free solar loans under this scheme. Combined with the subsidy, your net outflow can be significantly reduced.',
  },
  {
    q: 'What if I rent my property?',
    a: "The applicant must be a homeowner. Tenants are generally not eligible unless they have the owner's NOC and the electricity connection is in the owner's name.",
  },
  {
    q: 'Can I apply for subsidy for a system above 3 kW?',
    a: 'Yes, but the central subsidy is capped at ₹78,000 for 3 kW and above. The UP state subsidy is capped at ₹30,000. You can still install a larger system — only the subsidy amount is fixed.',
  },
  {
    q: 'Who is the DISCOM for Meerut?',
    a: 'Meerut falls under PVVNL — Paschimanchal Vidyut Vitaran Nigam Limited.',
  },
  {
    q: 'What is the difference between central and UP state subsidy?',
    a: 'The central subsidy (up to ₹78,000) is credited directly to your bank account via DBT through the PM Surya Ghar portal. The UP state subsidy (up to ₹30,000) is a separate reimbursement processed by UPNEDA after installation.',
  },
];

const articleStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'PM Surya Ghar: Muft Bijli Yojana — Step-by-Step Guide to Subsidy in UP (2025)',
  description:
    'Complete step-by-step guide to claim PM Surya Ghar Muft Bijli Yojana subsidy in Meerut. Eligibility, UP state subsidy of ₹30,000, documents and how to apply online.',
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
    <a href="/#contact">
      Get Free Site Visit <ArrowRight className="ml-2 w-4 h-4" />
    </a>
  </Button>
);

const SubsidyTable = ({
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

const BlogPMSuryaGharMeerut = () => {
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
  const canonical = `${SITE_URL}${SLUG}`;
  const title =
    'PM Surya Ghar Subsidy Meerut 2025 | Kailash Solar';
  const description =
    'Step-by-step guide to claim PM Surya Ghar subsidy in Meerut. Eligibility, UP state subsidy of ₹30,000, documents and how to apply online.';

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="hidden md:block">
        <Header />
      </div>

      {/* Mobile App-like Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md z-50 border-b border-slate-200 flex items-center justify-between px-4 shadow-sm">
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors active:scale-95">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <span className="font-bold text-sm truncate px-3 text-slate-800">PM Surya Ghar Yojana</span>
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'PM Surya Ghar Subsidy Meerut',
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

      <main className="pt-14 md:pt-0">
        {/* Hero Image */}
        <section className="bg-card">
          <div className="w-full md:container-custom md:pt-10">
            <img
              src={heroImage.src}
              alt="How to get PM Surya Ghar subsidy in Meerut — up to ₹1,08,000 combined central and UP state subsidy"
              width={1280}
              height={854}
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto md:rounded-2xl"
            />
          </div>
        </section>

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground md:mt-12">
          <div className="container-custom py-12 md:py-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-accent text-sm font-semibold uppercase tracking-wide">
                  PM Surya Ghar Guide · Meerut
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                PM Surya Ghar: Muft Bijli Yojana — Step-by-Step Guide to Subsidy in UP (2025)
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-3xl">
                Claim up to <strong>₹1,08,000</strong> in combined central + UP state subsidy for
                rooftop solar — credited directly to your bank account.
              </p>
              <CTAButton />
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="container-custom py-12 md:py-16">
          <div className="grid lg:grid-cols-[1fr_320px] gap-12">
            <div className="max-w-3xl">
              <H2>Introduction — Free Solar for Your Home in Meerut? Yes, It's Real.</H2>
              <P>
                If you live in Meerut and you're still paying high electricity bills, here's
                something the government wants you to know: you can get a rooftop solar system
                installed at a fraction of the cost — or sometimes almost free.
              </P>
              <P>
                Under the <strong>PM Surya Ghar Muft Bijli Yojana</strong>, the central government
                gives a direct cash subsidy of up to <strong>₹78,000</strong>. On top of that, the
                Uttar Pradesh state government gives an additional <strong>₹15,000 per kW</strong>,
                up to a maximum of <strong>₹30,000</strong> through UPNEDA.
              </P>
              <P>
                Combined, Meerut homeowners can receive up to <strong>₹1,08,000</strong> in total
                subsidy — credited directly to their bank account. This guide explains exactly how
                to claim it, step by step.
              </P>

              <H2>What Is PM Surya Ghar Muft Bijli Yojana?</H2>
              <P>
                Launched by the Government of India under MNRE, the PM Surya Ghar Muft Bijli Yojana
                aims to install rooftop solar in 1 crore Indian homes. The scheme:
              </P>
              <ul className="space-y-2 mb-4 text-foreground/85">
                {[
                  'Provides up to 300 units of free electricity per month',
                  'Gives a direct subsidy (DBT) credited to your bank account',
                  'Covers both on-grid and hybrid solar systems',
                  'Is applicable for residential homeowners across India, including Meerut',
                ].map((i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <div className="border-l-4 border-accent bg-accent/5 p-4 rounded-r-lg my-6">
                <strong>Important:</strong> Off-grid/standalone battery systems are not eligible for
                this subsidy. Only grid-connected (on-grid) and hybrid systems qualify.
              </div>

              <H2>Total Subsidy Available in Meerut, UP</H2>
              <P>Meerut homeowners can benefit from two layers of subsidy — central and state:</P>

              <H3>Central Government Subsidy (MNRE)</H3>
              <SubsidyTable
                headers={['System Size', 'Central Subsidy']}
                rows={[
                  ['1 kW', '₹30,000'],
                  ['2 kW', '₹60,000'],
                  ['3 kW and above', '₹78,000'],
                ]}
              />

              <H3>UP State Government Subsidy (UPNEDA)</H3>
              <P>
                UPNEDA offers an additional state subsidy of ₹15,000 per kW, capped at ₹30,000 for
                residential consumers.
              </P>
              <SubsidyTable
                headers={['System Size', 'UP State Subsidy']}
                rows={[
                  ['1 kW', '₹15,000'],
                  ['2 kW', '₹30,000'],
                  ['3 kW and above', '₹30,000 (maximum)'],
                ]}
              />

              <H3>Combined Subsidy — What You Actually Get</H3>
              <SubsidyTable
                headers={['System Size', 'Central', 'UP State', 'Total Subsidy']}
                rows={[
                  ['1 kW', '₹30,000', '₹15,000', '₹45,000'],
                  ['2 kW', '₹60,000', '₹30,000', '₹90,000'],
                  ['3 kW+', '₹78,000', '₹30,000', '₹1,08,000'],
                ]}
              />
              <P>
                <em>Note:</em> The UP state subsidy is disbursed by UPNEDA separately on a
                reimbursement basis after successful installation and documentation. Subsidy amounts
                are subject to change — confirm current rates with UPNEDA or your registered vendor
                at the time of application.
              </P>

              <H2>Who Is Eligible?</H2>
              <P>To qualify for the PM Surya Ghar subsidy in Meerut, you must meet these criteria:</P>
              <ul className="space-y-2 mb-4 text-foreground/85">
                {[
                  'Indian citizen with a residential property in Meerut',
                  'Valid electricity connection under PVVNL (Paschimanchal Vidyut Vitaran Nigam Limited)',
                  'Own the rooftop or have roof rights',
                  'Aadhaar linked to your bank account (for DBT transfer)',
                  'Installing an on-grid or hybrid solar system (1 kW – 10 kW)',
                  'Using an MNRE-empanelled and UPNEDA-registered vendor',
                ].map((i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>

              <H2>Step-by-Step Process to Get Solar Subsidy in Meerut</H2>

              <H3>Step 1: Register on the National Portal</H3>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/85">
                <li>
                  Visit:{' '}
                  <a
                    href="https://pmsuryaghar.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    pmsuryaghar.gov.in
                  </a>
                </li>
                <li>Click "Apply for Rooftop Solar"</li>
                <li>
                  Select State: <strong>Uttar Pradesh</strong> and DISCOM:{' '}
                  <strong>PVVNL</strong> (Paschimanchal Vidyut Vitaran Nigam Limited) for Meerut
                </li>
                <li>Enter your Consumer Account Number from your electricity bill</li>
                <li>Create your login ID and password</li>
              </ul>

              <H3>Step 2: Apply for Feasibility Approval</H3>
              <P>After registration, submit your application for feasibility approval from PVVNL:</P>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/85">
                <li>Upload documents: Aadhaar, electricity bill, rooftop photograph</li>
                <li>PVVNL reviews and grants approval within a few working days</li>
                <li>
                  This approval is mandatory before installation begins — do not install solar
                  before receiving this
                </li>
              </ul>

              <H3>Step 3: Select a UPNEDA-Registered Vendor</H3>
              <P>
                This is the most important step. The UP state subsidy is provided on a reimbursement
                basis and will be released only after the solar system is successfully installed,
                commissioned, and all documentation is submitted to UPNEDA. So your vendor must be
                officially registered.
              </P>
              <P>
                <strong>Kailash Solar Pvt. Ltd.</strong> is registered with both MNRE and UPNEDA,
                making us a fully subsidy-eligible installer in Meerut. We handle the portal,
                paperwork, and PVVNL coordination on your behalf.
              </P>
              <CTAButton className="my-4" />

              <H3>Step 4: System Design and Installation</H3>
              <P>Your vendor will:</P>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/85">
                <li>Conduct a detailed site survey and shadow analysis</li>
                <li>Design the optimal system — on-grid or hybrid — for your home</li>
                <li>Install panels, inverter, mounting structure, cabling, and protection equipment</li>
                <li>Typical residential installation is completed in 1–3 days</li>
              </ul>
              <P>
                Kailash Solar uses only Tier-1, BIS-certified components that meet MNRE quality
                standards and are approved under the PM Surya Ghar scheme.
              </P>

              <H3>Step 5: Net Metering Application</H3>
              <P>After installation:</P>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/85">
                <li>Your vendor applies for net metering with PVVNL</li>
                <li>PVVNL inspects the system and installs a bi-directional meter</li>
                <li>
                  This allows excess solar units to be fed back to the grid, further reducing your
                  electricity bills
                </li>
                <li>Typical timeline: 15–30 days</li>
              </ul>

              <H3>Step 6: Submit Your Subsidy Claim</H3>
              <P>Once net metering is approved:</P>
              <ul className="list-disc pl-6 space-y-2 mb-4 text-foreground/85">
                <li>Log back in to pmsuryaghar.gov.in</li>
                <li>Upload the Commissioning Certificate</li>
                <li>Enter your Aadhaar-linked bank account details</li>
                <li>Submit the central subsidy claim</li>
              </ul>
              <P>
                For the UP state subsidy of ₹30,000, your vendor will assist you in submitting the
                reimbursement application separately to UPNEDA with the required documentation.
              </P>

              <H3>Step 7: Receive Subsidy in Your Bank Account</H3>
              <P>
                After eligibility is verified and the scheme is approved, the subsidy is credited to
                the applicant's bank account within 30 days. The UP state subsidy follows separately
                through UPNEDA after their verification.
              </P>

              <H2>On-Grid vs Hybrid — Which Is Better for Subsidy?</H2>
              <P>
                Both on-grid and hybrid solar systems are eligible for the PM Surya Ghar subsidy.
                Here's a quick comparison:
              </P>
              <SubsidyTable
                headers={['Feature', 'On-Grid System', 'Hybrid System']}
                rows={[
                  ['Subsidy eligibility', 'Yes', 'Yes'],
                  ['Works during power cuts', 'No', 'Yes (battery backup)'],
                  ['Net metering', 'Yes', 'Yes'],
                  ['Best for', 'Low power cuts', 'Frequent outages'],
                  ['Cost', 'Lower', 'Slightly higher'],
                ]}
              />
              <P>
                <strong>Meerut tip:</strong> Given that Meerut and surrounding areas still
                experience occasional outages, many homeowners prefer hybrid systems for the added
                backup benefit — and you don't lose your subsidy eligibility.
              </P>

              <H2>Documents Required — Checklist</H2>
              <P>Keep these ready before applying:</P>
              <ul className="space-y-2 mb-4 text-foreground/85">
                {[
                  'Aadhaar card',
                  'Latest PVVNL electricity bill (with consumer number)',
                  'Bank passbook or cancelled cheque (Aadhaar-linked account)',
                  'Passport-size photograph',
                  'Property ownership documents or NOC from owner',
                  'Installation invoice from your UPNEDA-registered vendor',
                  'Net metering approval letter from PVVNL',
                  'Commissioning certificate',
                ].map((i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>

              <H2>Common Mistakes That Can Kill Your Subsidy Application</H2>
              <div className="space-y-4 mb-6">
                {[
                  {
                    t: 'Installing before feasibility approval',
                    d: 'Any system installed before PVVNL approval is ineligible for subsidy. Always wait for the green light.',
                  },
                  {
                    t: 'Using an unregistered installer',
                    d: 'If your vendor is not empanelled with MNRE and UPNEDA, your subsidy claim will be rejected — regardless of how good the installation is.',
                  },
                  {
                    t: 'Wrong bank account details',
                    d: 'The central subsidy transfers via Aadhaar-linked DBT. Ensure your Aadhaar is seeded to the correct bank account before applying.',
                  },
                  {
                    t: 'Choosing an off-grid system',
                    d: 'Standalone battery systems without grid connection do not qualify. Choose on-grid or hybrid only.',
                  },
                  {
                    t: 'Delaying net metering',
                    d: "Subsidy is released only after successful net metering. Don't let this step drag.",
                  },
                ].map((m) => (
                  <div key={m.t} className="border-l-4 border-destructive/60 bg-destructive/5 p-4 rounded-r-lg">
                    <p className="font-bold text-foreground mb-1">{m.t}</p>
                    <p className="text-foreground/80 text-sm">{m.d}</p>
                  </div>
                ))}
              </div>

              <H2>Frequently Asked Questions (FAQs)</H2>
              <Accordion type="single" collapsible className="mb-8">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger className="text-left font-semibold text-foreground">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <H2>Why Kailash Solar Pvt. Ltd. for Your Meerut Subsidy Application?</H2>
              <P>
                At Kailash Solar Pvt. Ltd., Meerut, we are a MNRE-empanelled and UPNEDA-registered
                solar EPC company offering complete end-to-end solar and subsidy services:
              </P>
              <ul className="space-y-2 mb-4 text-foreground/85">
                {[
                  'Free site visit and system sizing',
                  'Full portal registration and application assistance',
                  'PVVNL net metering coordination',
                  'Central + UP state subsidy claim filing',
                  'In-house installation team — no subcontracting',
                  'Tier-1, BIS-certified components eligible under PM Surya Ghar',
                ].map((i) => (
                  <li key={i} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <P>We don't just install solar — we ensure your subsidy is successfully claimed.</P>

              {/* Final CTA */}
              <div className="mt-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 md:p-10 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Go Solar in Meerut?</h2>
                <p className="text-primary-foreground/90 mb-6 max-w-2xl mx-auto">
                  Don't leave ₹1,08,000 on the table. Talk to our solar experts today and book your
                  free consultation and site visit.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <CTAButton />
                  <Button asChild variant="heroOutline" size="lg">
                    <a href="tel:+918999999654" className="font-bold">
                      <Phone className="mr-2 w-4 h-4 text-accent" strokeWidth={3} /> Call <span className="text-accent">8-999-999-654</span>
                    </a>
                  </Button>
                </div>
                <p className="text-primary-foreground text-sm mt-6">
                  Kailash Solar Pvt. Ltd. — MNRE & UPNEDA Registered Solar EPC Company<br />
                  Serving Meerut, Ghaziabad, Hapur, Muzaffarnagar, Bulandshahr & Western UP
                </p>
              </div>
            </div>

            {/* Sticky sidebar CTA (desktop) */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-border bg-card p-6">
                <p className="text-xs uppercase tracking-wide text-accent font-bold mb-2">
                  Free Consultation
                </p>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  Claim up to ₹1,08,000 subsidy
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Get a free rooftop site visit from our MNRE & UPNEDA registered team in Meerut.
                </p>
                <CTAButton className="w-full" />
                <a
                  href="tel:+918999999654"
                  className="mt-3 flex items-center justify-center gap-2 text-sm text-accent font-bold hover:underline"
                >
                  <Phone className="w-4 h-4 text-accent" strokeWidth={3} /> 8-999-999-654
                </a>
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

export default BlogPMSuryaGharMeerut;
