import type { Metadata } from 'next';
import { ProviderSignupForm } from './ProviderSignupForm';

export const metadata: Metadata = {
  title: 'Provider Portal',
  description:
    'Licensed healthcare providers — partner with Greenstone Peptides for streamlined prescription routing to USA-licensed compounding pharmacies.',
};

export default function ProviderPage() {
  return (
    <>
      <section className="section-py">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">For Licensed Providers</p>
          <h1>Partner with Greenstone Peptides.</h1>
          <p className="mt-8 text-lg text-cream-dim">
            Streamline prescription routing to USA-licensed compounding pharmacies. Our provider
            portal offers direct e-prescribing, patient tracking, and clinical support from our
            pharmacist team.
          </p>

          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              'Direct e-prescribe to partner pharmacies',
              'Patient tracking dashboard',
              'Clinical support from PharmD team',
              'Automated shipping and refill workflows',
              'Cold-chain logistics for every order',
              'Dedicated account management',
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
