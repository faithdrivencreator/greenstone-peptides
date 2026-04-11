import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Greenstone Peptides is a Miami-based managed services organization with 25 years of pharmaceutical experience, facilitating physician-prescribed peptide therapy.',
};

export default function AboutPage() {
  return (
    <>
      <section className="section-py">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">Our Story</p>
          <h1>Twenty-five years of pharmaceutical precision.</h1>
          <p className="mt-8 text-lg text-cream-dim">
            Greenstone Peptides is a managed services organization headquartered in Miami, Florida.
            We facilitate physician-prescribed, USA-compounded peptide therapy through licensed
            pharmacy partners. We are not a pharmacy. We exist to make precision therapy
            accessible, transparent, and held to the highest clinical standards.
          </p>
          <p className="mt-6 text-lg text-cream-dim">
            Our team brings over two decades of pharmaceutical operations experience to a
            category still finding its footing. Every compound we facilitate comes from a
            USP 795 & 797 compliant partner. Every prescription is written by a licensed
            provider. Every shipment is cold-chain verified.
          </p>
        </div>
      </section>

      <section className="section-py bg-obsidian-mid/40 border-y border-gold/10">
        <div className="container-gr max-w-4xl">
          <p className="eyebrow">Commitments</p>
          <h2>Quality is not a marketing word.</h2>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { t: 'USP 795 & 797 Compliance', b: 'Sterile and non-sterile compounding standards verified at every partner pharmacy.' },
              { t: 'Licensed Partners Only', b: 'We work exclusively with state-licensed compounding pharmacies in the United States.' },
              { t: 'Physician Oversight', b: 'Every prescription is written by a licensed provider after a clinical consult.' },
              { t: 'Cold-Chain Logistics', b: 'Temperature-controlled packaging and tracking for every shipment nationwide.' },
              { t: '24/7 Pharmacist Access', b: 'Clinical questions answered by a licensed pharmacist, any hour.' },
              { t: 'Radical Transparency', b: 'Product sourcing, compounding methodology, and safety data available on request.' },
            ].map((c) => (
              <li key={c.t} className="card-glass">
                <h4 className="font-cormorant text-xl text-white">{c.t}</h4>
                <p className="text-sm text-cream-dim mt-2">{c.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-py">
        <div className="container-gr text-center max-w-2xl">
          <p className="eyebrow">Speak With Us</p>
          <h2>Have a question?</h2>
          <p className="mt-4 mx-auto">
            Our team is available to walk through clinical questions, product sourcing, and
            prescription workflows.
          </p>
          <Link href="/contact" className="btn btn-primary mt-8 inline-flex">
            Contact Greenstone Peptides
          </Link>
        </div>
      </section>
    </>
  );
}
