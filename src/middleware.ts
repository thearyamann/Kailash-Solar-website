import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only process if it's exactly the home page
  if (req.nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  // If the user clicked a link from inside our own website (like the Home button),
  // Next.js will send the 'rsc' header or the browser will send 'sec-fetch-site: same-origin'
  const isInternalNavigation = 
    req.headers.has('rsc') || 
    req.headers.get('sec-fetch-site') === 'same-origin' ||
    (req.headers.get('referer') || '').includes('kailashsolar.com');

  if (isInternalNavigation) {
    return NextResponse.next();
  }

  // Get the headers
  const cityHeader = req.headers.get('x-vercel-ip-city');
  const regionHeader = req.headers.get('x-vercel-ip-country-region');
  
  const city = cityHeader ? decodeURIComponent(cityHeader).toLowerCase() : '';
  const region = regionHeader ? regionHeader.toUpperCase() : '';
  
  // Broad list of cities
  const targetCities = [
    'meerut', 'modinagar', 'modipuram', 
    'delhi', 'new delhi', 'noida', 'ghaziabad', 'gurugram', 
    'lucknow', 'muzaffarnagar', 'hapur', 'bulandshahr', 'saharanpur'
  ];

  // ISO 3166-2 codes for States (UP = Uttar Pradesh, DL = Delhi, HR = Haryana, UK = Uttarakhand)
  const targetRegions = ['UP', 'DL', 'HR', 'UK'];

  // If the city matches OR if the region (State) matches our target areas
  if (targetCities.includes(city) || targetRegions.includes(region)) {
    // Redirect them to the Meerut specific page
    return NextResponse.redirect(new URL('/solar-company-meerut/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
