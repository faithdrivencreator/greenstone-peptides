import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Existing Resend audience for Greenstone customers + interested visitors.
// Pete will broadcast the "we're live" email to this audience when the site
// is unlocked tomorrow. Override via env if a separate relaunch audience is
// created later.
const AUDIENCE_ID =
  process.env.RESEND_RELAUNCH_AUDIENCE_ID ||
  process.env.RESEND_GREENSTONE_AUDIENCE_ID ||
  '43c1771d-c0b7-4337-aeff-ab60e4e678d6';

const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'pete@fluidfaithsolutions.com';

const Body = z.object({
  email: z.string().email().max(254),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase().trim();

  if (!resend) {
    console.warn('[notify-relaunch] RESEND_API_KEY missing — accepting email but not saving');
    return NextResponse.json({ ok: true });
  }

  // Add to audience (idempotent — Resend ignores duplicates with 409)
  try {
    await resend.contacts.create({
      email,
      audienceId: AUDIENCE_ID,
      unsubscribed: false,
    });
  } catch (err) {
    // Duplicates are fine — only log unexpected failures
    const msg = err instanceof Error ? err.message : String(err);
    if (!/already exists|409/i.test(msg)) {
      console.error('[notify-relaunch] resend audience add failed', err);
    }
  }

  // Notify Pete (best-effort, non-blocking)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
  resend.emails
    .send({
      from: 'Greenstone Signups <hello@greenstonewellness.store>',
      to: ADMIN_NOTIFY_EMAIL,
      subject: `Relaunch waitlist signup: ${email}`,
      replyTo: email,
      html: `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;background:#0a0e0d;color:#e8e3d6;padding:24px;">
        <p style="font-family:Menlo,monospace;font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#5db89a;margin:0 0 6px 0;">// Relaunch waitlist</p>
        <h2 style="font-family:Georgia,serif;color:#f4eedd;font-size:22px;margin:0 0 14px 0;font-weight:500;">${email}</h2>
        <p style="color:#a89f8b;font-family:Menlo,monospace;font-size:12px;margin:0;">${new Date().toLocaleString('en-US',{timeZone:'America/New_York'})} ET${ip ? ` · ${ip}` : ''}</p>
        <p style="color:#cfc8b3;font-size:13px;margin-top:16px;">Added to the Greenstone audience. They&rsquo;ll be notified when the site is live.</p>
      </body></html>`,
    })
    .catch((err) => console.error('[notify-relaunch] admin email failed', err));

  return NextResponse.json({ ok: true });
}
