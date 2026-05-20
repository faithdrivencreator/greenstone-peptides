/**
 * Brand-styled FAQ accordion. Semantic <details>/<summary> — no JS state,
 * works without hydration, fully keyboard accessible.
 *
 * Renders nothing when `items` is empty or undefined so the surrounding
 * section can short-circuit cleanly.
 */

import { ChevronDown } from 'lucide-react';

export type FAQItem = { q: string; a: string };

type Props = {
  items: FAQItem[] | undefined;
};

export function FAQAccordion({ items }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <div className="divide-y divide-emerald/15 border-y border-emerald/15">
      {items.map((item, i) => (
        <details key={`${item.q}-${i}`} className="group/faq">
          <summary
            className="flex items-start justify-between gap-6 py-5 cursor-pointer list-none text-left"
          >
            <span className="font-cormorant text-xl text-cream leading-snug">
              {item.q}
            </span>
            <ChevronDown
              size={18}
              className="text-emerald flex-shrink-0 mt-1.5 transition-transform duration-300 group-open/faq:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="pb-6 pr-10 -mt-1">
            <p className="text-sm text-cream-dim leading-relaxed">{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
