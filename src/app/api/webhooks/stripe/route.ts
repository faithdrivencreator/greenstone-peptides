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
            `<tr><td style="padding:12px 8px;border-bottom:1px solid #e8e2d4;font-family:Georgia,serif">${i.name}</td><td style="padding:12px 8px;border-bottom:1px solid #e8e2d4;text-align:center">${i.quantity}</td><td style="padding:12px 8px;border-bottom:1px solid #e8e2d4;text-align:right">$${i.subtotal.toFixed(2)}</td></tr>`,
        )
        .join('');

      try {
        await resend.emails.send({
          from: ORDERS_FROM,
          to: order.customerEmail,
          replyTo: SUPPORT_EMAIL,
          subject: `Your Greenstone order is confirmed — #${orderRef}`,
          html: `
            <div style="font-family:Georgia,serif;background:#f4efe6;padding:32px 16px">
              <div style="max-width:600px;margin:0 auto;background:#fff;padding:40px 32px;border:1px solid #e8e2d4">
                <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:300;letter-spacing:0.15em;color:#1a3d2e;margin:0 0 4px;text-align:center">GREENSTONE</h1>
                <p style="text-align:center;color:#7a8175;font-size:11px;letter-spacing:0.3em;margin:0 0 32px">PEPTIDES &middot; WELLNESS</p>

                <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;color:#1a3d2e;font-weight:400;margin:0 0 8px">Thank you${customerFirstName ? `, ${customerFirstName}` : ''}.</h2>
                <p style="color:#444;line-height:1.6;margin:0 0 24px">We've received your order and will begin preparing it for shipment. You'll get a tracking email the moment it leaves our facility.</p>

                <table style="width:100%;margin:24px 0;font-family:Arial,sans-serif">
                  <tr><td style="color:#888;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 0">Order</td><td style="text-align:right;color:#1a3d2e;font-weight:600">#${orderRef}</td></tr>
                  <tr><td style="color:#888;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 0">Total</td><td style="text-align:right;color:#1a3d2e;font-weight:600;font-size:18px">$${order.amountTotal.toFixed(2)} ${order.currency}</td></tr>
                  <tr><td style="color:#888;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:4px 0">Shipping</td><td style="text-align:right;color:#1a3d2e">Free &middot; US Priority</td></tr>
                </table>

                <table style="width:100%;border-collapse:collapse;margin:24px 0;font-family:Arial,sans-serif">
                  <tr style="background:#1a3d2e;color:#f4efe6"><th style="padding:12px 8px;text-align:left;font-weight:400;letter-spacing:0.1em;font-size:11px">PRODUCT</th><th style="padding:12px 8px;text-align:center;font-weight:400;letter-spacing:0.1em;font-size:11px">QTY</th><th style="padding:12px 8px;text-align:right;font-weight:400;letter-spacing:0.1em;font-size:11px">AMOUNT</th></tr>
                  ${customerItemRows}
                </table>

                <div style="background:#f4efe6;padding:20px;margin:24px 0;border-left:3px solid #1a3d2e">
                  <p style="margin:0 0 4px;color:#888;font-size:11px;letter-spacing:0.15em;text-transform:uppercase">Shipping to</p>
                  <p style="margin:0;color:#1a3d2e;line-height:1.5">${customerShipping}</p>
                </div>

                <p style="color:#444;line-height:1.6;margin:32px 0 8px">Questions about your order? Reply to this email or write us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#1a3d2e">${SUPPORT_EMAIL}</a>.</p>
                <p style="color:#7a8175;font-size:13px;line-height:1.6;margin:24px 0 0">Research peptides for laboratory and research use. Not for human consumption.</p>

                <hr style="border:none;border-top:1px solid #e8e2d4;margin:32px 0 16px">
                <p style="text-align:center;color:#7a8175;font-size:11px;letter-spacing:0.2em;margin:0">
                  <a href="${SITE_URL}" style="color:#7a8175;text-decoration:none">GREENSTONEWELLNESS.STORE</a>
                </p>
              </div>
            </div>
          `,
        });
        console.log('[Webhook] Customer confirmation sent to', order.customerEmail);
      } catch (err) {
        console.error('[Webhook] Failed to send customer confirmation:', err);
      }

      if (!wasReturning) {
        await addToCustomersAudience(order.customerEmail, customerFirstName);

        const welcomeAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

        try {
          await resend.emails.send({
            from: ORDERS_FROM,
            to: order.customerEmail,
            replyTo: SUPPORT_EMAIL,
            scheduledAt: welcomeAt,
            subject: 'Welcome to Greenstone — a small gift for next time',
            html: `
              <div style="font-family:Georgia,serif;background:#f4efe6;padding:32px 16px">
                <div style="max-width:600px;margin:0 auto;background:#fff;padding:40px 32px;border:1px solid #e8e2d4">
                  <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:300;letter-spacing:0.15em;color:#1a3d2e;margin:0 0 4px;text-align:center">GREENSTONE</h1>
                  <p style="text-align:center;color:#7a8175;font-size:11px;letter-spacing:0.3em;margin:0 0 32px">PEPTIDES &middot; WELLNESS</p>

                  <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;color:#1a3d2e;font-weight:400;margin:0 0 16px">Welcome${customerFirstName ? `, ${customerFirstName}` : ''}.</h2>
                  <p style="color:#444;line-height:1.7;margin:0 0 16px">Thank you for trusting Greenstone with your first order. We source every peptide through US-based compounding partners and ship in temperature-controlled packaging.</p>
                  <p style="color:#444;line-height:1.7;margin:0 0 24px">As a thank-you, here's <strong>15% off</strong> your next order. Valid for 60 days.</p>

                  <div style="background:#1a3d2e;color:#f4efe6;padding:28px;text-align:center;margin:24px 0">
                    <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.3em">YOUR CODE</p>
                    <p style="margin:0;font-family:Courier,monospace;font-size:32px;letter-spacing:0.2em;font-weight:600">THANKS15</p>
                    <p style="margin:8px 0 0;font-size:12px;color:#a8b2a4">15% off &middot; one use &middot; expires in 60 days</p>
                  </div>

                  <p style="text-align:center;margin:32px 0">
                    <a href="${SITE_URL}/shop" style="display:inline-block;background:#1a3d2e;color:#f4efe6;padding:14px 32px;text-decoration:none;letter-spacing:0.15em;font-size:13px;font-family:Arial,sans-serif">SHOP AGAIN</a>
                  </p>

                  <h3 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;color:#1a3d2e;font-weight:400;margin:32px 0 12px">A few things to know</h3>
                  <ul style="color:#444;line-height:1.7;padding-left:20px;margin:0 0 16px">
                    <li>All orders ship free via US Priority Mail.</li>
                    <li>Track every order from your confirmation email.</li>
                    <li>Questions? Write us at <a href="mailto:${SUPPORT_EMAIL}" style="color:#1a3d2e">${SUPPORT_EMAIL}</a>.</li>
                  </ul>

                  <p style="color:#7a8175;font-size:13px;line-height:1.6;margin:24px 0 0">Research peptides for laboratory and research use. Not for human consumption.</p>

                  <hr style="border:none;border-top:1px solid #e8e2d4;margin:32px 0 16px">
                  <p style="text-align:center;color:#7a8175;font-size:11px;letter-spacing:0.2em;margin:0">
                    <a href="${SITE_URL}" style="color:#7a8175;text-decoration:none">GREENSTONEWELLNESS.STORE</a>
                  </p>
                </div>
              </div>
            `,
          });
          console.log('[Webhook] Welcome email scheduled for', welcomeAt);
        } catch (err) {
          console.error('[Webhook] Failed to schedule welcome email:', err);
        }
      } else {
        console.log('[Webhook] Returning customer — skipping welcome email');
      }
    }
  } catch (err) {
    console.error('[Webhook] Error processing order:', err);
  }

  return NextResponse.json({ received: true });
}
