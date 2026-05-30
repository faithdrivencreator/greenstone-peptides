import { TrustRibbon } from '@/components/TrustRibbon';
import { Navigation } from '@/components/Navigation';
import { ChatWidget } from '@/components/ChatWidget';
import { Footer } from '@/components/Footer';

/**
 * Wraps every page in the standard dark-site chrome (trust ribbon, nav,
 * chat widget, footer) and a top-padded <main>.
 *
 * AnnouncementBanner was removed once all 50 states unlocked (out-of-state
 * order capture went live 2026-05-30). Top padding reduced accordingly.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TrustRibbon />
      <Navigation />
      <main id="main-content" className="relative z-10 pt-[8.25rem]">{children}</main>
      <ChatWidget />
      <Footer />
    </>
  );
}
