import Index from '@/views/Index';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Meerut's #1 Choice for Solar Panels for Homes | Kailash Solar | PM Surya Ghar Vendor",
  description: "Kailash Solar — Meerut's trusted rooftop solar panel company for homes. UPNEDA-registered & PM Surya Ghar empanelled. Claim up to ₹1,08,000 subsidy. Free site visit. Call 8-999-999-654.",
  keywords: "solar panel installation Meerut, home solar Meerut, residential solar Meerut, PM Surya Ghar Meerut, solar subsidy Meerut, rooftop solar Meerut, UPNEDA solar, Kailash Solar Meerut",
  openGraph: {
    title: "Kailash Solar | Meerut's #1 Choice for Home Solar Panels",
    description: "Install rooftop solar panels at home in Meerut. Claim up to ₹1,08,000 PM Surya Ghar subsidy. Free site visit available. UPNEDA-registered installer.",
    url: "https://kailashsolar.com",
    siteName: "Kailash Solar",
    images: [
      {
        url: "https://kailashsolar.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kailash Solar — Home Solar Panel Installation in Meerut",
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kailash Solar | Meerut's #1 Choice for Home Solar Panels",
    description: "Install rooftop solar at home in Meerut. Up to ₹1,08,000 PM Surya Ghar subsidy. Free site visit. UPNEDA-registered.",
    images: ["https://kailashsolar.com/og-image.jpg"],
  }
};

export default function Home() {
  return <Index />;
}
