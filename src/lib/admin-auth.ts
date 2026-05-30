/**
 * Admin auth helper — central allowlist + server-side gate.
 *
 * Currently a static allowlist (small team, no need for a DB role yet).
 * If/when the admin team grows, swap this for a Supabase `admin_users`
 * table and a `select` check against the session email.
 */

import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export const ADMIN_EMAILS: ReadonlyArray<string> = [
  'pete@fluidfaithsolutions.com',
];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

/**
 * Server-component / route-handler gate. Throws a redirect to /login when
 * the caller is not an admin. Returns the admin's email on success.
 */
export async function requireAdmin(): Promise<{ email: string; userId: string }> {
  const session = await auth();
  const email = session?.user?.email;
  const userId = session?.user?.id;

  if (!email || !userId || !isAdminEmail(email)) {
    redirect('/login');
  }

  return { email, userId };
}
