'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function WholesaleLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <section className="section-py min-h-[80vh] flex items-center">
      <div className="container-gr max-w-md mx-auto">

        {/* Portal header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-emerald/30 mb-6"
            style={{ background: 'rgba(26,158,110,0.08)' }}>
            <Lock size={22} className="text-emerald" />
          </div>
          <p className="font-jetbrains text-[0.65rem] tracking-[0.25em] uppercase text-emerald mb-3">
            Distributor Portal
          </p>
          <h1 className="font-cormorant text-4xl text-white">Partner Login</h1>
          <p className="text-sm text-cream-dim mt-3">
            Secure access for approved wholesale and distribution partners.
          </p>
        </div>

        {submitted ? (
          <div className="card-glass border-emerald/30 text-center space-y-4">
            <AlertCircle size={32} className="text-emerald mx-auto" />
            <h3 className="font-cormorant text-2xl text-white">Access Pending Activation</h3>
            <p className="text-sm text-cream-dim leading-relaxed">
              Your credentials were not found in our system. If you have applied for wholesale
              access and are awaiting approval, our team will reach out within 2 business days
              with your portal credentials.
            </p>
            <div className="pt-2 flex flex-col gap-3">
              <Link href="/wholesale" className="btn btn-primary w-full justify-center">
                Apply for Wholesale Access
              </Link>
              <Link href="/contact" className="btn btn-ghost w-full justify-center text-sm">
                Contact the Wholesale Team
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-glass border-emerald/20 space-y-5">
            <div>
              <label htmlFor="email" className="mono block mb-2">
                Partner Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 text-cream outline-none transition-colors"
                placeholder="orders@yourclinic.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mono block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="w-full bg-obsidian-light border border-gold/20 focus:border-emerald/60 px-4 py-3 pr-12 text-cream outline-none transition-colors"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-dim hover:text-gold transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-cream-dim cursor-pointer">
                <input type="checkbox" className="accent-emerald" />
                Keep me signed in
              </label>
              <button type="button" className="text-emerald hover:text-emerald-light transition-colors font-jetbrains tracking-wide uppercase text-[0.65rem]">
                Reset Password
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <Lock size={13} />
                  Sign In to Portal
                </>
              )}
            </button>

            <div className="border-t border-gold/10 pt-4 text-center">
              <p className="text-xs text-cream-dim/60">
                Not yet a partner?{' '}
                <Link href="/wholesale" className="text-emerald hover:text-emerald-light transition-colors">
                  Apply for wholesale access
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* Security note */}
        <p className="text-center text-[0.65rem] font-jetbrains tracking-wide text-cream-dim/40 mt-8 uppercase">
          256-bit encrypted · Session-protected · HIPAA compliant
        </p>
      </div>
    </section>
  );
}
