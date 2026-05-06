'use client';

import { useEffect, useState, useRef } from 'react';
import { X, Lock } from 'lucide-react';
import { subscribeToKlaviyo } from '@/lib/klaviyo';

const STORAGE_KEY = 'grx-exit-popup-dismissed';
const DISMISS_DAYS = 7;

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    // Never show popup until age gate is verified
    try {
      if (localStorage.getItem('gr_age_verified_v1') !== 'true') return;
    } catch {}

    // Check if dismissed within suppression window
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const dismissedAt = parseInt(stored, 10);
        const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
        if (daysSince < DISMISS_DAYS) return;
      }
    } catch {}

    // Desktop: exit intent on mouse leaving viewport toward top
    const handleMouseLeave = (e: MouseEvent) => {
      if (triggered.current) return;
      if (e.clientY <= 5) {
        triggered.current = true;
        setVisible(true);
      }
    };

    // Mobile: show after 45 seconds of session
    const mobileTimer = window.innerWidth < 1024
      ? setTimeout(() => {
          if (!triggered.current) {
            triggered.current = true;
            setVisible(true);
          }
        }, 45000)
      : null;

    // Also show after 60% scroll depth on any device
    const handleScroll = () => {
      if (triggered.current) return;
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.6) {
        triggered.current = true;
        setVisible(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      if (mobileTimer) clearTimeout(mobileTimer);
    };
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  function dismiss() {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, Date.now().toString()); } catch {}
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeToKlaviyo(email, 'Exit Intent Popup');
    } finally {
      setLoading(false);
      setSubmitted(true);
      try { localStorage.setItem(STORAGE_KEY, Date.now().toString()); } catch {}
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[90] bg-obsidian/85 backdrop-blur-sm"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Exclusive offer"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div className="relative w-full max-w-lg bg-obsidian-mid border border-emerald/30 overflow-hidden">
          {/* Close */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-cream-dim/50 hover:text-cream transition-colors z-10"
            aria-label="Close offer"
          >
            <X size={18} />
          </button>

          {/* Top emerald accent bar */}
          <div className="h-1 w-full bg-emerald" />

          <div className="p-8 md:p-10">
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-14 h-14 border border-emerald/30 flex items-center justify-center mx-auto"
                  style={{ background: 'rgba(26,158,110,0.1)' }}>
                  <span className="text-emerald text-2xl font-cormorant font-semibold">✓</span>
                </div>
                <h3 className="font-cormorant text-3xl text-white">Your code is ready.</h3>
                <p className="text-cream-dim text-sm">Use code below at checkout:</p>
                <div className="bg-obsidian border border-emerald/40 px-6 py-4 text-center my-4">
                  <span className="font-jetbrains text-2xl tracking-[0.3em] text-emerald font-bold">CLINICAL30</span>
                </div>
                <p className="text-xs text-cream-dim/60 font-jetbrains">
                  $30 off your first order · Valid for 14 days · One use per customer
                </p>
                <button
                  onClick={dismiss}
                  className="btn btn-primary w-full justify-center mt-2"
                >
                  Shop Now →
                </button>
              </div>
            ) : (
              <>
                {/* Eyebrow */}
                <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald mb-3">
                  Welcome Offer
                </p>

                <h2 className="font-cormorant text-3xl md:text-4xl text-white leading-tight">
                  $30 off your
                  <br />
                  <em className="italic text-gold">first order.</em>
                </h2>

                <p className="mt-4 text-sm text-cream-dim leading-relaxed">
                  Join the Greenstone clinical community. Receive your discount code
                  instantly — plus new protocol alerts and clinical research updates,
                  one email a month.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-3"
                >
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full justify-center disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        Sending code...
                      </span>
                    ) : (
                      'Claim $30 Off My First Order'
                    )}
                  </button>
                </form>

                <p className="mt-4 text-[0.65rem] text-cream-dim/40 font-jetbrains text-center">
                  <Lock size={9} className="inline mr-1" />
                  We respect your privacy. Unsubscribe anytime.
                </p>

                <button
                  onClick={dismiss}
                  className="mt-3 text-[0.65rem] text-cream-dim/40 hover:text-cream-dim/70 transition-colors w-full text-center font-jetbrains tracking-wide uppercase"
                >
                  No thanks, I&apos;ll pay full price
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
