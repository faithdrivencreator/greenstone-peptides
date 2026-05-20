import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type Vertical = {
  slug: 'weight-loss' | 'peptides' | 'mens-ed' | 'longevity';
  title: string;
  eyebrow: string;
  tagline: string;
  image: string;
  imageAlt: string;
};

const VERTICALS: ReadonlyArray<Vertical> = [
  {
    slug: 'weight-loss',
    title: 'Weight Loss',
    eyebrow: 'GLP-1 · GIP',
    tagline: 'Reset hunger signals — not willpower.',
    image: '/images/verticals/weight-loss.webp',
    imageAlt: 'Woman in a bright kitchen holding a glass of water in the morning light',
  },
  {
    slug: 'peptides',
    title: 'Peptides',
    eyebrow: '7 medications',
    tagline:
      'Targeted signals for healing, growth hormone, metabolism, and collagen.',
    image: '/images/verticals/peptides.webp',
    imageAlt: 'Man at a sunlit desk reading a printed information booklet',
  },
  {
    slug: 'mens-ed',
    title: "Men's ED",
    eyebrow: 'Oral therapies',
    tagline:
      'Sildenafil, tadalafil, combination orals — discreetly shipped.',
    image: '/images/verticals/mens-ed.webp',
    imageAlt: 'Mature couple sharing a quiet morning coffee at home',
  },
  {
    slug: 'longevity',
    title: 'Longevity',
    eyebrow: 'NAD+ · Mitochondria',
    tagline: 'Cellular energy and longevity protocols.',
    image: '/images/verticals/longevity.webp',
    imageAlt: 'Active man hiking a coastal cliff trail at sunrise',
  },
];

/**
 * VerticalsStrip — the four-vertical browse strip directly under the hero.
 *
 * Each card is a single Link to the gated /shop catalog. Pharmacy deep-links
 * are intentionally absent here — visitors must sign in and select a product
 * before they can deep-link to Greenstone Rx (Bloom).
 */
export function VerticalsStrip() {
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
          {VERTICALS.map((v) => (
            <Link
              key={v.slug}
              href="/shop"
              data-track={`vertical-${v.slug}`}
              className="card-glass border-emerald/15 hover:border-emerald/40 transition-colors duration-300 flex flex-col group/vert relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald focus-visible:outline-offset-2"
              aria-label={`Browse ${v.title} formulations`}
            >
              <div className="relative aspect-[4/3] -mx-6 -mt-6 mb-6 overflow-hidden border-b border-emerald/15 bg-obsidian-mid">
                <Image
                  src={v.image}
                  alt={v.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover/vert:scale-[1.04]"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(8,28,22,0.55))' }}
                  aria-hidden
                />
              </div>

              <p className="font-jetbrains text-[0.6rem] tracking-[0.22em] uppercase text-emerald/90 mb-2">
                {v.eyebrow}
              </p>
              <h3 className="font-cormorant text-2xl text-white leading-tight">
                {v.title}
              </h3>
              <p className="mt-3 text-sm text-cream-dim leading-relaxed flex-1">
                {v.tagline}
              </p>

              <div className="mt-6 pt-4 border-t border-emerald/10 flex items-center justify-between">
                <span className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald group-hover/vert:text-emerald-light transition-colors">
                  Explore {v.title}
                </span>
                <ArrowRight size={13} className="text-emerald group-hover/vert:text-emerald-light transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center text-xs text-cream-dim/70 mt-10 font-jetbrains tracking-[0.18em] uppercase">
          Prescription required · Reviewed by a licensed U.S. physician
        </p>
      </div>
    </section>
  );
}
