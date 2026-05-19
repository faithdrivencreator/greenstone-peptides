import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

const PROTECTED_PREFIXES = ['/shop', '/account'];
const MAINTENANCE_ALLOWLIST = ['/', '/api/notify-relaunch'];

// Maintenance mode handler — plain (no Auth.js wrapper) so it stays light and
// doesn't load the credentials provider or Supabase admin client in the edge
// middleware while the site is gated.
function maintenanceMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const allowed =
    MAINTENANCE_ALLOWLIST.includes(pathname) ||
    pathname.startsWith('/api/notify-relaunch');
  if (allowed) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  return NextResponse.redirect(url);
}

// Normal-mode handler — Auth.js wrapper for the /shop + /account session gate.
const normalMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );
  if (!isProtected) return NextResponse.next();

  if (!req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export default MAINTENANCE_MODE ? maintenanceMiddleware : normalMiddleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|robots.txt|sitemap.xml|images|fonts).*)'],
};
