import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import type { CartItem } from '@/context/CartContext';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json();

    if (!items?.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';

    // Build metadata: product names and quantities, available in webhook payload
    const metadataItems = items.map((item) => {
      const label = [item.name, item.strength, item.size].filter(Boolean).join(' · ');
      return `${label} x${item.qty}`;
    });
    const metadata: Record<string, string> = {
      source_site: 'greenstonewellness.store',
      brand: 'greenstone-peptides',
      revenue_type: 'product_sale',
      item_count: String(items.reduce((sum, i) => sum + i.qty, 0)),
      // Stripe metadata values max 500 chars, truncate if cart is very large
      items_summary: metadataItems.join(' | ').slice(0, 500),
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_intent_data: {
        statement_descriptor: 'GREENSTONE WELLNESS',
        metadata: {
          source_site: 'greenstonewellness.store',
          brand: 'greenstone-peptides',
          revenue_type: 'product_sale',
        },
      },
      allow_promotion_codes: false,
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1000, currency: 'usd' },
            display_name: 'USPS Priority Mail',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 8 },
              maximum: { unit: 'business_day', value: 12 },
            },
            metadata: {
              note: 'Includes 5-7 business days compounding + 3-5 business days shipping',
            },
          },
        },
      ],
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
