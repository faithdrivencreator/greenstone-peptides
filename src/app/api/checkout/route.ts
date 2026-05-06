import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/context/CartContext';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

export async function POST(req: NextRequest) {
  try {
    const { items, couponCode }: { items: CartItem[]; couponCode?: string } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';

    // Resolve coupon — validate it exists in Stripe before passing
    let discounts: Stripe.Checkout.SessionCreateParams['discounts'] | undefined;
    if (couponCode) {
      try {
        await stripe.coupons.retrieve(couponCode.toUpperCase());
        discounts = [{ coupon: couponCode.toUpperCase() }];
      } catch {
        // Invalid coupon — proceed without it (don't block checkout)
      }
    }

    // Build metadata: product names and quantities — available in webhook payload
    const metadataItems = items.map((item) => {
      const label = [item.name, item.strength, item.size].filter(Boolean).join(' · ');
      return `${label} x${item.qty}`;
    });
    const metadata: Record<string, string> = {
      item_count: String(items.reduce((sum, i) => sum + i.qty, 0)),
      // Stripe metadata values max 500 chars — truncate if cart is very large
      items_summary: metadataItems.join(' | ').slice(0, 500),
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_intent_data: {
        statement_descriptor: 'GREENSTONE PEPTIDE',
      },
      allow_promotion_codes: !discounts, // show promo code field if no code pre-applied
      ...(discounts ? { discounts } : {}),
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      line_items: items.map((item) => ({
        quantity: item.qty,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.name,
            description: [item.strength, item.size].filter(Boolean).join(' · ') || undefined,
          },
        },
      })),
      metadata,
      success_url: `${siteUrl}/shop/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
