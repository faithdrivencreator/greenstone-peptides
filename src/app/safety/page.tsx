import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety & Storage | Greenstone Peptides',
  description:
    'Product safety information, storage guidelines, and important notices for Greenstone Peptides.',
};

export default function SafetyPage() {
  return (
    <section className="section-py">
      <div className="container-gr max-w-3xl space-y-10">
        <header>
          <p className="eyebrow">Product Information</p>
          <h1>Safety & Storage</h1>
        </header>

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
