import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Booking Confirmed | Kailash Solar",
  description: "Your free solar consultation and site visit request has been received. Our expert engineers will contact you shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BookingSuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
