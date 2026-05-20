import { NextRequest, NextResponse } from 'next/server';

/**
 * Maintenance-mode bypass.
 *
 * POST { password } — if it matches MAINTENANCE_BYPASS_PASSWORD env, sets an
 * httpOnly cookie (`gs_bypass=ok`) that middleware + the root layout check
 * before showing the takeover. Lets Pete (or anyone with the password) walk
 * the live site for QA while the public still hits the email-capture page.
 *
 * DELETE — clears the cookie (re-locks the current browser).
 */

const COOKIE_NAME = 'gs_bypass';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(req: NextRequest) {
  const expected = process.env.MAINTENANCE_BYPASS_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: 'Bypass not configured.' },
      { status: 500 },
    );
  }

  let password: string | undefined;
  try {
    const body = await req.json();
    password = typeof body?.password === 'string' ? body.password : undefined;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!password || password !== expected) {
    // Generic message — don't leak whether the password env is set.
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, 'ok', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
