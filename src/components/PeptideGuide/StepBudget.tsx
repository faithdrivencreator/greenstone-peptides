'use client';

import { Wallet } from 'lucide-react';
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
      <div className="w-14 h-14 bg-gold/10 border border-gold/30 flex items-center justify-center mb-6" style={{ borderRadius: '8px' }}>
        <Wallet className="w-7 h-7 text-gold" />
      </div>
      <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-3 text-center" style={{ fontWeight: 400 }}>
        What&apos;s your monthly budget?
      </h2>
      <p className="text-cream-dim mb-10 text-center max-w-md">
        Every tier delivers real results. More budget simply means a more complete stack.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-lg">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="card-glass flex flex-col items-start !p-6 text-left hover:!border-gold/40 transition-all duration-200"
          >
            <div className="font-cormorant text-gold text-2xl">{opt.label}</div>
            <div className="text-cream-dim text-sm mt-1">{opt.description}</div>
          </button>
        ))}
      </div>
      <button
        onClick={onBack}
        className="mt-8 text-cream-dim/50 hover:text-gold text-sm transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
