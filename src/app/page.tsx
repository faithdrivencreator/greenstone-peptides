import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getRecentBlogPosts } from '@/lib/queries';
import { BlogCard } from '@/components/BlogCard';
import { SchemaOrg } from '@/components/SchemaOrg';
import { ShieldCheck, FlaskConical, Thermometer, Clock, ArrowRight } from 'lucide-react';
import EmailCapture from '@/components/EmailCapture';
import { VerticalsStrip } from '@/components/VerticalsStrip';
import { TrustGrid } from '@/components/TrustGrid';
import { HeroHowItWorks } from '@/components/HeroHowItWorks';
import { PARENT_PRODUCTS, fromPrice } from '@/data/parent-products';

export const metadata: Metadata = {
  title: 'GS Wellness Pharmacy | Compounded GLP-1, Peptide & Men\'s Therapy',
  description:
    'Compounded GLP-1, peptide, and oral therapy prescribed by a licensed physician and dispensed by a 503A pharmacy in Florida. Browse the formulary, then complete a quick health screening to start.',
  alternates: { canonical: '/' },
};

export const revalidate = 300;

// Three hand-picked parents featured on the homepage. Ordered by how Pete
// wants them to appear left-to-right.
const FEATURED_SLUGS = ['retatrutide', 'bpc-157', 'nad'] as const;

// Per-card image override — usually the parent's default image, but NAD+
// surfaces the nasal-spray variant on the homepage to highlight that option.
const FEATURED_IMAGE_OVERRIDES: Record<string, { image: string; alt: string; subtitle: string }> = {
  nad: {
    image: '/images/products/nad-plus-nasal-spray.jpg',
    alt: 'NAD+ intranasal spray bottle, GS Wellness Pharmacy',
    subtitle: 'Now available as an intranasal spray',
  },
};

export default async function HomePage() {
  const recentPosts = await getRecentBlogPosts(3);
  const featured = FEATURED_SLUGS
    .map((slug) => PARENT_PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      <SchemaOrg
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'GS Wellness Pharmacy',
          url: process.env.NEXT_PUBLIC_SITE_URL,
        }}
      />

      {/* ---------- ANNOUNCEMENT BANNER ---------- */}
      <div className="bg-emerald text-obsidian py-2.5 text-center font-jetbrains text-[0.65rem] tracking-[0.15em] uppercase">
        New: Retatrutide, the first triple agonist peptide for weight management{' '}
        <Link href="/shop/retatrutide" className="ml-1 underline underline-offset-2 font-bold hover:opacity-80 transition-opacity">
          Shop Retatrutide →
        </Link>
      </div>

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden section-py min-h-[80vh] flex items-center">
        {/* Full-bleed lab background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-lab.png)' }}
          aria-hidden
        />
        {/* Dark overlay, keeps text readable, adds brand depth */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.75) 50%, rgba(13,17,23,0.55) 100%)' }}
          aria-hidden
        />
        {/* Emerald glow over image */}
        <div
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(26,158,110,0.20) 0%, transparent 70%)' }}
          aria-hidden
        />

        <div className="container-gr relative z-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
          {/* Left: compressed, conversion-focused copy */}
          <div>
            <p className="eyebrow text-emerald">Licensed in Florida · Ships to All 50 States</p>
            <h1 className="font-cormorant">
              Medicine,{' '}
              <em className="italic text-gold">prescribed</em>
              <br />
              for you.
            </h1>
            <p className="mt-5 text-base text-cream-dim max-w-lg leading-relaxed">
              GLP-1, peptide, and oral therapies selected by our clinic and compounded
              by Greenstone Rx, a licensed 503A pharmacy. A real physician reviews your
              health screening before any medication ships.
            </p>
            {/* Hero CTAs intentionally removed — visitors should reach the
                pharmacy only after they create an account and select a product.
                The Verticals strip and Featured Formulations below funnel into
                /shop (gated), which is where the journey continues. */}

            {/* Micro trust row */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
              {['Licensed in FL', 'Ships to All 50 States', '503A Pharmacy', 'Physician-prescribed', 'USP 797 Sterile Compounding'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-cream-dim/70 font-jetbrains tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: animated 3-step "How it works" timeline */}
          <HeroHowItWorks />
        </div>
      </section>

      {/* ---------- FOUR VERTICALS STRIP ---------- */}
      <VerticalsStrip />

      {/* ---------- FEATURED FORMULATIONS — moved up so visitors see real
           products right after the hero/category cards, not buried under
           trust bars + free guides + quality standards. The conversion
           path is: see brand → see categories → see products. */}
      {featured.length > 0 && (
        <section className="section-py">
          <div className="container-gr">
            <header className="text-center mb-12 max-w-2xl mx-auto">
              <p className="eyebrow text-emerald">// Featured</p>
              <h2 className="font-cormorant">Three formulations <em className="italic text-gold">worth knowing.</em></h2>
              <p className="mt-4 text-sm text-cream-dim leading-relaxed">
                Hand-picked from our 14-medication formulary — what patients ask about most.
                All compounded by Greenstone Rx under USP 797 sterile standards.
              </p>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => {
                const override = FEATURED_IMAGE_OVERRIDES[p.slug];
                const cardImage = override?.image ?? p.image;
                const cardAlt = override?.alt ?? p.imageAlt;
                const subtitle = override?.subtitle;
                const from = fromPrice(p);
                return (
                  <Link
                    key={p.slug}
                    href={`/shop/${p.slug}`}
                    className="card-glass border-emerald/15 hover:border-emerald/40 transition-colors flex flex-col group/feat overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] -mx-6 -mt-6 mb-6 bg-obsidian-mid overflow-hidden border-b border-emerald/15">
                      <Image
                        src={cardImage}
                        alt={cardAlt}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover/feat:scale-[1.04]"
                      />
                    </div>
                    <h3 className="font-cormorant text-2xl text-white leading-tight">{p.name}</h3>
                    {subtitle && (
                      <p className="mt-1 font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald/85">
                        {subtitle}
                      </p>
                    )}
                    <p className="mt-3 text-sm text-cream-dim leading-relaxed flex-1">{p.shortDescription}</p>
                    <div className="mt-6 flex items-end justify-between gap-3 pt-4 border-t border-emerald/10">
                      <div>
                        <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald/80 mb-0.5">From</p>
                        <p className="font-cormorant text-2xl text-gold leading-none">${from}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 font-jetbrains text-[0.65rem] tracking-[0.18em] uppercase text-emerald group-hover/feat:text-emerald-light transition-colors">
                        View <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link href="/shop" className="inline-flex items-center gap-2 btn btn-primary">
                Browse the Full Formulary <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- TRUST BAR ---------- */}
      <section className="bg-obsidian-mid/90 border-y border-emerald/25 py-8 md:py-10">
        <div className="container-gr">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {[
              'Florida-Licensed',
              '503A Compounding Pharmacy',
              'Physician-Prescribed',
              'USP 797 Sterile',
            ].map((label) => (
              <span key={label} className="flex items-center gap-3 font-jetbrains text-xs md:text-sm tracking-widest uppercase text-cream/90">
                <span className="text-emerald font-bold text-base md:text-lg">✓</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FREE GUIDES STRIP ---------- */}
      <section className="section-py">
        <div className="container-gr">
          <header className="text-center mb-10 max-w-2xl mx-auto">
            <p className="eyebrow text-gold">Free Guides</p>
            <h2 className="font-cormorant">Two short reads to start with confidence</h2>
            <p className="mt-3 text-sm text-cream-dim">
              Plain language. No fluff. Sent to your inbox in 60 seconds.
            </p>
          </header>
          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {[
              {
                href: '/free/peptides-made-easy',
                cover: '/images/ebook-covers/peptides-made-easy-cover.webp',
                alt: 'Peptides Made Easy, Volume I free guide cover',
                caption: '18 pages · Beginner-friendly',
                shadow:
                  'shadow-[0_20px_60px_-15px_rgba(201,169,110,0.25)] hover:shadow-[0_30px_80px_-15px_rgba(201,169,110,0.4)]',
              },
              {
                href: '/free/peptides-unlocked',
                cover: '/images/ebook-covers/peptides-unlocked-cover.webp',
                alt: 'Peptides Unlocked, Volume II free guide cover',
                caption: '23 pages · Build your protocol',
                shadow:
                  'shadow-[0_20px_60px_-15px_rgba(26,158,110,0.25)] hover:shadow-[0_30px_80px_-15px_rgba(26,158,110,0.4)]',
              },
            ].map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="card-glass border-gold/20 hover:border-gold/40 transition-all duration-300 group/g flex gap-5 items-center !p-5 hover:-translate-y-1"
              >
                {/* Real cover */}
                <div className={`relative w-28 sm:w-32 flex-shrink-0 transition-transform duration-300 group-hover/g:scale-[1.02] ${guide.shadow}`}>
                  <Image
                    src={guide.cover}
                    alt={guide.alt}
                    width={400}
                    height={534}
                    priority={false}
                    className="w-full h-auto rounded-sm"
                  />
                </div>
                {/* Body */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-gold/80 mb-2">
                    {guide.caption}
                  </p>
                  <p className="font-jetbrains text-[0.7rem] tracking-[0.15em] uppercase text-emerald group-hover/g:text-emerald-light transition-colors">
                    Read free &rarr;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TELEHEALTH / SHIPPING / QUALITY TRUST GRID ---------- */}
      <TrustGrid />

      {/* ---------- QUALITY STANDARDS ---------- */}
      <section className="section-py bg-emerald/[0.06] border-y border-emerald/20">
        <div className="container-gr">
          <header className="text-center mb-12">
            <p className="eyebrow text-emerald">Quality Standards</p>
            <h2>Third-party tested. Pharmacy-grade.</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                label: 'Sterility',
                title: 'USP 797 compounded',
                detail: 'Every batch is produced in an ISO Class 5 cleanroom under USP 797 sterile compounding standards by our licensed US pharmacy partner.',
              },
              {
                label: 'Purity Testing',
                title: 'HPLC verified ≥98%',
                detail: 'Third-party High-Performance Liquid Chromatography confirms purity on every lot before any vial leaves the lab.',
              },
              {
                label: 'Identity Confirmation',
                title: 'Mass spectrometry',
                detail: 'Independent mass spectrometry verifies molecular weight and structure, with lot-specific data available on request.',
              },
            ].map((card) => (
              <div key={card.title} className="card-glass border-emerald/15 flex flex-col">
                <p className="font-jetbrains text-emerald text-[0.6rem] tracking-[0.25em] uppercase mb-3">{card.label}</p>
                <p className="font-cormorant text-cream text-2xl leading-tight mb-3">{card.title}</p>
                <p className="text-sm text-cream-dim leading-relaxed flex-1">{card.detail}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-3 mt-8">
            <div className="hidden md:block" aria-hidden />
            <p className="text-center text-xs text-cream-dim/70 font-jetbrains tracking-wide uppercase">
              Dispensed by Greenstone Rx · A licensed Florida 503A compounding pharmacy
            </p>
            <div className="hidden md:block" aria-hidden />
          </div>
        </div>
      </section>

      {/* ---------- QUALITY PROMISE ---------- */}
      <section className="section-py bg-emerald/[0.09] border-y border-emerald/25 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(26,158,110,0.08), transparent 80%)' }}
          aria-hidden
        />
        <div className="container-gr relative z-10">
          <header className="text-center mb-16">
            <p className="eyebrow text-emerald">Quality Commitment</p>
            <h2>Built on precision</h2>
          </header>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: 'USP 797', body: 'Sterile compounding in an ISO Class 5 cleanroom — the standard for hospital pharmacies.' },
              { icon: FlaskConical, title: 'Lot-Tested', body: 'Every batch verified for potency (HPLC ≥98%) and identity (mass spectrometry).' },
              { icon: Thermometer, title: 'Specialized Packaging', body: 'Temperature-controlled, medical-grade packaging maintains integrity from the cleanroom to your door.' },
              { icon: Clock, title: 'Physician Reviewed', body: 'A licensed prescribing physician reviews every order before it ships.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center">
                <Icon size={32} className="text-emerald mx-auto mb-4" aria-hidden />
                <h4 className="font-cormorant text-xl text-white mb-2">{title}</h4>
                <p className="text-sm text-cream-dim mx-auto">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY SOURCE MATTERS ---------- */}
      <section className="section-py bg-emerald/[0.07] border-y border-emerald/30 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-molecular bg-[length:60px_60px] opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          aria-hidden
        />
        <div className="container-gr relative z-10">
          <header className="text-center mb-16 max-w-3xl mx-auto">
            <p className="eyebrow text-emerald">Source Integrity</p>
            <h2 className="font-cormorant">Why source matters</h2>
            <p className="mt-6 text-cream-dim leading-relaxed">
              The peptide market has a quality problem. Most of what is sold online is not what
              the label says it is. The chemistry is unregulated, the supply chain is opaque, and
              the consequences land on the person doing the injecting.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {[
              {
                stat: '70-90%',
                label: 'Of peptides sold online originate from bulk Chinese synthesis facilities with zero independent oversight.',
              },
              {
                stat: '1% - 100%',
                label: 'Purity range found in independent lab testing of research-grade peptides. The vial may contain almost none of the listed compound.',
              },
              {
                stat: 'March 2026',
                label: 'FDA issued formal warning letters to research-peptide companies, ending the gray-market "research use only" workaround. Our model — a licensed 503A compounding pharmacy with a prescribing physician — has always been the regulated path.',
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="card-glass border-emerald/20 hover:border-emerald/40 transition-colors"
              >
                <p className="font-cormorant text-5xl text-emerald mb-3">{item.stat}</p>
                <p className="text-sm text-cream-dim leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-start">
            <div>
              <p className="mono text-emerald mb-3">// the problem</p>
              <h3 className="font-cormorant text-3xl text-white mb-6">
                The overseas supply chain is a black box
              </h3>
              <ul className="space-y-4 text-cream-dim text-sm leading-relaxed">
                <li className="pl-4 border-l border-emerald/30">
                  <strong className="text-cream block mb-1">Heavy metal contamination</strong>
                  Lead, cadmium, and mercury have been documented in overseas peptide imports.
                  These are injected directly into the bloodstream.
                </li>
                <li className="pl-4 border-l border-emerald/30">
                  <strong className="text-cream block mb-1">Counterfeit compounds</strong>
                  Illicit semaglutide seized by European regulators tested as an entirely
                  different substance. The vial said one thing, the contents said another.
                </li>
                <li className="pl-4 border-l border-emerald/30">
                  <strong className="text-cream block mb-1">Fabricated certificates</strong>
                  A Certificate of Analysis from an unaccredited source is a PDF, not a
                  guarantee. Many online sellers recycle the same fake document across batches.
                </li>
                <li className="pl-4 border-l border-emerald/30">
                  <strong className="text-cream block mb-1">Regulatory collapse</strong>
                  The FDA&rsquo;s March 2026 enforcement action gave non-compliant research
                  peptide sellers 15 days to cease shipments. Buyers lose their supplier
                  overnight, with no recourse.
                </li>
              </ul>
            </div>
            <div>
              <p className="mono text-gold mb-3">// the greenstone standard</p>
              <h3 className="font-cormorant text-3xl text-white mb-6">
                Every compound traceable to a licensed pharmacy
              </h3>
              <ul className="space-y-4 text-cream-dim text-sm leading-relaxed">
                <li className="pl-4 border-l border-gold/30">
                  <strong className="text-cream block mb-1">USA compounding pharmacies only</strong>
                  Every formulation is produced inside a state-licensed compounding pharmacy,
                  not a chemical supplier. Quality, not shortcuts.
                </li>
                <li className="pl-4 border-l border-gold/30">
                  <strong className="text-cream block mb-1">USP 797 sterile compounding</strong>
                  ISO Class 5 clean room environment. 14-day sterility testing. Bacterial
                  endotoxin testing on every sterile lot.
                </li>
                <li className="pl-4 border-l border-gold/30">
                  <strong className="text-cream block mb-1">Batch-specific Certificate of Analysis</strong>
                  Real CoA from accredited labs, tied to the lot number on your vial. Potency,
                  purity, and contaminant testing, verifiable, not theatrical.
                </li>
                <li className="pl-4 border-l border-gold/30">
                  <strong className="text-cream block mb-1">Third-party verified potency</strong>
                  Every batch independently tested by accredited labs. The chain of
                  custody is documented from raw material to finished vial.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/about" className="btn btn-ghost">
              Read the full quality protocol →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="section-py bg-emerald/[0.05] border-y border-emerald/15">
        <div className="container-gr">
          <header className="text-center mb-16">
            <p className="eyebrow text-emerald">Process</p>
            <h2>How it works</h2>
          </header>
          <ol className="grid gap-8 md:grid-cols-4">
            {[
              { n: '01', t: 'Browse the Formulary', b: 'Read about each medication, then click Start a Consult to begin.' },
              { n: '02', t: 'Verify & Screen', b: 'Confirm your phone number, then complete a short health screening built by the pharmacy.' },
              { n: '03', t: 'Physician Reviews', b: 'A licensed prescriber reviews your screening and writes the prescription if appropriate.' },
              { n: '04', t: 'Pharmacy Ships', b: 'Greenstone Rx compounds your prescription to order and ships it directly to you.' },
            ].map((s) => (
              <li key={s.n} className="card-glass border-emerald/20 hover:border-emerald/40">
                <span className="mono !text-emerald">{s.n}</span>
                <h4 className="font-cormorant text-2xl text-white mt-3 mb-2">{s.t}</h4>
                <p className="text-sm text-cream-dim">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- RECENT BLOG ---------- */}
      {recentPosts.length > 0 && (
        <section className="section-py bg-emerald/[0.06] border-y border-emerald/20">
          <div className="container-gr">
            <header className="text-center mb-16">
              <p className="eyebrow">Learn</p>
              <h2>Latest from the clinic</h2>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- EMAIL CAPTURE (FREE GUIDE) ---------- */}
      <section className="section-py border-t border-emerald/15 bg-obsidian-mid/40">
        <div className="container-gr max-w-2xl text-center">
          <div className="inline-block bg-emerald/10 border border-emerald/30 px-4 py-1.5 mb-6">
            <span className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald">
              Free Guide
            </span>
          </div>
          <h2 className="font-cormorant">Peptides, made easy.</h2>
          <p className="text-cream-dim mt-4 mx-auto">
            Our plain-language peptide primer, free. One short email a month
            after that, never spam.
          </p>
          <EmailCapture />
        </div>
      </section>
    </>
  );
}
