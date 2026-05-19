'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

const PHARMACY_URL =
  process.env.NEXT_PUBLIC_PHARMACY_URL || 'https://bloom.greenstonerx.com';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const fromParam = params.get('from') || '/account';
  const nextParam = params.get('next'); // 'pharmacy' = continue to Bloom after login
  const signupOk = params.get('signup') === 'ok';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Email or password is incorrect.');
      setSubmitting(false);
      return;
    }

    // If the user arrived via Order Now (next=pharmacy), forward them to the
    // pharmacy storefront. Same-tab — opening a new tab post-login is blocked
    // by popup blockers since the navigation isn't a direct user gesture on
    // the link itself.
    if (nextParam === 'pharmacy') {
      window.location.assign(PHARMACY_URL);
      return;
    }

    router.push(fromParam);
    router.refresh();
  }

  return (
    <section className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-obsidian-mid border border-gold/25 shadow-2xl">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="p-8 sm:p-10">
          <p className="font-jetbrains text-emerald text-[0.6rem] tracking-[0.25em] uppercase mb-3">
            // Sign in
          </p>
          <h1 className="font-cormorant text-cream text-3xl sm:text-4xl leading-tight mb-2" style={{ fontWeight: 400 }}>
            Sign in
          </h1>
          <p className="text-cream-dim text-sm leading-relaxed mb-7">
            New to Greenstone?{' '}
            <Link
              href={nextParam === 'pharmacy' ? '/signup?next=pharmacy' : '/signup'}
              className="text-emerald hover:text-emerald-light underline-offset-2 hover:underline"
            >
              Create an account
            </Link>.
          </p>

          {signupOk && (
            <div className="bg-emerald/10 border border-emerald/30 text-emerald text-sm px-4 py-3 mb-5">
              Account created. Sign in to continue.
            </div>
          )}

          {nextParam === 'pharmacy' && (
            <div className="bg-gold/10 border border-gold/30 text-gold text-sm px-4 py-3 mb-5">
              Sign in to continue to the Greenstone Rx pharmacy.
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim block mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian/60 border border-cream-dim/20 focus:border-emerald/60 outline-none px-3 py-2.5 text-cream text-sm transition-colors"
              />
            </div>

            {error && (
              <div className="bg-rose-900/20 border border-rose-500/30 text-rose-200 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !email || !password}
              className={`w-full px-7 py-3.5 font-jetbrains text-xs tracking-widest uppercase transition-all shadow-lg ${
                !submitting && email && password
                  ? 'bg-emerald hover:bg-emerald-light text-white shadow-emerald/30 cursor-pointer'
                  : 'bg-emerald/20 text-cream-dim/40 shadow-none cursor-not-allowed'
              }`}
            >
              {submitting ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
