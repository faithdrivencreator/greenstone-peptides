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
    shippingAddress: session.shipping_details?.address ?? null,
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
  } catch (err) {
    console.error('[Webhook] Error processing order:', err);
  }

  return NextResponse.json({ received: true });
}
