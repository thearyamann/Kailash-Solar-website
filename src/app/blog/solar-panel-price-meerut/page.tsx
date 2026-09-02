import BlogSolarPanelPriceMeerut from '@/views/BlogSolarPanelPriceMeerut';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar Panel Price in Meerut (2025) | Installation Cost & Subsidy',
  description: 'Find out the exact solar panel price in Meerut for 2kW, 3kW, 5kW, and 10kW systems. Learn about installation costs, PM Surya Ghar subsidy, and ROI.',
  keywords: 'Solar Panel Price in Meerut, Solar Panel Cost in Meerut, Solar System Price Meerut, Solar Installation Cost Meerut, 3kW Solar System Price Meerut, 5kW Solar System Price Meerut, 10kW Solar System Price Meerut, Best Solar Company Meerut, PM Surya Ghar Yojana Meerut',
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Solar Panel Price in Meerut (2025) | Installation Cost & Subsidy",
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
        "text": "Homeowners in Meerut can get up to ₹1,08,000 in combined subsidies. This includes up to ₹78,000 from the central PM Surya Ghar Yojana and an additional ₹30,000 from the Uttar Pradesh state government."
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
        "text": "High-quality Tier-1 solar panels (like Waaree or Adani) come with a 25-year performance warranty and easily last 25 to 30 years with minimal maintenance."
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
