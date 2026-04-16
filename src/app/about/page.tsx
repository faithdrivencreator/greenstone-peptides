import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Greenstone Peptides | USA-Compounded Quality',
  description: 'Why Greenstone Peptides: 25+ years of pharmaceutical care, USP 797 sterile compounding, third-party tested, 100% USA-compounded. Learn what makes our peptides different.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-py">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">Our Story</p>
          <h1>Not All Peptides Are Created Equal</h1>
          <p className="mt-8 text-lg text-cream-dim">
            Over 70% of peptides sold online are synthesized overseas — in facilities with no
            meaningful oversight, no independent testing, and no accountability. The prices look
            appealing. The purity rarely matches what's on the label.
          </p>
          <p className="mt-6 text-lg text-cream-dim">
            Greenstone Peptides was built on a different premise: that people who use these
            compounds deserve pharmaceutical-grade quality, domestic compounding, and the
            accountability that comes with real USA-licensed pharmacy infrastructure. We've
            spent 25 years building exactly that.
          </p>
        </div>
      </section>

      {/* USA Compounding — the differentiator */}
      <section className="section-py bg-obsidian-mid/40 border-y border-emerald/20">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow text-emerald">The Difference</p>
          <h2>Compounded in the United States. <br className="hidden md:block" />That matters more than you think.</h2>
          <p className="mt-6 text-lg text-cream-dim">
            The vast majority of peptides sold online — regardless of what the label says —
            originate from bulk synthesis facilities overseas. The raw material arrives, gets
            repackaged, and ships to your door with a domestic address on the label. The
            peptide itself was never made here.
          </p>
          <p className="mt-6 text-lg text-cream-dim">
            Every compound we carry is formulated by licensed USA-based compounding pharmacies
            operating under <strong className="text-cream">USP 797</strong> sterile standards —
            the same federal guidelines that govern hospital pharmacies. That means independent
            potency testing, sterility verification, and full chain-of-custody documentation
            before anything ships.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                stat: '100%',
                label: 'USA Compounded',
                detail: 'Every formulation compounded domestically by licensed pharmacy partners. No overseas bulk imports.',
              },
              {
                stat: 'USP 797',
                label: 'Sterile Standard',
                detail: 'The same sterility standard required of hospital IV preparations.',
              },
              {
                stat: '25 yrs',
                label: 'Pharmaceutical Experience',
                detail: 'Two decades of pharmaceutical compounding operations behind every vial.',
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
                b: 'Pharmaceutical-grade compounding means consistent potency from vial to vial. Inconsistent raw material leads to inconsistent outcomes — and no way to know which is which.',
              },
              {
                t: 'Batch Accountability',
                b: 'Our pharmacy partners maintain full chain-of-custody documentation and Certificates of Analysis for every formulation — available on request. No overseas vendor offers that.',
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
                t: 'USA Compounding',
                b: 'Every formulation compounded domestically by licensed pharmacy partners. No overseas bulk imports. Ever.',
              },
              {
                t: 'USP 797 Compliance',
                b: 'Sterile compounding standards verified at every partner facility — the same bar required of hospital pharmacies.',
              },
              {
                t: 'Third-Party Testing',
                b: 'Every batch independently tested for purity and concentration before it ships. Results available on request.',
              },
              {
                t: 'Batch Traceability',
                b: 'Certificates of Analysis for every formulation. Full chain-of-custody documentation from compounding to delivery.',
              },
              {
                t: 'Temperature-Controlled Shipping',
                b: 'Cold-chain packaging and real-time tracking from the compounding facility to your door.',
              },
              {
                t: '25+ Years Experience',
                b: 'Over two decades of pharmaceutical compounding operations. The infrastructure behind every vial we carry.',
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
            We're here to help you find the right protocol.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link href="/shop" className="btn btn-primary">
              Shop All Products
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
