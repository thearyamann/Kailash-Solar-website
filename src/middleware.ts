import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only process if it's exactly the home page
  if (req.nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  // If the user has already been routed or explicitly visited the homepage, skip
  if (req.cookies.has('geo_routed')) {
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
    const url = new URL('/solar-company-meerut/', req.url);
    const response = NextResponse.redirect(url);
    
    // Set a cookie so we don't redirect them again if they intentionally click "Home"
    response.cookies.set('geo_routed', 'true', { path: '/', maxAge: 60 * 60 * 24 }); // 24 hours
    
    return response;
  }

  // If they don't match the geo, still set the cookie so we don't keep checking
  const response = NextResponse.next();
  response.cookies.set('geo_routed', 'true', { path: '/', maxAge: 60 * 60 * 24 });
  return response;
}

export const config = {
  matcher: ['/'],
};
