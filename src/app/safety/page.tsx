import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety & Storage | Greenstone Peptides',
  description:
    'Product safety information, storage guidelines, and important notices for Greenstone Peptides.',
  alternates: { canonical: '/safety' },
};

export default function SafetyPage() {
  return (
    <section className="section-py">
      <div className="container-gr max-w-3xl space-y-10">
        <header>
          <p className="eyebrow">Product Information</p>
          <h1>Safety & Storage</h1>
        </header>

        <div className="card-glass border-gold/30 bg-obsidian-light/60">
          <h2 className="font-cormorant text-2xl text-white mb-4">Regulatory Disclaimer</h2>
          <div className="space-y-3 text-sm leading-relaxed text-cream-dim">
            <p>
              <strong className="text-cream">FDA Notice:</strong> These statements have not been
              evaluated by the Food and Drug Administration. These products are not intended to
              diagnose, treat, cure, or prevent any disease.
            </p>
            <p>
              All products sold by Greenstone Peptides are for <strong className="text-cream">research
              and educational purposes only</strong>. They are not intended for human consumption.
            </p>
            <p>
              Bodily introduction of any kind into humans or animals is strictly forbidden by law.
              By purchasing from this site, you acknowledge and agree that these products are
              restricted to lawful research and educational use only.
            </p>
          </div>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Product Safety</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            All Greenstone Peptides products are compounded in the USA under USP 797 sterile
            standards and third-party tested for potency, sterility, and purity. We recommend
            consulting with a healthcare professional before starting any new supplement or
            peptide regimen. Individual results may vary.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Storage Guidelines</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Most peptide formulations should be stored refrigerated at 2-8°C (36-46°F) and
            protected from direct light. Once reconstituted, use within the timeframe noted
            on your product label. Do not freeze unless specifically directed. Keep all
            products out of reach of children.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Shipping & Handling</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            All orders are shipped with temperature-controlled packaging to maintain product
            integrity during transit. If your package arrives damaged or the cold pack is
            fully thawed, contact us for a replacement.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Educational Content</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            The information on this website is for educational purposes only and is not
            intended as medical advice. Always consult your healthcare provider with questions
            about your health or before making changes to your wellness routine.
          </p>
        </div>
      </div>
    </section>
  );
}
