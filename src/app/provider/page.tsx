import type { Metadata } from 'next';
import { ProviderSignupForm } from './ProviderSignupForm';

export const metadata: Metadata = {
  title: 'Provider Portal',
  description:
    'Clinics, medspas, and healthcare professionals — partner with Greenstone Peptides to offer compounded peptide therapy to your patients.',
  alternates: { canonical: '/provider' },
};

export default function ProviderPage() {
  return (
    <>
      <section className="section-py">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">For Clinics & Healthcare Professionals</p>
          <h1>Partner with Greenstone Peptides.</h1>
          <p className="mt-8 text-lg text-cream-dim">
            Offer your patients access to USA-compounded peptide therapy backed by licensed
            pharmacy partners. Designed for clinics, medspas, and healthcare professionals who
            want to expand their treatment offerings without the pharmacy overhead.
          </p>

          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              'Wholesale pricing for qualified partners',
              'Dedicated account representative',
              'Product and protocol training',
              'Marketing support and patient education materials',
              'Priority fulfillment and cold-chain logistics',
              'Custom formulations available',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-cream-dim">
                <span className="text-gold mt-1">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-py bg-obsidian-mid/40 border-y border-gold/10">
        <div className="container-gr max-w-2xl">
          <header className="text-center mb-12">
            <p className="eyebrow">Sign Up</p>
            <h2>Request Provider Access</h2>
            <p className="mt-4 mx-auto">
              Verified licensed providers only. Credentials will be verified before portal
              activation.
            </p>
          </header>

          <ProviderSignupForm />
        </div>
      </section>
    </>
  );
}
