/**
 * Greenstone Rx (Bloom) storefront URL helpers.
 *
 * Bloom hosts our clinic storefront at `/dtp/<clinic-id>`. The bare host
 * (`bloom.greenstonerx.com/login`) is the provider portal — sending a
 * patient there causes the bug we shipped twice already.
 *
 * Use `pharmacyStorefrontUrl()` everywhere a patient-facing pharmacy link
 * is needed.
 *
 * The `NEXT_PUBLIC_PHARMACY_URL` env can be either:
 *   - just the host  (e.g. `https://bloom.greenstonerx.com`)
 *   - or the full URL (e.g. `https://bloom.greenstonerx.com/dtp/<clinic-id>`)
 * The helper accepts both shapes — if the env already includes a path that
 * matches the storefront pattern, we use it as-is instead of appending
 * `/dtp/<clinic-id>` again (which produces a doubled path and breaks).
 */

/** Clinic-id for the GreenstoneWellness.Store storefront on Bloom.
 *  Source: docs/bloom-storefront-flow.md. */
export const BLOOM_CLINIC_ID = '6a0bb254fa53ddc1571c040b';

const DEFAULT_HOST = 'https://bloom.greenstonerx.com';

/** Full patient-storefront URL — what every "Continue to Pharmacy" CTA
 *  should resolve to. Defensive against the env var being set to either
 *  shape; an empty env falls back to the production host. */
export function pharmacyStorefrontUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_PHARMACY_URL || DEFAULT_HOST).replace(
    /\/+$/,
    '',
  );
  // If the env already includes the storefront path, trust it.
  if (raw.includes('/dtp/')) return raw;
  return `${raw}/dtp/${BLOOM_CLINIC_ID}`;
}
