'use client';

/**
 * Saved card record. Shape mirrors what a payment processor (Stripe,
 * Hyperswitch, etc.) would return for a stored payment method. The form
 * consumes this shape directly — when we wire the real backend, only this
 * hook changes, the form stays the same.
 */
export interface SavedCard {
  id: string;
  brand: string;       // 'Visa', 'Mastercard', 'Amex', etc.
  last4: string;       // '4242'
  exp_month: number;   // 1-12
  exp_year: number;    // 4-digit year
}

interface UseSavedCardsResult {
  cards: SavedCard[];
  loading: boolean;
}

/**
 * STUB. Returns an empty list of saved cards.
 *
 * TODO: replace with a real fetch once payment processor is chosen
 * (Stripe Customer.payment_methods vs Hyperswitch). Decision pending.
 * When wired, this should call `/api/account/saved-cards` and return
 * the authenticated user's vaulted cards.
 */
export function useSavedCards(): UseSavedCardsResult {
  return { cards: [], loading: false };
}
