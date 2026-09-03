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

  // Always redirect to the Meerut specific page for all direct/external visits
  return NextResponse.redirect(new URL('/solar-company-meerut/', req.url));
}

export const config = {
  matcher: ['/'],
};
