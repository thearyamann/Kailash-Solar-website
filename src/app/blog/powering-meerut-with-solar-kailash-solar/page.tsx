import BlogPoweringMeerutWithSolar from '@/views/BlogPoweringMeerutWithSolar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Powering Meerut with Solar: How Kailash Solar Is Helping Homes Save',
  description: 'See how Kailash Solar is helping homes in Meerut switch to rooftop solar, reduce electricity bills, and make solar installation simple with easy and affordable options.',
  keywords: 'solar company in Meerut, solar panel in Meerut, rooftop solar Meerut, solar for home in Meerut, residential solar system Meerut, solar energy in Meerut, solar panel for home, best solar company in Meerut, reduce electricity bill with solar, rooftop solar panel, solar installation in Meerut, solar subsidy in Meerut, solar system for home',
  alternates: {
    canonical: 'https://kailashsolar.com/blog/powering-meerut-with-solar-kailash-solar'
  },
  openGraph: {
    title: 'Powering Meerut with Solar: How Kailash Solar Is Helping Homes Save',
    description: 'See how Kailash Solar is helping homes in Meerut switch to rooftop solar, reduce electricity bills, and make solar installation simple with easy and affordable options.',
    url: 'https://kailashsolar.com/blog/powering-meerut-with-solar-kailash-solar',
    siteName: 'Kailash Solar',
    images: [
      {
        url: 'https://kailashsolar.com/vaniimage.png',
        width: 1200,
        height: 630,
        alt: 'rooftop solar panels on a home in Meerut — Kailash Solar',
      }
    ],
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Powering Meerut with Solar: How Kailash Solar Is Helping Homes Save',
    description: 'See how Kailash Solar is helping homes in Meerut switch to rooftop solar, reduce electricity bills, and make solar installation simple with easy options.',
    images: ['https://kailashsolar.com/vaniimage.png'],
  }
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Powering Meerut with Solar: How Kailash Solar Is Helping Homes Save on Electricity Bills",
  "description": "See how Kailash Solar is helping homes in Meerut switch to rooftop solar, reduce electricity bills, and make solar installation simple with easy and affordable options.",
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
    "@id": "https://kailashsolar.com/blog/powering-meerut-with-solar-kailash-solar"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is rooftop solar suitable for homes in Meerut?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Meerut receives excellent sunlight for most of the year. Rooftop solar panels are highly suitable for homes with an open terrace, tin shed, or RCC roof."
      }
    },
    {
      "@type": "Question",
      "name": "How much can I save with solar panels?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your savings depend on your electricity usage and the size of your solar system. For example, a home spending ₹4,000 per month could see a significant reduction in their bill. However, actual savings vary by household and are not guaranteed to be 100%."
      }
    },
    {
      "@type": "Question",
      "name": "How many solar panels does a home need?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "There is no fixed number. It depends entirely on your electricity consumption (monthly bill) and available roof space. We check your bill and recommend a suitable size, usually between 2kW to 5kW for most homes."
      }
    },
    {
      "@type": "Question",
      "name": "Can I install solar without paying the full amount upfront?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, depending on eligibility and financing approval, you may have zero-upfront-cost or flexible EMI options available to make the switch to solar easier without paying everything on day one."
      }
    },
    {
      "@type": "Question",
      "name": "Does Kailash Solar provide solar installation in Meerut?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we are a trusted local solar company providing complete residential solar installation services across Meerut, including Ganga Nagar, Shastri Nagar, and surrounding areas."
      }
    },
    {
      "@type": "Question",
      "name": "Can solar reduce my monthly electricity bill?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. By generating your own electricity during the day, you reduce the amount of electricity you purchase from the grid, which significantly lowers your monthly electricity expenses."
      }
    },
    {
      "@type": "Question",
      "name": "How do I know what size solar system my home needs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The easiest way is to share your latest electricity bill with us. We will look at your monthly units consumed and calculate the suitable system size for your specific home."
      }
    },
    {
      "@type": "Question",
      "name": "Is government subsidy available for residential solar?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, eligible residential homeowners can apply for subsidies under schemes like the PM Surya Ghar Yojana. We guide you through the documentation process."
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
      <BlogPoweringMeerutWithSolar />
    </>
  );
}
