import { Stethoscope, Snowflake, BadgeCheck } from 'lucide-react';

/**
 * TrustGrid — three-card trust row modeled on the 73 Aminos flyer Pete approved.
 * Sits between the verticals strip and the featured-products grid on the
 * homepage. Server component, no state.
 */
const CARDS = [
  {
    icon: Stethoscope,
    title: 'TELEHEALTH',
    body:
      'Convenient access for patients nationwide. Physician review on every prescription.',
  },
  {
    icon: Snowflake,
    title: 'COLD SHIPPING · SAME DAY',
    body:
      'Orders placed before 1PM M–F ship the same day in specialized temperature-controlled packaging.',
  },
  {
    icon: BadgeCheck,
    title: 'QUALITY YOU CAN TRUST',
    body:
      'Premium compounded medications. Rigorous USP 797 sterile compounding. Consistent results.',
  },
] as const;

export function TrustGrid() {
  return (
    <section
      className="section-py bg-obsidian-mid/40 border-y border-emerald/15"
      aria-label="GS Wellness Pharmacy trust pillars"
    >
      <div className="container-gr">
        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="card-glass border-emerald/15 hover:border-emerald/35 transition-colors text-center md:text-left flex flex-col items-center md:items-start"
            >
              <Icon
                size={36}
                strokeWidth={1.25}
                className="text-emerald mb-5"
                aria-hidden
              />
              <h3 className="font-jetbrains text-[0.72rem] tracking-[0.22em] uppercase text-gold mb-3">
                {title}
              </h3>
              <p className="text-sm text-cream-dim leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
