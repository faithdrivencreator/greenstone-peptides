'use client';

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

type FormState = {
  email: string;
  password: string;
  confirm: string;
  full_name: string;
  date_of_birth: string;
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
  accepted_age_21: false,
  accepted_ruo: false,
  accepted_liability: false,
};

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const fromParam = params.get('from') || '/shop';

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
    form.date_of_birth.length === 10;

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

      // Auto sign in
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        // Signup worked but sign-in failed — send them to login
        router.push('/login?signup=ok');
        return;
      }

      router.push(fromParam);
      router.refresh();
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
                  I acknowledge that all products are sold strictly for{' '}
                  <strong>research and educational use only</strong> — not for human or animal consumption, medical, or veterinary use.
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
