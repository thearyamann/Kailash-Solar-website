import BlogSolarPanelPriceMeerut from '@/views/BlogSolarPanelPriceMeerut';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar Panel Price in Meerut 2025 | 2kW to 10kW Cost, Subsidy & ROI Guide',
  description: 'Exact solar panel installation cost in Meerut for 2kW (₹1.1L), 3kW (₹1.6L), 5kW (₹2.6L) and 10kW (₹4.8L) systems before subsidy. PM Surya Ghar subsidy breakdown, ROI, and payback period explained — by Kailash Solar.',
  keywords: 'solar panel price Meerut, solar system cost Meerut, 3kW solar price Meerut, 5kW solar system cost Meerut, 10kW solar Meerut, solar installation cost Meerut 2025, PM Surya Ghar subsidy cost Meerut',
  alternates: {
    canonical: 'https://kailashsolar.com/blog/solar-panel-price-meerut'
  },
  openGraph: {
    title: 'Solar Panel Price in Meerut 2025 | 2kW–10kW Cost & Subsidy Guide',
    description: 'How much does solar cost in Meerut? 2kW at ₹1.1L, 3kW at ₹1.6L, 5kW at ₹2.6L. PM Surya Ghar subsidy reduces your cost. Full pricing guide by Kailash Solar.',
    url: 'https://kailashsolar.com/blog/solar-panel-price-meerut',
    siteName: 'Kailash Solar',
    images: [
      {
        url: 'https://kailashsolar.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Solar Panel Price Guide for Meerut 2025 — Kailash Solar',
      }
    ],
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Panel Price in Meerut 2025 | 2kW–10kW Cost Guide',
    description: 'Solar panel costs in Meerut — 2kW at ₹1.1L, 3kW at ₹1.6L, 5kW at ₹2.6L. Plus PM Surya Ghar subsidy breakdown.',
    images: ['https://kailashsolar.com/og-image.jpg'],
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Solar Panel Price in Meerut (2026): Costs, Subsidies & ROI Complete Guide",
  "description": "Find out the exact solar panel price in Meerut for 2kW, 3kW, 5kW, and 10kW systems. Learn about installation costs, PM Surya Ghar subsidy, and ROI.",
  "author": {
    "@type": "Organization",
    "name": "Kailash Solar",
    "url": "https://kailashsolar.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Kailash Solar",
    "logo": {
      "@type": "ImageObject",
      "url": "https://kailashsolar.com/favicon.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://kailashsolar.com/blog/solar-panel-price-meerut"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the price of a 3kW solar system in Meerut?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A premium 3kW solar system in Meerut typically costs between ₹1,60,000 and ₹1,80,000 before subsidy. After applying the PM Surya Ghar central and UP state subsidy (up to ₹1,08,000 combined), your net effective cost drops significantly."
      }
    },
    {
      "@type": "Question",
      "name": "How much subsidy is available for solar panels in Meerut?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Homeowners in Meerut can get up to ₹1,08,000 in total combined subsidies under the PM Surya Ghar Yojana and Uttar Pradesh state government schemes."
      }
    },
    {
      "@type": "Question",
      "name": "How many solar panels are needed for a home in Meerut?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It depends on your energy consumption. A typical 3kW system requires 6-8 high-efficiency panels, taking up roughly 200 to 300 square feet of shadow-free rooftop space."
      }
    },
    {
      "@type": "Question",
      "name": "Is net metering free in Meerut?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Net metering involves a one-time application and meter cost paid to PVVNL (the local DISCOM). The process is highly streamlined now, and Kailash Solar handles the entire net metering application on your behalf."
      }
    },
    {
      "@type": "Question",
      "name": "How long do solar panels last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "High-quality Tier-1 solar panels (like Waaree or Adani) come with a 30-year performance warranty and easily last 30 years with minimal maintenance."
      }
    }
  ]
};

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <BlogSolarPanelPriceMeerut />
    </>
  );
}
