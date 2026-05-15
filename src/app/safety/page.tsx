import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety & Storage | Greenstone Wellness',
  description:
    'Product safety information, storage guidelines, and important notices for Greenstone Wellness.',
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

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Product Safety</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            All Greenstone Wellness products are compounded in the USA under USP 797 sterile
            standards and third-party tested for potency, sterility, and purity. We recommend
            consulting with a healthcare professional before starting any new supplement or
            peptide regimen. Individual results may vary.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Storage Guidelines</h2>
          <div className="text-cream-dim text-sm leading-relaxed space-y-3">
            <p>
              <strong className="text-cream">Before reconstitution:</strong> injectable peptides
              ship as a lyophilized (freeze-dried) powder sealed inside a sterile glass vial.
              In this form they are stable at room temperature for weeks and can be stored at
              normal indoor temperatures until you're ready to mix.
            </p>
            <p>
              <strong className="text-cream">After reconstitution:</strong> once you add
              bacteriostatic water to the vial, the solution must be refrigerated at 2-8°C
              (36-46°F) and protected from direct light. Most compounded peptides remain
              stable for 28-56 days refrigerated after reconstitution, depending on the peptide.
              Do not freeze. Discard any vial that becomes cloudy, discolored, or contains
              particles.
            </p>
            <p>
              <strong className="text-cream">ODT tablets and topical creams:</strong> store at
              room temperature, away from heat and moisture. No refrigeration needed. Keep all
              products out of reach of children.
            </p>
          </div>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Shipping & Handling</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Injectable peptides ship as lyophilized powder in sealed sterile vials, which are
            stable at room temperature in transit. If your package arrives with a broken vial
            or compromised seal, contact us for a replacement.
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
