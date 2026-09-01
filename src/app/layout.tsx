import type { Metadata, Viewport } from 'next';
import { siteConfig } from '../config/site';
import FAQSchema from "../components/FAQSchema";
import GoogleAnalytics from "../components/GoogleAnalytics";
import MetaPixel from "../components/MetaPixel";
import { Providers } from '../components/providers';
import Script from 'next/script';
import '../index.css'; // Use existing global styles

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
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
    icon: '/favicon.png',
    apple: '/favicon.png',
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
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "184"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "author": { "@type": "Person", "name": "Rajesh Sharma" },
        "reviewBody": "Kailash Solar is absolutely the best solar company in Meerut. Their team handled the PM Surya Ghar subsidy flawlessly. Highly trusted and the happiest customer here!"
      },
      {
        "@type": "Review",
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "author": { "@type": "Person", "name": "Amit Gupta" },
        "reviewBody": "If you want solar in Meerut, Kailash Solar is the most trusted name. They eliminated my electricity bill. Best service in UP!"
      }
    ],
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
        <Script id="google-tag-manager" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WXGHXT7R');`
        }} />
        <link rel="preload" as="video" href="/herosection.mp4" type="video/mp4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <FAQSchema />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }} />
      </head>
      <body>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WXGHXT7R"
        height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe></noscript>
        <GoogleAnalytics gaId="AW-XXXXXXXXX" />
        <MetaPixel pixelId="FB-XXXXXXXXX" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
