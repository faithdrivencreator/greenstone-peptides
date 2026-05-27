'use client';

import Link from 'next/link';
import { trackIgLinkClick } from '@/lib/gtag';

type IgLink = {
  href: string;
  title: string;
  sub: string;
  icon: string;
  destination: string;
  label: string;
};

type Promo = {
  href: string;
  code: string;
  headline: string;
  sub: string;
  destination: string;
  label: string;
};

export default function IgLinks({ promo, links }: { promo: Promo; links: IgLink[] }) {
  return (
    <section className="min-h-screen bg-obsidian text-cream flex justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-md">
        <div className="rounded-3xl overflow-hidden border border-white/5 bg-obsidian shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <header
            className="px-7 pt-12 pb-7 text-center border-b border-white/5"
            style={{
              background:
                'radial-gradient(800px 200px at 50% -50px, rgba(111,168,220,0.18), transparent 60%), radial-gradient(600px 200px at 50% 110%, rgba(26,158,110,0.10), transparent 60%), #0D1117',
            }}
          >
            <h1 className="font-cormorant text-[34px] font-medium leading-none tracking-[0.5px] text-cream">
              Greenstone
              <span className="italic text-emerald-light"> Wellness</span>
            </h1>
            <p className="mt-2.5 font-jetbrains text-[12.5px] uppercase tracking-[2px] text-cream-dim">
              Prescription compounding pharmacy · Florida
            </p>
            <div className="mt-4 inline-flex flex-wrap justify-center gap-1.5">
              {['503A Pharmacy', 'Physician-prescribed', 'USP 797 Sterile'].map((p) => (
                <span
                  key={p}
                  className="font-jetbrains text-[11px] tracking-[0.5px] text-blue-light bg-blue/[0.08] border border-blue/[0.18] rounded-full px-2.5 py-1"
                >
                  {p}
                </span>
              ))}
            </div>
          </header>

          <Link
            href={promo.href}
            onClick={() => trackIgLinkClick({ destination: promo.destination, label: promo.label })}
            className="mx-5 mt-5 mb-2 flex items-center gap-3 p-4 rounded-xl border border-emerald/30 hover:border-emerald-light/60 transition-all hover:-translate-y-[1px]"
            style={{
              background:
                'linear-gradient(135deg, rgba(26,158,110,0.14), rgba(111,168,220,0.10))',
            }}
          >
            <span className="font-jetbrains text-[13px] font-semibold text-emerald-light bg-emerald/20 border border-dashed border-emerald-light/50 px-2.5 py-1.5 rounded-md whitespace-nowrap">
              {promo.code}
            </span>
            <span className="text-[14px] leading-snug text-cream">
              {promo.headline}
              <small className="block text-cream-dim text-[11.5px] mt-0.5">{promo.sub}</small>
            </span>
          </Link>

          <div className="px-5 pt-3 pb-6 flex flex-col gap-2.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => trackIgLinkClick({ destination: link.destination, label: link.label })}
                className="group flex items-center gap-3.5 bg-obsidian-mid border border-white/5 rounded-[10px] px-4 py-3.5 hover:bg-obsidian-light hover:border-blue/35 hover:-translate-y-[1px] transition-all"
              >
                <span className="w-9 h-9 rounded-lg grid place-items-center bg-blue/10 border border-blue/20 flex-shrink-0 font-jetbrains text-sm text-blue-light">
                  {link.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-medium tracking-[0.1px] text-cream">
                    {link.title}
                  </div>
                  <div className="text-[12px] text-cream-dim mt-0.5">{link.sub}</div>
                </span>
                <span className="text-cream-dim text-lg group-hover:text-blue-light transition-colors">
                  ›
                </span>
              </Link>
            ))}
          </div>

          <footer className="text-center px-5 py-4 border-t border-white/5">
            <div className="font-jetbrains text-[11px] tracking-[1px] text-cream-dim opacity-80">
              gswellnesspharmacy.com
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
