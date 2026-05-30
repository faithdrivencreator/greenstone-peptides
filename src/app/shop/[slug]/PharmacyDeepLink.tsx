'use client';

import { useSession } from 'next-auth/react';
import { FL_STATE_CODE } from '@/lib/us-states';
import { pharmacyStorefrontUrl } from '@/lib/pharmacy';

type Props = {
  slug: string;
};

const ORDER_PATH = '/order-out-of-state';
const ACCOUNT_SHIPPING_PATH = '/account/shipping';

/**
 * Single CTA on the parent product detail page.
 *
 *   Loading              → inert
 *   Not signed in        → /login?next=pharmacy
 *   FL shipping          → Bloom storefront in a new tab (commission preserved)
 *   non-FL shipping      → /order-out-of-state (our managed OOS funnel)
 *   no shipping_state    → /account/shipping?next=<order-url>
 */
export function PharmacyDeepLink({ slug }: Props) {
  const { data: session, status } = useSession();

  let href = '#';
  let target: string | undefined;
  let rel: string | undefined;
  let ariaDisabled: boolean | undefined;

  if (status === 'loading') {
    ariaDisabled = true;
  } else if (status === 'unauthenticated') {
    href = '/login?next=pharmacy';
  } else {
    const state = session?.user?.shippingState?.toUpperCase() ?? '';
    if (!state) {
      const sp = new URLSearchParams({ next: ORDER_PATH });
      href = `${ACCOUNT_SHIPPING_PATH}?${sp.toString()}`;
    } else if (state === FL_STATE_CODE) {
      href = pharmacyStorefrontUrl();
      target = '_blank';
      rel = 'noopener noreferrer';
    } else {
      // Carry the parent-product slug so the OOS form can render a variant
      // picker scoped to the product the customer was just reading about.
      const sp = new URLSearchParams({ slug });
      href = `${ORDER_PATH}?${sp.toString()}`;
    }
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-disabled={ariaDisabled}
      onClick={(e) => {
        if (ariaDisabled) e.preventDefault();
      }}
      data-track={`shop-parent-${slug}-pharmacy`}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald text-obsidian font-jetbrains text-[0.7rem] tracking-[0.2em] uppercase font-semibold hover:bg-emerald-light transition-colors w-full sm:w-auto ${ariaDisabled ? 'opacity-60 cursor-wait pointer-events-none' : ''}`}
    >
      Continue to Pharmacy →
    </a>
  );
}
