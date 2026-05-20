'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const PHARMACY_BASE =
  process.env.NEXT_PUBLIC_PHARMACY_URL || 'https://bloom.greenstonerx.com';

/**
 * Clinic-id for the GreenstoneWellness.Store storefront on Bloom.
 * Mirrored from docs/bloom-storefront-flow.md.
 */
const BLOOM_CLINIC_ID = '6a0bb254fa53ddc1571c040b';

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

  const pharmacyUrl = `${PHARMACY_BASE}/dtp/${BLOOM_CLINIC_ID}`;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (signedIn) return; // native <a target=_blank> behavior fires
    e.preventDefault();
    router.push(`/login?next=${encodeURIComponent(pharmacyUrl)}`);
  }

  return (
    <a
      href={signedIn ? pharmacyUrl : `/login?next=${encodeURIComponent(pharmacyUrl)}`}
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
