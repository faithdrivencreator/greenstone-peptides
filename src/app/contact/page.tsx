import type { Metadata } from 'next';
import { ContactForm } from './ContactForm';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Speak with the Greenstone Peptides team. 24/7 pharmacist support, provider onboarding, and patient inquiries.',
};

export default function ContactPage() {
  return (
    <section className="section-py">
      <div className="container-gr grid gap-16 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Let's talk.</h1>
          <p className="mt-6 text-lg text-cream-dim">
            Our team is available for clinical questions, provider onboarding, and patient
            inquiries. Licensed pharmacists on staff 24/7.
          </p>

          <ul className="mt-12 space-y-6">
            <ContactRow icon={Phone} label="Phone" value="(855) 625-7588" href="tel:+18556257588" />
            <ContactRow icon={Mail} label="Email" value="hello@greenstonepeptides.com" href="mailto:hello@greenstonepeptides.com" />
            <ContactRow
              icon={MapPin}
              label="Address"
              value="861 SW 8th Street, Suite 101, Miami, FL 33130"
            />
            <ContactRow icon={Clock} label="Hours" value="Mon-Fri 8am-8pm ET · Pharmacist on-call 24/7" />
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

interface ContactRowProps {
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  label: string;
  value: string;
  href?: string;
}

function ContactRow({ icon: Icon, label, value, href }: ContactRowProps) {
  const content = (
    <div className="flex items-start gap-4">
      <Icon size={20} className="text-gold mt-1" aria-hidden />
      <div>
        <p className="mono !text-cream-dim">{label}</p>
        <p className="text-cream mt-1">{value}</p>
      </div>
    </div>
  );
  return (
    <li>
      {href ? (
        <a href={href} className="hover:text-gold transition-colors">
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  );
}
