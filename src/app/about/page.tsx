import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Greenstone Peptides — USA-synthesized, physician-facilitated peptide therapy. 25 years of pharmaceutical experience. Not all peptides are equal.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-py">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">Our Story</p>
          <h1>Not all peptides are created equal.</h1>
          <p className="mt-8 text-lg text-cream-dim">
            Walk through any corner of the internet and you'll find peptides sold cheap —
            vials shipped from overseas, synthesized in facilities with no oversight, no
            testing, and no accountability. The prices look appealing. The results rarely match.
          </p>
          <p className="mt-6 text-lg text-cream-dim">
            Greenstone Peptides was built on a different premise: that the people who use these
            compounds deserve pharmaceutical-grade quality, domestic synthesis, and the oversight
            of real clinical infrastructure. We've spent 25 years building exactly that.
          </p>
        </div>
      </section>

      {/* USA Synthesis — the differentiator */}
      <section className="section-py bg-obsidian-mid/40 border-y border-emerald/20">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow text-emerald">The Difference</p>
          <h2>Synthesized in the United States. <br className="hidden md:block" />That matters more than you think.</h2>
          <p className="mt-6 text-lg text-cream-dim">
            The vast majority of peptides sold online — regardless of what the label says —
            originate from bulk synthesis facilities in China. The raw material arrives, gets
            repackaged, and ships to your door with a domestic address on the label. The
            peptide itself was never made here.
          </p>
          <p className="mt-6 text-lg text-cream-dim">
            Every compound we facilitate is synthesized and formulated by licensed USA-based
            compounding pharmacies operating under <strong className="text-cream">USP 795 &amp; 797</strong> standards —
            the same federal guidelines that govern hospital pharmacies. That means independent
            potency testing, sterility verification, and full chain-of-custody documentation
            before anything ships.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                stat: '100%',
                label: 'USA Synthesized',
                detail: 'Every formulation compounded domestically. No overseas bulk imports.',
              },
              {
                stat: 'USP 797',
                label: 'Sterile Standard',
                detail: 'The same sterility standard required of hospital IV preparations.',
              },
              {
                stat: '25 yrs',
                label: 'Pharmaceutical Experience',
                detail: 'Two decades of clinical compounding operations behind every vial.',
              },
            ].map((item) => (
              <div key={item.stat} className="card-glass border-emerald/20 text-center p-8">
                <div className="font-cormorant text-4xl text-emerald font-semibold">{item.stat}</div>
                <div className="font-jetbrains text-xs tracking-widest uppercase text-gold mt-2">{item.label}</div>
                <p className="text-sm text-cream-dim mt-3">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="section-py">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">Why It Matters</p>
          <h2>Cheap peptides cost more than you think.</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {[
              {
                t: 'Purity & Potency',
                b: 'Independent testing of overseas peptide products frequently finds underdosing, contamination, or mislabeled compounds. You may be injecting something entirely different from what the label claims.',
              },
              {
                t: 'Sterility',
                b: 'Injectable compounds require sterile preparation. Without USP 797 compliance, contamination risks are real. Infections from non-sterile injectables are documented and serious.',
              },
              {
                t: 'Consistent Results',
                b: 'Pharmaceutical-grade synthesis means consistent potency from vial to vial. Inconsistent raw material leads to inconsistent outcomes — and no way to know which is which.',
              },
              {
                t: 'Clinical Oversight',
                b: 'Our network includes licensed pharmacists available 24/7 for clinical questions, drug interaction screening, and dosing guidance — something no overseas vendor offers.',
              },
            ].map((c) => (
              <div key={c.t} className="card-glass">
                <h4 className="font-cormorant text-xl text-white">{c.t}</h4>
                <p className="text-sm text-cream-dim mt-2">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality commitments */}
      <section className="section-py bg-obsidian-mid/40 border-y border-gold/10">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">Our Standards</p>
          <h2>What pharmaceutical-grade actually means.</h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                t: 'Independent Potency Testing',
                b: 'Every batch tested for purity and concentration before it ships. Results available on request.',
              },
              {
                t: 'Licensed USA Pharmacies Only',
                b: 'We work exclusively with state-licensed compounding pharmacies. No gray-market suppliers. Ever.',
              },
              {
                t: 'Cold-Chain Logistics',
                b: 'Temperature-controlled packaging and real-time tracking from compounding to your door.',
              },
              {
                t: '24/7 Pharmacist Access',
                b: 'A licensed pharmacist is reachable around the clock for clinical questions and safety concerns.',
              },
              {
                t: 'USP 795 & 797 Compliance',
                b: 'Both non-sterile and sterile compounding standards verified at every partner facility.',
              },
              {
                t: 'Physician Facilitation',
                b: 'Every prescription is written by a licensed provider through a proper clinical consultation.',
              },
            ].map((c) => (
              <li key={c.t} className="card-glass">
                <h4 className="font-cormorant text-xl text-white">{c.t}</h4>
                <p className="text-sm text-cream-dim mt-2">{c.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py">
        <div className="container-gr text-center max-w-2xl">
          <p className="eyebrow">Get Started</p>
          <h2>Ready to do this right?</h2>
          <p className="mt-4 mx-auto text-cream-dim">
            Browse the catalog, learn about the science, or reach out to our team.
            We're here to help you find the right protocol — with real clinical support behind it.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link href="/shop" className="btn btn-primary">
              Browse Products
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
