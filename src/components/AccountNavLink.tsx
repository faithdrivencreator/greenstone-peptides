'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserRound, LogIn } from 'lucide-react';

export function AccountNavLink({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const { status } = useSession();
  const signedIn = status === 'authenticated';
  const href = signedIn ? '/account' : '/login';

  if (variant === 'mobile') {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 font-jetbrains text-xs tracking-widest uppercase text-cream-dim hover:text-cream transition-colors"
      >
        {signedIn ? <UserRound size={11} /> : <LogIn size={11} />}
        {signedIn ? 'My Account' : 'Sign in'}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="hidden lg:inline-flex items-center gap-1.5 font-jetbrains text-[0.65rem] tracking-widest uppercase text-cream-dim hover:text-gold border border-cream-dim/25 hover:border-gold/40 px-3 py-2 transition-colors"
      aria-label={signedIn ? 'Your account' : 'Sign in'}
    >
      {signedIn ? <UserRound size={10} /> : <LogIn size={10} />}
      {signedIn ? 'Account' : 'Sign in'}
    </Link>
  );
}
