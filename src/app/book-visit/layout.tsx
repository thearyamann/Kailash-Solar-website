import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Book a Free Site Visit | Kailash Solar",
  description: "Get a free consultation and exact site assessment from our expert engineers. We'll help you find the perfect solar solution.",
};

export default function BookVisitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
