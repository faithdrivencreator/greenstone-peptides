import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

const PROTECTED_PREFIXES = ['/shop', '/account'];

// Paths that stay reachable during maintenance mode:
// - Homepage (renders the maintenance takeover)
// - notify-relaunch API (the email capture endpoint)
const MAINTENANCE_ALLOWLIST = ['/', '/api/notify-relaunch'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Maintenance mode: rewrite everything not on the allowlist back to /
  if (MAINTENANCE_MODE) {
    const allowed =
      MAINTENANCE_ALLOWLIST.includes(pathname) ||
      pathname.startsWith('/api/notify-relaunch');
    if (!allowed) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Normal mode: standard /shop + /account gating
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

export const config = {
  // Skip Next.js internals + static assets + the auth API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|logo.png|robots.txt|sitemap.xml|images|fonts).*)'],
};
