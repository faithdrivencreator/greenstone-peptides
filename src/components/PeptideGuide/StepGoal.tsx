'use client';

import type { GuideGoal } from '@/lib/guide-logic';
import { GOAL_CONTENT } from '@/data/guide-content';

interface StepGoalProps {
  onSelect: (goal: GuideGoal) => void;
}

const GOALS: GuideGoal[] = [
  'lose-weight',
  'build-recover',
  'anti-aging',
  'energy-metabolism',
  'mens-health',
];

export function StepGoal({ onSelect }: StepGoalProps) {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-2 text-center">
        What&apos;s your primary goal?
      </h1>
      <p className="text-white/60 mb-10 text-center">
        We&apos;ll build your personalized peptide protocol around this.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
        {GOALS.map((goal) => {
          const content = GOAL_CONTENT[goal];
          return (
            <button
              key={goal}
              onClick={() => onSelect(goal)}
              className="group flex flex-col items-start gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-[#1A9E6E]/60 hover:bg-[#1A9E6E]/10 transition-all duration-200 text-left"
            >
              <span className="text-3xl">{content.icon}</span>
              <div>
                <div className="text-white font-semibold text-lg">{content.label}</div>
                <div className="text-white/50 text-sm mt-1">{content.tagline}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
