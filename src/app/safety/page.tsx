import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Safety Information',
  description:
    'Full safety information, legal disclaimers, and state availability notices for Greenstone Peptides compounded peptide therapy.',
};

export default function SafetyPage() {
  return (
    <section className="section-py">
      <div className="container-gr max-w-3xl space-y-10">
        <header>
          <p className="eyebrow">Important Information</p>
          <h1>Safety & Disclaimers</h1>
        </header>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Full Disclaimer</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Compounded medications are not FDA-approved. Greenstone Peptides facilitates access
            to USA-compounded peptide formulations through licensed pharmacy partners. Compounded
            medications are prepared by licensed compounding pharmacies and are not FDA-approved.
            Greenstone Rx is not a pharmacy and does not manufacture, compound, dispense, or ship
            medications directly.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Educational Purpose</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            The content on this website is intended for educational and informational purposes
            only. Nothing on this site constitutes medical advice, diagnosis, or treatment.
            Always consult a licensed healthcare provider before starting, stopping, or
            modifying any therapy. Individual results may vary.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">State Availability</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Not all compounded products are available in all U.S. states. Availability is
            subject to state pharmacy board regulations and the licensing of our partner
            pharmacies. If a product is not available in your state, your provider will be
            notified during prescription review.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Reporting Adverse Events</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            If you experience an adverse event while using any product facilitated through
            Greenstone Peptides, contact your prescribing provider immediately. You may also report
            adverse events to the FDA MedWatch program at fda.gov/medwatch or by calling
            1-800-FDA-1088. For urgent clinical support, call our 24/7 pharmacist line at{' '}
            <a href="tel:+18556257588" className="text-gold">
              (855) 625-7588
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
