import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function GET(req: NextRequest) {
  return NextResponse.json({
    city: req.headers.get('x-vercel-ip-city') || 'Not detected (Localhost or header missing)',
    region: req.headers.get('x-vercel-ip-country-region') || 'Not detected',
    country: req.headers.get('x-vercel-ip-country') || 'Not detected',
    ip: req.headers.get('x-forwarded-for') || 'Not detected',
  });
}
