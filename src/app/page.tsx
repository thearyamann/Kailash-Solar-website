import Index from '@/views/Index';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Solar Panel Installation in Meerut, UP | Kailash Solar",
  description: "Use our free Solar Calculator to see how much you can save on your electricity bill! Call 8-999-999-654 for expert solar panel installation in Meerut.",
};

export default function Home() {
  return <Index />;
}
