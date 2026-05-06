'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

const STORAGE_KEY = 'gr_disclaimer_dismissed_v1';

export function DisclaimerBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Important disclaimer"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-obsidian/95 backdrop-blur-xl"
    >
      <div className="container-gr flex items-start gap-4 py-3">
        <p className="flex-1 text-[11px] leading-relaxed text-cream-dim">
          All products are for research and educational purposes only. Not intended for human consumption. Compounded by licensed USA pharmacies under USP 797 sterile standards.{' '}
          <Link href="/safety" className="text-gold underline hover:text-gold-light">
            Read full disclaimer
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="p-1 text-cream-dim hover:text-gold"
          aria-label="Dismiss disclaimer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
