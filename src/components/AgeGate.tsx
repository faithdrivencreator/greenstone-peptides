'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Full-screen RUO click-wrap acknowledgment.
 *
 * Three affirmative checkboxes are required before the "Enter Site" button
 * activates:
 *   1. I am 21 years of age or older.
 *   2. I acknowledge these products are sold strictly for research and
 *      educational use only — not for human or animal consumption.
 *   3. I assume all liability for the handling and use of these compounds.
 *
 * Storage key bumped to `gr_ruo_verified_v2` so previously-confirmed 18+
 * visitors are forced to re-affirm under the new terms.
 *
 * ExitIntentPopup reads `gr_age_verified_v1`, so we mirror to that key for
 * backwards compatibility once all three boxes are checked.
 */
const STORAGE_KEY = 'gr_ruo_verified_v2';
const LEGACY_KEY = 'gr_age_verified_v1';

export function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [check21, setCheck21] = useState(false);
  const [checkRuo, setCheckRuo] = useState(false);
  const [checkLiability, setCheckLiability] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const allChecked = check21 && checkRuo && checkLiability;

  useEffect(() => {
    let isVerified = false;
    try {
      isVerified = localStorage.getItem(STORAGE_KEY) === 'true';
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
    if (!allChecked) return;
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      localStorage.setItem(LEGACY_KEY, 'true');
    } catch {
      // localStorage blocked — proceed for this session
    }
    setExiting(true);
    setVisible(false);
    setTimeout(() => setVerified(true), 280);
  }, [allChecked]);

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
      aria-labelledby="ruo-gate-title"
      className={[
        'fixed inset-0 z-[100] flex items-center justify-center px-4 py-8 transition-opacity duration-300',
        visible && !exiting ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      {/* Solid backdrop — hard gate, not a soft banner */}
      <div className="absolute inset-0 bg-obsidian/95 backdrop-blur-md" aria-hidden />

      <div
        ref={dialogRef}
        className={[
          'relative w-full max-w-xl bg-obsidian-mid border border-gold/25 shadow-2xl',
          'transform transition-all duration-300',
          visible && !exiting ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95',
        ].join(' ')}
      >
        {/* Top accent rule */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <div className="p-8 sm:p-10">
          {/* Eyebrow */}
          <p className="font-jetbrains text-emerald text-[0.6rem] tracking-[0.25em] uppercase mb-3">
            // Restricted Access · 21+
          </p>

          {/* Headline */}
          <h2
            id="ruo-gate-title"
            className="font-cormorant text-cream text-3xl sm:text-4xl leading-tight mb-3"
            style={{ fontWeight: 400 }}
          >
            Restricted Access.<br />
            <em className="italic text-gold">Research-grade compounds.</em>
          </h2>

          <p className="text-cream-dim text-sm leading-relaxed mb-7">
            All Greenstone Wellness products are sold strictly for research and
            educational use only. Confirm the following to enter the catalog.
          </p>

          {/* The three affirmations */}
          <div className="space-y-4 mb-7">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={check21}
                onChange={(e) => setCheck21(e.target.checked)}
                className="mt-1 w-4 h-4 accent-emerald cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-cream leading-snug group-hover:text-white transition-colors">
                I am <strong>21 years of age or older</strong>.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checkRuo}
                onChange={(e) => setCheckRuo(e.target.checked)}
                className="mt-1 w-4 h-4 accent-emerald cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-cream leading-snug group-hover:text-white transition-colors">
                I acknowledge that all products are sold strictly for{' '}
                <strong>research and educational use only</strong> — not for human
                or animal consumption, medical, or veterinary use.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checkLiability}
                onChange={(e) => setCheckLiability(e.target.checked)}
                className="mt-1 w-4 h-4 accent-emerald cursor-pointer flex-shrink-0"
              />
              <span className="text-sm text-cream leading-snug group-hover:text-white transition-colors">
                I <strong>assume all liability</strong> for the handling, storage,
                and use of these compounds.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="button"
              onClick={handleLeave}
              className="px-5 py-2.5 border border-cream-dim/30 text-cream-dim font-jetbrains text-[0.7rem] tracking-widest uppercase hover:border-cream-dim/60 hover:text-cream transition-colors"
            >
              Leave site
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!allChecked}
              className={[
                'px-7 py-3.5 font-jetbrains text-xs tracking-widest uppercase transition-all shadow-lg',
                allChecked
                  ? 'bg-emerald hover:bg-emerald-light text-white shadow-emerald/30 cursor-pointer'
                  : 'bg-emerald/20 text-cream-dim/40 shadow-none cursor-not-allowed',
              ].join(' ')}
            >
              Enter Catalog &rarr;
            </button>
          </div>

          {/* Footer fine print */}
          <p className="mt-7 pt-5 border-t border-cream-dim/10 font-jetbrains text-[0.55rem] tracking-[0.2em] uppercase text-cream-dim/50 leading-relaxed text-center">
            For Research Use Only · Not For Human Consumption
          </p>
        </div>
      </div>
    </div>
  );
}
