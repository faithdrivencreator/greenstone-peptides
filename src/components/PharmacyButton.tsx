'use client';

import { useSession } from 'next-auth/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { FL_STATE_CODE } from '@/lib/us-states';
import { pharmacyStorefrontUrl } from '@/lib/pharmacy';

const ORDER_PATH = '/order-out-of-state';
const ACCOUNT_SHIPPING_PATH = '/account/shipping';

type Props = {
  label?: string;
  variant?: 'primary' | 'inline' | 'compact';
  className?: string;
  showArrow?: boolean;
  showIcon?: boolean;
  trackId?: string;
  ariaLabel?: string;
  productContext?: { product?: string; dose?: string; size?: string; price?: number };
};

function buildQuery(ctx?: Props['productContext']) {
  if (!ctx) return '';
  const params = new URLSearchParams();
  if (ctx.product) params.set('product', ctx.product);
  if (ctx.dose) params.set('dose', ctx.dose);
  if (ctx.size) params.set('size', ctx.size);
  if (ctx.price != null) params.set('price', String(ctx.price));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function buildOrderUrl(ctx?: Props['productContext']) {
  return ORDER_PATH + buildQuery(ctx);
}

function buildAccountShippingUrl(ctx?: Props['productContext']) {
  // Forward to the order page after the user fills in their state.
  const next = ORDER_PATH + buildQuery(ctx);
  const sp = new URLSearchParams({ next });
  return `${ACCOUNT_SHIPPING_PATH}?${sp.toString()}`;
}

/**
 * Order CTA — routes the user to the right destination based on auth + shipping state.
 *
 *   - Loading                      → href="#", disabled (don't let the user fire a hard nav early)
 *   - Not signed in                → /login?next=pharmacy
 *   - Signed in, FL shipping       → Bloom storefront in a new tab (preserves account-manager commission)
 *   - Signed in, non-FL shipping   → /order-out-of-state (our managed OOS checkout)
 *   - Signed in, no shipping_state → /account/shipping?next=<order-url> (legacy accounts collect-state-once)
 */
export function PharmacyButton({
  label = 'Order from Pharmacy',
  variant = 'primary',
  className = '',
  showArrow = true,
  showIcon = false,
  trackId,
  ariaLabel,
  productContext,
}: Props) {
  const { data: session, status } = useSession();

  const base = 'inline-flex items-center gap-2 transition-colors';
  const variants = {
    primary: 'btn btn-primary',
    inline:
      'font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald hover:text-emerald-light border border-emerald/40 hover:border-emerald/70 px-4 py-2.5',
    compact:
      'font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald hover:text-emerald-light px-3 py-1.5 border border-emerald/30 hover:border-emerald/60',
  };

  // Default: loading state — link is inert until we know the user's auth status.
  let href: string = '#';
  let target: string | undefined;
  let rel: string | undefined;
  let ariaDisabled: boolean | undefined;

  if (status === 'loading') {
    ariaDisabled = true;
  } else if (status === 'unauthenticated') {
    href = '/login?next=pharmacy';
  } else {
    const shippingState = session?.user?.shippingState ?? null;
    if (!shippingState) {
      // Legacy account — collect the missing state once, then forward.
      href = buildAccountShippingUrl(productContext);
    } else if (shippingState.toUpperCase() === FL_STATE_CODE) {
      href = pharmacyStorefrontUrl();
      target = '_blank';
      rel = 'noopener noreferrer';
    } else {
      href = buildOrderUrl(productContext);
    }
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      data-track={trackId}
      aria-label={ariaLabel}
      aria-disabled={ariaDisabled}
      onClick={(e) => {
        if (ariaDisabled) e.preventDefault();
      }}
      className={`${base} ${variants[variant]} ${className} ${ariaDisabled ? 'opacity-60 cursor-wait pointer-events-none' : ''}`}
    >
      {showIcon && <ShoppingBag size={variant === 'compact' ? 11 : 14} />}
      <span>{label}</span>
      {showArrow && <ArrowRight size={variant === 'compact' ? 11 : 14} />}
    </a>
  );
}
