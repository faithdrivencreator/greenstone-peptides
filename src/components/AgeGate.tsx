'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 21+ age gate.
 *
 * Greenstone Wellness is a clinic + Florida 503A pharmacy storefront.
 * The actual phone-verified ID and intake happen on the pharmacy checkout
 * (Bloom Health). This gate is a soft top-of-funnel confirmation that the
 * visitor is at least 21 years old before browsing the formulary.
 *
 * Storage key bumped to `gr_age_verified_v3` so visitors previously gated
 * under the old research-use-only 3-checkbox flow are forced to re-affirm
 * under the simpler pharmacy framing.
 */
const STORAGE_KEY = 'gr_age_verified_v3';
const LEGACY_KEYS = ['gr_ruo_verified_v2', 'gr_age_verified_v1'];

export function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isVerified = false;
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') {
        isVerified = true;
      }
    } catch {
      isVerified = false;
    }
    setVerified(isVerified);
  }, []);

  useEffect(() => {
    if (verified === false) {
      const t = setTimeout(() => setVisible(true), 200);
      return () => clearTimeout(t);
    }
  }, [verified]);

  const handleConfirm = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      // Mirror to legacy keys so any latent component still reading old keys
      // (e.g. ExitIntentPopup) treats the visitor as verified.
      LEGACY_KEYS.forEach((k) => localStorage.setItem(k, 'true'));
    } catch {
      // localStorage blocked — proceed for this session
    }
    setExiting(true);
    setVisible(false);
    setTimeout(() => setVerified(true), 280);
  }, []);

  const handleLeave = useCallback(() => {
    window.location.href = 'https://www.google.com';
  }, []);

  // Lock body scroll while the gate is open
  useEffect(() => {
    if (verified === false) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [verified]);

  if (verified === null) return null;
  if (verified) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className={[
        'fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 transition-opacity duration-300',
        visible && !exiting ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      {/* Solid backdrop */}
      <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-md" aria-hidden />

      <div
        ref={dialogRef}
        className={[
          'relative w-full max-w-md bg-obsidian-mid border border-gold/25 shadow-2xl',
          'transform transition-all duration-300',
          visible && !exiting ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95',
        ].join(' ')}
      >
        {/* Top accent rule */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <div className="p-8 sm:p-10">
          {/* Eyebrow */}
          <p className="font-jetbrains text-emerald text-[0.6rem] tracking-[0.25em] uppercase mb-3">
            // Licensed Pharmacy · 21+
          </p>

          {/* Headline */}
          <h2
            id="age-gate-title"
            className="font-cormorant text-cream text-3xl sm:text-4xl leading-tight mb-3"
            style={{ fontWeight: 400 }}
          >
            Welcome.<br />
            <em className="italic text-gold">Are you 21 or older?</em>
          </h2>

          <p className="text-cream-dim text-sm leading-relaxed mb-8">
            Greenstone Wellness is the storefront of Greenstone Rx, a Florida-licensed
            503A compounding pharmacy. The formulary is restricted to patients 21 and over.
            Phone-verified identity and physician health screening happen at checkout.
          </p>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="button"
              onClick={handleLeave}
              className="px-5 py-2.5 border border-cream-dim/30 text-cream-dim font-jetbrains text-[0.7rem] tracking-widest uppercase hover:border-cream-dim/60 hover:text-cream transition-colors"
            >
              I&rsquo;m under 21
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="px-7 py-3.5 font-jetbrains text-xs tracking-widest uppercase bg-emerald hover:bg-emerald-light text-white shadow-lg shadow-emerald/30 transition-all cursor-pointer"
            >
              Yes, I&rsquo;m 21+ &rarr;
            </button>
          </div>

          {/* Footer fine print */}
          <p className="mt-7 pt-5 border-t border-cream-dim/10 font-jetbrains text-[0.55rem] tracking-[0.2em] uppercase text-cream-dim/50 leading-relaxed text-center">
            Greenstone Rx · Florida 503A Compounding Pharmacy
          </p>
        </div>
      </div>
    </div>
  );
}
