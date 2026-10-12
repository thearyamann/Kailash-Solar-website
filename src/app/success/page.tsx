import { redirect } from 'next/navigation';

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') query.set(key, value);
    else if (Array.isArray(value) && value.length > 0) query.set(key, value[0]);
  }
  const queryString = query.toString();
  redirect(`/booking-success${queryString ? `?${queryString}` : ''}`);
}
