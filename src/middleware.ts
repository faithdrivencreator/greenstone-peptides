import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

const PROTECTED_PREFIXES = ['/shop', '/account'];
const MAINTENANCE_ALLOWLIST = ['/', '/api/notify-relaunch', '/api/maintenance-bypass'];

// Maintenance mode handler — plain (no Auth.js wrapper) so it stays light and
// doesn't load the credentials provider or Supabase admin client in the edge
// middleware while the site is gated. A valid `gs_bypass=ok` cookie (set by
// /api/maintenance-bypass after correct password) bypasses the takeover so
// Pete + collaborators can QA the live site behind the public-facing gate.
function maintenanceMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const bypass = req.cookies.get('gs_bypass')?.value === 'ok';
  if (bypass) return NextResponse.next();
  const allowed =
    MAINTENANCE_ALLOWLIST.includes(pathname) ||
    pathname.startsWith('/api/notify-relaunch') ||
    pathname.startsWith('/api/maintenance-bypass');
  if (allowed) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/';
  url.search = '';
  return NextResponse.redirect(url);
}

// Normal-mode handler — Auth.js wrapper for the /shop + /account session gate.
const normalMiddleware = auth((req) => {
  const { pathname } = req.nextUrl;

  // Stamp the request pathname so server components can branch on the route
  // if needed. Currently unused but harmless to keep — useful as a hook.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-pathname', pathname);

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  );
  if (!isProtected) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next({ request: { headers: requestHeaders } });
});

export default MAINTENANCE_MODE ? maintenanceMiddleware : normalMiddleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|robots.txt|sitemap.xml|images|fonts).*)'],
};
