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
  bloomLearn: 'weight-loss' | 'peptides' | 'mens-ed';
  slug: string;
};

/**
 * Dual CTA on the parent product detail page. Two entry points into the
 * Greenstone Rx (Bloom) storefront:
 *
 *   1. Continue to Pharmacy → lightweight storefront root. Patient already
 *      decided what they want; we route them straight to checkout.
 *      Bloom's lightweight layout doesn't expose per-product deep URLs,
 *      so this always lands on the root (`/dtp/<clinic-id>`).
 *
 *   2. Use Dose Finder → educational page for this molecule. Includes
 *      the BMI calculator and dose-finder sidebar Bloom hosts on /learn.
 *      For patients still picking a dose.
 *
 * Both are auth-gated through the same /login?next= pattern used in
 * VerticalsStrip. Signed-in users open Bloom in a new tab; everyone else
 * bounces through sign-in first.
 */
export function PharmacyDeepLink({ bloomLearn, slug }: Props) {
  const router = useRouter();
  const { status } = useSession();
  const signedIn = status === 'authenticated';

  const lightweightUrl = `${PHARMACY_BASE}/dtp/${BLOOM_CLINIC_ID}`;
  const educationalUrl = `${PHARMACY_BASE}/dtp/${BLOOM_CLINIC_ID}/learn/${bloomLearn}/${slug}`;

  function makeHandler(href: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (signedIn) return; // native <a target=_blank> behavior fires
      e.preventDefault();
      router.push(`/login?next=${encodeURIComponent(href)}`);
    };
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Primary — lightweight, direct-to-purchase */}
      <a
        href={signedIn ? lightweightUrl : `/login?next=${encodeURIComponent(lightweightUrl)}`}
        target={signedIn ? '_blank' : undefined}
        rel={signedIn ? 'noopener noreferrer' : undefined}
        onClick={makeHandler(lightweightUrl)}
        data-track={`shop-parent-${slug}-pharmacy-direct`}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald text-obsidian font-jetbrains text-[0.7rem] tracking-[0.2em] uppercase font-semibold hover:bg-emerald-light transition-colors"
      >
        Continue to Pharmacy →
      </a>

      {/* Secondary — educational, with BMI calc + dose finder */}
      <a
        href={signedIn ? educationalUrl : `/login?next=${encodeURIComponent(educationalUrl)}`}
        target={signedIn ? '_blank' : undefined}
        rel={signedIn ? 'noopener noreferrer' : undefined}
        onClick={makeHandler(educationalUrl)}
        data-track={`shop-parent-${slug}-pharmacy-learn`}
        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-emerald/40 text-emerald hover:border-emerald hover:text-emerald-light font-jetbrains text-[0.7rem] tracking-[0.2em] uppercase font-semibold transition-colors"
      >
        Use Dose Finder →
      </a>
    </div>
  );
}
