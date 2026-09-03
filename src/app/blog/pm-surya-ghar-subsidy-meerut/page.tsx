import BlogPMSuryaGharMeerut from '@/views/BlogPMSuryaGharMeerut';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PM Surya Ghar Subsidy in Meerut 2025 | Up to ₹1,08,000 | Kailash Solar Guide',
  description: 'Complete guide to PM Surya Ghar: Muft Bijli Yojana subsidy in Meerut, UP. Claim up to ₹1,08,000 (₹78,000 Central + ₹30,000 UPNEDA state subsidy) for your home rooftop solar. Step-by-step process, eligibility & PVVNL net metering explained.',
  keywords: 'PM Surya Ghar subsidy Meerut, PM Surya Ghar Muft Bijli Yojana UP, solar subsidy Meerut 2025, UPNEDA subsidy Meerut, rooftop solar subsidy UP, PM Surya Ghar apply online Meerut',
  alternates: {
    canonical: 'https://kailashsolar.com/blog/pm-surya-ghar-subsidy-meerut'
  },
  openGraph: {
    title: 'PM Surya Ghar Subsidy in Meerut | Up to ₹1,08,000 | Complete Guide',
    description: 'How to claim up to ₹1,08,000 PM Surya Ghar subsidy in Meerut, UP. Central + UPNEDA state subsidy explained. Eligibility, process & PVVNL net metering — by Kailash Solar.',
    url: 'https://kailashsolar.com/blog/pm-surya-ghar-subsidy-meerut',
    siteName: 'Kailash Solar',
    images: [
      {
        url: 'https://kailashsolar.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PM Surya Ghar Solar Subsidy Guide for Meerut — Kailash Solar',
      }
    ],
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PM Surya Ghar Subsidy in Meerut | Up to ₹1,08,000',
    description: 'Claim up to ₹1,08,000 PM Surya Ghar subsidy in Meerut. Central + UPNEDA state subsidy guide by Kailash Solar.',
    images: ['https://kailashsolar.com/og-image.jpg'],
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "PM Surya Ghar: Muft Bijli Yojana | Complete Guide & Application Process",
  "description": "Learn how to apply for the PM Surya Ghar: Muft Bijli Yojana in Uttar Pradesh and get up to ₹78,000 in government subsidies for your rooftop solar panel installation.",
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
    "@id": "https://kailashsolar.com/blog/pm-surya-ghar-subsidy-meerut"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is PM Surya Ghar: Muft Bijli Yojana?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PM Surya Ghar: Muft Bijli Yojana is a government scheme providing up to 300 units of free electricity per month by subsidizing rooftop solar panel installations for homes across India."
      }
    },
    {
      "@type": "Question",
      "name": "How to apply online for PM Surya Ghar: Muft Bijli Yojana in UP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can apply through the national portal or contact an approved vendor like Kailash Solar in UP, who will handle the entire online application, net metering, and subsidy processing for you."
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
      <BlogPMSuryaGharMeerut />
    </>
  );
}
