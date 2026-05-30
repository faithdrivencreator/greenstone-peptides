'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

import { pharmacyStorefrontUrl } from '@/lib/pharmacy';
import { US_STATES } from '@/lib/us-states';

type FormState = {
  email: string;
  password: string;
  confirm: string;
  full_name: string;
  date_of_birth: string;
  shipping_state: string;
  address_line1: string;
  address_line2: string;
  city: string;
  zip: string;
  accepted_age_21: boolean;
  accepted_ruo: boolean;
  accepted_liability: boolean;
};

const INITIAL: FormState = {
  email: '',
  password: '',
  confirm: '',
  full_name: '',
  date_of_birth: '',
  shipping_state: '',
  address_line1: '',
  address_line2: '',
  city: '',
  zip: '',
  accepted_age_21: false,
  accepted_ruo: false,
  accepted_liability: false,
};

function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const fromParam = params.get('from') || '/shop';
  const nextParam = params.get('next'); // 'pharmacy' = forward to Bloom post-signup

  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allChecked = form.accepted_age_21 && form.accepted_ruo && form.accepted_liability;
  const passwordsMatch = form.password.length >= 8 && form.password === form.confirm;
  const canSubmit =
    !submitting &&
    allChecked &&
    passwordsMatch &&
    form.email.includes('@') &&
    form.full_name.trim().length > 0 &&
    form.date_of_birth.length === 10 &&
    form.shipping_state.length === 2 &&
    form.address_line1.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.zip.length === 5;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          date_of_birth: form.date_of_birth,
          shipping_state: form.shipping_state,
          address_line1: form.address_line1,
          address_line2: form.address_line2 || undefined,
          city: form.city,
          zip: form.zip,
          accepted_age_21: form.accepted_age_21,
          accepted_ruo: form.accepted_ruo,
          accepted_liability: form.accepted_liability,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const code = data?.error;
        const msg =
          code === 'email_in_use'
            ? 'An account with that email already exists. Try signing in instead.'
            : code === 'under_21'
            ? 'You must be 21 or older to create an account.'
            : code === 'invalid_input'
            ? 'Please review the form and try again.'
            : 'Something went wrong creating your account. Please try again.';
        setError(msg);
        setSubmitting(false);
        return;
      }

      // Auto sign in — then HARD navigate so the session cookie is sent on
      // the next request (router.push doesn't always propagate the cookie
      // before middleware runs, which causes the form to look stuck).
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        // Account was created but auto-sign-in failed — bounce to /login
        // with a success banner; user can sign in manually.
        const loginUrl =
          nextParam === 'pharmacy' ? '/login?signup=ok&next=pharmacy' : '/login?signup=ok';
        window.location.assign(loginUrl);
        return;
      }

      // Success — if user was funneling toward the pharmacy, hand off to the
      // server-side router which reads their shipping_state and forwards to
      // Bloom (FL) or our /order-out-of-state form (everyone else).
      if (nextParam === 'pharmacy') {
        window.location.assign('/api/pharmacy-route');
        return;
      }

      // Otherwise home page with a full reload (Pete's preference).
      window.location.assign('/');
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg bg-obsidian-mid border border-gold/25 shadow-2xl">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="p-8 sm:p-10">
          <p className="font-jetbrains text-emerald text-[0.6rem] tracking-[0.25em] uppercase mb-3">
            // Create account · 21+
          </p>
          <h1 className="font-cormorant text-cream text-3xl sm:text-4xl leading-tight mb-2" style={{ fontWeight: 400 }}>
            Create your <em className="italic text-gold">Greenstone</em> account
          </h1>
          <p className="text-cream-dim text-sm leading-relaxed mb-7">
            Required to view the catalog and submit prescription requests. Already have an account?{' '}
            <Link href="/login" className="text-emerald hover:text-emerald-light underline-offset-2 hover:underline">
              Sign in
            </Link>.
          </p>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="full_name" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                Full name
              </label>
              <input
                id="full_name"
                type="text"
                required
                autoComplete="name"
                value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="date_of_birth" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                Date of birth
              </label>
              <input
                id="date_of_birth"
                type="date"
                required
                autoComplete="bday"
                value={form.date_of_birth}
                onChange={(e) => update('date_of_birth', e.target.value)}
                className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
              />
              <p className="mt-1 text-[0.7rem] text-cream-dim/60">You must be 21+ to create an account.</p>
            </div>

            <div>
              <label htmlFor="address_line1" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                Street address
              </label>
              <input
                id="address_line1"
                type="text"
                required
                autoComplete="address-line1"
                value={form.address_line1}
                onChange={(e) => update('address_line1', e.target.value)}
                className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="address_line2" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                Apt / Suite <span className="text-cream-dim/50 normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="address_line2"
                type="text"
                autoComplete="address-line2"
                value={form.address_line2}
                onChange={(e) => update('address_line2', e.target.value)}
                className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="city" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                City
              </label>
              <input
                id="city"
                type="text"
                required
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-4">
              <div>
                <label htmlFor="shipping_state" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                  State
                </label>
                <select
                  id="shipping_state"
                  required
                  value={form.shipping_state}
                  onChange={(e) => update('shipping_state', e.target.value)}
                  className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
                >
                  <option value="">Select state…</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="zip" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                  ZIP
                </label>
                <input
                  id="zip"
                  type="text"
                  inputMode="numeric"
                  required
                  autoComplete="postal-code"
                  value={form.zip}
                  onChange={(e) => update('zip', e.target.value.replace(/\D/g, '').slice(0, 5))}
                  className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors font-jetbrains"
                />
              </div>
            </div>
            <p className="mt-1 text-[0.7rem] text-cream-dim/60 -mt-3">Florida customers are routed directly to our pharmacy partner; everyone else uses our managed checkout.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
                />
                <p className="mt-1 text-[0.7rem] text-cream-dim/60">At least 8 characters.</p>
              </div>
              <div>
                <label htmlFor="confirm" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={(e) => update('confirm', e.target.value)}
                  className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
                />
                {form.confirm.length > 0 && !passwordsMatch && (
                  <p className="mt-1 text-[0.7rem] text-rose-300/80">Passwords don&rsquo;t match.</p>
                )}
              </div>
            </div>

            <div className="pt-2 space-y-3.5 border-t border-cream-dim/10">
              <label className="flex items-start gap-3 cursor-pointer group pt-3">
                <input
                  type="checkbox"
                  checked={form.accepted_age_21}
                  onChange={(e) => update('accepted_age_21', e.target.checked)}
                  className="mt-1 w-4 h-4 accent-emerald cursor-pointer flex-shrink-0"
                />
                <span className="text-sm text-cream leading-snug group-hover:text-white transition-colors">
                  I am <strong>21 years of age or older</strong>.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.accepted_ruo}
                  onChange={(e) => update('accepted_ruo', e.target.checked)}
                  className="mt-1 w-4 h-4 accent-emerald cursor-pointer flex-shrink-0"
                />
                <span className="text-sm text-cream leading-snug group-hover:text-white transition-colors">
                  I acknowledge that medications listed here are{' '}
                  <strong>compounded by a 503A licensed pharmacy</strong> pursuant to a
                  valid prescription, are not FDA-approved drug products, and require
                  review by a licensed U.S. clinician before any order is dispensed.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.accepted_liability}
                  onChange={(e) => update('accepted_liability', e.target.checked)}
                  className="mt-1 w-4 h-4 accent-emerald cursor-pointer flex-shrink-0"
                />
                <span className="text-sm text-cream leading-snug group-hover:text-white transition-colors">
                  I <strong>assume all liability</strong> for the handling, storage, and use of these compounds.
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-rose-900/20 border border-rose-500/30 text-rose-200 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full px-7 py-3.5 font-jetbrains text-xs tracking-widest uppercase transition-all shadow-lg ${
                canSubmit
                  ? 'bg-emerald hover:bg-emerald-light text-white shadow-emerald/30 cursor-pointer'
                  : 'bg-emerald/20 text-cream-dim/40 shadow-none cursor-not-allowed'
              }`}
            >
              {submitting ? 'Creating account…' : 'Create account &rarr;'.replace('&rarr;', '→')}
            </button>

            <p className="text-[0.7rem] text-cream-dim/60 leading-relaxed text-center pt-2">
              By creating an account you agree to our{' '}
              <Link href="/terms" className="underline-offset-2 hover:underline">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="underline-offset-2 hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
