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
    default: 'Greenstone Peptides | USA-Compounded Peptide Therapy',
    template: 'Greenstone Peptides | %s',
  },
  description:
    'Premium peptide therapy compounded in the USA under USP 797 sterile standards. Third-party tested for potency, sterility, and purity. Temperature-controlled shipping.',
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
    title: 'Greenstone Peptides | USA-Compounded Peptide Therapy',
    description:
      'Premium peptide therapy compounded in the USA under USP 797 sterile standards. Third-party tested. Temperature-controlled shipping.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Greenstone Peptides | USA-Compounded Peptide Therapy',
    description:
      'Premium peptide therapy compounded in the USA under USP 797 sterile standards. Third-party tested. Temperature-controlled shipping.',
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
    'Premium peptide therapy compounded in the USA under USP 797 sterile standards by licensed pharmacy partners with 25+ years of pharmaceutical care.',
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
