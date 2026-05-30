import Link from 'next/link';
import Image from 'next/image';
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
  { href: '/about', label: 'About GS Wellness Pharmacy' },
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
          <div className="flex items-center gap-3 leading-none">
            <Image
              src="/icon.png"
              alt=""
              width={1024}
              height={1024}
              className="h-12 w-12 shrink-0"
            />
            <span className="font-cormorant text-2xl font-medium text-white">GS Wellness Pharmacy</span>
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
              aria-label="Follow GS Wellness Pharmacy on Instagram"
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

      <div className="container-gr mt-16 pt-8 border-t border-gold/10 space-y-5">
        {/* Dense compliance disclaimer — required fine print covering clinic /
            pharmacy / FDA / trademark / testimonial boundaries. */}
        <p className="text-[0.65rem] leading-relaxed text-cream-dim/80 max-w-4xl font-jetbrains">
          The assessment available on GS Wellness Pharmacy does not create a
          doctor–patient relationship. Clinical services are provided by
          Greenstone Rx and partnered networks of U.S.-licensed clinicians who
          determine prescription eligibility based on medical history and
          assessment responses. Providers retain full discretion to prescribe or
          decline compounded medications. Compounded medications offered through
          GS Wellness Pharmacy are prepared in 503A licensed compounding
          pharmacies but are not FDA-approved and have not been evaluated by the
          FDA for safety, efficacy, or quality. Results may vary and depend on
          individual adherence, provider guidance, and lifestyle changes.
          GS Wellness Pharmacy does not manufacture compounded medications,
          and product appearance may differ from website images.
          GS Wellness Pharmacy partners with licensed U.S. pharmacies to
          ensure high standards of safety and quality. Ozempic&reg;, Mounjaro&reg;,
          and Wegovy&reg; are FDA-approved trademarks of their respective owners.
          All other trademarks are the property of their respective owners.
          Unless otherwise noted, testimonials reflect similar telehealth brands
          and patient experiences rather than peer-reviewed clinical studies.{' '}
          <Link
            href="/safety"
            className="underline underline-offset-2 hover:text-cream-dim transition-colors"
          >
            Read full safety information
          </Link>
          .
        </p>

        {/* Co-brand attribution to the pharmacy partner. */}
        <p className="text-[11px] leading-relaxed text-cream-dim/70">
          Pharmacy partner:{' '}
          <strong className="text-emerald font-semibold">Greenstone Rx</strong>{' '}
          &middot; 503A Compounding Pharmacy &middot; Licensed in Florida
        </p>

        <p className="text-xs text-cream-dim/60">
          &copy; {new Date().getFullYear()} GS Wellness Pharmacy. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
