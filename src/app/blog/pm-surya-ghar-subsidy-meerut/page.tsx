import BlogPMSuryaGharMeerut from '@/views/BlogPMSuryaGharMeerut';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PM Surya Ghar: Muft Bijli Yojana | Apply Online & Get Subsidy in UP',
  description: 'Official guide to PM Surya Ghar: Muft Bijli Yojana in UP. Apply online for up to ₹78,000 solar subsidy and get free electricity with Kailash Solar.',
  keywords: 'PM Surya Ghar: Muft Bijli Yojana, PM Surya Ghar apply online, Muft Bijli Yojana UP, Solar subsidy UP, PM Surya Ghar Yojana Meerut',
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
