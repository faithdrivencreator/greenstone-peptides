/**
 * TrustRibbon — auto-scrolling marquee strip rendered immediately above the
 * primary Navigation. Six trust badges loop infinitely across all pages.
 *
 * Implementation notes:
 *   - Server component (no client state). All animation runs in pure CSS.
 *   - The badge list is duplicated inline so the keyframe can translate -50%
 *     of the track for a seamless loop.
 *   - Respects prefers-reduced-motion via the global stylesheet override below.
 */
const BADGES = [
  'Licensed in Florida',
  'Ships to All 50 States',
  '503A Compounding Pharmacy',
  'USP 797 Sterile Compounding',
  'Physician-Prescribed',
  'Same-Day Consult · 1–4 Hour Approvals',
  'Specialized Cold-Chain Shipping',
] as const;

export function TrustRibbon() {
  // Duplicate the badge set so the -50% translate keyframe produces a seamless
  // infinite loop. Both halves are aria-hidden except the first because screen
  // readers only need the content once.
  return (
    <div
      className="fixed inset-x-0 top-0 z-[60] w-full overflow-hidden bg-obsidian-mid/95 backdrop-blur-md border-b border-emerald/20"
      role="region"
      aria-label="GS Wellness Pharmacy trust ribbon"
    >
      <div className="trust-ribbon-track flex items-center whitespace-nowrap py-2.5 will-change-transform">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            className="flex items-center shrink-0"
            aria-hidden={copy === 1 ? 'true' : undefined}
          >
            {BADGES.map((badge) => (
              <li
                key={`${copy}-${badge}`}
                className="flex items-center gap-2 px-7 font-jetbrains text-[0.62rem] tracking-[0.18em] uppercase text-cream-dim/85"
              >
                <span className="text-emerald font-bold leading-none">✓</span>
                <span>{badge}</span>
              </li>
            ))}
          </ul>
        ))}
      </div>

      <style>{`
        @keyframes trust-ribbon-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .trust-ribbon-track {
          animation: trust-ribbon-scroll 38s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .trust-ribbon-track { animation: none; }
        }
      `}</style>
    </div>
  );
}
