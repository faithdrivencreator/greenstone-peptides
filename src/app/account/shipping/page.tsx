'use client';

import { Suspense, useEffect, useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { US_STATES } from '@/lib/us-states';

function ShippingStateForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, status, update } = useSession();

  const nextParam = params.get('next') || '/';

  const [stateCode, setStateCode] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auth gate — bounce to /login preserving the eventual destination.
  useEffect(() => {
    if (status === 'unauthenticated') {
      const callback = `/account/shipping?next=${encodeURIComponent(nextParam)}`;
      router.replace(`/login?callbackUrl=${encodeURIComponent(callback)}`);
    }
  }, [status, nextParam, router]);

  // Pre-fill from session if the user already has a state on file
  // (so this page doubles as "update my state").
  useEffect(() => {
    const current = session?.user?.shippingState;
    if (current && !stateCode) setStateCode(current);
  }, [session, stateCode]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!stateCode || stateCode.length !== 2) {
      setError('Please select your shipping state.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/account/shipping', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ shipping_state: stateCode }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || 'Could not save your state. Please try again.');
        setSubmitting(false);
        return;
      }

      // Refresh the JWT so PharmacyButton routes correctly on the next page.
      try {
        await update();
      } catch {
        // Non-fatal — the next hard nav will refresh the session anyway.
      }

      window.location.assign(nextParam);
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <main className="min-h-screen bg-obsidian text-cream pt-32 pb-24 px-6 grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-emerald/30 border-t-emerald rounded-full animate-spin" />
          <div className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim">
            {status === 'loading' ? 'Loading…' : 'Redirecting to sign in…'}
          </div>
        </div>
      </main>
    );
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-obsidian-mid border border-gold/25 shadow-2xl">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="p-8 sm:p-10">
          <p className="font-jetbrains text-emerald text-[0.6rem] tracking-[0.25em] uppercase mb-3">
            // Account · Shipping state
          </p>
          <h1 className="font-cormorant text-cream text-3xl sm:text-4xl leading-tight mb-2" style={{ fontWeight: 400 }}>
            Confirm your <em className="italic text-gold">shipping state</em>
          </h1>
          <p className="text-cream-dim text-sm leading-relaxed mb-7">
            We use this to route your order correctly. Florida customers go directly to our pharmacy
            partner; everyone else is processed through our managed checkout.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="shipping_state" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                Primary shipping state
              </label>
              <select
                id="shipping_state"
                required
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
              >
                <option value="">Select state…</option>
                {US_STATES.map((s) => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-rose-900/20 border border-rose-500/30 text-rose-200 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !stateCode}
              className={`w-full px-7 py-3.5 font-jetbrains text-xs tracking-widest uppercase transition-all shadow-lg ${
                submitting || !stateCode
                  ? 'bg-emerald/20 text-cream-dim/40 shadow-none cursor-not-allowed'
                  : 'bg-emerald hover:bg-emerald-light text-white shadow-emerald/30 cursor-pointer'
              }`}
            >
              {submitting ? 'Saving…' : 'Save and continue →'}
            </button>

            <p className="text-[0.7rem] text-cream-dim/60 leading-relaxed text-center pt-2">
              Moved? You can update your shipping state anytime from your{' '}
              <Link href="/account" className="underline-offset-2 hover:underline">account</Link>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function ShippingStatePage() {
  return (
    <Suspense fallback={null}>
      <ShippingStateForm />
    </Suspense>
  );
}
