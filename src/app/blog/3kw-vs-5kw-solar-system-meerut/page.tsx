import Blog3kwVs5kwSolarSystemMeerut from '@/views/Blog3kwVs5kwSolarSystemMeerut';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3kW vs 5kW Solar System in Meerut: Price, Subsidy & Guide',
  description: 'Deciding between a 3kW and 5kW solar system for your Meerut home? Compare prices, PM Surya Ghar subsidy, generation, roof space, and find the right size based on your electricity bill.',
  keywords: '3kW vs 5kW solar system in Meerut, 3kW solar system price Meerut, 5kW solar system price Meerut, 3kW solar system for home Meerut, 5kW solar system for home Meerut, PM Surya Ghar subsidy Meerut',
  alternates: {
    canonical: 'https://kailashsolar.com/blog/3kw-vs-5kw-solar-system-meerut'
  },
  openGraph: {
    title: '3kW vs 5kW Solar System in Meerut | Kailash Solar',
    description: 'Compare 3kW vs 5kW residential solar systems in Meerut. Includes pricing, PM Surya Ghar subsidy, generation capacity, and a buyer guide.',
    url: 'https://kailashsolar.com/blog/3kw-vs-5kw-solar-system-meerut',
    siteName: 'Kailash Solar',
    images: [
      {
        url: 'https://kailashsolar.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '3kW vs 5kW Solar System in Meerut',
      }
    ],
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3kW vs 5kW Solar System in Meerut',
    description: 'Compare 3kW vs 5kW residential solar systems in Meerut. Find the right size for your home.',
    images: ['https://kailashsolar.com/og-image.jpg'],
  }
};

export default function BlogPage() {
  return <Blog3kwVs5kwSolarSystemMeerut />;
}
