/**
 * Daily delivered + how-to-use cron — Greenstone Wellness
 *
 * Runs once a day at 15:00 UTC (11am ET in EDT, 10am ET in EST).
 *
 * For every Stripe payment_intent that:
 *   - has metadata.source_site === 'greenstonewellness.store'
 *   - has metadata.shipped_at set to a timestamp between 5 and 6 days ago
 *   - does NOT yet have metadata.delivered_email_sent_at
 *
 * Sends the branded "your delivery has arrived — here's how to handle it"
 * email via Resend (cold-chain storage + sterile technique + a soft reminder
 * that the THANKS15 code from their welcome email is still active), and
 * marks the Stripe PI with delivered_email_sent_at to prevent duplicates.
 *
 * Why heuristic instead of carrier-event-driven: all delivery-tracking APIs
 * with webhook access (AfterShip, EasyPost, Shippo, TrackingMore) moved
 * behind paywalls. USPS direct API is free but USPS-only. Heuristic is +/-
 * 2 days from actual delivery in practice and works for all carriers with
 * zero ongoing cost.
 */

import type { Config } from '@netlify/functions';

const SITE_URL = 'https://greenstonewellness.store';
const SUPPORT_EMAIL = 'support@greenstonewellness.store';
const ORDERS_FROM = 'Greenstone Wellness <orders@greenstonewellness.store>';
const STRIPE_API_VERSION = '2024-06-20';

// How long after shipping to fire the delivered email.
// 5 days catches most USPS Priority Mail and UPS Ground deliveries.
const DAYS_AFTER_SHIP_MIN = 5;
const DAYS_AFTER_SHIP_MAX = 6;

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

function renderDeliveredEmail(firstName: string | null, carrier: string | null): { subject: string; html: string } {
  const greeting = firstName ? `, ${firstName}` : '';
  const carrierLine = carrier
    ? `Your <span style="color:#1A9E6E;font-weight:500">${carrier}</span> shipment should have arrived in the last day or two.`
    : `Your shipment should have arrived in the last day or two.`;

  return {
    subject: 'Your Greenstone delivery is here — handling guide inside',
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Greenstone</title></head>
<body style="margin:0;padding:0;background:#0D1117;color:#F5F1EB">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Your delivery should have arrived. Here's how to store, draw, and protect it for research.</div>
<div style="background:#0D1117;padding:40px 16px">
  <div style="max-width:600px;margin:0 auto;background:#161C26;padding:48px 36px;border:1px solid #1E2738">

    <!-- Header -->
    <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #1E2738;margin-bottom:36px">
      <a href="${SITE_URL}" style="text-decoration:none">
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:400;letter-spacing:0.18em;color:#F5F1EB;margin:0 0 6px">GREENSTONE</h1>
        <p style="color:#C9A96E;font-family:'DM Sans',-apple-system,sans-serif;font-size:10px;letter-spacing:0.4em;margin:0">WELLNESS</p>
      </a>
    </div>

    <!-- Hook -->
    <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#F5F1EB;font-weight:400;margin:0 0 16px">It's in your hands${greeting}.</h2>
    <p style="color:#B8B2A8;line-height:1.7;margin:0 0 28px;font-family:'DM Sans',-apple-system,sans-serif">${carrierLine} Below is a short field guide to keep what you've received <em>research-grade</em> — cold-chain storage and sterile draw. Bookmark this email; it covers the essentials.</p>

    <!-- Section 1: First 30 minutes -->
    <div style="background:#0D1117;border-left:3px solid #1A9E6E;padding:20px 24px;margin:0 0 28px">
      <p style="margin:0 0 6px;color:#1A9E6E;font-size:10px;letter-spacing:0.3em;font-family:'DM Sans',-apple-system,sans-serif">STEP ONE &middot; FIRST 30 MINUTES</p>
      <h3 style="margin:0 0 10px;color:#F5F1EB;font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:400">Refrigerate the vial immediately.</h3>
      <p style="margin:0;color:#B8B2A8;line-height:1.6;font-family:'DM Sans',-apple-system,sans-serif;font-size:14px">Your vial shipped cold and is ready to use. As soon as it arrives, move it to a refrigerator at <strong>36–46°F (2–8°C)</strong>. Store it in the <strong>back of the fridge</strong>, away from the door, where the temperature stays the most stable. Keep it in its box — peptides degrade with light exposure. <strong>Never freeze the vial</strong>; ice crystals damage the peptide.</p>
    </div>

    <!-- Section 2: Storage timeline -->
    <div style="background:#0D1117;border-left:3px solid #1A9E6E;padding:20px 24px;margin:0 0 28px">
      <p style="margin:0 0 6px;color:#1A9E6E;font-size:10px;letter-spacing:0.3em;font-family:'DM Sans',-apple-system,sans-serif">STEP TWO &middot; STORAGE TIMELINE</p>
      <h3 style="margin:0 0 10px;color:#F5F1EB;font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:400">Refrigerated, dark, used within the label window.</h3>
      <p style="margin:0;color:#B8B2A8;line-height:1.6;font-family:'DM Sans',-apple-system,sans-serif;font-size:14px">Each vial has a use-by window printed on its label — most compounded peptides are stable for <strong>28 days refrigerated</strong>, a few (GHK-Cu, BPC-157) remain stable longer. Keep the vial cold, keep it dark, and discard once you hit the label date.</p>
    </div>

    <!-- Section 3: Sterile draw -->
    <div style="background:#0D1117;border-left:3px solid #1A9E6E;padding:20px 24px;margin:0 0 28px">
      <p style="margin:0 0 6px;color:#1A9E6E;font-size:10px;letter-spacing:0.3em;font-family:'DM Sans',-apple-system,sans-serif">EVERY TIME &middot; STERILE DRAW</p>
      <h3 style="margin:0 0 10px;color:#F5F1EB;font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:400">Fresh swab. Fresh needle. Never shared.</h3>
      <p style="margin:0;color:#B8B2A8;line-height:1.6;font-family:'DM Sans',-apple-system,sans-serif;font-size:14px">Alcohol-swab the stopper before every draw. Use a fresh sterile needle each time — never re-cap and reuse. One vial per research subject. Contamination is the single most common cause of a failed research cycle.</p>
    </div>

    <!-- Soft support nudge -->
    <p style="margin:0 0 32px;color:#B8B2A8;font-size:14px;line-height:1.7;font-family:'DM Sans',-apple-system,sans-serif">Questions about storage or technique? Reply to this email or write <a href="mailto:${SUPPORT_EMAIL}" style="color:#1A9E6E;text-decoration:none">${SUPPORT_EMAIL}</a>.</p>

    <!-- Divider -->
    <div style="text-align:center;margin:36px 0">
      <span style="display:inline-block;width:60px;height:1px;background:#1A9E6E;vertical-align:middle"></span>
      <span style="display:inline-block;color:#1A9E6E;font-size:8px;letter-spacing:0.4em;margin:0 16px;vertical-align:middle;font-family:'DM Sans',-apple-system,sans-serif">&#9670;</span>
      <span style="display:inline-block;width:60px;height:1px;background:#1A9E6E;vertical-align:middle"></span>
    </div>

    <!-- Offer -->
    <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;color:#F5F1EB;font-weight:400;margin:0 0 8px;text-align:center">When you're ready for the next vial.</h3>
    <p style="color:#B8B2A8;line-height:1.7;margin:0 0 20px;font-family:'DM Sans',-apple-system,sans-serif;text-align:center">The <span style="color:#C9A96E;font-weight:500">THANKS15</span> code from your welcome email is still active. Build out your stack, or restock what's working.</p>

    <p style="text-align:center;margin:28px 0 0">
      <a href="${SITE_URL}/shop" style="display:inline-block;background:#C9A96E;color:#0D1117;padding:14px 36px;text-decoration:none;letter-spacing:0.2em;font-size:12px;font-family:'DM Sans',-apple-system,sans-serif;font-weight:600">BROWSE THE CATALOG</a>
    </p>

    <!-- Footer -->
    <hr style="border:none;border-top:1px solid #1E2738;margin:32px 0 20px">
    <p style="text-align:center;color:#8A6E3E;font-size:10px;line-height:1.6;margin:0 0 12px;font-family:'DM Sans',-apple-system,sans-serif;font-style:italic">Research peptides for laboratory and research use. Not for human consumption.</p>
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
  const shipMaxTs = now - DAYS_AFTER_SHIP_MIN * 86400; // shipped >= 5 days ago
  const shipMinTs = now - DAYS_AFTER_SHIP_MAX * 86400; // shipped <= 6 days ago

  // Cast a wide net via Stripe Search (succeeded greenstone PIs from last 90 days),
  // then filter in code on shipped_at + delivered_email_sent_at metadata.
  // Stripe Search can't do numeric comparisons on metadata, so the window filter
  // happens locally. Volume is small enough this is fine.
  const lookbackStart = now - 90 * 86400;
  const query = `status:'succeeded' AND created>${lookbackStart} AND metadata['source_site']:'greenstonewellness.store'`;
  let candidates: StripePaymentIntent[] = [];
  try {
    const searchRes = await stripeGet<{ data: StripePaymentIntent[] }>(
      '/payment_intents/search',
      sk,
      { query, limit: '100' },
    );
    candidates = searchRes.data;
  } catch (err) {
    console.error('[DeliveredCron] Stripe search failed:', err);
    return new Response(JSON.stringify({ error: 'Stripe search failed', detail: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Filter to PIs in the shipped-5-to-6-days-ago window, not yet emailed.
  const ready = candidates.filter((pi) => {
    const shippedAtStr = pi.metadata?.shipped_at;
    if (!shippedAtStr) return false;
    if (pi.metadata?.delivered_email_sent_at) return false;
    const shippedAt = Number(shippedAtStr);
    if (!Number.isFinite(shippedAt)) return false;
    return shippedAt >= shipMinTs && shippedAt <= shipMaxTs;
  });

  console.log(`[DeliveredCron] Scanned ${candidates.length} greenstone PIs from last 90d, ${ready.length} ready for delivered email`);

  const results: { email: string; piId: string; status: string }[] = [];

  for (const pi of ready) {
    try {
      // Find the checkout session to get customer email + first name
      const sessRes = await stripeGet<{ data: StripeCheckoutSession[] }>(
        '/checkout/sessions',
        sk,
        { payment_intent: pi.id, limit: '1' },
      );
      const session = sessRes.data[0];
      const email = session?.customer_details?.email ?? pi.receipt_email;
      const fullName = session?.customer_details?.name ?? null;
      const firstName = fullName ? fullName.split(' ')[0] : null;
      const carrier = pi.metadata?.carrier ?? null;

      if (!email) {
        results.push({ email: 'n/a', piId: pi.id, status: 'no_email' });
        continue;
      }

      const { subject, html } = renderDeliveredEmail(firstName, carrier);
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
        'metadata[delivered_email_sent_at]': String(now),
      });

      results.push({ email, piId: pi.id, status: 'sent' });
    } catch (err) {
      console.error('[DeliveredCron] PI', pi.id, 'failed:', err);
      results.push({ email: 'n/a', piId: pi.id, status: `error: ${String(err)}` });
    }
  }

  console.log('[DeliveredCron] Results:', JSON.stringify(results));

  return new Response(JSON.stringify({ ok: true, scanned: candidates.length, ready: ready.length, results }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};

export const config: Config = {
  // 15:00 UTC daily = 11am EDT (10am EST). One hour after the review cron
  // to avoid overlapping Stripe API calls.
  schedule: '0 15 * * *',
};
