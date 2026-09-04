import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';
import { BookVisitModal } from '@/components/BookVisitModal';
import { SolarConsultationForm } from '@/components/SolarConsultationForm';
import BlogSection from "@/components/BlogSection";
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ArrowRight, Phone, CheckCircle2, ShieldCheck, Zap, 
  MapPin, Star, Sun, Calculator, Building2, 
  Wrench, FileText, IndianRupee, TrendingUp, Leaf, ChevronRight, Users, Plus
} from 'lucide-react';
import Link from 'next/link';

// Asset Imports
import residential1 from '@/assets/residential-1.webp';
import residential2 from '@/assets/residential-2.webp';
import project1 from '@/assets/solar-project-1.jpg';
import project2 from '@/assets/solar-project-2.jpg';
import project3 from '@/assets/solar-project-3.jpg';

export const metadata: Metadata = {
  title: "Meerut's No.1 Choice for Solar Panels for Homes | PM Surya Ghar Subsidy up to ₹1,08,000 | Kailash Solar",
  description: "Kailash Solar — Meerut's trusted home solar panel company. UPNEDA-registered & PM Surya Ghar empanelled. Install 1–10kW rooftop solar, claim up to ₹1,08,000 subsidy, and get free site visit. Serving Meerut, Ghaziabad & Western UP.",
  keywords: "solar company in Meerut, home solar panels Meerut, residential solar Meerut, solar panel installation Meerut, PM Surya Ghar Meerut, rooftop solar Meerut, solar subsidy Meerut, UPNEDA solar Meerut, Kailash Solar",
  alternates: {
    canonical: 'https://kailashsolar.com/solar-company-meerut/'
  },
  openGraph: {
    title: "Meerut's No.1 Choice for Home Solar Panels | Kailash Solar",
    description: "Install rooftop solar panels at home in Meerut. Claim up to ₹1,08,000 PM Surya Ghar subsidy. Free site visit. UPNEDA-registered installer. Call 8-999-999-654.",
    url: "https://kailashsolar.com/solar-company-meerut/",
    siteName: "Kailash Solar",
    images: [
      {
        url: "https://kailashsolar.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kailash Solar — Home Solar Panel Installation in Meerut",
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meerut's No.1 Choice for Home Solar Panels | Kailash Solar",
    description: "Install rooftop solar at home in Meerut. Up to ₹1,08,000 PM Surya Ghar subsidy. Free site visit. UPNEDA-registered.",
    images: ["https://kailashsolar.com/og-image.jpg"],
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
      "email": "sales@kailashsolar.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "62, Sec 3, Industrial Area, Shatabdi Nagar",
        "addressLocality": "Meerut",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "250103",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.9845,
        "longitude": 77.7064
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "areaServed": ["Meerut", "Ghaziabad", "Muzaffarnagar", "Hapur", "Bulandshahr"],
      "description": "Kailash Solar is a UPNEDA-registered and PM Surya Ghar empanelled solar EPC company in Meerut, offering rooftop solar installation, subsidy assistance, and net metering for homes and businesses.",
      "sameAs": [
        "https://kailashsolar.com"
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://kailashsolar.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Solar Company in Meerut",
          "item": "https://kailashsolar.com/solar-company-meerut/"
        }
      ]
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

      {/* Auto-opening popup modal (same as homepage) */}
      <BookVisitModal autoOpenDelay={3500} />

      <Header />

      <section className="relative min-h-[100dvh] md:min-h-[80vh] flex flex-col justify-between md:justify-center overflow-hidden pt-20 pb-0 md:pb-10">
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img
            src="/Happyfamily.png"
            alt="Happy family using solar power"
            className="w-full h-full object-cover object-[center_80%] md:object-[100%_20%]"
          />
          {/* Subtle dark overlay without blur to keep image sharp while text is readable */}
          <div className="absolute inset-0 bg-slate-900/50" />
        </div>
        
        <div className="container relative z-10 mx-auto px-0 sm:px-6 flex flex-col flex-grow h-full md:grid md:grid-cols-12 md:gap-8 lg:gap-12 md:items-center">
          
          {/* TEXT BLOCK: Centered on mobile, normal grid on desktop */}
          <div className="px-4 md:px-0 flex-grow flex flex-col justify-center md:col-span-7 space-y-4 md:space-y-5 animate-in fade-in slide-in-from-left-8 duration-1000 pt-6 md:pt-0">

            <h1 className="text-[38px] leading-[1.1] md:text-5xl lg:text-6xl font-bold font-montserrat text-white tracking-tight mt-2 md:mt-0 drop-shadow-md">
              Meerut's No.1 Choice for <span className="text-accent drop-shadow-sm">Home Solar Panels</span>
            </h1>
            
            <p className="text-[16px] md:text-xl text-white/90 font-medium leading-snug max-w-xl pb-4 md:pb-0">
              Install rooftop solar and claim up to ₹1,08,000 PM Surya Ghar subsidy — with easy EMIs and a free site visit.
            </p>
            
            <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-6 pt-1 md:pt-2 text-sm font-semibold text-white">
              
              {/* Block 1: PM Surya Ghar Vendor */}
              <div className="flex flex-col md:flex-row items-center justify-start gap-2 md:gap-3 text-center md:text-left">
                <img src="/pmsurya.webp" alt="PM Surya Ghar Vendor" className="h-10 md:h-12 w-auto object-contain brightness-0 invert flex-shrink-0 drop-shadow-lg" />
                <div className="hidden md:block w-[1px] h-10 bg-white/30" />
                <h4 className="text-white font-bold text-[10px] leading-[1.1] md:text-xs md:tracking-wide drop-shadow-md">PM Surya Ghar<br/>Vendor</h4>
              </div>

              {/* Block 2: MNRE */}
              <div className="flex flex-col md:flex-row items-center justify-start gap-2 md:gap-3 text-center md:text-left">
                <img src="/mnre-logo.svg" alt="MNRE" className="h-10 md:h-12 w-auto object-contain brightness-0 invert flex-shrink-0 drop-shadow-lg" />
                <div className="hidden md:block w-[1px] h-10 bg-white/30" />
                <h4 className="text-white font-bold text-[10px] leading-[1.1] md:text-xs md:tracking-wide drop-shadow-md">MNRE<br/>Approved</h4>
              </div>

              {/* Block 3: UPNEDA */}
              <div className="flex flex-col md:flex-row items-center justify-start gap-1 md:gap-3 text-center md:text-left">
                <img src="/upneda-white.png" alt="UPNEDA Approved" className="h-12 md:h-14 w-auto object-contain brightness-0 invert flex-shrink-0 -mb-1 md:mb-0 drop-shadow-lg" />
                <div className="hidden md:block w-[1px] h-10 bg-white/30" />
                <h4 className="text-white font-bold text-[10px] leading-[1.1] md:text-xs md:tracking-wide drop-shadow-md">UPNEDA<br/>Approved</h4>
              </div>
            </div>

            <div className="pt-2 md:pt-3">
              <div className="hidden md:inline-flex items-center gap-2.5 px-4 py-1.5 md:py-2 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-white font-bold text-xs md:text-sm shadow-sm">
                <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent fill-accent" /> &quot;Fastest Subsidy Approval in UP&quot;
              </div>
            </div>
          </div>

          {/* FORM BLOCK: Bottom sheet on mobile, right column on desktop */}
          <div className="w-full md:col-span-5 animate-in fade-in slide-in-from-bottom-12 md:slide-in-from-right-8 duration-1000 delay-200 mt-6 md:mt-0">
            <SolarConsultationForm />
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
      <section className="pt-16 pb-10 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-montserrat mb-6 text-slate-900">Why Choose Kailash Solar in <span className="text-primary">Meerut?</span></h2>
            <p className="text-lg text-slate-600 font-medium">As a local Meerut company, we understand the specific energy needs of our city. We provide end-to-end solar EPC solutions with unmatched quality.</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-12 md:gap-y-16">
            {[
              { title: "Local Meerut Company", desc: "Based right here in Meerut, ensuring ultra-fast service and support whenever you need it.", img: "/engineer.png" },
              { title: "Subsidy Assistance", desc: "We handle the entire PM Surya Ghar Yojana subsidy paperwork for you from start to finish.", img: "/subsidy.png" },
              { title: "Tier-1 Solar Panels", desc: "We only use premium Tier-1 modules (Adani, Waaree) built for maximum efficiency.", img: "/solarpanel.png" },
              { title: "Expert Engineers", desc: "Our in-house professional engineers guarantee safe, structurally sound, and aesthetic rooftop installations.", img: "/expert.png" },
              { title: "30-Year Warranty", desc: "Enjoy complete peace of mind with a 30-year performance warranty on your solar panels.", img: "/warranty.png" },
              { title: "Quick Installation", desc: "From site survey to commissioning, we complete residential projects in record time.", img: "/installation.png" },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden mb-4 md:mb-8 shadow-sm transition-all duration-500 ">
                  <img src={feature.img} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 " />
                </div>
                <h3 className="text-[14px] sm:text-base md:text-2xl font-bold mb-1.5 md:mb-3 text-slate-900 leading-tight">{feature.title}</h3>
                <p className="text-[11px] sm:text-sm md:text-base text-slate-600 leading-snug md:leading-relaxed max-w-sm line-clamp-3 md:line-clamp-none mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Benefits of Solar (Native App Mobile / Elegant Desktop) */}
      <section className="pt-6 pb-12 lg:py-24 bg-slate-50 lg:bg-background">
        <div className="container mx-auto px-4 lg:px-4">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-16">
            
            <div className="w-full lg:w-1/2 relative group">
              <div className="hidden lg:block absolute inset-0 bg-accent/20 rounded-[2rem] transform rotate-3 transition-transform duration-500 group-hover:rotate-6" />
              <img src="/van.png" alt="Benefits of solar panels in Meerut" className="relative rounded-2xl lg:rounded-[2rem] shadow-md lg:shadow-lg w-full object-cover z-10" />
            </div>

            <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-[26px] md:text-5xl font-bold font-montserrat text-slate-900 leading-[1.2] mb-2 lg:mb-0">
                  Smart Reasons to Install Solar
                </h2>
                <p className="lg:hidden text-[15px] text-slate-500 mt-2">Why Meerut is switching to rooftop solar</p>
              </div>
              
              <ul className="space-y-5 lg:space-y-8">
                {[
                  { title: "Reduce Bills by 95%", desc: "Generate your own power and drastically reduce reliance on the PVVNL grid." },
                  { title: "Government Subsidy", desc: "Get direct bank transfers up to ₹1,08,000 under the PM Surya Ghar Yojana." },
                  { title: "High ROI & Payback", desc: "Recover your investment in 3-4 years and enjoy free electricity for 25+ years." },
                  { title: "Eco-Friendly Power", desc: "Reduce your carbon footprint and contribute to a greener, cleaner Meerut." },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 lg:gap-5 items-start">
                    <div className="shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                      <CheckCircle2 className="w-5 h-5 lg:w-6 lg:h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-[16px] lg:text-xl font-bold mb-1 text-slate-900 leading-tight">{item.title}</h4>
                      <p className="text-[14px] lg:text-[16px] text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Happy Customers (Area based) */}
      <section className="py-12 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-montserrat mb-4 md:mb-6 text-slate-900">Happy Solar Customers</h2>
            <p className="text-[16px] md:text-lg text-slate-600 font-medium">Join hundreds of families across Meerut who have slashed their electricity bills and switched to green energy.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
            {[
              { name: "Happy Customer", location: "Shastri Nagar, Meerut", img: "/happy costumer.jpeg" },
              { name: "Happy Customer", location: "Pallavpuram, Meerut", img: "/happycostumer2.jpeg" },
              { name: "Happy Customer", location: "Modipuram, Meerut", img: "/happycostumer3.jpeg" },
              { name: "Happy Customer", location: "Partapur, Meerut", img: "/happycostumer5.jpeg" },
              { name: "Happy Customer", location: "Jagriti Vihar, Meerut", img: "/happycostumer6.jpeg" },
              { name: "Happy Family", location: "Ganga Nagar, Meerut", img: "/ganganagar.jpeg" },
            ].map((customer, i) => (
              <div key={i} className="group">
                <div className="rounded-2xl md:rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-[4/3] mb-3 md:mb-5 bg-slate-200">
                  <img src={customer.img} alt={`Happy Customer in ${customer.location}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="px-1 md:px-2">
                  <h3 className="text-slate-900 font-bold text-[14px] md:text-xl mb-1 leading-tight">{customer.name}</h3>
                  <div className="flex items-center text-slate-500 font-medium text-[11px] md:text-[15px]">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 shrink-0 text-slate-400" /> <span className="truncate">{customer.location}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 500+ More Customers Card */}
            <div className="col-span-2 relative flex flex-col items-center justify-center rounded-2xl md:rounded-[2rem] p-8 md:p-16 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('/Happyfamily.png')` }}
              ></div>
              <div className="absolute inset-0 bg-slate-900/60"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-accent text-white rounded-full flex items-center justify-center mb-4 md:mb-6 shadow-lg">
                  <Users className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-white font-bold text-3xl md:text-5xl mb-2 text-center">500+</h3>
                <p className="text-white/90 font-medium text-[16px] md:text-xl text-center">More Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PM Surya Subsidy Section (Brand Consistent) */}
      <section className="py-12 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block bg-accent text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[12px] md:text-sm font-bold mb-4 md:mb-6 tracking-wide shadow-md">
              GOVERNMENT SUBSIDY
            </div>
            <h2 className="text-[28px] md:text-5xl font-bold font-montserrat mb-4 md:mb-6 leading-[1.2]">PM Surya Ghar Yojana in Meerut</h2>
            <p className="text-[16px] md:text-xl text-white/90 mb-6 md:mb-10 leading-relaxed font-medium">
              The Government of India is offering massive subsidies to homeowners in Meerut installing rooftop solar panels. As an MNRE-approved vendor, Kailash Solar helps you claim this subsidy seamlessly.
            </p>
            
            <div className="mb-8 md:mb-12 flex justify-center text-left">
              <ul className="space-y-4 md:space-y-6">
                <li className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 text-[15px] md:text-lg font-bold">
                    <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-accent shrink-0" /> 1kW System: Up to ₹45,000 Subsidy
                  </div>
                  <div className="text-[13px] md:text-[15px] text-white/80 ml-9 md:ml-10 font-medium">
                    (₹30,000 Central + ₹15,000 UP State)
                  </div>
                </li>
                <li className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 text-[15px] md:text-lg font-bold">
                    <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-accent shrink-0" /> 2kW System: Up to ₹90,000 Subsidy
                  </div>
                  <div className="text-[13px] md:text-[15px] text-white/80 ml-9 md:ml-10 font-medium">
                    (₹60,000 Central + ₹30,000 UP State)
                  </div>
                </li>
                <li className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 text-[15px] md:text-lg font-bold">
                    <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7 text-accent shrink-0" /> 3kW+ System: Up to ₹1,08,000 Subsidy
                  </div>
                  <div className="text-[13px] md:text-[15px] text-white/80 ml-9 md:ml-10 font-medium">
                    (₹78,000 Central + ₹30,000 UP State)
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <BookVisitModal>
                <Button className="w-full md:w-auto h-12 md:h-14 px-10 rounded-full text-[16px] md:text-lg font-bold bg-accent hover:bg-accent/90 text-white shadow-lg transition-transform active:scale-95 hover:-translate-y-0.5">
                  Check Your Eligibility
                </Button>
              </BookVisitModal>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Areas We Serve */}
      <section className="py-12 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-montserrat mb-4 md:mb-6 text-slate-900">Service Areas in & Around Meerut</h2>
            <p className="text-[16px] md:text-lg text-slate-600 font-medium">We proudly install and maintain solar panel systems across the entire Meerut district.</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {[
                "Meerut City", "Shastri Nagar", "Jagriti Vihar", "Ganga Nagar", 
                "Pallavpuram", "Kanker Khera", "Modipuram", "Partapur", 
                "Sardhana", "Mawana", "Daurala", "Parikshitgarh"
              ].map((area, i) => (
                <div key={i} className="bg-white p-3 md:p-5 rounded-2xl border border-slate-200 flex items-center justify-between cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                    </div>
                    <span className="font-bold text-slate-900 text-[13px] md:text-base leading-tight">{area}</span>
                  </div>
                </div>
              ))}
              {/* 100+ More Areas Card */}
              <div className="col-span-2 md:col-span-3 lg:col-span-4 bg-accent/5 p-4 md:p-6 rounded-2xl border border-accent/20 flex items-center justify-center cursor-default">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent text-white flex items-center justify-center shrink-0">
                    <Plus className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="font-bold text-accent text-[15px] md:text-xl leading-tight">100+ More Areas</span>
                </div>
              </div>
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
                a: "We offer a 30-year performance warranty on solar panels and standard manufacturer warranties on inverters (typically 5-10 years), ensuring your investment is completely secure."
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

      {/* 10. Blog Section for SEO */}
      <BlogSection />

      {/* 11 & 12. CTA & Form Section */}
      <section className="py-24 text-white relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/panel.jpg')` }}
        ></div>
        <div className="absolute inset-0 bg-primary/40"></div>
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
