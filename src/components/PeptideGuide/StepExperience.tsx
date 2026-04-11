'use client';

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
      <h2 className="text-3xl font-bold text-white mb-2 text-center">
        How familiar are you with peptides?
      </h2>
      <p className="text-white/60 mb-10 text-center">
        This helps us recommend the right starting point for you.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-lg">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className="flex flex-col items-start p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#1A9E6E]/60 hover:bg-[#1A9E6E]/10 transition-all duration-200 text-left"
          >
            <div className="text-white font-semibold text-lg">{opt.label}</div>
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
