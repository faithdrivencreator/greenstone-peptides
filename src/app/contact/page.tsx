import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Greenstone Peptides for product questions, wholesale inquiries, or general support.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <section className="section-py">
      <div className="container-gr grid gap-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>We're here to help.</h1>
          <p className="mt-6 text-lg text-cream-dim">
            Questions about products, orders, or bulk pricing? Our team responds within one business day.
          </p>

          <div className="mt-12 space-y-8">
            <div className="card-glass">
              <h4 className="font-cormorant text-xl text-white">Product Questions</h4>
              <p className="text-sm text-cream-dim mt-2">
                Dosing info, storage, shipping timelines, order status, or help picking a starter kit.
              </p>
            </div>
            <div className="card-glass">
              <h4 className="font-cormorant text-xl text-white">Wholesale &amp; Bulk Orders</h4>
              <p className="text-sm text-cream-dim mt-2">
                Volume pricing for clinics, med spas, gyms, and retailers. Minimum order quantities apply.
              </p>
            </div>
            <div className="card-glass">
              <h4 className="font-cormorant text-xl text-white">General &amp; Media</h4>
              <p className="text-sm text-cream-dim mt-2">
                Press, partnerships, content collaborations, or general feedback.
              </p>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
