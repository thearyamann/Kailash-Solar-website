export default function FAQSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How much does a 3kW solar panel cost in Meerut, UP?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The cost of a 3kW solar panel system in Meerut depends on the brand and setup, but with the combined subsidy of up to ₹1,08,000, your final out-of-pocket cost is significantly reduced. Contact Kailash Solar for a free quote."
        }
      },
      {
        "@type": "Question",
        "name": "How can I apply for the PM Surya Ghar subsidy in Uttar Pradesh?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "As an approved UPNEDA and PM Surya Ghar vendor in Meerut, Kailash Solar handles the entire subsidy paperwork and application process for you. You just provide basic documents, and we ensure the subsidy goes directly to your bank account."
        }
      },
      {
        "@type": "Question",
        "name": "Does Kailash Solar provide commercial EPC solar installation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Kailash Solar specializes in large-scale commercial and industrial (C&I) solar EPC projects across Meerut and Western UP, helping factories and businesses reduce their electricity bills to near zero."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}
