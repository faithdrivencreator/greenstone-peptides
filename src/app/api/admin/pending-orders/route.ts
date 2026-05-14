/**
 * Returns Greenstone orders waiting to ship, i.e., succeeded payments
 * with `metadata.source_site=greenstonewellness.store` that don't yet
 * have a `metadata.shipped_at` timestamp set.
 *
 * Auth: same `ADMIN_PASSWORD` as /api/admin/send-shipping (header
 * `Authorization: Bearer <pw>` or `?password=<pw>` query).
 */

import { NextRequest, NextResponse } from 'next/server';

interface StripeAddress {
  city?: string | null;
  country?: string | null;
  line1?: string | null;
  line2?: string | null;
  postal_code?: string | null;
  state?: string | null;
}

interface StripeCheckoutSession {
  id: string;
  amount_total: number;
  currency: string;
  customer_details?: {
    email?: string | null;
    name?: string | null;
  } | null;
  payment_intent: string | null;
  payment_status: string;
  metadata?: Record<string, string>;
  collected_information?: {
    shipping_details?: {
      address?: StripeAddress;
      name?: string;
    } | null;
  } | null;
  created: number;
}

export interface PendingOrder {
  sessionId: string;
  orderRef: string;
  paymentIntent: string | null;
  customerEmail: string;
  customerName: string | null;
  customerFirstName: string | null;
  amountTotal: number;
  currency: string;
  shippingAddress: StripeAddress | null;
  itemsSummary: string;
  createdAt: string;
  ageDays: number;
}

function authorize(req: NextRequest): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const header = req.headers.get('authorization');
  if (header === `Bearer ${expected}`) return true;
  const url = new URL(req.url);
  if (url.searchParams.get('password') === expected) return true;
  return false;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sk = process.env.STRIPE_SECRET_KEY;
  if (!sk) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY not set' }, { status: 500 });
  }

  // Query last 30 days of Greenstone-sourced payment_intents that succeeded.
  // Stripe Search lets us combine status + metadata + date in one shot.
  const now = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - 30 * 86400;

  // Also include orders BEFORE the `source_site` metadata convention existed
  // (older Greenstone orders like Azam's, placed before today's webhook upgrade).
  // We fetch two queries and merge, one for tagged orders, one for older
  // untagged orders by statement_descriptor.
  const queries = [
    `status:'succeeded' AND created>${thirtyDaysAgo} AND metadata['source_site']:'greenstonewellness.store'`,
    `status:'succeeded' AND created>${thirtyDaysAgo}`,
  ];

  const piMap = new Map<string, { id: string; metadata: Record<string, string> }>();
  for (const q of queries) {
    try {
      const url = new URL('https://api.stripe.com/v1/payment_intents/search');
      url.searchParams.set('query', q);
      url.searchParams.set('limit', '100');
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${sk}`, 'Stripe-Version': '2024-06-20' },
      });
      if (!res.ok) {
        console.error('[PendingOrders] Stripe search failed', q, res.status);
        continue;
      }
      const data = await res.json();
      for (const pi of data.data) {
        // For the broad query, only include if it's Greenstone, use
        // statement_descriptor as a backup signal for pre-metadata orders.
        const isGreenstone =
          pi.metadata?.source_site === 'greenstonewellness.store' ||
          (pi.statement_descriptor || '').toUpperCase().includes('GREENSTONE');
        if (!isGreenstone) continue;
        if (!piMap.has(pi.id)) piMap.set(pi.id, pi);
      }
    } catch (err) {
      console.error('[PendingOrders] Stripe search error:', err);
    }
  }

  // Filter out already-shipped
  const pending = Array.from(piMap.values()).filter((pi) => !pi.metadata?.shipped_at);

  // For each, fetch the checkout session to get email/name/address
  const orders: PendingOrder[] = [];
  for (const pi of pending) {
    try {
      const url = new URL('https://api.stripe.com/v1/checkout/sessions');
      url.searchParams.set('payment_intent', pi.id);
      url.searchParams.set('limit', '1');
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${sk}`, 'Stripe-Version': '2024-06-20' },
      });
      if (!res.ok) continue;
      const sessRes = await res.json();
      const session = (sessRes.data?.[0] ?? null) as StripeCheckoutSession | null;
      if (!session) continue;
      if (!session.customer_details?.email) continue;

      const email = session.customer_details.email;
      const fullName = session.customer_details.name ?? null;
      const firstName = fullName ? fullName.split(' ')[0] : null;
      const shippingAddress =
        session.collected_information?.shipping_details?.address ?? null;

      orders.push({
        sessionId: session.id,
        orderRef: session.id.slice(-8).toUpperCase(),
        paymentIntent: pi.id,
        customerEmail: email,
        customerName: fullName,
        customerFirstName: firstName,
        amountTotal: (session.amount_total ?? 0) / 100,
        currency: (session.currency ?? 'usd').toUpperCase(),
        shippingAddress,
        itemsSummary: session.metadata?.items_summary ?? '',
        createdAt: new Date(session.created * 1000).toISOString(),
        ageDays: Math.floor((Date.now() / 1000 - session.created) / 86400),
      });
    } catch (err) {
      console.error('[PendingOrders] Session fetch failed for', pi.id, err);
    }
  }

  // Sort: oldest first (those have been waiting longest to ship)
  orders.sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  return NextResponse.json({ orders });
}
