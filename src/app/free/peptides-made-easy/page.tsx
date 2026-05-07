import type { Metadata } from 'next';
import Link from 'next/link';
import { EbookCaptureForm } from '@/components/EbookCaptureForm';
import { SchemaOrg } from '@/components/SchemaOrg';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';

export const metadata: Metadata = {
  title: 'Free Peptide Guide — Peptides Made Easy | Greenstone',
  description:
    "Free 14-page beginner's guide. Learn what peptides are and how to start safely. Sent to your inbox in 60 seconds.",
  alternates: { canonical: '/free/peptides-made-easy' },
  openGraph: {
    title: 'Peptides Made Easy — Free Guide',
    description:
      "Your first 72 hours: a safe, simple, research-backed start. Sent to your inbox in 60 seconds.",
    url: `${SITE_URL}/free/peptides-made-easy`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peptides Made Easy — Free Guide',
    description: 'Your first 72 hours: a safe, simple, research-backed start.',
  },
};

const insideCards = [
  {
    title: 'What peptides actually are',
    body: 'A plain-language primer on the chemistry — without the jargon. By the time you finish chapter one you can explain a peptide to a friend.',
  },
  {
    title: 'How to start safely',
    body: 'A short framework for evaluating sourcing, sterility, and storage before you ever open a vial. Built around the questions our pharmacy actually answers.',
  },
  {
    title: 'Your first 72 hours',
    body: 'A clear, hour-by-hour walkthrough of what to look for, what to log, and what to do if something feels off in your first three days.',
  },
];

const faqs = [
  {
    q: 'Is this really free?',
    a: 'Yes — completely free, no credit card, no trial. The PDF lands in your inbox seconds after you submit your email. We wrote it because most peptide content online is either fearmongering or sales copy. We wanted something honest in between.',
  },
  {
    q: 'Will you spam me?',
    a: 'No. After we send the guide, you might hear from us once a month with new educational content or a sourcing update. Unsubscribe anytime — one click, no friction. Your email stays inside Resend; we do not sell or rent lists.',
  },
  {
    q: 'Are these products for human use?',
    a: 'Greenstone formulations are dispensed by a USA-licensed compounding pharmacy. The guide itself is for research and educational purposes — it does not replace consultation with a licensed medical provider, and nothing in it should be read as a medical recommendation.',
  },
];

export default function PeptidesMadeEasyPage() {
  return (
    <>
      <SchemaOrg
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: 'Peptides Made Easy',
          bookFormat: 'EBook',
          inLanguage: 'en',
          description:
            "A 14-page beginner's guide to peptides — what they are, how to start safely, and what to look for in your first 72 hours.",
          publisher: {
            '@type': 'Organization',
            name: 'Greenstone Peptides',
            url: SITE_URL,
          },
          isAccessibleForFree: true,
          url: `${SITE_URL}/free/peptides-made-easy`,
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden section-py min-h-[80vh] flex items-center">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(26,158,110,0.18) 0%, transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-molecular bg-[length:60px_60px] opacity-[0.05] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          aria-hidden
        />
        <div className="container-gr relative z-10 grid gap-12 lg:grid-cols-[1.05fr_1fr] items-center">
          {/* LEFT — book cover mockup */}
          <div>
            <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-4">
              Free Guide · Lead Magnet 01
            </p>
            <h1 className="font-cormorant text-display-md md:text-display-lg leading-[1.05] text-cream">
              Peptides
              <br />
              <em className="italic text-gold">Made Easy.</em>
            </h1>
            <p className="mt-5 text-base md:text-lg text-cream-dim max-w-xl leading-relaxed">
              Your first 72 hours: a safe, simple, research-backed start.
            </p>

            {/* Book cover mockup */}
            <div className="mt-10 max-w-sm">
              <div
                className="relative aspect-[3/4] bg-obsidian-mid border border-gold/30 shadow-2xl overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #161C26 0%, #0D1117 60%, #161C26 100%)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gold" />
                <div className="absolute inset-0 flex flex-col justify-between p-7">
                  <div>
                    <p className="font-jetbrains text-[0.55rem] tracking-[0.25em] uppercase text-gold/80">
                      Greenstone Peptides
                    </p>
                    <div className="w-10 h-px bg-gold/60 mt-3" />
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <svg
                      viewBox="0 0 120 120"
                      className="w-32 h-32 opacity-70"
                      aria-hidden
                    >
                      <g fill="none" stroke="#C9A96E" strokeWidth="1.2">
                        <circle cx="30" cy="40" r="6" />
                        <circle cx="60" cy="25" r="6" />
                        <circle cx="90" cy="40" r="6" />
                        <circle cx="60" cy="65" r="6" />
                        <circle cx="30" cy="90" r="6" />
                        <circle cx="90" cy="90" r="6" />
                        <line x1="30" y1="40" x2="60" y2="25" />
                        <line x1="60" y1="25" x2="90" y2="40" />
                        <line x1="30" y1="40" x2="60" y2="65" />
                        <line x1="90" y1="40" x2="60" y2="65" />
                        <line x1="60" y1="65" x2="30" y2="90" />
                        <line x1="60" y1="65" x2="90" y2="90" />
                      </g>
                    </svg>
                  </div>

                  <div>
                    <h2 className="font-cormorant text-3xl text-cream leading-tight">
                      Peptides
                      <br />
                      <em className="italic text-gold">Made Easy</em>
                    </h2>
                    <p className="mt-2 font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-cream-dim/70">
                      Volume I · The first 72 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — capture form */}
          <div className="card-glass border-emerald/30 !p-8 md:!p-10">
            <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald mb-3">
              Send to my inbox
            </p>
            <h2 className="font-cormorant text-3xl text-cream leading-tight">
              Get your free guide.
            </h2>
            <p className="mt-3 text-sm text-cream-dim leading-relaxed">
              14 pages, plain language, no fluff. Lands in your inbox in under 60 seconds.
            </p>

            <div className="mt-6">
              <EbookCaptureForm
                ebook="made-easy"
                source="hero"
                redirectUrl="/free/peptides-made-easy/thank-you"
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
            <h2 className="font-cormorant">Three short chapters. Zero filler.</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {insideCards.map((card, idx) => (
              <article
                key={card.title}
                className="card-glass border-gold/15 hover:border-gold/35 transition-colors"
              >
                <div className="w-10 h-px bg-gold mb-5" />
                <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-gold/80 mb-3">
                  Chapter {String(idx + 1).padStart(2, '0')}
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
            Greenstone formulations are compounded inside a USA-licensed pharmacy under USP 797
            sterile standards. Every batch is independently tested for potency and purity before
            it ships. The guide is built on the same standards we apply to the vial.
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

      {/* FAQ */}
      <section className="section-py bg-emerald/[0.05] border-y border-emerald/15">
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
      <section className="section-py">
        <div className="container-gr max-w-2xl">
          <div className="card-glass border-emerald/30 text-center !py-12">
            <p className="eyebrow text-emerald">Get the guide</p>
            <h2 className="font-cormorant">Send Peptides Made Easy to my inbox.</h2>
            <p className="text-cream-dim mt-3 text-sm">
              Free. 14 pages. Yours to keep.
            </p>
            <div className="mt-8 max-w-md mx-auto text-left">
              <EbookCaptureForm
                ebook="made-easy"
                source="final-cta"
                redirectUrl="/free/peptides-made-easy/thank-you"
              />
            </div>
            <p className="mt-5 text-[0.7rem] text-cream-dim/60 font-dm-sans">
              No spam. Unsubscribe anytime. Your email is private — we use Resend, never Klaviyo.
            </p>
          </div>
        </div>
      </section>

      {/* CROSS-LINK */}
      <section className="section-py border-t border-emerald/10 bg-obsidian-mid/40">
        <div className="container-gr text-center">
          <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim/60 mb-3">
            Already past the basics?
          </p>
          <Link
            href="/free/peptides-unlocked"
            className="font-cormorant text-2xl text-cream hover:text-gold transition-colors"
          >
            Read Volume II — Peptides Unlocked &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
