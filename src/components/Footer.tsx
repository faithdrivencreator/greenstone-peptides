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
  { href: '/about', label: 'About Greenstone Peptides' },
  { href: '/provider', label: 'Provider Portal' },
  { href: '/wholesale', label: 'Wholesale & Distribution' },
  { href: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { href: '/safety', label: 'Safety Information' },
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
            <span className="font-cormorant text-2xl font-medium text-white">Greenstone Peptides</span>
            <span className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-gold mt-1">
              Peptide Solutions
            </span>
          </div>
          <p className="text-sm text-cream-dim leading-relaxed max-w-xs">
            USA-made peptide formulations. Third-party tested. Shipped direct to your door.
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
              aria-label="Follow Greenstone Peptides on Instagram"
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

      {/* Full disclaimer */}
      <div className="container-gr mt-16 pt-8 border-t border-gold/10">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold text-cream-dim/80 leading-relaxed tracking-wide mb-3">
            ALL PRODUCTS AND INFORMATION PROVIDED ON THIS WEBSITE ARE FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY.
          </p>
          <p className="text-xs text-cream-dim/80 leading-relaxed mb-3">
            The products offered on this website are furnished for in-vitro studies and research purposes only. In-vitro studies (Latin: in glass) are performed outside of the body. These products are not medicines or drugs and have not been approved by the FDA to prevent, treat, cure, or diagnose any medical condition, ailment, or disease. Bodily introduction of any kind into humans or animals is strictly forbidden by law.
          </p>
          <p className="text-xs text-cream-dim/80 leading-relaxed">
            Products are compounded by licensed USA pharmacies under USP 797 sterile standards. Greenstone Peptides facilitates access to compounded formulations and does not practice medicine. Must be 18 years or older to purchase.
          </p>
        </div>
        <p className="text-xs text-cream-dim/60 mt-8">
          &copy; {new Date().getFullYear()} Greenstone Peptides. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
