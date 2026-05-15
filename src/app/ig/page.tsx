import type { Metadata } from 'next';
import IgLinks from './IgLinks';

export const metadata: Metadata = {
  title: 'Greenstone Wellness',
  description: 'Research-grade peptides, made in the USA. Tap a link to keep exploring.',
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
  code: '10% OFF',
  headline: 'Download the free guide, get 10% off',
  sub: 'Drop your email to unlock the PDF + discount',
  destination: '/free/peptides-made-easy',
  label: 'promo_free_guide',
};

const LINKS: IgLink[] = [
  {
    href: `/shop${UTM}shop`,
    title: 'Shop the catalog',
    sub: 'All peptides · BAC water · accessories',
    icon: '$',
    destination: '/shop',
    label: 'shop',
  },
  {
    href: `/free/peptides-made-easy${UTM}free_guide`,
    title: 'Free: Peptides Made Easy',
    sub: 'PDF guide · reconstitution + dosing basics',
    icon: '↓',
    destination: '/free/peptides-made-easy',
    label: 'free_guide',
  },
  {
    href: `/learn${UTM}blog`,
    title: 'The Journal',
    sub: 'Research-backed posts with peer-reviewed citations',
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
    sub: 'Product Q&A · order help',
    icon: '@',
    destination: '/contact',
    label: 'contact',
  },
];

export default function IgPage() {
  return <IgLinks promo={PROMO} links={LINKS} />;
}
