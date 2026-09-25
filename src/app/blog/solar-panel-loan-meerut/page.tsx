import BlogSolarPanelLoanMeerut from '@/views/BlogSolarPanelLoanMeerut';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Solar Panel Loan in Meerut: EMI, SBI & PNB Loans, Subsidy & Costs",
  description: "Learn how to finance a 3kW, 4kW, or 5kW solar system in Meerut. Compare SBI Surya Ghar and PNB solar loans, calculate EMI, and understand subsidies.",
  keywords: "solar panel loan in Meerut, solar loan Meerut, solar panel EMI, solar loan EMI, solar financing Meerut, 3kW solar loan, 5kW solar loan, PM Surya Ghar solar loan, solar subsidy and loan, rooftop solar loan Meerut",
  alternates: {
    canonical: "https://kailashsolar.com/blog/solar-panel-loan-meerut"
  },
  openGraph: {
    title: "Solar Panel Loan in Meerut: EMI, SBI & PNB Loan Options, Subsidy & Costs",
    description: "Learn how to finance a 3kW, 4kW, or 5kW solar system in Meerut. Compare bank loans, calculate EMI, and understand how the PM Surya Ghar subsidy works.",
    url: "https://kailashsolar.com/blog/solar-panel-loan-meerut",
    siteName: "Kailash Solar",
    images: [
      {
        url: "https://kailashsolar.com/loansolar.png",
        width: 1200,
        height: 630,
        alt: "Solar panel financing in Meerut",
      }
    ],
    locale: "en_IN",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solar Panel Loan in Meerut: EMI, SBI & PNB Loan Options",
    description: "Finance a 3kW, 4kW, or 5kW solar system in Meerut. Compare bank loans and calculate EMIs.",
    images: ["https://kailashsolar.com/loansolar.png"],
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Solar Panel Loan in Meerut: EMI, SBI & PNB Loan Options, Subsidy & Costs",
  "image": "https://kailashsolar.com/loansolar.png",
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
  "datePublished": "2026-09-25T08:00:00+05:30",
  "dateModified": "2026-09-25T08:00:00+05:30",
  "description": "Learn how to finance a 3kW, 4kW, or 5kW solar system in Meerut. Compare SBI Surya Ghar and PNB solar loans, calculate EMI, and understand subsidies."
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BlogSolarPanelLoanMeerut />
    </>
  );
}
