import BlogBestSolarCompanyMeerut from '@/views/BlogBestSolarCompanyMeerut';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Why Kailash Solar Is a Leading Solar Company in Meerut (2025)",
  description: "Looking for a trusted solar company in Meerut? Discover why homeowners choose Kailash Solar for premium panels, expert in-house installation, and seamless PM Surya Ghar subsidy support.",
  alternates: {
    canonical: "https://kailashsolar.com/blog/best-solar-company-in-meerut"
  },
  openGraph: {
    title: "Why Kailash Solar Is a Leading Solar Company in Meerut",
    description: "Looking for a trusted solar company in Meerut? Discover why homeowners choose Kailash Solar for premium panels, expert in-house installation, and seamless PM Surya Ghar subsidy support.",
    url: "https://kailashsolar.com/blog/best-solar-company-in-meerut",
    siteName: "Kailash Solar",
    images: [
      {
        url: "https://kailashsolar.com/panel.jpg",
        width: 1200,
        height: 630,
        alt: "Kailash Solar engineering team in Meerut",
      }
    ],
    locale: "en_IN",
    type: "article",
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Why Kailash Solar Is a Leading Solar Company in Meerut",
      "image": "https://kailashsolar.com/panel.jpg",
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
      "datePublished": "2025-01-15T08:00:00+05:30",
      "dateModified": "2025-01-15T08:00:00+05:30",
      "description": "Looking for a trusted solar company in Meerut? Discover why homeowners choose Kailash Solar for premium panels, expert in-house installation, and seamless PM Surya Ghar subsidy support."
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which is the best solar company in Meerut?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Choosing the best solar company depends on transparency, in-house installation quality, and after-sales support. Kailash Solar is highly trusted in Meerut because we offer premium components and end-to-end net metering and subsidy assistance."
          }
        },
        {
          "@type": "Question",
          "name": "Is it better to choose a local solar company?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. A local company based in Meerut offers faster site surveys, better understanding of local DISCOM procedures, and quicker after-sales service compared to national brands operating from distant cities."
          }
        },
        {
          "@type": "Question",
          "name": "Does Kailash Solar use its own installation team?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, a key differentiator is our 100% in-house trained installation team, ensuring strict quality control and safety without relying on third-party daily-wage subcontractors."
          }
        },
        {
          "@type": "Question",
          "name": "Does Kailash Solar help with PM Surya Ghar subsidy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, as an empanelled vendor, we assist our customers through the entire PM Surya Ghar process, from national portal registration to final documentation."
          }
        }
      ]
    }
  ]
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogBestSolarCompanyMeerut />
    </>
  );
}
