import { TrustRibbon } from '@/components/TrustRibbon';
import { Navigation } from '@/components/Navigation';
import { ChatWidget } from '@/components/ChatWidget';
import { Footer } from '@/components/Footer';

/**
 * Wraps every page in the standard dark-site chrome (trust ribbon, nav,
 * chat widget, footer) and a top-padded <main>.
 *
 * Kept as its own component (decoupled from the root layout) so we can swap
 * shells later without rebuilding the root tree — e.g. when we add a real
 * CSS-variable theme refactor for light mode.
 *
 * NOTE: ExitIntentPopup was removed — promised "10% off" that can't be
 * honored since Greenstone Rx (Bloom) processes checkout and doesn't
 * accept our coupon codes.
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
