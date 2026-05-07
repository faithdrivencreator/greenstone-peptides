import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { EbookCaptureForm } from '@/components/EbookCaptureForm';
import { SchemaOrg } from '@/components/SchemaOrg';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';

export const metadata: Metadata = {
  title: 'Free Peptide Guide — Peptides Unlocked (Volume II) | Greenstone',
  description:
    'Free advanced guide. Match peptides to your goals, run a real quality and sourcing checklist, and use a 48-hour research framework. Sent to your inbox in 60 seconds.',
  alternates: { canonical: '/free/peptides-unlocked' },
  openGraph: {
    title: 'Peptides Unlocked — Free Guide (Volume II)',
    description:
      'Your 48-hour blueprint for safe, research-backed results. Sent to your inbox in 60 seconds.',
    url: `${SITE_URL}/free/peptides-unlocked`,
    type: 'website',
    images: [
      {
        url: '/images/ebook-covers/peptides-unlocked-cover.jpg',
        width: 1200,
        height: 1608,
        alt: 'Peptides Unlocked — Volume II free guide cover',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peptides Unlocked — Free Guide (Volume II)',
    description: 'Your 48-hour blueprint for safe, research-backed results.',
    images: ['/images/ebook-covers/peptides-unlocked-cover.jpg'],
  },
};

const insideCards = [
  {
    title: 'Match peptides to your goals',
    body: 'A simple decision framework: what classes of peptides are studied for which research outcomes, and how to think about combinations without overcomplicating it.',
  },
  {
    title: 'Quality & sourcing checklist',
    body: "The exact 12-question checklist we run on every supplier. If a vendor can't answer all of them, it's not the right vendor.",
  },
  {
    title: '48-hour research framework',
    body: 'A structured approach to evaluating, logging, and observing in your first 48 hours of any new protocol — designed to surface signal early, before noise accumulates.',
  },
];

const faqs = [
  {
    q: 'Is this really free?',
    a: 'Yes. Volume II is free, no card required. The PDF is sent to your inbox seconds after submission. We publish it because there is a real gap between beginner content and clinical literature.',
  },
  {
    q: 'Will you spam me?',
    a: 'No. After the guide arrives, expect us to land in your inbox at most once a month — research updates, sourcing notes, and the occasional protocol primer. One-click unsubscribe at the bottom of every email.',
  },
  {
    q: 'Are these products for human use?',
    a: 'Greenstone formulations are dispensed by a USA-licensed compounding pharmacy. The guide itself is for research and educational purposes — it does not replace medical advice from a licensed provider, and nothing in it should be read as a clinical recommendation.',
  },
];

export default function PeptidesUnlockedPage() {
  return (
    <>
      <SchemaOrg
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: 'Peptides Unlocked',
          bookFormat: 'EBook',
          inLanguage: 'en',
          description:
            'A research-grade guide to matching peptides to goals, running a sourcing checklist, and structuring the first 48 hours of a new protocol.',
          publisher: {
            '@type': 'Organization',
            name: 'Greenstone Peptides',
            url: SITE_URL,
          },
          isAccessibleForFree: true,
          url: `${SITE_URL}/free/peptides-unlocked`,
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden section-py min-h-[80vh] flex items-center">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-molecular bg-[length:60px_60px] opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          aria-hidden
        />
        <div className="container-gr relative z-10 grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center">
          {/* LEFT — real cover */}
          <div>
            <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-4">
              Free Guide · Lead Magnet 02 · Volume II
            </p>
            <h1 className="font-cormorant text-display-md md:text-display-lg leading-[1.05] text-cream">
              Peptides
              <br />
              <em className="italic text-gold">Unlocked.</em>
            </h1>
            <p className="mt-5 text-base md:text-lg text-cream-dim max-w-xl leading-relaxed">
              Your 48-hour blueprint for safe, research-backed results.
            </p>

            <div className="mt-10 w-full max-w-md shadow-[0_20px_60px_-15px_rgba(26,158,110,0.25)]">
              <Image
                src="/images/ebook-covers/peptides-unlocked-cover.webp"
                alt="Peptides Unlocked — Volume II free guide cover"
                width={600}
                height={800}
                priority
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* RIGHT — form */}
          <div className="card-glass border-emerald/30 !p-8 md:!p-10">
            <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald mb-3">
              Send to my inbox
            </p>
            <h2 className="font-cormorant text-3xl text-cream leading-tight">
              Get Volume II free.
            </h2>
            <p className="mt-3 text-sm text-cream-dim leading-relaxed">
              The advanced guide, sent to your inbox in under 60 seconds.
            </p>

            <div className="mt-6">
              <EbookCaptureForm
                ebook="unlocked"
                source="hero"
                redirectUrl="/free/peptides-unlocked/thank-you"
              />
            </div>

            <p className="mt-5 text-[0.7rem] text-cream-dim/60 leading-relaxed font-dm-sans">
              No spam. Unsubscribe anytime. Your email is private — we use Resend, never Klaviyo.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE */}
      <section className="section-py bg-obsidian-mid/50 border-y border-emerald/15">
        <div className="container-gr">
          <header className="text-center mb-12 max-w-2xl mx-auto">
            <p className="eyebrow text-emerald">What&rsquo;s inside</p>
            <h2 className="font-cormorant">Three frameworks. Used in our pharmacy daily.</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {insideCards.map((card, idx) => (
              <article
                key={card.title}
                className="card-glass border-gold/15 hover:border-gold/35 transition-colors"
              >
                <div className="w-10 h-px bg-gold mb-5" />
                <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-gold/80 mb-3">
                  Framework {String(idx + 1).padStart(2, '0')}
                </p>
                <h3 className="font-cormorant text-2xl text-cream mb-3 leading-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-cream-dim leading-relaxed">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section-py">
        <div className="container-gr max-w-3xl text-center">
          <p className="eyebrow text-emerald">Why trust this guide</p>
          <h2 className="font-cormorant">Third-party verified. US-shipped. Research-grade purity.</h2>
          <p className="mt-5 text-cream-dim leading-relaxed">
            Volume II is built from the same pharmacy SOPs we use to evaluate raw material,
            sterility, and lot release. Greenstone formulations are compounded inside a
            USA-licensed pharmacy under USP 797 sterile standards and independently tested
            for potency and purity before shipment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {['USA-Compounded', 'USP 797 Sterile Standard', 'Third-Party Tested', 'Cold-Chain Shipping'].map((label) => (
              <span
                key={label}
                className="flex items-center gap-2 font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CROSS-LINK BACK TO V1 */}
      <section className="section-py bg-emerald/[0.05] border-y border-emerald/15">
        <div className="container-gr text-center max-w-2xl">
          <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim/60 mb-3">
            Haven&rsquo;t read Volume I?
          </p>
          <Link
            href="/free/peptides-made-easy"
            className="font-cormorant text-3xl text-cream hover:text-gold transition-colors"
          >
            Start with Peptides Made Easy &rarr;
          </Link>
          <p className="mt-3 text-sm text-cream-dim">
            Volume I is the plain-language primer. Volume II builds on it.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-py">
        <div className="container-gr max-w-3xl">
          <header className="text-center mb-12">
            <p className="eyebrow">Common questions</p>
            <h2 className="font-cormorant">Before you give us your email</h2>
          </header>
          <div className="space-y-6">
            {faqs.map((item) => (
              <div key={item.q} className="card-glass border-emerald/15 !py-7">
                <h3 className="font-cormorant text-xl text-cream mb-2">{item.q}</h3>
                <p className="text-sm text-cream-dim leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-py bg-obsidian-mid/50 border-t border-emerald/15">
        <div className="container-gr max-w-2xl">
          <div className="card-glass border-emerald/30 text-center !py-12">
            <p className="eyebrow text-emerald">Get the guide</p>
            <h2 className="font-cormorant">Send Peptides Unlocked to my inbox.</h2>
            <p className="text-cream-dim mt-3 text-sm">
              Free. Volume II. Yours to keep.
            </p>
            <div className="mt-8 max-w-md mx-auto text-left">
              <EbookCaptureForm
                ebook="unlocked"
                source="final-cta"
                redirectUrl="/free/peptides-unlocked/thank-you"
              />
            </div>
            <p className="mt-5 text-[0.7rem] text-cream-dim/60 font-dm-sans">
              No spam. Unsubscribe anytime. Your email is private — we use Resend, never Klaviyo.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
