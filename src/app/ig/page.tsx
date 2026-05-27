import type { Metadata } from 'next';
import IgLinks from './IgLinks';

export const metadata: Metadata = {
  title: 'GS Wellness Pharmacy',
  description: 'Compounded GLP-1, injectable, and oral medications — physician-prescribed in Florida. Tap a link to keep exploring.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/ig' },
};

const UTM = '?utm_source=instagram&utm_medium=social&utm_campaign=ig_bio&utm_content=';

type IgLink = {
  href: string;
  title: string;
  sub: string;
  icon: string;
  destination: string;
  label: string;
};

const PROMO = {
  href: `/free/peptides-made-easy${UTM}promo_free_guide`,
  code: 'FREE GUIDE',
  headline: 'Compounded therapy, made easy — the free guide',
  sub: 'Drop your email to unlock the PDF',
  destination: '/free/peptides-made-easy',
  label: 'promo_free_guide',
};

const LINKS: IgLink[] = [
  {
    href: `/shop${UTM}shop`,
    title: 'Browse the formulary',
    sub: '14 compounded medications · GLP-1, injectable, oral therapies',
    icon: '$',
    destination: '/shop',
    label: 'shop',
  },
  {
    href: `/free/peptides-made-easy${UTM}free_guide`,
    title: 'Free: Therapy Made Easy',
    sub: 'PDF primer · plain-language compounded therapy basics',
    icon: '↓',
    destination: '/free/peptides-made-easy',
    label: 'free_guide',
  },
  {
    href: `/learn${UTM}blog`,
    title: 'The Journal',
    sub: 'Plain-language guides from the clinic',
    icon: '¶',
    destination: '/learn',
    label: 'blog',
  },
  {
    href: `/about${UTM}about`,
    title: 'Our story',
    sub: 'Why we built Greenstone',
    icon: 'i',
    destination: '/about',
    label: 'about',
  },
  {
    href: `/contact${UTM}contact`,
    title: 'Questions?',
    sub: 'Talk to the clinic · order help',
    icon: '@',
    destination: '/contact',
    label: 'contact',
  },
];

export default function IgPage() {
  return <IgLinks promo={PROMO} links={LINKS} />;
}
