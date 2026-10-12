import { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: "Book a Free Site Visit | Kailash Solar",
  description: "Get a free consultation and exact site assessment from our expert engineers. We'll help you find the perfect solar solution in Meerut & UP.",
  alternates: {
    canonical: `${siteConfig.url}/book-visit`,
  },
  openGraph: {
    title: "Book a Free Site Visit | Kailash Solar",
    description: "Get a free consultation and exact site assessment from our expert engineers. Claim up to ₹1,08,000 subsidy.",
    url: `${siteConfig.url}/book-visit`,
  },
};

export default function BookVisitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
