'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight } from 'lucide-react';

const PHARMACY_BASE =
  process.env.NEXT_PUBLIC_PHARMACY_URL || 'https://bloom.greenstonerx.com';

/**
 * The clinic-id slug Bloom uses for the GreenstoneWellness.Store storefront.
 * Mirrored from docs/bloom-storefront-flow.md. Kept in code so each card builds
 * both its lightweight (storefront root) and educational (/learn/<slug>) URLs.
 */
const BLOOM_CLINIC_ID = '6a0bb254fa53ddc1571c040b';

type Vertical = {
  slug: 'weight-loss' | 'peptides' | 'mens-ed' | 'longevity';
  learnSlug: 'weight-loss' | 'peptides' | 'mens-ed';
  title: string;
  eyebrow: string;
  tagline: string;
  image: string;
  imageAlt: string;
};

const VERTICALS: ReadonlyArray<Vertical> = [
  {
    slug: 'weight-loss',
    learnSlug: 'weight-loss',
    title: 'Weight Loss',
    eyebrow: 'GLP-1 · GIP',
    tagline: 'Reset hunger signals — not willpower.',
    image: '/images/verticals/weight-loss.webp',
    imageAlt: 'Woman in a bright kitchen holding a glass of water in the morning light',
  },
  {
    slug: 'peptides',
    learnSlug: 'peptides',
    title: 'Peptides',
    eyebrow: '7 medications',
    tagline:
      'Targeted signals for healing, growth hormone, metabolism, and collagen.',
    image: '/images/verticals/peptides.webp',
    imageAlt: 'Man at a sunlit desk reading a printed information booklet',
  },
  {
    slug: 'mens-ed',
    learnSlug: 'mens-ed',
    title: "Men's ED",
    eyebrow: 'Oral therapies',
    tagline:
      'Sildenafil, tadalafil, combination orals — discreetly shipped.',
    image: '/images/verticals/mens-ed.webp',
    imageAlt: 'Mature couple sharing a quiet morning coffee at home',
  },
  {
    slug: 'longevity',
    learnSlug: 'peptides',
    title: 'Longevity',
    eyebrow: 'NAD+ · Mitochondria',
    tagline: 'Cellular energy and longevity protocols.',
    image: '/images/verticals/longevity.webp',
    imageAlt: 'Active man hiking a coastal cliff trail at sunrise',
  },
];

function buildProductUrl(): string {
  // Lightweight storefront root. Bloom's lightweight layout doesn't expose
  // per-category deep URLs — patients land on the root and filter from there.
  return `${PHARMACY_BASE}/dtp/${BLOOM_CLINIC_ID}`;
}

function buildLearnUrl(learnSlug: Vertical['learnSlug']): string {
  return `${PHARMACY_BASE}/dtp/${BLOOM_CLINIC_ID}/learn/${learnSlug}`;
}

/**
 * VerticalsStrip — the four-vertical browse strip directly under the hero.
 *
 * Every CTA respects the same auth gate that <PharmacyButton> uses: signed-in
 * users open Bloom in a new tab; everyone else gets bounced to /login?next=
 * with the original destination preserved so they land in the right place
 * after sign-in.
 */
export function VerticalsStrip() {
  const router = useRouter();
  const { status } = useSession();
  const signedIn = status === 'authenticated';

  function makeHandler(href: string) {
    return (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (signedIn) {
        // Let the native <a target=_blank> behavior take over.
        return;
      }
      // Not signed in → bounce through the auth gate. Encode the full Bloom
      // URL so /login can forward there after successful sign-in.
      e.preventDefault();
      router.push(`/login?next=${encodeURIComponent(href)}`);
    };
  }

  return (
    <section
      className="section-py bg-obsidian-mid/30 border-y border-emerald/15"
      aria-labelledby="verticals-heading"
    >
      <div className="container-gr">
        <header className="text-center mb-12 max-w-2xl mx-auto">
          <p className="eyebrow text-emerald">// Treatment Areas</p>
          <h2 id="verticals-heading" className="font-cormorant">
            Find the protocol <em className="italic text-gold">built for you.</em>
          </h2>
          <p className="mt-4 text-sm text-cream-dim leading-relaxed">
            Read the science first, or browse the formulary directly. Every order
            ships from Greenstone Rx after a licensed physician reviews your
            health screening.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VERTICALS.map((v) => {
            const productUrl = buildProductUrl();
            const learnUrl = buildLearnUrl(v.learnSlug);

            return (
              <article
                key={v.slug}
                className="card-glass border-emerald/15 hover:border-emerald/35 transition-colors duration-300 flex flex-col group/vert relative overflow-hidden"
              >
                <div className="relative aspect-[4/3] -mx-6 -mt-6 mb-6 overflow-hidden border-b border-emerald/15 bg-obsidian-mid">
                  <Image
                    src={v.image}
                    alt={v.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover/vert:scale-[1.04]"
                  />
                  {/* Subtle bottom emerald wash for visual cohesion with card body */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,28,22,0.55))' }}
                    aria-hidden
                  />
                </div>

                <p className="font-jetbrains text-[0.6rem] tracking-[0.22em] uppercase text-emerald/85 mb-2">
                  {v.eyebrow}
                </p>
                <h3 className="font-cormorant text-2xl text-white leading-tight">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm text-cream-dim leading-relaxed flex-1">
                  {v.tagline}
                </p>

                {/* Dual-CTA pattern. Both routed through the same auth gate as
                    PharmacyButton. */}
                <div className="mt-6 flex flex-col gap-2">
                  <a
                    href={signedIn ? productUrl : `/login?next=${encodeURIComponent(productUrl)}`}
                    target={signedIn ? '_blank' : undefined}
                    rel={signedIn ? 'noopener noreferrer' : undefined}
                    onClick={makeHandler(productUrl)}
                    data-track={`vertical-${v.slug}-products`}
                    className="inline-flex items-center justify-between gap-2 px-4 py-2.5 bg-emerald text-obsidian font-jetbrains text-[0.65rem] tracking-[0.18em] uppercase font-semibold hover:bg-emerald-light transition-colors"
                  >
                    <span>Browse Products</span>
                    <ArrowRight size={13} />
                  </a>
                  <a
                    href={signedIn ? learnUrl : `/login?next=${encodeURIComponent(learnUrl)}`}
                    target={signedIn ? '_blank' : undefined}
                    rel={signedIn ? 'noopener noreferrer' : undefined}
                    onClick={makeHandler(learnUrl)}
                    data-track={`vertical-${v.slug}-learn`}
                    className="inline-flex items-center justify-between gap-2 px-4 py-2.5 border border-emerald/40 text-emerald hover:text-emerald-light hover:border-emerald/70 font-jetbrains text-[0.65rem] tracking-[0.18em] uppercase transition-colors"
                  >
                    <span>Learn More</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className="text-center text-[0.6rem] text-cream-dim/40 mt-10 font-jetbrains tracking-[0.18em] uppercase">
          Prescription required · Reviewed by a licensed U.S. physician
        </p>
      </div>
    </section>
  );
}
