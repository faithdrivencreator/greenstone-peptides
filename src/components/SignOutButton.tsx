'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

export function SignOutButton() {
  const [submitting, setSubmitting] = useState(false);

  async function handleClick() {
    if (submitting) return;
    setSubmitting(true);
    await signOut({ callbackUrl: '/' });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={submitting}
      className="px-5 py-2.5 border border-cream-dim/30 text-cream-dim hover:text-cream hover:border-cream-dim/60 font-jetbrains text-[0.65rem] tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {submitting ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
