'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/learn', label: 'Learn' },
  { href: '/about', label: 'About' },
  { href: '/safety', label: 'Safety' },
  { href: '/provider', label: 'Provider Portal' },
  { href: '/contact', label: 'Contact' },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Sticky nav scroll listener — add .scrolled class after 20px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={clsx(
          'fixed inset-x-0 top-0 z-50 transition-all duration-200',
          scrolled
            ? 'bg-obsidian/85 backdrop-blur-xl border-b border-gold/15 py-3'
            : 'bg-transparent backdrop-blur-xl py-5 border-b border-transparent'
        )}
      >
        <div className="container-gr flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none" aria-label="Greenstone Peptides home">
            <span className="font-cormorant text-2xl font-medium text-white tracking-tight">
              Greenstone Peptides
            </span>
            <span className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-gold mt-1">
              Peptide Solutions
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={clsx(
                      'relative text-sm tracking-wide transition-colors',
                      active ? 'text-gold' : 'text-cream-dim hover:text-gold'
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-1.5 inset-x-0 h-px bg-gold" aria-hidden />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <Link href="/contact" className="hidden lg:inline-flex btn btn-primary">
            Get Started
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            className="lg:hidden p-2 text-cream z-[101]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={clsx(
          'fixed inset-0 z-40 lg:hidden flex flex-col items-center justify-center gap-8 bg-obsidian transition-transform duration-[400ms] ease-smooth',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!mobileOpen}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="font-cormorant text-3xl text-cream hover:text-gold transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <Link href="/contact" className="btn btn-primary mt-4">
          Get Started
        </Link>
      </div>
    </>
  );
}
