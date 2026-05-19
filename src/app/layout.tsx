import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import Script from 'next/script';
import '@/styles/globals.css';
import { Navigation } from '@/components/Navigation';
import { TrustRibbon } from '@/components/TrustRibbon';
import { Footer } from '@/components/Footer';
import { SchemaOrg } from '@/components/SchemaOrg';
import { CartProvider } from '@/context/CartContext';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { AgeGate } from '@/components/AgeGate';
import { ChatWidget } from '@/components/ChatWidget';
import { SessionProviderWrapper } from '@/components/SessionProviderWrapper';
import { MaintenancePage } from '@/components/MaintenancePage';
// PrescriptionRequestDrawer is intentionally not rendered — all checkout
// happens on the pharmacy storefront (Bloom). CartProvider stays so any
// component that still imports useCart compiles, but the drawer UI is dead.

const MAINTENANCE_MODE = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

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
    default: 'Greenstone Wellness | Physician-Prescribed GLP-1, Peptide & Men\'s Therapy',
    template: 'Greenstone Wellness | %s',
  },
  description:
    'Compounded GLP-1, peptide, and oral therapy prescribed by a licensed physician and dispensed by Greenstone Rx, a Florida 503A pharmacy. Physician-reviewed, USP 797 sterile compounded, specialized temperature-controlled packaging.',
  keywords: [
    'compounded GLP-1',
    'compounded semaglutide',
    'compounded tirzepatide',
    'compounded peptides',
    'telehealth pharmacy',
    'Florida 503A pharmacy',
    'BPC-157',
    'sermorelin',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Greenstone Wellness',
    title: 'Greenstone Wellness | Physician-Prescribed GLP-1, Peptide & Men\'s Therapy',
    description:
      'Compounded medication, prescribed by a licensed physician, dispensed by Greenstone Rx — a Florida-licensed 503A compounding pharmacy.',
    images: [
      {
        url: '/images/hero-lab.png',
        width: 1376,
        height: 768,
        alt: 'Greenstone Wellness, Florida 503A Compounding Pharmacy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Greenstone Wellness | Physician-Prescribed GLP-1, Peptide & Men\'s Therapy',
    description:
      'Compounded medication, prescribed by a licensed physician, dispensed by Greenstone Rx — a Florida-licensed 503A compounding pharmacy.',
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
    'Florida-licensed clinic and 503A compounding pharmacy. Physician-prescribed GLP-1, peptide, and oral therapy, compounded under USP 797 sterile standards.',
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
  // Maintenance takeover — single full-bleed page, no nav/footer/chat/agegate.
  // Toggle off by setting NEXT_PUBLIC_MAINTENANCE_MODE=false (or removing it)
  // in Netlify env and redeploying.
  if (MAINTENANCE_MODE) {
    return (
      <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${jetbrains.variable}`}>
        <head>
          <meta name="robots" content="noindex,nofollow" />
        </head>
        <body className="bg-obsidian text-cream min-h-screen antialiased">
          <MaintenancePage />
        </body>
      </html>
    );
  }

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
        <SessionProviderWrapper>
          <CartProvider>
            <TrustRibbon />
            <Navigation />
            <ExitIntentPopup />
            <main className="relative z-10 pt-[8.25rem]">{children}</main>
            <ChatWidget />
            <Footer />
          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
