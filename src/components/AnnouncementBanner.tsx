import Link from 'next/link';
import { Truck } from 'lucide-react';

export function AnnouncementBanner() {
  return (
    <div
      className="fixed inset-x-0 top-0 z-[61] w-full bg-emerald/95 backdrop-blur-md border-b border-emerald-light/30"
      role="region"
      aria-label="Shipping availability announcement"
    >
      <div className="container-gr flex items-center justify-center gap-3 py-2 text-center">
        <Truck size={14} className="hidden sm:block shrink-0 text-cream" aria-hidden />
        <p className="font-jetbrains text-[0.65rem] sm:text-[0.7rem] tracking-[0.14em] uppercase text-cream leading-snug">
          <span className="font-semibold">Florida shipping only this week.</span>
          <span className="hidden sm:inline"> All 50 states unlocking in the next 7 days. </span>
          <span className="sm:hidden"> All states soon. </span>
          <Link
            href="/signup"
            className="underline underline-offset-2 decoration-cream/60 hover:decoration-cream font-semibold whitespace-nowrap"
          >
            Sign up for updates →
          </Link>
        </p>
      </div>
    </div>
  );
}
