'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * AgeConfirmBanner — soft single-click 18+ confirmation.
 *
 * Replaces the previous full-screen DOB modal with a low-friction
 * bottom-anchored banner. Page content is visible behind a 50% dimmer
 * (pointer-events: none — the user can scroll/look around). One click
 * dismisses; "Leave site" redirects to google.com.
 *
 * Storage shape (DO NOT change — ExitIntentPopup reads `=== 'true'`):
 *   localStorage['gr_age_verified_v1'] = 'true'
 *
 * Exported as `AgeGate` to keep layout.tsx imports stable.
 */
export function AgeGate() {
  // null = haven't checked storage yet (avoid flash on returning visits)
  const [verified, setVerified] = useState<boolean | null>(null);
  // Drives the slide-up entrance and slide-down exit
  const [visible, setVisible] = useState(false);
  // Drives unmount after the exit animation
  const [exiting, setExiting] = useState(false);
  const primaryBtnRef = useRef<HTMLButtonElement | null>(null);

  // Read storage on mount
  useEffect(() => {
    let isVerified = false;
    try {
      isVerified = localStorage.getItem('gr_age_verified_v1') === 'true';
    } catch {
      // SSR / privacy mode — fail open and show the banner
      isVerified = false;
    }
    setVerified(isVerified);
  }, []);

  // Schedule the slide-up entrance 300ms after we confirm we need to show
  useEffect(() => {
    if (verified === false) {
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    }
  }, [verified]);

  // Focus the primary button once it's on-screen so Enter dismisses
  useEffect(() => {
    if (visible && !exiting && primaryBtnRef.current) {
      primaryBtnRef.current.focus();
    }
  }, [visible, exiting]);

  const handleConfirm = useCallback(() => {
    try {
      localStorage.setItem('gr_age_verified_v1', 'true');
    } catch {
      // localStorage blocked — proceed anyway, banner dismisses for this session
    }
    setExiting(true);
    setVisible(false);
    // Unmount after the slide-down finishes (matches the 250ms exit transition)
    setTimeout(() => setVerified(true), 280);
  }, []);

  const handleLeave = useCallback(() => {
    window.location.href = 'https://www.google.com';
  }, []);

  // ESC = "yes, I'm 18+" (treat as confirm — it's a soft banner)
  useEffect(() => {
    if (verified !== false) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleConfirm();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [verified, handleConfirm]);

  // Don't render until storage is read (no flash) or once confirmed
  if (verified === null) return null;
  if (verified) return null;

  return (
    <>
      {/* Backdrop dimmer — visual only. pointer-events: none so the page
          beneath stays interactive (scroll, hover); only the banner itself
          captures clicks. This is a soft banner, not a hard modal. */}
      <div
        aria-hidden="true"
        className={[
          'pointer-events-none fixed inset-0 z-[90] bg-black transition-opacity duration-300 ease-out',
          visible && !exiting ? 'opacity-50' : 'opacity-0',
        ].join(' ')}
      />

      {/* Banner */}
      <div
        role="region"
        aria-label="Age confirmation"
        aria-live="polite"
        className={[
          'fixed inset-x-0 bottom-0 z-[100] transform transition-all',
          visible && !exiting
            ? 'translate-y-0 opacity-100 duration-[350ms] ease-out'
            : 'translate-y-full opacity-0 duration-[250ms] ease-in',
        ].join(' ')}
      >
        {/* Thin gold rule — brand accent above the banner */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        <div className="bg-obsidian-mid/95 backdrop-blur-md border-t border-gold/20">
          <div className="mx-auto max-w-6xl px-5 py-5 md:px-8 md:py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-8">
              {/* Left: copy */}
              <div className="flex-1 min-w-0">
                <p className="font-cormorant italic text-lg md:text-xl text-cream leading-snug">
                  Confirm you&rsquo;re 18 or older to continue.
                </p>
                <p className="mt-1.5 font-jetbrains text-[0.65rem] tracking-[0.15em] uppercase text-cream-dim/70 leading-relaxed">
                  Greenstone products are for research and educational use only.
                </p>
              </div>

              {/* Right: buttons. Stack on mobile, side-by-side on md+. */}
              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:gap-3 md:flex-shrink-0">
                <button
                  type="button"
                  onClick={handleLeave}
                  className="px-5 py-2.5 border border-cream-dim/30 text-cream-dim font-jetbrains text-[0.7rem] tracking-widest uppercase hover:border-cream-dim/60 hover:text-cream transition-colors"
                >
                  Leave site
                </button>
                <button
                  ref={primaryBtnRef}
                  type="button"
                  onClick={handleConfirm}
                  autoFocus
                  className="px-7 py-3.5 bg-emerald hover:bg-emerald-light text-white font-jetbrains text-xs tracking-widest uppercase transition-colors shadow-lg shadow-emerald/20"
                >
                  I&rsquo;m 18 or older &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
