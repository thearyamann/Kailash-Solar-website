import BlogHowToChooseSolarPanelsMeerut from '@/views/BlogHowToChooseSolarPanelsMeerut';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Choose the Right Solar Panel for Your Home in Meerut',
  description: 'A complete guide for homeowners in Meerut on choosing the best solar panels. Learn about efficiency, warranty, types, and how to select a reliable installer.',
  keywords: 'solar panels for home in Meerut, best solar panels for home, rooftop solar panels in Meerut, solar installation in Meerut, solar company in Meerut, PM Surya Ghar subsidy',
  alternates: {
    canonical: 'https://kailashsolar.com/blog/how-to-choose-solar-panels-home-meerut'
  },
  openGraph: {
    title: 'How to Choose the Right Solar Panel for Your Home in Meerut',
    description: 'Learn how to choose the right solar panel for your home in Meerut. Consider efficiency, warranty, degradation, and the importance of a quality installer.',
    url: 'https://kailashsolar.com/blog/how-to-choose-solar-panels-home-meerut',
    siteName: 'Kailash Solar',
    images: [
      {
        url: 'https://kailashsolar.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'How to Choose Solar Panels for Home in Meerut — Kailash Solar',
      }
    ],
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Choose the Right Solar Panel for Your Home in Meerut',
    description: 'Learn how to choose the right solar panel for your home in Meerut. Complete homeowner guide by Kailash Solar.',
    images: ['https://kailashsolar.com/og-image.jpg'],
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Choose the Right Solar Panel for Your Home in Meerut",
  "description": "A complete guide for homeowners in Meerut on choosing the best solar panels. Learn about efficiency, warranty, types, and how to select a reliable installer.",
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
      "url": "https://kailashsolar.com/og.jpg"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://kailashsolar.com/blog/how-to-choose-solar-panels-home-meerut"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the best solar panel for a home in Meerut?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best solar panel depends on your budget, roof space, and energy needs. Monocrystalline and N-type panels are highly recommended for residential rooftops due to their high efficiency and better performance in hot weather."
      }
    },
    {
      "@type": "Question",
      "name": "How many solar panels are needed for a 5kW system?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The exact number depends on the wattage of the panels. For a 5kW (5000W) system, you would typically need about 9 to 10 panels if each panel is rated at 540W to 550W."
      }
    },
    {
      "@type": "Question",
      "name": "Are N-type solar panels good for homes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, N-type solar panels are excellent for homes. They offer higher efficiency, lower degradation rates over time, and better performance in high-temperature conditions compared to older panel technologies."
      }
    },
    {
      "@type": "Question",
      "name": "How long do solar panels last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "High-quality solar panels typically last for 25 to 30 years. Most reputable manufacturers provide a 25-year or 30-year linear performance warranty to guarantee they will continue producing a high percentage of their original power."
      }
    },
    {
      "@type": "Question",
      "name": "What should I check in a solar panel warranty?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You should check both the product warranty (covering manufacturing defects, usually 10-15 years) and the performance warranty (guaranteeing power output over 25-30 years). Also, confirm who will provide the local service support if something goes wrong."
      }
    },
    {
      "@type": "Question",
      "name": "Does rooftop solar work during Meerut's hot summers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. While extreme heat can slightly reduce a solar panel's efficiency, modern panels with a good temperature coefficient are designed to handle high summer temperatures. Proper system sizing ensures you generate enough power even on very hot days."
      }
    },
    {
      "@type": "Question",
      "name": "How much rooftop space is required for solar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Generally, you need about 80 to 100 square feet of shadow-free rooftop space per kilowatt (kW) of solar capacity. A standard 3kW system requires roughly 250 to 300 square feet of available space."
      }
    },
    {
      "@type": "Question",
      "name": "Can I get PM Surya Ghar subsidy for rooftop solar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, eligible homeowners in Meerut can claim up to ₹1,08,000 in combined central and UP state subsidies under the PM Surya Ghar: Muft Bijli Yojana. Kailash Solar assists with the complete application and net metering process."
      }
    },
    {
      "@type": "Question",
      "name": "How do I choose a reliable solar company in Meerut?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Look for a local EPC company that handles the complete process from site survey and design to installation, net metering, and after-sales support. Avoid companies that only sell equipment without taking responsibility for the final system performance."
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
      <BlogHowToChooseSolarPanelsMeerut />
    </>
  );
}
