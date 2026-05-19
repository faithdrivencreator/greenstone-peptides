import Link from 'next/link';
import { Instagram } from 'lucide-react';

const SHOP_LINKS = [
  { href: '/shop?category=weight-management', label: 'Weight Management' },
  { href: '/shop?category=recovery', label: 'Recovery & Repair' },
  { href: '/shop?category=longevity', label: 'Longevity' },
  { href: '/shop?category=cognitive', label: 'Cognitive' },
  { href: '/shop', label: 'All Products' },
];

const RESOURCE_LINKS = [
  { href: '/learn', label: 'Learn Center' },
  { href: '/about', label: 'About Greenstone Wellness' },
  { href: '/provider', label: 'Provider Portal' },
  { href: '/wholesale', label: 'Wholesale & Distribution' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/research-use-only', label: 'How Compounded Medications Work' },
  { href: '/safety', label: 'Safety Information' },
  { href: '/shipping', label: 'Shipping & Returns' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-gold/15 bg-obsidian-mid/40 pt-20 pb-10 mt-32">
      <div className="container-gr grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand column */}
        <div className="space-y-4">
          <div className="flex flex-col leading-none">
            <span className="font-cormorant text-2xl font-medium text-white">Greenstone Wellness</span>
          </div>
          <p className="text-sm text-cream-dim leading-relaxed max-w-xs">
            Florida-licensed 503A compounding pharmacy. Physician-prescribed GLP-1, peptide, and oral therapy.
          </p>
          <div className="text-sm text-cream-dim space-y-1 pt-2">
            <p>Miami, Florida</p>
            <p className="pt-2">
              <a href="/contact" className="hover:text-gold transition-colors">
                Contact Us →
              </a>
            </p>
          </div>
          <div className="pt-2">
            <a
              href="https://instagram.com/greenstone.wellness"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Greenstone Wellness on Instagram"
              className="inline-flex items-center gap-2 text-sm text-cream-dim hover:text-gold transition-colors"
            >
              <Instagram size={18} />
              <span>@greenstone.wellness</span>
            </a>
          </div>
        </div>

        {/* Shop links */}
        <nav aria-label="Shop">
          <h4 className="mono !text-gold mb-5">Shop</h4>
          <ul className="space-y-3">
            {SHOP_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-cream-dim hover:text-gold transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Resources */}
        <nav aria-label="Resources">
          <h4 className="mono !text-gold mb-5">Resources</h4>
          <ul className="space-y-3">
            {RESOURCE_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-cream-dim hover:text-gold transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Legal */}
        <nav aria-label="Legal">
          <h4 className="mono !text-gold mb-5">Legal</h4>
          <ul className="space-y-3">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-cream-dim hover:text-gold transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container-gr mt-16 pt-8 border-t border-gold/10 space-y-3">
        <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald/80">
          // Powered by{' '}
          <a
            href="https://greenstonerx.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-emerald-light transition-colors"
          >
            Greenstone Rx Pharmacy
          </a>
        </p>
        <p className="text-[11px] leading-relaxed text-cream-dim/50 max-w-3xl">
          All orders are fulfilled by Greenstone Rx, a licensed USA compounding pharmacy.
          Treatment is prescribed by a licensed physician after a phone-verified health
          screening completed at checkout.
        </p>
        <p className="text-[10px] leading-relaxed text-cream-dim/45 max-w-3xl">
          Compounded medications are prepared by a licensed pharmacy for a specific patient pursuant to a valid prescription. They are not FDA-approved drug products. Individual results vary. Speak with the prescribing physician about whether a given medication is appropriate for you.{' '}
          <Link href="/safety" className="underline underline-offset-2 hover:text-cream-dim transition-colors">
            Read full safety information
          </Link>
          .
        </p>
        <p className="text-xs text-cream-dim/60">
          &copy; {new Date().getFullYear()} Greenstone Wellness. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
