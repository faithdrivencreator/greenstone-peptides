'use client';

import { useSession } from 'next-auth/react';

type Props = {
  slug: string;
};

/**
 * Single CTA on the parent product detail page.
 *
 * Always routes through /api/pharmacy-route so the redirect is computed
 * server-side from a fresh DB read (not a potentially stale JWT). The
 * server handler sends FL customers to Bloom, OOS customers to
 * /order-out-of-state?slug=<slug>, no-state customers to /account/shipping.
 */
export function PharmacyDeepLink({ slug }: Props) {
  const { status } = useSession();
  const loading = status === 'loading';
  const unauth = status === 'unauthenticated';

  // Unauthed visitors get sent through /login first (skip the auth round-trip
  // on /api/pharmacy-route, which would just bounce them anyway).
  const href = unauth
    ? '/login?next=pharmacy'
    : `/api/pharmacy-route?next=${encodeURIComponent(`/order-out-of-state?slug=${encodeURIComponent(slug)}`)}`;

  return (
    <a
      href={href}
      aria-disabled={loading}
      onClick={(e) => {
        if (loading) e.preventDefault();
      }}
      data-track={`shop-parent-${slug}-pharmacy`}
      className={`inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald text-obsidian font-jetbrains text-[0.7rem] tracking-[0.2em] uppercase font-semibold hover:bg-emerald-light transition-colors w-full sm:w-auto ${loading ? 'opacity-60 cursor-wait pointer-events-none' : ''}`}
    >
      Continue to Pharmacy →
    </a>
  );
}
