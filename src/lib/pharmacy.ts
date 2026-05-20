/**
 * Greenstone Rx (Bloom) storefront URL helpers.
 *
 * Bloom hosts our clinic storefront at `/dtp/<clinic-id>`. The bare host
 * (`bloom.greenstonerx.com/login`) is the provider portal — sending a
 * patient there causes the bug we shipped twice already.
 *
 * Use `pharmacyStorefrontUrl()` everywhere a patient-facing pharmacy link
 * is needed. Do NOT use the bare `NEXT_PUBLIC_PHARMACY_URL` value as a
 * destination — it's just the host.
 */

/** Clinic-id for the GreenstoneWellness.Store storefront on Bloom.
 *  Source: docs/bloom-storefront-flow.md. */
export const BLOOM_CLINIC_ID = '6a0bb254fa53ddc1571c040b';

/** Bloom host. Defaults to production. Override via env if needed for staging. */
const BLOOM_HOST =
  process.env.NEXT_PUBLIC_PHARMACY_URL || 'https://bloom.greenstonerx.com';

/** Full patient-storefront URL — what every "Continue to Pharmacy" CTA
 *  should resolve to. */
export function pharmacyStorefrontUrl(): string {
  return `${BLOOM_HOST}/dtp/${BLOOM_CLINIC_ID}`;
}
