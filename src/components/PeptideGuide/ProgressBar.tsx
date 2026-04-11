'use client';

interface ProgressBarProps {
  currentStep: number; // 1–5
  totalSteps: number;
}

const STEP_LABELS = ['Goal', 'Experience', 'Budget', 'Learn', 'Protocol'];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-2">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isComplete
                    ? 'bg-[#1A9E6E] text-white'
                    : isActive
                    ? 'bg-[#1A9E6E] text-white ring-2 ring-[#1A9E6E]/30 ring-offset-2 ring-offset-[#0a0f1a]'
                    : 'bg-white/10 text-white/40'
                }`}
              >
                {isComplete ? '✓' : stepNum}
              </div>
              <span
                className={`text-xs hidden sm:block transition-colors ${
                  isActive ? 'text-[#1A9E6E]' : isComplete ? 'text-white/60' : 'text-white/30'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative h-0.5 bg-white/10 -mt-5 mx-4">
        <div
          className="absolute h-full bg-[#1A9E6E] transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
