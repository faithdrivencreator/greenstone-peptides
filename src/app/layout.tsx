import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';
import '@/styles/globals.css';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { SchemaOrg } from '@/components/SchemaOrg';
import { CartProvider } from '@/context/CartContext';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { AgeGate } from '@/components/AgeGate';
import { ChatWidget } from '@/components/ChatWidget';

const cormorant = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const jetbrains = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Greenstone Wellness | USA-Compounded Peptide Therapy',
    template: 'Greenstone Wellness | %s',
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
    siteName: 'Greenstone Wellness',
    title: 'Greenstone Wellness | USA-Compounded Peptide Therapy',
    description:
      'Premium peptide therapy compounded in the USA under USP 797 sterile standards. Third-party tested. Temperature-controlled shipping.',
    images: [
      {
        url: '/images/hero-lab.png',
        width: 1376,
        height: 768,
        alt: 'Greenstone Wellness, USA-Compounded Peptide Therapy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Greenstone Wellness | USA-Compounded Peptide Therapy',
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
  name: 'Greenstone Wellness',
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
          <ExitIntentPopup />
          <main className="relative z-10 pt-24">{children}</main>
          <ChatWidget />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
