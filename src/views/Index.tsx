"use client";

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PaybackSection from '@/components/PaybackSection';
import ResidentialSection from '@/components/ResidentialSection';
import SolarCalculator from '@/components/SolarCalculator';
import ServicesSection from '@/components/ServicesSection';
import WhyUsSection from '@/components/WhyUsSection';
import FinancingSection from '@/components/FinancingSection';
// import ProjectsSection from '@/components/ProjectsSection'; // temporarily hidden
import AboutSection from '@/components/AboutSection';
import BlogSection from '@/components/BlogSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import StickyCTA from '@/components/StickyCTA';

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Kailash Solar",
      "alternateName": "Kailash Solar EPC",
      "url": "https://kailashsolar.com",
      "logo": "https://kailashsolar.com/favicon.png",
      "description": "Premium commercial & industrial solar EPC in Meerut. Adani & Waaree panels, fast payback, end-to-end installation.",
      "foundingDate": "2010",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "62, Sec 3, Industrial Area, Shatabdi Nagar",
        "addressLocality": "Meerut",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "250103",
        "addressCountry": "IN"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91-97590-66666",
          "contactType": "sales",
          "availableLanguage": ["English", "Hindi"]
        },
        {
          "@type": "ContactPoint",
          "telephone": "+91-78958-88887",
          "contactType": "customer service",
          "availableLanguage": ["English", "Hindi"]
        }
      ],
      "email": "sales@kailashsolar.com"
    },
    {
      "@type": "WebSite",
      "name": "Kailash Solar",
      "url": "https://kailashsolar.com",
      "description": "Premium commercial & industrial solar EPC in Meerut. Adani & Waaree panels, fast payback, end-to-end installation.",
      "publisher": {
        "@type": "Organization",
        "name": "Kailash Solar"
      }
    },
    {
      "@type": "LocalBusiness",
      "name": "Kailash Solar",
      "description": "Premium solar EPC company serving commercial and industrial clients in Meerut.",
      "url": "https://kailashsolar.com",
      "telephone": "+91-97590-66666",
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
        "latitude": "28.9845",
        "longitude": "77.7064"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "18:00"
        }
      ],
      "priceRange": "₹₹",
      "areaServed": {
        "@type": "City",
        "name": "Meerut"
      }
    },
    {
      "@type": "Service",
      "name": "Solar EPC Services",
      "provider": {
        "@type": "Organization",
        "name": "Kailash Solar"
      },
      "description": "PM Surya Ghar & UPNEDA approved solar EPC services for residential, commercial, and industrial clients in Meerut and Western UP.",
      "areaServed": [
        { "@type": "City", "name": "Meerut" },
        { "@type": "AdministrativeArea", "name": "Western Uttar Pradesh" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Solar Solutions",
        "itemListElement": [
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Residential Rooftop Solar (PM Surya Ghar Yojana)" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "PM Surya Ghar Subsidy Assistance" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial & Industrial Solar EPC" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Design & Engineering" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Turnkey EPC" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Installation & Commissioning" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Net Metering Approvals" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Solar Financing Assistance" } },
          { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Annual Maintenance (AMC)" } }
        ]
      }
    }
  ]
};

const SITE_URL = "https://kailashsolar.com";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

const Index = () => {
  const canonical = `${SITE_URL}/`;
  const title = "Kailash Solar | Solar EPC in Meerut - PM Surya Ghar Vendor";
  const description = "PM Surya Ghar Yojana & UPNEDA approved solar installer in Meerut. Residential rooftop subsidies up to ₹1,08,000 + Commercial & Industrial EPC with Adani & Waaree panels.";
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main>
        <HeroSection />
        <PaybackSection />
        <SolarCalculator />
        <ServicesSection />
        <WhyUsSection />
        <FinancingSection />
        {/* <ProjectsSection /> */}
        <AboutSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
};

export default Index;
