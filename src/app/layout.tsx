import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { SchemaOrg } from '@/components/SchemaOrg';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonepeptides.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Greenstone Peptides | Physician-Prescribed Peptide Therapy',
    template: 'Greenstone Peptides | %s',
  },
  description:
    'Greenstone Peptides is a managed services organization facilitating physician-prescribed, USA-compounded peptide therapy through licensed pharmacy partners. Miami, FL.',
  keywords: [
    'peptide therapy',
    'GLP-1',
    'compounded peptides',
    'semaglutide',
    'tirzepatide',
    'BPC-157',
    'Miami pharmacy',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Greenstone Peptides',
    title: 'Greenstone Peptides | Physician-Prescribed Peptide Therapy',
    description:
      'USA-compounded, physician-prescribed peptide therapy. 25 years of pharmaceutical experience. USP 795 & 797 compliant.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Greenstone Peptides | Physician-Prescribed Peptide Therapy',
    description:
      'USA-compounded, physician-prescribed peptide therapy. 25 years of pharmaceutical experience.',
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Greenstone Peptides',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description:
    'Managed services organization facilitating physician-prescribed peptide therapy through licensed compounding pharmacy partners.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Miami',
    addressRegion: 'FL',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    areaServed: 'US',
    availableLanguage: ['English', 'Spanish'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body className="bg-obsidian text-cream min-h-screen antialiased">
        <SchemaOrg schema={organizationSchema} />
        <CartProvider>
          <Navigation />
          <CartDrawer />
          <ExitIntentPopup />
          <main className="relative z-10 pt-24">{children}</main>
          <Footer />
          <DisclaimerBanner />
        </CartProvider>
      </body>
    </html>
  );
}
