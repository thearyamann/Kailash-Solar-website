import type { Metadata, Viewport } from 'next';
import { siteConfig } from '../config/site';
import FAQSchema from "../components/FAQSchema";
import MetaPixel from "../components/MetaPixel";
import { Providers } from '../components/providers';
import { GoogleTagManager } from '@next/third-parties/google';
import NavigationLoader from '../components/NavigationLoader';
import '../index.css'; // Use existing global styles

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.name,
      url: siteConfig.url,
    },
  ],
  creator: siteConfig.name,
  appleWebApp: { capable: true, statusBarStyle: "default", title: siteConfig.name },
  formatDetection: { telephone: true },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Kailash Solar",
    "image": siteConfig.ogImage,
    "description": siteConfig.description,
    "url": siteConfig.url,
    "telephone": "+918999999654",
    "email": "sales@kailashsolar.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "62, Sec 3, Industrial Area, Shatabdi Nagar",
      "addressLocality": "Meerut",
      "addressRegion": "UP",
      "postalCode": "250103",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.9845,
      "longitude": 77.7064
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    "areaServed": ["Meerut", "Western UP", "Ghaziabad", "Muzaffarnagar"],
    "priceRange": "₹₹",

    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 28.9845,
        "longitude": 77.7064
      },
      "geoRadius": "50000"
    }
  };

  const calculatorSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Kailash Solar Electricity Bill Calculator",
    "applicationCategory": "CalculatorApplication",
    "operatingSystem": "All",
    "description": "Calculate how much you can save on your electricity bill with solar panels in UP.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    }
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" as="video" href="/herosection.mp4" type="video/mp4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <FAQSchema />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }} />
        <MetaPixel pixelId="1071029479055771" />
      </head>
      <body>
        <NavigationLoader />
        <GoogleTagManager gtmId="GTM-WXGHXT7R" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
