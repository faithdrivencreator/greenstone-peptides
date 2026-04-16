import Link from 'next/link';

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
  { href: '/hipaa', label: 'HIPAA Notice' },
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
            USA-compounded peptide therapy. Third-party tested under USP 797 sterile standards by licensed pharmacy partners with 25+ years of pharmaceutical care.
          </p>
          <div className="text-sm text-cream-dim space-y-1 pt-2">
            <p>Miami, Florida</p>
            <p className="pt-2">
              <a href="/contact" className="hover:text-gold transition-colors">
                Contact Us →
              </a>
            </p>
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
        <p className="text-xs text-cream-dim/80 leading-relaxed max-w-4xl">
          <strong className="text-cream">Important:</strong> Compounded medications are not FDA-approved and are prepared by licensed compounding pharmacies. These statements have not been evaluated by the FDA. Products are not intended to diagnose, treat, cure, or prevent any disease. Greenstone Peptides facilitates access to USA-compounded formulations through licensed pharmacy partners.
        </p>
        <p className="text-xs text-cream-dim/60 mt-8">
          &copy; {new Date().getFullYear()} Greenstone Peptides. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
