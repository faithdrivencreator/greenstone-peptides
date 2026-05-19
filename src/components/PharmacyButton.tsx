'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const PHARMACY_URL = process.env.NEXT_PUBLIC_PHARMACY_URL || 'https://bloom.greenstonerx.com';

type Props = {
  label?: string;
  variant?: 'primary' | 'inline' | 'compact';
  className?: string;
  showArrow?: boolean;
  showIcon?: boolean;
  trackId?: string;
  ariaLabel?: string;
};

/**
 * Pharmacy purchase deep-link, GATED on an active Greenstone Wellness account.
 *
 * Click behavior:
 *   - Signed in     → open the Greenstone Rx (Bloom) storefront in a new tab.
 *   - Not signed in → route to /login?next=pharmacy. After successful login,
 *                     the login page sends the user straight to the pharmacy
 *                     (same tab — new-tab opens post-login can be blocked).
 *   - Loading       → treat as not signed in (defaults to safer / gated path).
 *
 * The destination URL is per-account-manager and configured via
 * NEXT_PUBLIC_PHARMACY_URL in Netlify.
 */
export function PharmacyButton({
  label = 'Order from Pharmacy',
  variant = 'primary',
  className = '',
  showArrow = true,
  showIcon = false,
  trackId,
  ariaLabel,
}: Props) {
  const router = useRouter();
  const { status } = useSession();
  const signedIn = status === 'authenticated';

  const base = 'inline-flex items-center gap-2 transition-colors';
  const variants = {
    primary: 'btn btn-primary',
    inline:
      'font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald hover:text-emerald-light border border-emerald/40 hover:border-emerald/70 px-4 py-2.5',
    compact:
      'font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald hover:text-emerald-light px-3 py-1.5 border border-emerald/30 hover:border-emerald/60',
  };

  function handleClick(e: React.MouseEvent) {
    if (signedIn) {
      // Let the default <a target=_blank> behavior fire.
      return;
    }
    // Not signed in → bounce to login.
    e.preventDefault();
    router.push('/login?next=pharmacy');
  }

  // We render an <a> with href + target=_blank for signed-in users.
  // For signed-out users the onClick intercepts and routes to /login instead.
  // This preserves cmd-click / middle-click behavior for authenticated users.
  return (
    <a
      href={signedIn ? PHARMACY_URL : '/login?next=pharmacy'}
      target={signedIn ? '_blank' : undefined}
      rel={signedIn ? 'noopener noreferrer' : undefined}
      onClick={handleClick}
      data-track={trackId}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {showIcon && <ShoppingBag size={variant === 'compact' ? 11 : 14} />}
      <span>{label}</span>
      {showArrow && <ArrowRight size={variant === 'compact' ? 11 : 14} />}
    </a>
  );
}
