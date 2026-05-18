import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Research Use Only Notice | Greenstone Wellness',
  description:
    'All Greenstone Wellness products are sold strictly for research and educational use only. Full disclaimer, regulatory notice, and buyer acknowledgment terms.',
  alternates: { canonical: 'https://greenstonewellness.store/research-use-only' },
  robots: { index: true, follow: true },
};

export default function ResearchUseOnlyPage() {
  return (
    <main className="bg-obsidian min-h-screen">
      <section className="section-py">
        <div className="container-gr max-w-3xl">
          <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-4">
            // Compliance Notice
          </p>
          <h1 className="font-cormorant text-cream text-4xl sm:text-5xl leading-tight mb-6" style={{ fontWeight: 400 }}>
            Research Use Only
          </h1>
          <p className="text-cream-dim text-base sm:text-lg leading-relaxed mb-10">
            All products sold by Greenstone Wellness are research compounds intended
            for laboratory and educational use only. The information on this site is
            provided for scientific and informational purposes and does not constitute
            medical advice.
          </p>

          <div className="space-y-10 text-cream-dim text-[0.95rem] leading-relaxed">
            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Not for human or animal consumption
              </h2>
              <p>
                The compounds offered through this site are not intended for human or
                veterinary use, ingestion, injection, inhalation, topical application,
                or any other route of administration involving a living organism. They
                are not intended to diagnose, treat, cure, or prevent any disease or
                medical condition.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Regulatory status
              </h2>
              <p>
                These compounds have not been evaluated or approved by the U.S. Food
                and Drug Administration (FDA) for any clinical use. They are not
                approved drugs, dietary supplements, or food products. Statements
                concerning research applications are based on third-party scientific
                literature and do not constitute medical claims.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Buyer responsibility and liability
              </h2>
              <p>
                By purchasing from this site, the buyer represents that they are a
                qualified researcher, educator, or otherwise authorized purchaser
                acquiring these materials for legitimate research or educational
                purposes. The buyer assumes full responsibility for the safe handling,
                storage, and lawful use of all compounds purchased and agrees to
                indemnify Greenstone Wellness against any claim arising from use
                outside of the intended research context.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Quality testing
              </h2>
              <p>
                Every lot is third-party tested. High-Performance Liquid Chromatography
                (HPLC) verifies purity at ≥98% and mass spectrometry confirms molecular
                identity. Lot-specific Certificates of Analysis are available on
                request to verified buyers.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Age and access restriction
              </h2>
              <p>
                Access to this site is restricted to individuals 21 years of age or
                older. The acknowledgment presented at the entry of this site is a
                binding affirmation of the terms on this page and is recorded in your
                browser session.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Contact
              </h2>
              <p>
                Questions about this notice, COA requests, or institutional account
                inquiries can be sent to{' '}
                <a href="mailto:support@greenstonewellness.store" className="text-gold hover:underline">
                  support@greenstonewellness.store
                </a>
                .
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-cream-dim/10">
            <Link
              href="/"
              className="font-jetbrains text-[0.7rem] tracking-widest uppercase text-emerald hover:text-emerald-light transition-colors"
            >
              &larr; Back to Home
            </Link>
          </div>

          <p className="mt-10 font-jetbrains text-[0.55rem] tracking-[0.2em] uppercase text-cream-dim/40 text-center">
            For Research Use Only · Not For Human Consumption
          </p>
        </div>
      </section>
    </main>
  );
}
