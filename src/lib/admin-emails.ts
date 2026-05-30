/**
 * Single source of truth for the admin allowlist.
 *
 * Edge middleware can't import from `admin-auth.ts` (pulls in next-auth +
 * Supabase admin client, blows up the edge bundler). This tiny file has no
 * runtime dependencies so both layers can share it.
 */
export const ADMIN_EMAILS: ReadonlyArray<string> = [
  'pete@fluidfaithsolutions.com',
];
