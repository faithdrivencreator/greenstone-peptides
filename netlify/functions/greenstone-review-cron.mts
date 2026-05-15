/**
 * Daily review-request cron — Greenstone Wellness
 *
 * Runs once a day at 14:00 UTC (10am ET in EDT, 9am ET in EST).
 *
 * For every Stripe payment_intent that:
 *   - succeeded between 60 and 61 days ago
 *   - has metadata.source_site === 'greenstonewellness.store'
 *   - does NOT yet have metadata.review_email_sent_at
 *
 * Generates a unique single-use REVIEW10-XXXXX code (90-day expiry), sends
 * the branded review-request email via Resend, and marks the Stripe PI with
 * review_email_sent_at to prevent duplicates.
 *
 * Why this exists as a scheduled function (not webhook scheduled): Resend
 * caps `scheduled_at` sends at 30 days, so we can't fire-and-forget the
 * review email at order time.
 */

import type { Config } from '@netlify/functions';

const SITE_URL = 'https://greenstonewellness.store';
const SUPPORT_EMAIL = 'support@greenstonewellness.store';
const ORDERS_FROM = 'Greenstone Wellness <orders@greenstonewellness.store>';
const STRIPE_API_VERSION = '2024-06-20';

interface StripePaymentIntent {
  id: string;
  metadata: Record<string, string>;
  customer: string | null;
  receipt_email: string | null;
  amount: number;
  created: number;
}

interface StripeCheckoutSession {
  id: string;
  customer_details?: { email?: string; name?: string };
}

function shortCodeSuffix(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function stripeGet<T>(path: string, sk: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`https://api.stripe.com/v1${path}`);
  if (params) for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${sk}`, 'Stripe-Version': STRIPE_API_VERSION },
  });
  if (!res.ok) throw new Error(`Stripe GET ${path}: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function stripePost<T>(path: string, sk: string, body: Record<string, string>): Promise<T> {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sk}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': STRIPE_API_VERSION,
    },
    body: new URLSearchParams(body).toString(),
  });
  if (!res.ok) throw new Error(`Stripe POST ${path}: ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

function renderReviewEmail(firstName: string | null, reviewCode: string): { subject: string; html: string } {
  const greeting = firstName ? `, ${firstName}` : '';
  return {
    subject: 'How is your Greenstone research going?',
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Greenstone</title></head>
<body style="margin:0;padding:0;background:#0D1117;color:#F5F1EB">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">It's been 60 days. We'd love to hear how things are going — and a thank-you code inside.</div>
<div style="background:#0D1117;padding:40px 16px">
  <div style="max-width:600px;margin:0 auto;background:#161C26;padding:48px 36px;border:1px solid #1E2738">
    <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #1E2738;margin-bottom:36px">
      <a href="${SITE_URL}" style="text-decoration:none">
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:400;letter-spacing:0.18em;color:#F5F1EB;margin:0 0 6px">GREENSTONE</h1>
        <p style="color:#C9A96E;font-family:'DM Sans',-apple-system,sans-serif;font-size:10px;letter-spacing:0.4em;margin:0">WELLNESS</p>
      </a>
    </div>

    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#F5F1EB;font-weight:400;margin:0 0 16px">How is it going${greeting}?</h2>
    <p style="color:#B8B2A8;line-height:1.7;margin:0 0 16px;font-family:'DM Sans',-apple-system,sans-serif">You ordered from Greenstone about two months ago. By now you've had real time to observe what's working and what isn't.</p>
    <p style="color:#B8B2A8;line-height:1.7;margin:0 0 28px;font-family:'DM Sans',-apple-system,sans-serif">We're building Greenstone with the help of the people using our products. Would you take <span style="color:#1A9E6E;font-weight:500">60 seconds</span> to tell us how it went? Your feedback shapes what we stock and how we ship.</p>

    <p style="text-align:center;margin:28px 0">
      <a href="mailto:${SUPPORT_EMAIL}?subject=My%20Greenstone%20experience" style="display:inline-block;background:#C9A96E;color:#0D1117;padding:14px 36px;text-decoration:none;letter-spacing:0.2em;font-size:12px;font-family:'DM Sans',-apple-system,sans-serif;font-weight:600">SHARE YOUR EXPERIENCE</a>
    </p>

    <p style="color:#B8B2A8;line-height:1.7;margin:28px 0 24px;font-family:'DM Sans',-apple-system,sans-serif;text-align:center;font-size:14px"><em>One reply. One paragraph. That's all we need.</em></p>

    <div style="text-align:center;margin:36px 0">
      <span style="display:inline-block;width:60px;height:1px;background:#1A9E6E;vertical-align:middle"></span>
      <span style="display:inline-block;color:#1A9E6E;font-size:8px;letter-spacing:0.4em;margin:0 16px;vertical-align:middle;font-family:'DM Sans',-apple-system,sans-serif">&#9670;</span>
      <span style="display:inline-block;width:60px;height:1px;background:#1A9E6E;vertical-align:middle"></span>
    </div>

    <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;color:#F5F1EB;font-weight:400;margin:0 0 8px;text-align:center">A thank-you, either way.</h3>
    <p style="color:#B8B2A8;line-height:1.7;margin:0 0 20px;font-family:'DM Sans',-apple-system,sans-serif;text-align:center">Here's <span style="color:#1A9E6E;font-weight:500">10% off</span> your next order — for being part of the early Greenstone community.</p>

    <div style="background:#0D1117;border:1px solid #C9A96E;padding:32px 24px;text-align:center;margin:24px 0">
      <p style="margin:0 0 8px;color:#8A6E3E;font-size:10px;letter-spacing:0.3em;font-family:'DM Sans',-apple-system,sans-serif">YOUR CODE</p>
      <p style="margin:0;font-family:'JetBrains Mono','SF Mono',Consolas,monospace;font-size:34px;letter-spacing:0.25em;font-weight:600;color:#C9A96E">${reviewCode}</p>
      <p style="margin:12px 0 0;color:#F5F1EB;font-size:13px;font-family:'DM Sans',-apple-system,sans-serif">10% off your next order</p>
      <p style="margin:4px 0 0;color:#8A6E3E;font-size:11px;font-family:'DM Sans',-apple-system,sans-serif">reserved for you &middot; one use &middot; expires in 90 days</p>
    </div>

    <p style="text-align:center;margin:28px 0 0">
      <a href="${SITE_URL}/shop" style="display:inline-block;background:transparent;color:#1A9E6E;padding:12px 28px;text-decoration:none;letter-spacing:0.2em;font-size:12px;font-family:'DM Sans',-apple-system,sans-serif;font-weight:600;border:1px solid #1A9E6E">BROWSE THE CATALOG</a>
    </p>
    <hr style="border:none;border-top:1px solid #1E2738;margin:32px 0 20px">
    <p style="text-align:center;color:#8A6E3E;font-size:10px;letter-spacing:0.25em;margin:0;font-family:'DM Sans',-apple-system,sans-serif">
      <a href="${SITE_URL}" style="color:#8A6E3E;text-decoration:none">GREENSTONEWELLNESS.STORE</a>
    </p>
  </div>
</div>
</body></html>`,
  };
}

export default async (_req: Request): Promise<Response> => {
  const sk = process.env.STRIPE_SECRET_KEY;
  const rk = process.env.RESEND_API_KEY;
  if (!sk || !rk) {
    return new Response(JSON.stringify({ error: 'Missing STRIPE_SECRET_KEY or RESEND_API_KEY' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const day60 = now - 60 * 86400;
  const day61 = now - 61 * 86400;

  // Stripe Search API lets us filter by metadata + date range in one call.
  // Query: greenstone-tagged, succeeded, within day60–day61 window.
  const query = `status:'succeeded' AND created<${day60} AND created>${day61} AND metadata['source_site']:'greenstonewellness.store'`;
  let candidates: StripePaymentIntent[] = [];
  try {
    const searchRes = await stripeGet<{ data: StripePaymentIntent[] }>(
      '/payment_intents/search',
      sk,
      { query, limit: '100' },
    );
    candidates = searchRes.data;
  } catch (err) {
    console.error('[ReviewCron] Stripe search failed:', err);
    return new Response(JSON.stringify({ error: 'Stripe search failed', detail: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log(`[ReviewCron] Found ${candidates.length} candidate(s) at day-60`);

  const results: { email: string; piId: string; status: string; code?: string }[] = [];

  for (const pi of candidates) {
    try {
      // Skip if already reviewed
      if (pi.metadata?.review_email_sent_at) {
        results.push({ email: 'n/a', piId: pi.id, status: 'already_sent' });
        continue;
      }

      // Find the checkout session to get customer email + name
      const sessRes = await stripeGet<{ data: StripeCheckoutSession[] }>(
        '/checkout/sessions',
        sk,
        { payment_intent: pi.id, limit: '1' },
      );
      const session = sessRes.data[0];
      const email = session?.customer_details?.email ?? pi.receipt_email;
      const fullName = session?.customer_details?.name ?? null;
      const firstName = fullName ? fullName.split(' ')[0] : null;

      if (!email) {
        results.push({ email: 'n/a', piId: pi.id, status: 'no_email' });
        continue;
      }

      // Create per-customer REVIEW10 code (90-day expiry, single use)
      const reviewCode = `REVIEW10-${shortCodeSuffix()}`;
      const expiresAt = now + 90 * 86400;
      await stripePost('/promotion_codes', sk, {
        coupon: 'REVIEW10',
        code: reviewCode,
        active: 'true',
        max_redemptions: '1',
        expires_at: String(expiresAt),
      });

      // Send the email via Resend
      const { subject, html } = renderReviewEmail(firstName, reviewCode);
      const sendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${rk}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: ORDERS_FROM,
          to: email,
          reply_to: SUPPORT_EMAIL,
          subject,
          html,
        }),
      });

      if (!sendRes.ok) {
        const errBody = await sendRes.text();
        results.push({ email, piId: pi.id, status: `resend_error: ${sendRes.status} ${errBody}` });
        continue;
      }

      // Mark Stripe PI to prevent duplicates
      await stripePost(`/payment_intents/${pi.id}`, sk, {
        'metadata[review_email_sent_at]': String(now),
        'metadata[review_code]': reviewCode,
      });

      results.push({ email, piId: pi.id, status: 'sent', code: reviewCode });
    } catch (err) {
      console.error('[ReviewCron] PI', pi.id, 'failed:', err);
      results.push({ email: 'n/a', piId: pi.id, status: `error: ${String(err)}` });
    }
  }

  console.log('[ReviewCron] Results:', JSON.stringify(results));

  return new Response(JSON.stringify({ ok: true, checked: candidates.length, results }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};

export const config: Config = {
  // 14:00 UTC daily = 10am EDT (9am EST). Adjust if Pete's preference differs.
  schedule: '0 14 * * *',
};
