'use client';

import { useEffect, useState } from 'react';

export function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('gr_age_verified_v1');
    setVerified(stored === 'true');
  }, []);

  function handleSubmit() {
    setError('');
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const y = parseInt(year, 10);

    if (!m || !d || !y || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear()) {
      setError('Please enter a valid date of birth.');
      return;
    }

    const dob = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      setError('You must be 18 or older to access this website.');
      return;
    }

    localStorage.setItem('gr_age_verified_v1', 'true');
    setVerified(true);
  }

  function handleDeny() {
    window.location.href = 'https://www.google.com';
  }

  // Don't render anything until we've checked localStorage (avoids flash)
  if (verified === null) return null;
  if (verified) return null;

  const inputClass =
    'w-full bg-obsidian-light border border-gold/20 focus:border-gold/50 px-3 py-2.5 text-sm text-cream font-jetbrains tracking-wider outline-none transition-colors text-center placeholder:text-cream-dim/40';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/95 backdrop-blur-md">
      <div className="mx-4 w-full max-w-md border border-gold/20 bg-obsidian-mid px-8 py-10 text-center">
        {/* Brand */}
        <div className="mb-8">
          <div className="font-cormorant text-3xl font-medium text-white">
            Greenstone Peptides
          </div>
          <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-gold mt-1">
            Peptide Solutions
          </p>
        </div>

        {/* Heading */}
        <h2 className="font-cormorant text-2xl text-gold mb-4">
          Age Verification Required
        </h2>

        {/* Body */}
        <p className="text-sm text-cream-dim leading-relaxed mb-6 max-w-sm mx-auto">
          Please enter your date of birth to verify you are 18 years or older.
        </p>

        {/* Date of birth inputs */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={month}
            onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
            placeholder="MM"
            className={inputClass}
            aria-label="Month"
          />
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={day}
            onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
            placeholder="DD"
            className={inputClass}
            aria-label="Day"
          />
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={year}
            onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
            placeholder="YYYY"
            className={inputClass}
            aria-label="Year"
          />
        </div>

        {error && (
          <p className="text-xs text-error font-jetbrains mb-4">{error}</p>
        )}

        <p className="text-[0.65rem] text-cream-dim/60 leading-relaxed mb-6 max-w-sm mx-auto">
          By entering this site, you agree to our{' '}
          <a href="/terms" className="text-gold hover:text-gold-light transition-colors underline underline-offset-2">
            Terms of Service
          </a>{' '}
          and acknowledge that all products are for research purposes only.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full justify-center"
          >
            Verify &amp; Enter Site
          </button>
          <button
            onClick={handleDeny}
            className="w-full py-3 border border-gold/20 text-cream-dim font-jetbrains text-xs tracking-widest uppercase hover:border-gold/40 hover:text-cream transition-colors"
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
