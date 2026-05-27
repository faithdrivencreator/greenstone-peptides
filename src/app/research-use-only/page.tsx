import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How Compounded Medications Work | GS Wellness Pharmacy',
  description:
    'How compounded medications work at GS Wellness Pharmacy: a Florida 503A compounding pharmacy, a licensed prescribing physician, and the patient. The legal framework, the standards, and what to expect.',
  alternates: { canonical: 'https://gswellnesspharmacy.com/research-use-only' },
  robots: { index: true, follow: true },
};

export default function HowItWorksPage() {
  return (
    <main className="bg-obsidian min-h-screen">
      <section className="section-py">
        <div className="container-gr max-w-3xl">
          <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-4">
            // How Compounded Medications Work
          </p>
          <h1 className="font-cormorant text-cream text-4xl sm:text-5xl leading-tight mb-6" style={{ fontWeight: 400 }}>
            Compounded, not research.
          </h1>
          <p className="text-cream-dim text-base sm:text-lg leading-relaxed mb-10">
            The medications you see on this site are <strong className="text-cream">compounded prescription drugs</strong>,
            not research chemicals. They are prescribed by a licensed physician,
            compounded inside a licensed 503A pharmacy, and shipped directly to the
            patient. This page explains what that means and how the process works.
          </p>

          <div className="space-y-10 text-cream-dim text-[0.95rem] leading-relaxed">
            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                What a 503A compounding pharmacy is
              </h2>
              <p>
                A 503A pharmacy is a state-licensed compounding pharmacy authorized
                under section 503A of the Federal Food, Drug, and Cosmetic Act. It
                may compound medications for a specific patient on receipt of a valid
                prescription from a licensed prescriber. Greenstone Rx is a 503A
                pharmacy licensed in Florida.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                The physician&rsquo;s role
              </h2>
              <p>
                Every medication in our formulary requires a prescription. Before a
                prescription is written, a licensed physician reviews your health
                screening &mdash; the same questionnaire and history a telehealth
                provider would gather in a video consult. If the medication is
                appropriate and there are no contraindications, the physician writes
                the prescription. If it isn&rsquo;t, the physician declines and tells
                you why.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Compounding standards
              </h2>
              <p>
                Compounding happens inside an ISO Class 5 cleanroom under USP 797
                sterile compounding standards. Every lot is independently verified
                for potency (HPLC &ge; 98%) and identity (mass spectrometry). Sterile
                lots receive sterility and bacterial endotoxin testing. Lot-specific
                Certificates of Analysis are available on request.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Shipping
              </h2>
              <p>
                Prescriptions ship in specialized medical-grade packaging designed
                to maintain temperature stability through transit. Packaging
                requirements vary by formulation; your label and pharmacy
                communication will specify storage on arrival.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                FDA-approved vs. compounded
              </h2>
              <p>
                Brand-name GLP-1 medications like Ozempic and Wegovy are FDA-approved
                products manufactured at scale. Compounded GLP-1 medications use the
                same active ingredient, prepared inside a licensed compounding
                pharmacy for a specific patient with a prescription. The legal,
                clinical, and regulatory frameworks are different from research
                chemicals, brand-name pharmaceuticals, and supplements &mdash; this
                is its own category.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Age requirement
              </h2>
              <p>
                The GS Wellness Pharmacy formulary is restricted to patients 21 years
                of age or older. Verification happens at the start of the pharmacy
                checkout flow.
              </p>
            </section>

            <section>
              <h2 className="font-cormorant text-cream text-2xl mb-3" style={{ fontWeight: 400 }}>
                Contact
              </h2>
              <p>
                Questions about how the model works, lot Certificates of Analysis,
                or your account can be sent to{' '}
                <a href="mailto:support@gswellnesspharmacy.com" className="text-gold hover:underline">
                  support@gswellnesspharmacy.com
                </a>
                . Clinical questions about a prescription you&rsquo;ve received go
                through the pharmacy portal so the prescribing physician sees them.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-cream-dim/10 flex flex-wrap gap-4 items-center">
            <Link href="/shop" className="btn btn-primary">Browse the Formulary →</Link>
            <Link
              href="/"
              className="font-jetbrains text-[0.7rem] tracking-widest uppercase text-emerald hover:text-emerald-light transition-colors"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
