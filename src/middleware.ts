import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Get the city from Vercel's headers or the geo object
  const city = req.headers.get('x-vercel-ip-city') || req.geo?.city;

  // List of cities that should be redirected to the Meerut page
  const targetCities = ['Meerut', 'Modinagar', 'Modipuram'];

  // Check if the user is visiting the home page and if their city matches
  if (req.nextUrl.pathname === '/' && city && targetCities.includes(city)) {
    // Redirect them to the Meerut specific page
    const url = new URL('/solar-company-meerut/', req.url);
    return NextResponse.redirect(url);
  }

  // Otherwise, allow the request to proceed as normal
  return NextResponse.next();
}

// Ensure the middleware only runs on the root path
export const config = {
  matcher: '/',
};
