'use client';

import { useState } from 'react';
import type { GoalContent } from '@/data/guide-content';

interface SafetyChecklistProps {
  content: GoalContent;
  onNext: () => void;
  onBack: () => void;
}

export function SafetyChecklist({ content, onNext, onBack }: SafetyChecklistProps) {
  const [checked, setChecked] = useState<boolean[]>(
    new Array(content.safetyItems.length).fill(false)
  );

  const allChecked = checked.every(Boolean);

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <div className="w-12 h-12 rounded-full bg-[#1A9E6E]/20 border border-[#1A9E6E]/40 flex items-center justify-center mb-4">
        <span className="text-2xl">🛡️</span>
      </div>
      <h2 className="text-3xl font-bold text-white mb-2 text-center">Safety First</h2>
      <p className="text-white/60 mb-8 text-center">
        Check off each step before administering. Your safety is our highest priority.
      </p>

      <div className="w-full flex flex-col gap-3 mb-8">
        {content.safetyItems.map((item, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
              checked[i]
                ? 'border-[#1A9E6E]/60 bg-[#1A9E6E]/10'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                checked[i] ? 'border-[#1A9E6E] bg-[#1A9E6E]' : 'border-white/30'
              }`}
            >
              {checked[i] && <span className="text-white text-xs">✓</span>}
            </div>
            <span className={`text-sm transition-colors ${checked[i] ? 'text-white' : 'text-white/60'}`}>
              {item.text}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!allChecked}
        className={`px-8 py-3 font-semibold rounded-full transition-all ${
          allChecked
            ? 'bg-[#1A9E6E] text-white hover:bg-[#1A9E6E]/90'
            : 'bg-white/10 text-white/30 cursor-not-allowed'
        }`}
      >
        {allChecked ? 'Next: How to Administer →' : 'Check all items to continue'}
      </button>
      <button
        onClick={onBack}
        className="mt-4 text-white/40 hover:text-white/70 text-sm transition-colors"
      >
        ← Back
      </button>
    </div>
  );
}
