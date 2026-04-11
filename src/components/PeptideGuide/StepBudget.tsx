'use client';

import type { GuideBudget } from '@/lib/guide-logic';

interface StepBudgetProps {
  onSelect: (budget: GuideBudget) => void;
  onBack: () => void;
}

const OPTIONS: { value: GuideBudget; label: string; description: string }[] = [
  {
    value: 'under-100',
    label: 'Under $100',
    description: 'Single entry-level protocol',
  },
  {
    value: '100-200',
    label: '$100 – $200',
    description: 'Targeted protocol, 1–2 products',
  },
  {
    value: '200-plus',
    label: '$200+ full protocol',
    description: 'Comprehensive stack for maximum results',
  },
];

export function StepBudget({ onSelect, onBack }: StepBudgetProps) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">
        What&apos;s your monthly budget?
      </h2>
      <p className="text-white/60 mb-10 text-center">
        We&apos;ll match you to the right protocol at the right price.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-lg">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-start p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#C9A96E]/60 hover:bg-[#C9A96E]/10 transition-all duration-200 text-left"
          >
            <div className="text-[#C9A96E] font-bold text-xl">{opt.label}</div>
            <div className="text-white/50 text-sm mt-1">{opt.description}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onBack}
        className="mt-8 text-white/40 hover:text-white/70 text-sm transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
