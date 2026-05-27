import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About GS Wellness Pharmacy | A Florida Clinic + 503A Pharmacy',
  description:
    'GS Wellness Pharmacy is the clinic-side storefront of Greenstone Rx, a Florida-licensed 503A compounding pharmacy. Physician-prescribed GLP-1, peptide, and oral therapy.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-py">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">Our Story</p>
          <h1>A clinic, a pharmacy, and a real physician on every order.</h1>
          <p className="mt-8 text-lg text-cream-dim">
            GS Wellness Pharmacy is the patient-facing clinic of{' '}
            <strong className="text-cream">Greenstone Rx</strong>, a Florida-licensed
            503A compounding pharmacy. Every medication you see in our formulary has been
            selected by our clinic, prescribed by a licensed physician after a health
            screening, and compounded inside the pharmacy under USP 797 sterile standards.
          </p>
          <p className="mt-6 text-lg text-cream-dim">
            The model is straightforward: you browse our medicines, complete a short
            health screening, our physician reviews it, and if appropriate, the
            prescription is filled by the pharmacy and shipped to your door in
            specialized temperature-controlled packaging.
          </p>
        </div>
      </section>

      {/* The 503A explanation */}
      <section className="section-py bg-obsidian-mid/40 border-y border-emerald/20">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow text-emerald">503A · The Pharmacy License</p>
          <h2>What &ldquo;503A&rdquo; actually means.</h2>
          <p className="mt-6 text-lg text-cream-dim">
            A 503A pharmacy is a compounding pharmacy licensed under section 503A of
            the Federal Food, Drug, and Cosmetic Act. It is allowed to compound a
            medication for a specific patient with a valid prescription. That&rsquo;s
            the legal framework that lets us offer customized GLP-1, peptide, and
            oral therapy with a real physician&rsquo;s prescription, rather than the
            unregulated &ldquo;research peptide&rdquo; market that the FDA has spent
            2026 dismantling.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                stat: 'FL',
                label: 'State Licensed',
                detail:
                  'Greenstone Rx holds a Florida pharmacy license and operates within state and federal compounding regulations.',
              },
              {
                stat: 'USP 797',
                label: 'Sterile Standard',
                detail:
                  'Compounding happens inside an ISO Class 5 cleanroom — the same sterility bar required of hospital pharmacies.',
              },
              {
                stat: 'MD',
                label: 'Physician Prescribed',
                detail:
                  'A licensed prescribing physician reviews every health screening before any medication is compounded or shipped.',
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

      {/* Why this model */}
      <section className="section-py">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">Why This Model</p>
          <h2>The research-peptide era is over.</h2>
          <p className="mt-6 text-lg text-cream-dim">
            For years, the same molecules sold legitimately by compounding pharmacies
            also showed up on the gray market as &ldquo;research compounds&rdquo; with
            no oversight. The FDA spent 2026 sending warning letters to those sellers
            and shutting them down. We were never going to operate that way. Greenstone
            Wellness works through a licensed pharmacy and a licensed physician because
            that&rsquo;s the only model that protects you.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {[
              {
                t: 'Purity & Potency',
                b: 'Every lot is independently verified by HPLC (≥98%) and mass spectrometry. The Certificate of Analysis tied to your lot number is available on request.',
              },
              {
                t: 'Sterility',
                b: 'Injectable medications are prepared inside an ISO Class 5 cleanroom under USP 797 standards. Sterility and bacterial endotoxin testing are run on every lot.',
              },
              {
                t: 'Physician Oversight',
                b: 'A licensed prescribing physician reviews your health screening before a prescription is written. Contraindications get flagged before the order ships.',
              },
              {
                t: 'Real Accountability',
                b: 'You know who compounded your medication, where it was made, and who prescribed it. That is the difference between a regulated pharmacy and an overseas supplier.',
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

      {/* What's in the formulary */}
      <section className="section-py bg-obsidian-mid/40 border-y border-gold/10">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">The Formulary</p>
          <h2>Three areas. Eleven medications. Selected with intent.</h2>
          <p className="mt-4 text-lg text-cream-dim">
            We don&rsquo;t carry everything — we carry the medications our clinic and
            the pharmacy stand behind. The formulary is divided into three treatment
            areas: GLP-1 and dual-agonist therapies for weight loss, oral PDE5
            inhibitors for men&rsquo;s health, and peptide therapy for healing, growth
            hormone support, metabolism, and skin.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/shop" className="btn btn-primary">Browse the Formulary →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py">
        <div className="container-gr text-center max-w-2xl">
          <p className="eyebrow">Get Started</p>
          <h2>Ready when you are.</h2>
          <p className="mt-4 mx-auto text-cream-dim">
            Browse the formulary and read about each medication. Questions about
            how the model works? Reach the clinic any time.
          </p>
          <div className="flex gap-4 justify-center mt-8 flex-wrap">
            <Link href="/shop" className="btn btn-primary">Browse the Formulary →</Link>
            <Link href="/contact" className="btn btn-ghost">Contact the Clinic</Link>
          </div>
        </div>
      </section>
    </>
  );
}
