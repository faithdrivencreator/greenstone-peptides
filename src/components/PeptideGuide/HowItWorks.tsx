'use client';

import type { GoalContent } from '@/data/guide-content';

interface HowItWorksProps {
  content: GoalContent;
  onNext: () => void;
}

export function HowItWorks({ content, onNext }: HowItWorksProps) {
  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <div className="text-5xl mb-4">{content.icon}</div>
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        {content.howItWorksTitle}
      </h2>

      <div className="w-full bg-[#1A9E6E]/10 border border-[#1A9E6E]/30 rounded-2xl p-6 mb-6 text-center">
        <p className="text-[#1A9E6E] font-mono text-sm tracking-wider uppercase mb-1">
          The Mechanism
        </p>
        <p className="text-white font-semibold text-lg">{content.howItWorksMechanism}</p>
      </div>

      <p className="text-white/70 text-base leading-relaxed text-center mb-8">
        {content.howItWorksBody}
      </p>

      <button
        onClick={onNext}
        className="px-8 py-3 bg-[#1A9E6E] text-white font-semibold rounded-full hover:bg-[#1A9E6E]/90 transition-colors"
      >
        Next: Safety & Preparation →
      </button>
    </div>
  );
}
