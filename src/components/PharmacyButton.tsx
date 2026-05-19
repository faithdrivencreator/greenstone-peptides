import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const PHARMACY_URL = process.env.NEXT_PUBLIC_PHARMACY_URL || 'https://bloom.greenstonerx.com';

type Props = {
  label?: string;
  variant?: 'primary' | 'inline' | 'compact';
  className?: string;
  showArrow?: boolean;
  showIcon?: boolean;
  trackId?: string;
};

/**
 * Pharmacy purchase deep-link.
 *
 * Visitors browse the catalog on greenstonewellness.store, but every purchase
 * happens at the Greenstone Rx pharmacy (powered by Bloom Health) where the
 * customer goes through phone verification, medical assessment, and
 * prescriber review before payment. We never handle PHI or process payment.
 *
 * The destination URL is per-account-manager (Pete's DTP link). Configure via
 * NEXT_PUBLIC_PHARMACY_URL in Netlify.
 */
export function PharmacyButton({
  label = 'Order from Pharmacy',
  variant = 'primary',
  className = '',
  showArrow = true,
  showIcon = false,
  trackId,
}: Props) {
  const base = 'inline-flex items-center gap-2 transition-colors';
  const variants = {
    primary: 'btn btn-primary',
    inline:
      'font-jetbrains text-[0.65rem] tracking-widest uppercase text-emerald hover:text-emerald-light border border-emerald/40 hover:border-emerald/70 px-4 py-2.5',
    compact:
      'font-jetbrains text-[0.6rem] tracking-widest uppercase text-emerald hover:text-emerald-light px-3 py-1.5 border border-emerald/30 hover:border-emerald/60',
  };

  return (
    <Link
      href={PHARMACY_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-track={trackId}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {showIcon && <ShoppingBag size={variant === 'compact' ? 11 : 14} />}
      <span>{label}</span>
      {showArrow && <ArrowRight size={variant === 'compact' ? 11 : 14} />}
    </Link>
  );
}
