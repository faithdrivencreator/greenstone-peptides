import { TrustRibbon } from '@/components/TrustRibbon';
import { Navigation } from '@/components/Navigation';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { ChatWidget } from '@/components/ChatWidget';
import { Footer } from '@/components/Footer';

/**
 * Wraps every page in the standard dark-site chrome (trust ribbon, nav,
 * exit-intent, chat widget, footer) and a top-padded <main>.
 *
 * Kept as its own component (decoupled from the root layout) so we can swap
 * shells later without rebuilding the root tree — e.g. when we add a real
 * CSS-variable theme refactor for light mode.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TrustRibbon />
      <Navigation />
      <ExitIntentPopup />
      <main className="relative z-10 pt-[8.25rem]">{children}</main>
      <ChatWidget />
      <Footer />
    </>
  );
}
