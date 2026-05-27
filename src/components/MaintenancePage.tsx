'use client';

import { useState, FormEvent } from 'react';

/**
 * Full-page site takeover shown while NEXT_PUBLIC_MAINTENANCE_MODE=true.
 *
 * Brand-matched (obsidian + emerald + gold, Cormorant + DM Sans + IBM Plex Mono).
 * Renders only the maintenance UI — no nav, no footer, no chatbot, no AgeGate.
 * Email capture posts to /api/notify-relaunch which adds the address to the
 * Greenstone Customers Resend audience and pings Pete.
 */
export function MaintenancePage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Discreet password gate for Pete / collaborators to QA the live site
  // behind this takeover. Hidden behind a small toggle so visitors don't
  // see it. POSTs to /api/maintenance-bypass which sets an httpOnly cookie.
  const [bypassOpen, setBypassOpen] = useState(false);
  const [bypassPassword, setBypassPassword] = useState('');
  const [bypassSubmitting, setBypassSubmitting] = useState(false);
  const [bypassError, setBypassError] = useState<string | null>(null);

  async function onBypassSubmit(e: FormEvent) {
    e.preventDefault();
    if (!bypassPassword) return;
    setBypassSubmitting(true);
    setBypassError(null);
    try {
      const res = await fetch('/api/maintenance-bypass', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: bypassPassword }),
      });
      if (!res.ok) {
        setBypassError('Incorrect password.');
        setBypassSubmitting(false);
        return;
      }
      window.location.assign('/');
    } catch {
      setBypassError('Network error. Try again.');
      setBypassSubmitting(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/notify-relaunch', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Something went wrong. Try again in a moment.');
        setStatus('error');
        return;
      }
      setStatus('ok');
      setEmail('');
    } catch {
      setError('Network error. Try again.');
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-obsidian text-cream flex items-center justify-center px-4 py-12">
      {/* Background — emerald glow + molecular texture */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.18]"
        style={{ backgroundImage: 'url(/images/hero-lab.png)' }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(140deg, rgba(10,14,13,0.96) 0%, rgba(10,14,13,0.82) 50%, rgba(10,14,13,0.6) 100%)',
        }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -right-40 w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(26,158,110,0.22) 0%, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,169,108,0.10) 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Top accent rule */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent mb-12" />

        {/* Wordmark */}
        <p className="font-cormorant text-2xl text-cream mb-10 tracking-tight">
          GS Wellness Pharmacy
        </p>

        {/* Eyebrow */}
        <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.3em] uppercase mb-5">
          // Under Construction · Back within 24 hours
        </p>

        {/* Headline */}
        <h1
          className="font-cormorant text-cream text-4xl sm:text-5xl md:text-6xl leading-[1.05] mb-7"
          style={{ fontWeight: 400 }}
        >
          Something{' '}
          <em className="italic text-gold">remarkable</em>
          <br />
          is in the works.
        </h1>

        {/* Body */}
        <p className="text-cream-dim text-base sm:text-lg leading-relaxed max-w-xl mb-6">
          GS Wellness Pharmacy is in the middle of an upgrade. Our clinic + 503A pharmacy
          platform is being rebuilt to make ordering simpler, safer, and faster — with
          the same licensed physician review and specialized temperature-controlled
          packaging behind every prescription.
        </p>
        <p className="text-cream-dim text-base sm:text-lg leading-relaxed max-w-xl mb-12">
          We&rsquo;ll be back online within 24 hours. Drop your email and we&rsquo;ll
          let you know the moment we&rsquo;re live.
        </p>

        {/* Email capture */}
        {status === 'ok' ? (
          <div className="bg-emerald/10 border border-emerald/35 px-5 py-5">
            <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-2">
              // You&rsquo;re on the list
            </p>
            <p className="text-cream text-sm leading-relaxed">
              Thanks. We&rsquo;ll email you the moment GS Wellness Pharmacy is back online.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <label
              htmlFor="notify-email"
              className="font-jetbrains text-[0.65rem] tracking-[0.25em] uppercase text-cream-dim block"
            >
              Notify me when you&rsquo;re back
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="notify-email"
                type="email"
                required
                autoComplete="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-obsidian-mid/70 border border-cream-dim/20 focus:border-emerald/60 outline-none px-4 py-3.5 text-cream text-sm transition-colors"
              />
              <button
                type="submit"
                disabled={submitting || !email.includes('@')}
                className={`px-7 py-3.5 font-jetbrains text-xs tracking-widest uppercase transition-all shadow-lg whitespace-nowrap ${
                  !submitting && email.includes('@')
                    ? 'bg-emerald hover:bg-emerald-light text-white shadow-emerald/30 cursor-pointer'
                    : 'bg-emerald/20 text-cream-dim/40 shadow-none cursor-not-allowed'
                }`}
              >
                {submitting ? 'Saving…' : 'Notify Me →'}
              </button>
            </div>
            {error && (
              <p className="text-rose-300/80 text-xs font-jetbrains tracking-wide pt-1">{error}</p>
            )}
            <p className="text-[0.7rem] text-cream-dim/55 leading-relaxed pt-1">
              One email when we&rsquo;re live. No spam. We never share your address.
            </p>
          </form>
        )}

        {/* Footer mark */}
        <div className="mt-16 pt-8 border-t border-cream-dim/10 flex items-center justify-between">
          <p className="font-jetbrains text-[0.55rem] tracking-[0.25em] uppercase text-cream-dim/55">
            GS Wellness Pharmacy
          </p>
          <p className="font-jetbrains text-[0.55rem] tracking-[0.25em] uppercase text-cream-dim/55">
            Florida · 503A Compounding Pharmacy
          </p>
        </div>

        {/* Discreet staff bypass — opens an inline password field. The dot is
            intentionally low-contrast so visitors don't notice it. */}
        <div className="mt-8 flex justify-center">
          {!bypassOpen ? (
            <button
              type="button"
              onClick={() => setBypassOpen(true)}
              aria-label="Staff access"
              className="font-jetbrains text-[0.5rem] tracking-[0.3em] uppercase text-cream-dim/30 hover:text-cream-dim/60 transition-colors"
            >
              · staff ·
            </button>
          ) : (
            <form onSubmit={onBypassSubmit} className="w-full max-w-sm space-y-2">
              <label
                htmlFor="bypass-password"
                className="font-jetbrains text-[0.55rem] tracking-[0.25em] uppercase text-cream-dim/55 block"
              >
                Staff access
              </label>
              <div className="flex gap-2">
                <input
                  id="bypass-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  value={bypassPassword}
                  onChange={(e) => setBypassPassword(e.target.value)}
                  className="flex-1 bg-obsidian-mid/70 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2 text-cream text-sm transition-colors"
                />
                <button
                  type="submit"
                  disabled={bypassSubmitting || !bypassPassword}
                  className={`px-4 py-2 font-jetbrains text-[0.65rem] tracking-widest uppercase transition-all ${
                    !bypassSubmitting && bypassPassword
                      ? 'bg-cream-dim/20 hover:bg-cream-dim/30 text-cream cursor-pointer'
                      : 'bg-cream-dim/10 text-cream-dim/40 cursor-not-allowed'
                  }`}
                >
                  {bypassSubmitting ? '…' : 'Enter'}
                </button>
              </div>
              {bypassError && (
                <p className="text-rose-300/80 text-[0.7rem] font-jetbrains tracking-wide">{bypassError}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
