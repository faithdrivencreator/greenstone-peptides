import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import '@/styles/globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { SchemaOrg } from '@/components/SchemaOrg';
import { CartProvider } from '@/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { AgeGate } from '@/components/AgeGate';
import { ChatWidget } from '@/components/ChatWidget';

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';

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
    images: [
      {
        url: '/images/hero-lab.png',
        width: 1376,
        height: 768,
        alt: 'Greenstone Peptides — USA-Compounded Peptide Therapy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Greenstone Peptides | USA-Compounded Peptide Therapy',
    description:
      'Premium peptide therapy compounded in the USA under USP 797 sterile standards. Third-party tested. Temperature-controlled shipping.',
    images: ['/images/hero-lab.png'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
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
        <AgeGate />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WP0ECFJPB8"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WP0ECFJPB8');
          `}
        </Script>
        <Script
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=pk_ec707a288a01d41d1b31745bb1ce1c0a0f"
          strategy="afterInteractive"
        />
        <SchemaOrg schema={organizationSchema} />
        <CartProvider>
          <Navigation />
          <CartDrawer />
          <ExitIntentPopup />
          <main className="relative z-10 pt-24">{children}</main>
          <ChatWidget />
          <Footer />
          <DisclaimerBanner />
        </CartProvider>
      </body>
    </html>
  );
}
