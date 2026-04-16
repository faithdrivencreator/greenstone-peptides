import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach the Greenstone Peptides team for clinical questions, provider onboarding, and patient inquiries. Licensed pharmacists on staff 24/7.',
};

export default function ContactPage() {
  return (
    <section className="section-py">
      <div className="container-gr grid gap-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>We're here to help.</h1>
          <p className="mt-6 text-lg text-cream-dim">
            Whether you're a patient exploring your options, a provider looking to partner, or
            a clinician with a protocol question — our team responds within one business day.
            Licensed pharmacists are available 24/7 for urgent clinical inquiries.
          </p>

          <div className="mt-12 space-y-8">
            <div className="card-glass">
              <h4 className="font-cormorant text-xl text-white">Patient Inquiries</h4>
              <p className="text-sm text-cream-dim mt-2">
                Questions about products, pricing, or how to get started with your order.
                Use the form and we'll connect you with the right resource.
              </p>
            </div>
            <div className="card-glass">
              <h4 className="font-cormorant text-xl text-white">Provider & Clinic Partnerships</h4>
              <p className="text-sm text-cream-dim mt-2">
                Medspas, clinics, and physicians interested in offering compounded peptide
                therapy to patients. We handle the pharmacy logistics — you focus on care.
              </p>
            </div>
            <div className="card-glass">
              <h4 className="font-cormorant text-xl text-white">Clinical & Safety Questions</h4>
              <p className="text-sm text-cream-dim mt-2">
                Protocol questions, drug interaction concerns, or safety information.
                Our pharmacist team is on call 24/7.
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
