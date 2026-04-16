'use client';

import { BookOpen } from 'lucide-react';
import type { GuideExperience } from '@/lib/guide-logic';

interface StepExperienceProps {
  onSelect: (experience: GuideExperience) => void;
  onBack: () => void;
}

const OPTIONS: { value: GuideExperience; label: string; description: string }[] = [
  {
    value: 'newcomer',
    label: 'Complete newcomer',
    description: "I've never used peptides before",
  },
  {
    value: 'some',
    label: 'Some experience',
    description: "I've tried peptides but want guidance",
  },
  {
    value: 'experienced',
    label: 'Experienced',
    description: 'I know the basics — help me optimize',
  },
];

export function StepExperience({ onSelect, onBack }: StepExperienceProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 bg-emerald/10 border border-emerald/30 flex items-center justify-center mb-6" style={{ borderRadius: '8px' }}>
        <BookOpen className="w-7 h-7 text-emerald" />
      </div>
      <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-3 text-center" style={{ fontWeight: 400 }}>
        How familiar are you with peptides?
      </h2>
      <p className="text-cream-dim mb-10 text-center max-w-md">
        Honest answer is best — we tailor the education to where you are, not where you think you should be.
      </p>
      <div className="flex flex-col gap-3 w-full max-w-lg">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="card-glass flex flex-col items-start !p-6 text-left group hover:!border-gold/40 transition-all duration-200"
          >
            <div className="font-cormorant text-xl text-white group-hover:text-gold transition-colors">{opt.label}</div>
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
