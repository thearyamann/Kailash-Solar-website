import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Instant Home Solar Quote | Kailash Solar",
  description: "Get an instant, customized solar quote for your home. Calculate your savings, view government subsidies, and see your return on investment.",
};

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
