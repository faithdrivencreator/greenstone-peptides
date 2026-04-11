import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wholesale & Distribution',
  description:
    'Greenstone Peptides wholesale and distribution program. Partner with us to offer physician-prescribed, USA-compounded peptides to your clinical network.',
};

const BENEFITS = [
  {
    t: 'Tiered Pricing',
    b: 'Volume-based wholesale pricing available for qualified distributors and clinical networks. Margins structured for sustainable resale.',
  },
  {
    t: 'Dedicated Account Manager',
    b: 'Every wholesale partner is assigned a dedicated account manager for ordering, logistics coordination, and clinical support.',
  },
  {
    t: 'Co-branded Materials',
    b: 'Marketing collateral, patient education materials, and digital assets available for approved distribution partners.',
  },
  {
    t: 'Streamlined Reordering',
    b: 'Distributor portal for real-time inventory visibility, order tracking, and automated reorder scheduling.',
  },
  {
    t: 'Clinical Training',
    b: 'Access to our pharmacist-led clinical training library for your team. Protocol support and drug interaction resources included.',
  },
  {
    t: 'Compliance Documentation',
    b: 'Full USP 795 & 797 compliance documentation, CoA availability, and pharmacy licensure records provided for your records.',
  },
];

const STEPS = [
  { n: '01', t: 'Apply', b: 'Submit your practice information and wholesale inquiry via the form below. Review takes 2–3 business days.' },
  { n: '02', t: 'Review', b: 'Our team evaluates your facility, volume projections, and prescribing infrastructure before approval.' },
  { n: '03', t: 'Onboard', b: 'Approved partners receive portal credentials, pricing schedules, and a kickoff call with your account manager.' },
  { n: '04', t: 'Order', b: 'Place and track orders directly through the distributor portal. Cold-chain fulfilled to your facility.' },
];

export default function WholesalePage() {
  return (
    <>
      {/* Hero */}
      <section className="section-py bg-emerald/[0.08] border-b border-emerald/25 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(26,158,110,0.12), transparent 70%)' }}
          aria-hidden
        />
        <div className="container-gr relative z-10 max-w-4xl">
          <p className="eyebrow text-emerald">Distribution Program</p>
          <h1 className="font-cormorant">
            Wholesale &amp; Distribution
            <br />
            <em className="italic text-gold">Opportunities Available.</em>
          </h1>
          <p className="mt-8 text-lg text-cream-dim max-w-2xl leading-relaxed">
            Greenstone Peptides offers a structured wholesale program for medspas, integrative
            clinics, physician groups, and vetted distributors. Bring pharmaceutical-grade,
            USA-compounded peptides to your patient network — backed by our clinical and
            logistics infrastructure.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="#apply" className="btn btn-primary">
              Apply for Wholesale Access
            </Link>
            <Link href="/wholesale/login" className="inline-flex items-center gap-2 btn btn-ghost">
              <Lock size={14} />
              Existing Partner Login
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="section-py bg-obsidian-mid/60 border-b border-gold/10">
        <div className="container-gr">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            {[
              { stat: '53+', label: 'SKUs Available' },
              { stat: 'USP 797', label: 'Sterile Standard' },
              { stat: '25 yrs', label: 'Compounding Experience' },
            ].map((item) => (
              <div key={item.stat}>
                <p className="font-cormorant text-5xl text-emerald">{item.stat}</p>
                <p className="mono mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-py">
        <div className="container-gr">
          <header className="max-w-2xl mb-16">
            <p className="eyebrow text-emerald">Partner Benefits</p>
            <h2>Everything your practice needs to offer peptide therapy at scale.</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((item) => (
              <div key={item.t} className="card-glass border-emerald/20 hover:border-emerald/40">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-emerald mt-0.5 flex-shrink-0" aria-hidden />
                  <div>
                    <h4 className="font-cormorant text-xl text-white mb-2">{item.t}</h4>
                    <p className="text-sm text-cream-dim">{item.b}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-py bg-emerald/[0.06] border-y border-emerald/20">
        <div className="container-gr">
          <header className="text-center max-w-2xl mx-auto mb-16">
            <p className="eyebrow text-emerald">Onboarding Process</p>
            <h2>From application to first order in days.</h2>
          </header>
          <ol className="grid gap-8 md:grid-cols-4">
            {STEPS.map((s) => (
              <li key={s.n} className="card-glass border-emerald/20">
                <span className="font-jetbrains text-xs tracking-widest uppercase text-emerald">{s.n}</span>
                <h4 className="font-cormorant text-2xl text-white mt-3 mb-2">{s.t}</h4>
                <p className="text-sm text-cream-dim">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="section-py">
        <div className="container-gr max-w-2xl">
          <header className="mb-12">
            <p className="eyebrow text-emerald">Apply Now</p>
            <h2>Wholesale Inquiry</h2>
            <p className="mt-4 text-cream-dim">
              Complete the form below. Our wholesale team responds within 2 business days.
              Existing partners can log in directly at the{' '}
              <Link href="/wholesale/login" className="text-emerald hover:text-emerald-light transition-colors">
                Distributor Portal
              </Link>
              .
            </p>
          </header>

          <form className="space-y-6 card-glass border-emerald/20">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mono block mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
                  placeholder="Dr. Jane"
                />
              </div>
              <div>
                <label className="mono block mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
                  placeholder="Smith"
                />
              </div>
            </div>
            <div>
              <label className="mono block mb-2">Business / Practice Name</label>
              <input
                type="text"
                className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
                placeholder="Advanced Wellness Clinic"
              />
            </div>
            <div>
              <label className="mono block mb-2">Business Email</label>
              <input
                type="email"
                className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
                placeholder="orders@yourclinic.com"
              />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mono block mb-2">State</label>
                <input
                  type="text"
                  className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
                  placeholder="Florida"
                />
              </div>
              <div>
                <label className="mono block mb-2">Estimated Monthly Volume</label>
                <select className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors appearance-none">
                  <option value="">Select range</option>
                  <option>Under $5,000 / mo</option>
                  <option>$5,000 – $15,000 / mo</option>
                  <option>$15,000 – $50,000 / mo</option>
                  <option>Over $50,000 / mo</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mono block mb-2">Additional Notes</label>
              <textarea
                rows={4}
                className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors resize-none"
                placeholder="Tell us about your practice and what you're looking for..."
              />
            </div>
            <Link href="/contact" className="btn btn-primary w-full justify-center">
              Submit Wholesale Inquiry
            </Link>
            <p className="text-xs text-cream-dim/50 text-center font-jetbrains">
              Wholesale access is subject to review and approval. Prescription facilitation required.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
