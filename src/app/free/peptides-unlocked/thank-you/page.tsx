import type { Metadata } from 'next';
import Link from 'next/link';
import { LeadCaptureTracker } from '../../_components/LeadCaptureTracker';

export const metadata: Metadata = {
  title: 'Your guide is on its way — Peptides Unlocked | Greenstone',
  description: 'Your free Greenstone Volume II guide is being delivered to your inbox.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/free/peptides-unlocked/thank-you' },
};

const PDF_URL = '/downloads/greenstone-peptides-unlocked.pdf';

const nextSteps = [
  {
    eyebrow: 'Browse',
    title: 'See the catalog',
    body: 'Explore the full Greenstone library — 48 third-party tested formulations, USA-compounded under USP 797 standards.',
    href: '/shop',
    cta: 'Shop all products',
  },
  {
    eyebrow: 'Volume I',
    title: 'Peptides Made Easy',
    body: 'Haven’t read the primer? Volume I covers the basics in plain language — what peptides are, how to start, and your first 72 hours.',
    href: '/free/peptides-made-easy',
    cta: 'Read Volume I',
  },
  {
    eyebrow: 'Reference',
    title: 'Safety first',
    body: 'Storage, sterility, and the questions worth asking before any protocol. Built from our pharmacy SOPs.',
    href: '/safety',
    cta: 'Open the safety page',
  },
];

export default function PeptidesUnlockedThankYouPage() {
  return (
    <>
      <LeadCaptureTracker ebook="unlocked" />

      {/* HERO */}
      <section className="relative overflow-hidden section-py min-h-[60vh] flex items-center">
        <div
          className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(26,158,110,0.20) 0%, transparent 70%)' }}
          aria-hidden
        />
        <div className="container-gr relative z-10 max-w-3xl text-center">
          <div
            className="w-16 h-16 border border-emerald/40 flex items-center justify-center mx-auto mb-8"
            style={{ background: 'rgba(26,158,110,0.12)' }}
          >
            <span className="text-emerald text-3xl font-cormorant font-semibold">&#10003;</span>
          </div>
          <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald mb-4">
            Confirmed · Volume II
          </p>
          <h1 className="font-cormorant text-display-md md:text-display-lg leading-[1.05] text-cream">
            Your guide is
            <br />
            <em className="italic text-gold">on its way.</em>
          </h1>
          <p className="mt-6 text-base md:text-lg text-cream-dim max-w-xl mx-auto leading-relaxed">
            Check your inbox in the next 60 seconds. Didn&rsquo;t see it? Check spam — sometimes
            <span className="text-cream"> hello@greenstonewellness.store </span>
            lands there on first contact.
          </p>

          <div className="mt-10">
            <a
              href={PDF_URL}
              className="btn btn-primary inline-flex !text-base !px-10 !py-4"
              target="_blank"
              rel="noopener"
            >
              Download Now &rarr;
            </a>
            <p className="mt-4 font-jetbrains text-[0.65rem] tracking-wide uppercase text-cream-dim/60">
              Your copy, in case you close the email
            </p>
          </div>
        </div>
      </section>

      {/* WHILE YOU'RE HERE */}
      <section className="section-py bg-obsidian-mid/50 border-y border-emerald/15">
        <div className="container-gr">
          <header className="text-center mb-12">
            <p className="eyebrow">While you&rsquo;re here</p>
            <h2 className="font-cormorant">Three good next steps</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {nextSteps.map((step) => (
              <article
                key={step.title}
                className="card-glass border-emerald/15 hover:border-emerald/35 flex flex-col"
              >
                <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald/80 mb-3">
                  {step.eyebrow}
                </p>
                <h3 className="font-cormorant text-2xl text-cream mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-cream-dim leading-relaxed flex-1">{step.body}</p>
                <Link
                  href={step.href}
                  className="mt-5 inline-flex items-center gap-2 font-jetbrains text-[0.7rem] tracking-[0.15em] uppercase text-gold hover:text-gold-light transition-colors"
                >
                  {step.cta} &rarr;
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
