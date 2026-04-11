import type { Product } from '@/types';

/**
 * Stripe integration — Phase 1 uses Stripe Payment Links (no backend).
 * Phase 2 will migrate to Stripe Checkout Sessions via API route.
 */

export interface StripePaymentLink {
  url: string;
  productId: string;
}

/**
 * Returns the checkout URL for a product.
 * Phase 1: Reads the pre-generated Stripe Payment Link stored in Sanity.
 * Phase 2: Creates a dynamic Checkout Session and returns the session URL.
 */
export function getCheckoutUrl(product: Product): string | null {
  if (!product.stripePaymentLink) return null;
  return product.stripePaymentLink;
}

/**
 * Phase 2 placeholder — dynamic Stripe Checkout Session.
 *
 * TODO: Implement server-side Stripe Checkout Session creation for:
 *   - Multi-line-item carts
 *   - Subscription products
 *   - Promo code support
 *   - Per-customer tax calculation
 *
 * Example shape (not wired up):
 *   import Stripe from 'stripe';
 *   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' });
 *   const session = await stripe.checkout.sessions.create({ ... });
 *   return session.url;
 */
export async function createCheckoutSession(_products: Product[]): Promise<string | null> {
  // Placeholder — returns null until Phase 2 backend is built.
  return null;
}
