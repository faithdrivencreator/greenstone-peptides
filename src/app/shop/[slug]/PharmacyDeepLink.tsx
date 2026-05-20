'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { pharmacyStorefrontUrl } from '@/lib/pharmacy';

type Props = {
  slug: string;
};

/**
 * Single CTA on the parent product detail page. Visitors have already read the
 * full molecule explainer on our side; this button takes them straight to
 * Bloom's Lightweight storefront root (`/dtp/<clinic-id>`) so they can add to
 * cart and run the 4-step intake without going through Bloom's educational
 * tree again.
 *
 * The store layout in Bloom MUST be set to Lightweight for this URL to resolve
 * to the patient catalog. If it's set to Educational, this URL will bounce to
 * Bloom's provider login. (Pete: flip via dashboard → My Store before unlock.)
 *
 * Auth-gated via the same /login?next= pattern used elsewhere. Signed-in
 * users open Bloom in a new tab; signed-out users bounce through sign-in.
 */
export function PharmacyDeepLink({ slug }: Props) {
  const router = useRouter();
  const { status } = useSession();
  const signedIn = status === 'authenticated';

  const pharmacyUrl = pharmacyStorefrontUrl();
  // Signed-out users go to /login?next=pharmacy — the login form sees the
  // `pharmacy` keyword and resolves the actual storefront URL itself (single
  // source of truth in src/lib/pharmacy.ts).
  const loginHref = '/login?next=pharmacy';

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (signedIn) return; // native <a target=_blank> behavior fires
    e.preventDefault();
    router.push(loginHref);
  }

  return (
    <a
      href={signedIn ? pharmacyUrl : loginHref}
      target={signedIn ? '_blank' : undefined}
      rel={signedIn ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      data-track={`shop-parent-${slug}-pharmacy`}
      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald text-obsidian font-jetbrains text-[0.7rem] tracking-[0.2em] uppercase font-semibold hover:bg-emerald-light transition-colors w-full sm:w-auto"
    >
      Continue to Pharmacy →
    </a>
  );
}
