'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Menu, X, Lock, ChevronDown } from 'lucide-react';
import { AccountNavLink } from '@/components/AccountNavLink';

/** Top-level links, in display order. The Shop / Treatments pair both serve
 *  the catalog but Treatments routes through the explainer landing pages first
 *  (matches Bloom's funnel structure on our side). */
const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/learn', label: 'Learn' },
  { href: '/about', label: 'About' },
  { href: '/safety', label: 'Safety' },
  { href: '/provider', label: 'Provider Portal' },
  { href: '/contact', label: 'Contact' },
];

/** Treatments sub-links — rendered inline in the desktop dropdown and the
 *  mobile drawer's expandable section. */
const TREATMENT_LINKS = [
  { href: '/treatments/weight-loss', label: 'Weight Loss' },
  { href: '/treatments/peptides', label: 'Peptides' },
  { href: '/treatments/longevity', label: 'Longevity' },
  { href: '/treatments/mens-ed', label: "Men's ED" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const pathname = usePathname();

  function handleTouchStart(e: React.TouchEvent) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    // Swipe up >60px OR swipe right >60px closes the drawer
    if (dy < -60 || dx > 60) setMobileOpen(false);
    touchStartRef.current = null;
  }

  function handleBackgroundClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) setMobileOpen(false);
  }

  // Sticky nav scroll listener, add .scrolled class after 20px
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
          'fixed inset-x-0 top-[4.5rem] z-50 transition-all duration-200',
          scrolled
            ? 'bg-obsidian/85 backdrop-blur-xl border-b border-gold/15 py-3'
            : 'bg-transparent backdrop-blur-xl py-5 border-b border-transparent'
        )}
      >
        <div className="container-gr flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none" aria-label="GS Wellness Pharmacy home">
            <span className="font-cormorant text-2xl font-medium text-white tracking-tight">
              GS Wellness Pharmacy
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');

              // Treatments dropdown — inserted right after Shop.
              if (link.href === '/shop') {
                return (
                  <Fragment key={link.href}>
                    <li>
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
                    <li className="relative group/treat">
                      <button
                        type="button"
                        className={clsx(
                          'inline-flex items-center gap-1 text-sm tracking-wide transition-colors',
                          pathname.startsWith('/treatments') ? 'text-gold' : 'text-cream-dim hover:text-gold'
                        )}
                        aria-haspopup="true"
                      >
                        Treatments
                        <ChevronDown size={13} className="transition-transform group-hover/treat:rotate-180 group-focus-within/treat:rotate-180" />
                        {pathname.startsWith('/treatments') && (
                          <span className="absolute -bottom-1.5 inset-x-0 h-px bg-gold" aria-hidden />
                        )}
                      </button>
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover/treat:opacity-100 group-hover/treat:visible group-focus-within/treat:opacity-100 group-focus-within/treat:visible transition-all duration-150"
                      >
                        <ul className="bg-obsidian/95 backdrop-blur-xl border border-emerald/25 shadow-2xl min-w-[200px] py-2">
                          {TREATMENT_LINKS.map((t) => {
                            const tActive = pathname === t.href;
                            return (
                              <li key={t.href}>
                                <Link
                                  href={t.href}
                                  className={clsx(
                                    'block px-5 py-2.5 text-sm transition-colors',
                                    tActive ? 'text-gold bg-emerald/10' : 'text-cream-dim hover:text-gold hover:bg-emerald/5'
                                  )}
                                >
                                  {t.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </li>
                  </Fragment>
                );
              }

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

          {/* Account link, desktop */}
          <AccountNavLink variant="desktop" />

          {/* Wholesale login, desktop */}
          <Link
            href="/wholesale/login"
            className="hidden lg:inline-flex items-center gap-1.5 font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald hover:text-emerald-light border border-emerald/30 hover:border-emerald/60 px-3 py-2 transition-colors"
          >
            <Lock size={10} />
            Distributor Login
          </Link>

          {/* Nav-level pharmacy CTA intentionally removed — visitors must
              create an account and select a product before the pharmacy
              deep-link surfaces (on the product detail page). */}

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
          'fixed inset-0 z-[55] lg:hidden bg-obsidian overflow-y-auto overscroll-contain transition-transform duration-[400ms] ease-smooth',
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-hidden={!mobileOpen}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          onClick={handleBackgroundClick}
          className="min-h-full flex flex-col items-center gap-7 px-6 pt-24 pb-40"
        >
          {NAV_LINKS.map((link) => {
            // Insert the Treatments expandable group right after Shop in the
            // mobile drawer. Uses semantic <details> for collapse — no JS
            // state, fully accessible by default.
            if (link.href === '/shop') {
              return (
                <Fragment key={link.href}>
                  <Link
                    href={link.href}
                    className="font-cormorant text-3xl text-cream hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                  <details className="group/m-treat w-full max-w-xs">
                    <summary className="font-cormorant text-3xl text-cream hover:text-gold transition-colors cursor-pointer list-none flex items-center justify-center gap-2">
                      Treatments
                      <ChevronDown size={20} className="text-emerald transition-transform group-open/m-treat:rotate-180" />
                    </summary>
                    <ul className="mt-5 flex flex-col items-center gap-4">
                      {TREATMENT_LINKS.map((t) => (
                        <li key={t.href}>
                          <Link
                            href={t.href}
                            className="font-jetbrains text-sm tracking-wider uppercase text-cream-dim hover:text-gold transition-colors"
                          >
                            {t.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </Fragment>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-cormorant text-3xl text-cream hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
          <AccountNavLink variant="mobile" />
          <Link
            href="/wholesale/login"
            className="inline-flex items-center gap-2 font-jetbrains text-xs tracking-widest uppercase text-emerald hover:text-emerald-light transition-colors"
          >
            <Lock size={11} />
            Distributor Login
          </Link>
        </div>
      </div>
    </>
  );
}
