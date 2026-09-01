import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { BookVisitModal } from '@/components/BookVisitModal';
import { SolarConsultationForm } from '@/components/SolarConsultationForm';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowRight, Phone, CheckCircle2, ShieldCheck, Zap, 
  MapPin, Star, Sun, Calculator, Building2, 
  Wrench, FileText, IndianRupee 
} from 'lucide-react';
import Link from 'next/link';

// Asset Imports
import residential1 from '@/assets/residential-1.webp';
import residential2 from '@/assets/residential-2.webp';
import project1 from '@/assets/solar-project-1.jpg';
import project2 from '@/assets/solar-project-2.jpg';
import project3 from '@/assets/solar-project-3.jpg';

export const metadata: Metadata = {
  title: "Best Solar Company in Meerut | Rooftop Installation & PM Surya Ghar Subsidy",
  description: "Looking for the best solar company in Meerut? Kailash Solar offers premium rooftop solar panels, PM Surya Yojana subsidies, and EPC services in Meerut, UP.",
  alternates: {
    canonical: 'https://kailashsolar.com/solar-company-meerut/'
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "name": "Kailash Solar Private Limited",
      "image": "https://kailashsolar.com/og-image.jpg",
      "@id": "https://kailashsolar.com/solar-company-meerut/#localbusiness",
      "url": "https://kailashsolar.com/solar-company-meerut/",
      "telephone": "+918999999654",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Meerut",
        "addressRegion": "UP",
        "addressCountry": "IN"
      },
      "areaServed": "Meerut",
      "description": "Premium solar company in Meerut offering rooftop solar installation, PM Surya Ghar subsidy assistance, and EPC services for residential and commercial.",
    }
  ]
};

export default function SolarCompanyMeerut() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <Header />

      {/* 1. Full-Screen Video Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <video
            src="/herosection.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 py-8 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-black font-montserrat text-white leading-[1.1] tracking-tight">
                Meerut, Go Solar at Zero Investment!
              </h1>
              
              <p className="text-lg md:text-2xl text-slate-200 font-medium leading-relaxed max-w-xl">
                Save up to 90% on electricity bills with government subsidy and easy EMI.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-4 text-sm font-semibold text-white">
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <ShieldCheck className="w-5 h-5 text-accent"/> 15+ Years of Experience
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <Zap className="w-5 h-5 text-accent"/> 500+ Homes Solarised
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <Sun className="w-5 h-5 text-accent"/> 10MW+ Installation Experience
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-lg border border-white/10 backdrop-blur-sm">
                  <IndianRupee className="w-5 h-5 text-accent"/> ₹5Cr+ Savings in Meerut
                </div>
              </div>
              
              <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-black/50 border border-white/10 rounded-lg text-white font-medium text-lg">
                Rated <Star className="w-5 h-5 text-[#f59e0b] fill-[#f59e0b]" /> 4.9 on Google | 180+ ratings
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <SolarConsultationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-primary text-white py-10 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div className="flex flex-col items-center justify-center space-y-2 px-4">
              <Star className="w-8 h-8 text-accent mb-1 fill-accent" />
              <span className="font-bold text-2xl font-montserrat">4.9/5</span>
              <span className="text-sm text-white/90 font-medium">Google Reviews</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 px-4">
              <ShieldCheck className="w-8 h-8 text-accent mb-1" />
              <span className="font-bold text-2xl font-montserrat">15+ Years</span>
              <span className="text-sm text-white/90 font-medium">Solar Experience</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 px-4">
              <FileText className="w-8 h-8 text-accent mb-1" />
              <span className="font-bold text-2xl font-montserrat">MNRE</span>
              <span className="text-sm text-white/90 font-medium">Approved Vendor</span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 px-4">
              <Zap className="w-8 h-8 text-accent mb-1" />
              <span className="font-bold text-2xl font-montserrat">500+</span>
              <span className="text-sm text-white/90 font-medium">Meerut Projects</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Why Choose Us (Floating Images Layout) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-montserrat mb-6 text-slate-900">Why Choose Kailash Solar in <span className="text-primary">Meerut?</span></h2>
            <p className="text-lg text-slate-600 font-medium">As a local Meerut company, we understand the specific energy needs of our city. We provide end-to-end solar EPC solutions with unmatched quality.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {[
              { title: "Local Meerut Company", desc: "Based right here in Meerut, ensuring ultra-fast service and support whenever you need it.", img: project1.src },
              { title: "Subsidy Assistance", desc: "We handle the entire PM Surya Ghar Yojana subsidy paperwork for you from start to finish.", img: "/pmsurya.webp" },
              { title: "Tier-1 Solar Panels", desc: "We only use premium Tier-1 modules (Adani, Waaree) built for maximum efficiency.", img: residential1.src },
              { title: "Expert Engineers", desc: "Our in-house professional engineers guarantee safe, structurally sound, and aesthetic rooftop installations.", img: project2.src },
              { title: "25-Year Warranty", desc: "Enjoy complete peace of mind with a 25-year performance warranty on your solar panels.", img: residential2.src },
              { title: "Quick Installation", desc: "From site survey to commissioning, we complete residential projects in record time.", img: project3.src },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden mb-8 shadow-sm transition-all duration-500 ">
                  <img src={feature.img} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 " />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Benefits of Solar (Elegant Side-by-Side) */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-accent/20 rounded-[2rem] transform rotate-3 transition-transform duration-500 group-hover:rotate-6" />
              <img src="/Happyfamily.png" alt="Benefits of solar panels in Meerut" className="relative rounded-[2rem] shadow-lg w-full object-cover z-10" />
            </div>
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold font-montserrat text-slate-900 leading-[1.2]">Smart Reasons to Install Rooftop Solar in Meerut</h2>
              <ul className="space-y-8">
                {[
                  { title: "Reduce Bills by 95%", desc: "Generate your own electricity and drastically reduce your reliance on the PVVNL grid." },
                  { title: "Claim Government Subsidy", desc: "Get direct bank transfers up to ₹1,08,000 under the PM Surya Ghar Muft Bijli Yojana." },
                  { title: "Increase Property Value", desc: "Homes in Meerut with solar installations sell faster and at a premium price." },
                  { title: "Eco-Friendly Power", desc: "Reduce your carbon footprint and contribute to a greener, cleaner Uttar Pradesh." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-5 group">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent transition-colors duration-300">
                      <CheckCircle2 className="w-6 h-6 text-accent group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1 text-slate-900">{item.title}</h4>
                      <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Local Projects (Area based) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-montserrat mb-6 text-slate-900">Solar Installations in Meerut</h2>
            <p className="text-lg text-slate-600 font-medium">Take a look at some of our recent rooftop solar and commercial projects powering homes and businesses across the city.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-[2rem] overflow-hidden aspect-[4/3] group relative shadow-lg">
              <img src={residential2.src} alt="Solar Panels in Shastri Nagar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-1">5kW Residential Setup</h3>
                  <div className="flex items-center text-white/80 font-medium">
                    <MapPin className="w-4 h-4 mr-1" /> Shastri Nagar, Meerut
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-[2rem] overflow-hidden aspect-[4/3] group relative shadow-lg">
              <img src={project1.src} alt="Solar Panels in Pallavpuram" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-1">10kW Commercial Roof</h3>
                  <div className="flex items-center text-white/80 font-medium">
                    <MapPin className="w-4 h-4 mr-1" /> Pallavpuram, Meerut
                  </div>
                </div>
              </div>
            </div>
            
            <div className="rounded-[2rem] overflow-hidden aspect-[4/3] group relative shadow-lg">
              <img src={project3.src} alt="Solar Panels in Modipuram" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white font-bold text-2xl mb-1">50kW Industrial Plant</h3>
                  <div className="flex items-center text-white/80 font-medium">
                    <MapPin className="w-4 h-4 mr-1" /> Modipuram, Meerut
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PM Surya Subsidy Section (Brand Consistent) */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[url('/pm-surya-ghar-meerut-hero.webp')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-block bg-accent text-white px-5 py-2 rounded-full text-sm font-bold mb-6 tracking-wide shadow-md">
                GOVERNMENT SUBSIDY
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-montserrat mb-6">PM Surya Ghar Yojana in Meerut</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed font-medium">
                The Government of India is offering massive subsidies to homeowners in Meerut installing rooftop solar panels. As an MNRE-approved vendor, Kailash Solar helps you claim this subsidy seamlessly.
              </p>
              <div className="bg-white/10 rounded-3xl p-8 border border-white/20 shadow-xl">
                <ul className="space-y-5">
                  <li className="flex items-center gap-4 text-lg font-bold"><CheckCircle2 className="w-7 h-7 text-accent shrink-0" /> Up to ₹30,000 for 1kW systems</li>
                  <li className="flex items-center gap-4 text-lg font-bold"><CheckCircle2 className="w-7 h-7 text-accent shrink-0" /> Up to ₹60,000 for 2kW systems</li>
                  <li className="flex items-center gap-4 text-lg font-bold"><CheckCircle2 className="w-7 h-7 text-accent shrink-0" /> Up to ₹78,000 for 3kW+ systems</li>
                </ul>
              </div>
              <div className="mt-10">
                <BookVisitModal>
                  <Button className="h-14 px-8 rounded-full text-lg font-bold bg-accent hover:bg-accent/90 text-white shadow-lg transition-transform active:scale-95 hover:-translate-y-0.5">
                    Check Your Eligibility
                  </Button>
                </BookVisitModal>
              </div>
            </div>
            <div className="lg:w-1/2">
              <img src="/pmsurya.webp" alt="PM Surya Ghar Subsidy Meerut" className="rounded-3xl shadow-2xl mx-auto max-w-md w-full border-4 border-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Areas We Serve */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-6 text-slate-900">Service Areas in & Around Meerut</h2>
            <p className="text-lg text-slate-600 font-medium">We proudly install and maintain solar panel systems across the entire Meerut district.</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Meerut City", "Shastri Nagar", "Jagriti Vihar", "Ganga Nagar", 
                "Pallavpuram", "Kanker Khera", "Modipuram", "Partapur", 
                "Sardhana", "Mawana", "Daurala", "Parikshitgarh", 
                "Rohta", "Jani", "Kharkhoda"
              ].map((area, i) => (
                <div key={i} className="bg-white border border-slate-200 px-6 py-3 rounded-full text-slate-700 font-bold shadow-sm flex items-center gap-2 hover:border-primary hover:text-primary transition-colors cursor-default">
                  <MapPin className="w-4 h-4" /> {area}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Customer Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-montserrat mb-6 text-slate-900">What Meerut Says About Us</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rahul Verma", area: "Ganga Nagar", text: "Kailash Solar is truly the best solar company in Meerut. They installed a 5kW system at my home in Ganga Nagar. The process was smooth, and they handled the entire subsidy paperwork. My electricity bill is now zero!" },
              { name: "Amit Agarwal", area: "Partapur", text: "Excellent service and highly professional team. We needed a commercial solar setup for our factory in Partapur. Kailash Solar completed it on time with top-quality Adani panels. Highly recommended solar dealer." },
              { name: "Dr. Sneha Sharma", area: "Shastri Nagar", text: "Got a 3kW rooftop solar installed in Shastri Nagar. The finishing is very neat. The engineering team was very polite and explained everything about the inverter and net metering clearly." }
            ].map((review, i) => (
              <div key={i} className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                <div className="flex text-accent mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-600 italic mb-8 flex-grow text-lg leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                   <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{review.name}</div>
                    <div className="text-sm text-slate-500">{review.area}, Meerut</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQs */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-5xl font-bold font-montserrat mb-12 text-center text-slate-900">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            {[
              {
                q: "What is the cost of solar panels in Meerut?",
                a: "The cost depends on the system size. A standard 3kW system in Meerut costs approximately ₹1,60,000 to ₹1,80,000 before subsidy. With the PM Surya Ghar subsidy of up to ₹78,000, your effective cost becomes highly affordable."
              },
              {
                q: "Do you help with the PM Surya Ghar Subsidy?",
                a: "Yes! As a government-empanelled solar installer in Meerut, Kailash Solar assists you with the complete PM Surya Ghar Yojana application process, from portal registration to final inspection."
              },
              {
                q: "How long does solar installation take?",
                a: "For residential rooftop solar in Meerut, the physical installation takes just 1-2 days. The complete process, including net metering and discom approvals, typically takes 2-4 weeks."
              },
              {
                q: "What warranty do you provide?",
                a: "We offer a 25-year performance warranty on solar panels and standard manufacturer warranties on inverters (typically 5-10 years), ensuring your investment is completely secure."
              },
              {
                q: "Do I need to clean the solar panels?",
                a: "Yes, dust accumulates on panels and can reduce efficiency. We recommend cleaning your rooftop solar panels in Meerut with water every 15-20 days for optimal performance."
              },
              {
                q: "How much space is required for a 3kW solar system?",
                a: "A 3kW residential solar system typically requires about 300 sq.ft of shadow-free rooftop space."
              },
              {
                q: "What brands of solar panels do you use?",
                a: "We only use Tier-1 solar panels from top manufacturers like Adani Solar, Waaree, and Vikram Solar to ensure maximum durability and power generation."
              },
              {
                q: "Is financing available for solar installation?",
                a: "Yes, we partner with leading banks to offer easy EMI financing options for homeowners and businesses in Meerut who want to switch to solar without high upfront costs."
              }
            ].map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b last:border-0 border-slate-100">
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
      </section>

      {/* 11 & 12. CTA & Form Section */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/hero-solar.webp')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold font-montserrat leading-tight">Ready to Go Solar in Meerut?</h2>
            <p className="text-xl text-white/90 font-medium">Join hundreds of happy homeowners and businesses in Meerut. Book a free site survey today and find out exactly how much you can save.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <BookVisitModal>
                <Button className="h-14 w-full sm:w-auto px-10 rounded-full text-lg font-bold bg-accent hover:bg-accent/90 text-white shadow-xl hover:-translate-y-0.5 transition-transform active:scale-95">
                  Book Free Site Survey
                </Button>
              </BookVisitModal>
              <Link href="/quote" className="w-full sm:w-auto">
                <Button className="h-14 w-full px-10 rounded-full text-lg font-bold bg-white text-primary hover:bg-slate-100 shadow-xl hover:-translate-y-0.5 transition-transform active:scale-95">
                  Calculate Savings
                </Button>
              </Link>
            </div>
            <p className="pt-4 text-white/80 font-medium">Or speak with a solar expert immediately at <a href="tel:+918999999654" className="font-bold underline text-white hover:text-white/80 transition-colors">89999 99654</a></p>
          </div>
        </div>
      </section>

      <Footer />
      <StickyCTA />
    </div>
  );
}
