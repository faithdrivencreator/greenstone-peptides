import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Safety & Storage | Greenstone Wellness',
  description:
    'How Greenstone Wellness handles safety: physician review, USP 797 sterile compounding, lot testing, specialized temperature-controlled packaging, and storage guidelines for patients.',
  alternates: { canonical: '/safety' },
};

export default function SafetyPage() {
  return (
    <section className="section-py">
      <div className="container-gr max-w-3xl space-y-10">
        <header>
          <p className="eyebrow">Patient Safety</p>
          <h1>Safety & Storage</h1>
          <p className="mt-6 text-cream-dim text-lg leading-relaxed">
            Every medication in our formulary is prescribed by a licensed physician
            and compounded by a Florida 503A pharmacy. Safety isn&rsquo;t a marketing
            claim &mdash; it&rsquo;s the difference between this model and the
            unregulated research-peptide market we left behind.
          </p>
        </header>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Before any medication ships</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            A licensed physician reviews your health screening before any prescription
            is written. Contraindications &mdash; personal or family history of
            medullary thyroid cancer, pregnancy or breastfeeding, active pancreatitis,
            recent cardiac events, current nitrate use, and others &mdash; are flagged
            during that review. If a medication isn&rsquo;t appropriate for you, it
            doesn&rsquo;t get prescribed.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Compounding standards</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Greenstone Rx compounds inside an ISO Class 5 cleanroom under USP 797
            sterile compounding standards &mdash; the same bar applied to hospital
            pharmacy preparations. Every lot is independently tested for potency
            (HPLC &ge; 98%) and identity (mass spectrometry), and sterile lots receive
            bacterial endotoxin and sterility testing. Lot-specific Certificates of
            Analysis are available on request.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Shipping & packaging</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Prescriptions ship in specialized medical-grade packaging designed to
            maintain temperature stability through transit. If you have any concern
            about the condition of your delivery on arrival, contact the pharmacy
            immediately &mdash; they will handle any replacement directly.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Storage at home</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            Storage instructions vary by medication and are printed on the label your
            pharmacy provides. As a general rule: most injectable peptides and GLP-1
            medications are kept refrigerated (2&ndash;8&deg;C / 36&ndash;46&deg;F),
            protected from light, and used within the timeframe your label specifies.
            Oral dissolving tablets and creams have different requirements &mdash;
            follow the label and pharmacist&rsquo;s direction.
          </p>
        </div>

        <div className="card-glass">
          <h2 className="font-cormorant text-2xl text-white mb-4">Questions &mdash; clinical vs. logistical</h2>
          <p className="text-cream-dim text-sm leading-relaxed">
            For clinical questions about your prescription (dose adjustments, side
            effects you&rsquo;re experiencing, contraindications you&rsquo;re unsure
            about), contact the prescribing physician through the pharmacy portal.
            For logistical questions about your account, shipping, or ordering,{' '}
            <Link href="/contact" className="text-gold hover:underline">
              reach the clinic
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
