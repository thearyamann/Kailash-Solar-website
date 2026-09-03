import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Only process if it's exactly the home page
  if (req.nextUrl.pathname !== '/') {
    return NextResponse.next();
  }

  // Get the city from Vercel's headers
  const cityHeader = req.headers.get('x-vercel-ip-city');
  
  if (cityHeader) {
    const city = decodeURIComponent(cityHeader).toLowerCase();
    
    // Mobile network IPs in Western UP are usually routed through these major hubs
    const targetCities = [
      'meerut', 'modinagar', 'modipuram', 
      'delhi', 'new delhi', 'noida', 'ghaziabad', 'gurugram', 
      'lucknow', 'muzaffarnagar', 'hapur', 'bulandshahr', 'saharanpur'
    ];

    if (targetCities.includes(city)) {
      // Redirect them to the Meerut specific page
      return NextResponse.redirect(new URL('/solar-company-meerut/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
