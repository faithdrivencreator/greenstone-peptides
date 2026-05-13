/**
 * Stripe Webhook Handler — Greenstone Wellness
 *
 * SETUP (one-time):
 * 1. Stripe Dashboard → Developers → Webhooks → Add endpoint
 * 2. URL: https://greenstonewellness.store/api/webhooks/stripe
 * 3. Event: checkout.session.completed
 * 4. Copy whsec_... signing secret → Netlify env var STRIPE_WEBHOOK_SECRET
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const PETE_EMAIL = 'pete@fluidfaithsolutions.com';
const CUSTOMERS_AUDIENCE_ID = process.env.RESEND_GREENSTONE_CUSTOMERS_AUDIENCE_ID;
const ORDERS_FROM = 'Greenstone Peptides <orders@greenstonewellness.store>';
const SUPPORT_EMAIL = 'support@greenstonewellness.store';
const SITE_URL = 'https://greenstonewellness.store';

// ─── Per-customer single-use promo codes ─────────────────────────────────────

function shortCodeSuffix(): string {
  // Crockford-style alphabet: no 0/O/1/I to avoid customer typing mistakes
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function createPersonalPromoCode({
  baseCoupon,
  daysValid,
}: {
  baseCoupon: string;
  daysValid: number;
}): Promise<string> {
  const sk = process.env.STRIPE_SECRET_KEY;
  if (!sk) throw new Error('STRIPE_SECRET_KEY not set');
  const code = `${baseCoupon}-${shortCodeSuffix()}`;
  const expiresAt = Math.floor(Date.now() / 1000) + daysValid * 86400;
  const body = new URLSearchParams({
    coupon: baseCoupon,
    code,
    active: 'true',
    max_redemptions: '1',
    expires_at: String(expiresAt),
  }).toString();
  const res = await fetch('https://api.stripe.com/v1/promotion_codes', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sk}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': '2024-06-20',
    },
    body,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Stripe promo create failed: ${res.status} ${errText}`);
  }
  return code;
}

// ─── Customer audience helpers ────────────────────────────────────────────────

async function isReturningCustomer(email: string): Promise<boolean> {
  if (!CUSTOMERS_AUDIENCE_ID || !email || !process.env.RESEND_API_KEY) return false;
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${CUSTOMERS_AUDIENCE_ID}/contacts/${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } },
    );
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Branded email shell (Greenstone brand tokens) ───────────────────────────

function renderEmailShell({ preheader, body }: { preheader: string; body: string }): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Greenstone</title></head>
<body style="margin:0;padding:0;background:#0D1117;color:#F5F1EB">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${preheader}</div>
<div style="background:#0D1117;padding:40px 16px">
  <div style="max-width:600px;margin:0 auto;background:#161C26;padding:48px 36px;border:1px solid #1E2738">
    <div style="text-align:center;padding-bottom:32px;border-bottom:1px solid #1E2738;margin-bottom:36px">
      <a href="${SITE_URL}" style="text-decoration:none">
        <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:400;letter-spacing:0.18em;color:#F5F1EB;margin:0 0 6px">GREENSTONE</h1>
        <p style="color:#C9A96E;font-family:'DM Sans',-apple-system,sans-serif;font-size:10px;letter-spacing:0.4em;margin:0">PEPTIDES &middot; WELLNESS</p>
      </a>
    </div>

    ${body}

    <p style="color:#8A6E3E;font-size:11px;line-height:1.6;margin:48px 0 0;font-family:'DM Sans',-apple-system,sans-serif;font-style:italic">Research peptides for laboratory and research use. Not for human consumption.</p>

    <hr style="border:none;border-top:1px solid #1E2738;margin:32px 0 20px">
    <p style="text-align:center;color:#8A6E3E;font-size:10px;letter-spacing:0.25em;margin:0;font-family:'DM Sans',-apple-system,sans-serif">
      <a href="${SITE_URL}" style="color:#8A6E3E;text-decoration:none">GREENSTONEWELLNESS.STORE</a>
    </p>
  </div>
</div>
</body></html>`;
}

function renderCodeBlock({ code, label, meta }: { code: string; label: string; meta: string }): string {
  return `
    <div style="background:#0D1117;border:1px solid #C9A96E;padding:32px 24px;text-align:center;margin:24px 0">
      <p style="margin:0 0 8px;color:#8A6E3E;font-size:10px;letter-spacing:0.3em;font-family:'DM Sans',-apple-system,sans-serif">YOUR CODE</p>
      <p style="margin:0;font-family:'JetBrains Mono','SF Mono',Consolas,monospace;font-size:34px;letter-spacing:0.25em;font-weight:600;color:#C9A96E">${code}</p>
      <p style="margin:12px 0 0;color:#F5F1EB;font-size:13px;font-family:'DM Sans',-apple-system,sans-serif">${label}</p>
      <p style="margin:4px 0 0;color:#8A6E3E;font-size:11px;font-family:'DM Sans',-apple-system,sans-serif">${meta}</p>
    </div>
  `;
}

async function addToCustomersAudience(email: string, firstName: string | null) {
  if (!CUSTOMERS_AUDIENCE_ID || !email) return;
  try {
    await resend.contacts.create({
      email,
      firstName: firstName ?? undefined,
      audienceId: CUSTOMERS_AUDIENCE_ID,
      unsubscribed: false,
    });
  } catch (err) {
    console.error('[Webhook] Failed to add contact to audience:', err);
  }
}

// ─── Order detail extraction ──────────────────────────────────────────────────

async function extractOrderDetails(session: Stripe.Checkout.Session) {
  const sessionWithItems = await stripe.checkout.sessions.retrieve(
    session.id,
    { expand: ['line_items'] }
  );

  const lineItems =
    sessionWithItems.line_items?.data.map((item) => ({
      name: item.description ?? 'Product',
      quantity: item.quantity ?? 1,
      unitAmount: (item.price?.unit_amount ?? 0) / 100,
      subtotal: (item.amount_total ?? 0) / 100,
    })) ?? [];

  return {
    customerEmail: session.customer_details?.email ?? '',
    customerName: session.customer_details?.name ?? null,
    amountTotal: (session.amount_total ?? 0) / 100,
    currency: session.currency?.toUpperCase() ?? 'USD',
    lineItems,
    shippingAddress:
      (session as unknown as { collected_information?: { shipping_details?: { address?: Stripe.Address } } })
        .collected_information?.shipping_details?.address ??
      session.shipping_details?.address ??
      null,
    stripeSessionId: session.id,
    paymentIntent:
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent?.id ?? null),
  };
}

// ─── Webhook handler ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Webhook] Signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Multi-brand guard: this Stripe account is shared across FFS storefronts
  // (Greenstone, AO Strength Team) and client billing (FFS manual invoices).
  // Each storefront's checkout stamps metadata.source_site so its own webhook
  // fires only on its own events. Cross-brand events get a 200 and exit.
  if (session.metadata?.source_site !== 'greenstonewellness.store') {
    console.log(
      '[Webhook] Ignored — source_site=',
      session.metadata?.source_site ?? '(missing)',
      'session=', session.id,
    );
    return NextResponse.json({ received: true, ignored: 'cross-brand' });
  }

  console.log('[Webhook] checkout.session.completed:', {
    sessionId: session.id,
    customerEmail: session.customer_details?.email,
    amountTotal: session.amount_total,
  });

  try {
    const order = await extractOrderDetails(session);

    console.log('[New Order]', JSON.stringify(order, null, 2));

    const itemRows = order.lineItems
      .map((i) => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${i.subtotal.toFixed(2)}</td></tr>`)
      .join('');

    const shippingText = order.shippingAddress
      ? [order.shippingAddress.line1, order.shippingAddress.line2, order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.postal_code].filter(Boolean).join(', ')
      : 'Not provided';

    const stripeUrl = order.paymentIntent
      ? `https://dashboard.stripe.com/payments/${order.paymentIntent}`
      : 'https://dashboard.stripe.com';

    await resend.emails.send({
      from: 'Greenstone Orders <orders@greenstonewellness.store>',
      to: PETE_EMAIL,
      subject: `💰 New Order — $${order.amountTotal.toFixed(2)} from ${order.customerName || order.customerEmail}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0a0f1a;border-bottom:2px solid #1a9e6e;padding-bottom:8px">New Greenstone Order</h2>
          <table style="width:100%;margin:16px 0">
            <tr><td style="color:#666">Customer</td><td><strong>${order.customerName || 'N/A'}</strong></td></tr>
            <tr><td style="color:#666">Email</td><td><a href="mailto:${order.customerEmail}">${order.customerEmail}</a></td></tr>
            <tr><td style="color:#666">Total</td><td><strong style="color:#1a9e6e;font-size:18px">$${order.amountTotal.toFixed(2)} ${order.currency}</strong></td></tr>
            <tr><td style="color:#666">Shipping</td><td>${shippingText}</td></tr>
          </table>
          <h3 style="color:#0a0f1a">Items</h3>
          <table style="width:100%;border-collapse:collapse">
            <tr style="background:#f5f5f5"><th style="padding:8px;text-align:left">Product</th><th style="padding:8px;text-align:center">Qty</th><th style="padding:8px;text-align:right">Amount</th></tr>
            ${itemRows}
          </table>
          <p style="margin-top:20px"><a href="${stripeUrl}" style="background:#1a9e6e;color:#fff;padding:10px 20px;text-decoration:none;display:inline-block">View in Stripe →</a></p>
        </div>
      `,
    });

    console.log('[Webhook] Order notification email sent to Pete');

    // ─── Customer confirmation + welcome flow ──────────────────────────────
    if (order.customerEmail) {
      const orderRef = order.stripeSessionId.slice(-8).toUpperCase();
      const customerFirstName = (order.customerName ?? '').split(' ')[0] || null;
      const wasReturning = await isReturningCustomer(order.customerEmail);

      const customerShipping = order.shippingAddress
        ? [
            order.shippingAddress.line1,
            order.shippingAddress.line2,
            `${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}`,
          ]
            .filter(Boolean)
            .join('<br>')
        : 'On file with Stripe';

      const customerItemRows = order.lineItems
        .map(
          (i) =>
            `<tr><td style="padding:14px 8px;border-bottom:1px solid #1E2738;font-family:'DM Sans',-apple-system,sans-serif;color:#F5F1EB">${i.name}</td><td style="padding:14px 8px;border-bottom:1px solid #1E2738;text-align:center;color:#F5F1EB">${i.quantity}</td><td style="padding:14px 8px;border-bottom:1px solid #1E2738;text-align:right;color:#C9A96E;font-weight:600">$${i.subtotal.toFixed(2)}</td></tr>`,
        )
        .join('');

      try {
        await resend.emails.send({
          from: ORDERS_FROM,
          to: order.customerEmail,
          replyTo: SUPPORT_EMAIL,
          subject: `Your Greenstone order is confirmed — #${orderRef}`,
          html: renderEmailShell({
            preheader: `Order #${orderRef} confirmed. We'll send tracking when it ships.`,
            body: `
              <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#F5F1EB;font-weight:400;margin:0 0 12px">Thank you${customerFirstName ? `, ${customerFirstName}` : ''}.</h2>
              <p style="color:#B8B2A8;line-height:1.7;margin:0 0 28px;font-family:'DM Sans',-apple-system,sans-serif">We've received your order and will begin preparing it for shipment. You'll get a tracking email the moment it leaves our facility.</p>

              <table style="width:100%;margin:24px 0;font-family:'DM Sans',-apple-system,sans-serif;border-collapse:collapse">
                <tr><td style="color:#8A6E3E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;padding:6px 0">Order</td><td style="text-align:right;color:#F5F1EB;font-weight:500">#${orderRef}</td></tr>
                <tr><td style="color:#8A6E3E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;padding:6px 0">Total</td><td style="text-align:right;color:#C9A96E;font-weight:600;font-size:20px;font-family:'Cormorant Garamond',Georgia,serif">$${order.amountTotal.toFixed(2)} ${order.currency}</td></tr>
                <tr><td style="color:#8A6E3E;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;padding:6px 0">Shipping</td><td style="text-align:right;color:#1A9E6E;font-weight:500">Free &middot; US Priority</td></tr>
              </table>

              <table style="width:100%;border-collapse:collapse;margin:28px 0;font-family:'DM Sans',-apple-system,sans-serif">
                <tr style="background:#1E2738;border-top:1px solid #C9A96E;border-bottom:1px solid #C9A96E"><th style="padding:14px 8px;text-align:left;font-weight:500;letter-spacing:0.15em;font-size:10px;color:#C9A96E">PRODUCT</th><th style="padding:14px 8px;text-align:center;font-weight:500;letter-spacing:0.15em;font-size:10px;color:#C9A96E">QTY</th><th style="padding:14px 8px;text-align:right;font-weight:500;letter-spacing:0.15em;font-size:10px;color:#C9A96E">AMOUNT</th></tr>
                ${customerItemRows}
              </table>

              <div style="background:#1E2738;padding:20px 24px;margin:28px 0;border-left:3px solid #C9A96E">
                <p style="margin:0 0 6px;color:#8A6E3E;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;font-family:'DM Sans',-apple-system,sans-serif">Shipping to</p>
                <p style="margin:0;color:#F5F1EB;line-height:1.6;font-family:'DM Sans',-apple-system,sans-serif">${customerShipping}</p>
              </div>

              <p style="color:#B8B2A8;line-height:1.7;margin:36px 0 8px;font-family:'DM Sans',-apple-system,sans-serif">Questions about your order? Reply to this email or write us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#C9A96E;text-decoration:none;border-bottom:1px solid #8A6E3E">${SUPPORT_EMAIL}</a>.</p>
            `,
          }),
        });
        console.log('[Webhook] Customer confirmation sent to', order.customerEmail);
      } catch (err) {
        console.error('[Webhook] Failed to send customer confirmation:', err);
      }

      if (!wasReturning) {
        await addToCustomersAudience(order.customerEmail, customerFirstName);

        const welcomeAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        // Generate unique per-customer THANKS15 code for the +24h welcome email.
        // The +60d REVIEW email is fired by the daily cron (netlify/functions/
        // greenstone-review-cron) which generates its own per-customer code at
        // send time — Resend caps scheduled sends at 30 days so we can't wait.
        let thanksCode = 'THANKS15';
        try {
          thanksCode = await createPersonalPromoCode({ baseCoupon: 'THANKS15', daysValid: 60 });
          console.log('[Webhook] Personal THANKS code:', thanksCode);
        } catch (err) {
          console.error('[Webhook] THANKS code create failed, using shared fallback:', err);
        }

        // Welcome email +24h
        try {
          await resend.emails.send({
            from: ORDERS_FROM,
            to: order.customerEmail,
            replyTo: SUPPORT_EMAIL,
            scheduledAt: welcomeAt,
            subject: 'Welcome to Greenstone — a thank-you, and where to start',
            html: renderEmailShell({
              preheader: `Your THANKS15 code for next order, plus two free guides while you wait.`,
              body: `
                <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;color:#F5F1EB;font-weight:400;margin:0 0 16px">Welcome${customerFirstName ? `, ${customerFirstName}` : ''}.</h2>
                <p style="color:#B8B2A8;line-height:1.7;margin:0 0 16px;font-family:'DM Sans',-apple-system,sans-serif">Thank you for trusting Greenstone with your first order. Every peptide we ship is <span style="color:#1A9E6E;font-weight:500">compounded in the USA under USP 797 standards</span> and <span style="color:#1A9E6E;font-weight:500">third-party tested</span> for potency, sterility, and purity.</p>
                <p style="color:#B8B2A8;line-height:1.7;margin:0 0 28px;font-family:'DM Sans',-apple-system,sans-serif">A small thank-you below — and two free guides we publish for the community.</p>

                ${renderCodeBlock({ code: thanksCode, label: '15% off your next order', meta: 'reserved for you · one use · expires in 60 days' })}

                <p style="text-align:center;margin:28px 0 40px">
                  <a href="${SITE_URL}/shop" style="display:inline-block;background:#C9A96E;color:#0D1117;padding:14px 36px;text-decoration:none;letter-spacing:0.2em;font-size:12px;font-family:'DM Sans',-apple-system,sans-serif;font-weight:600">SHOP AGAIN</a>
                </p>

                <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;color:#F5F1EB;font-weight:400;margin:40px 0 8px">Free guides for the community</h3>
                <p style="color:#B8B2A8;line-height:1.7;margin:0 0 20px;font-family:'DM Sans',-apple-system,sans-serif">No fluff. Clinical-grade reading material for anyone serious about peptide research.</p>

                <table style="width:100%;border-collapse:collapse;margin:0 0 32px">
                  <tr>
                    <td style="padding:18px 20px;border:1px solid #1E2738;background:#161C26;width:50%;vertical-align:top">
                      <p style="margin:0 0 6px;color:#1A9E6E;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;font-family:'DM Sans',-apple-system,sans-serif">Volume I</p>
                      <p style="margin:0 0 10px;color:#F5F1EB;font-family:'Cormorant Garamond',Georgia,serif;font-size:20px">Peptides Made Easy</p>
                      <p style="margin:0 0 14px;color:#B8B2A8;font-size:13px;line-height:1.5;font-family:'DM Sans',-apple-system,sans-serif">A primer for newcomers — what peptides are, how they're researched, where to start.</p>
                      <a href="${SITE_URL}/free/peptides-made-easy" style="color:#1A9E6E;font-size:12px;letter-spacing:0.15em;text-decoration:none;font-family:'DM Sans',-apple-system,sans-serif;font-weight:600">DOWNLOAD →</a>
                    </td>
                    <td style="width:8px"></td>
                    <td style="padding:18px 20px;border:1px solid #1E2738;background:#161C26;width:50%;vertical-align:top">
                      <p style="margin:0 0 6px;color:#1A9E6E;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;font-family:'DM Sans',-apple-system,sans-serif">Volume II</p>
                      <p style="margin:0 0 10px;color:#F5F1EB;font-family:'Cormorant Garamond',Georgia,serif;font-size:20px">Peptides Unlocked</p>
                      <p style="margin:0 0 14px;color:#B8B2A8;font-size:13px;line-height:1.5;font-family:'DM Sans',-apple-system,sans-serif">Match peptides to research goals, quality and sourcing checklist, 48-hour framework.</p>
                      <a href="${SITE_URL}/free/peptides-unlocked" style="color:#1A9E6E;font-size:12px;letter-spacing:0.15em;text-decoration:none;font-family:'DM Sans',-apple-system,sans-serif;font-weight:600">DOWNLOAD →</a>
                    </td>
                  </tr>
                </table>

                <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;color:#F5F1EB;font-weight:400;margin:40px 0 16px">A few things to know</h3>
                <table style="width:100%;border-collapse:collapse;font-family:'DM Sans',-apple-system,sans-serif">
                  <tr><td style="color:#1A9E6E;padding:6px 12px 6px 0;vertical-align:top;font-weight:600">✓</td><td style="color:#B8B2A8;padding:6px 0;line-height:1.7">All orders ship free via US Priority Mail.</td></tr>
                  <tr><td style="color:#1A9E6E;padding:6px 12px 6px 0;vertical-align:top;font-weight:600">✓</td><td style="color:#B8B2A8;padding:6px 0;line-height:1.7">Tracking is included in every order confirmation.</td></tr>
                  <tr><td style="color:#1A9E6E;padding:6px 12px 6px 0;vertical-align:top;font-weight:600">✓</td><td style="color:#B8B2A8;padding:6px 0;line-height:1.7">Questions? <a href="mailto:${SUPPORT_EMAIL}" style="color:#C9A96E;text-decoration:none;border-bottom:1px solid #8A6E3E">${SUPPORT_EMAIL}</a></td></tr>
                </table>
              `,
            }),
          });
          console.log('[Webhook] Welcome email scheduled for', welcomeAt);
        } catch (err) {
          console.error('[Webhook] Failed to schedule welcome email:', err);
        }

        // Note: the +60d REVIEW email is fired by the daily scheduled function
        // at netlify/functions/greenstone-review-cron.mts, not from this webhook.
      } else {
        console.log('[Webhook] Returning customer — skipping welcome email');
      }
    }
  } catch (err) {
    console.error('[Webhook] Error processing order:', err);
  }

  return NextResponse.json({ received: true });
}
