import SolarCompanyMeerut from '@/views/SolarCompanyMeerut';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: "Meerut's No.1 Choice for Home Solar Panels | Kailash Solar",
  },
  description: "Kailash Solar — Meerut's trusted home solar panel company. UPNEDA-registered & PM Surya Ghar empanelled. Install 1–10kW rooftop solar, claim up to ₹1,08,000 subsidy, and get free site visit. Serving Meerut, Ghaziabad & Western UP.",
  keywords: "solar company in Meerut, home solar panels Meerut, residential solar Meerut, solar panel installation Meerut, PM Surya Ghar Meerut, rooftop solar Meerut, solar subsidy Meerut, UPNEDA solar Meerut, Kailash Solar",
  alternates: {
    canonical: 'https://kailashsolar.com/solar-company-meerut'
  }
};

export default function SolarCompanyMeerutPage() {
  return <SolarCompanyMeerut />;
}
