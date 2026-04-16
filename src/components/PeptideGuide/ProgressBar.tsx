'use client';

interface ProgressBarProps {
  currentStep: number; // 1–5
  totalSteps: number;
}

const STEP_LABELS = ['Goal', 'Experience', 'Budget', 'Learn', 'Protocol'];

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mb-10">
      <div className="relative">
        {/* Connector line — sits at circle center height (top-4 = 16px = center of w-8/h-8 circles) */}
        {/* left-4/right-4 = 16px inset so line runs center-to-center of first and last circle */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10">
          <div
            className="h-full bg-emerald transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Step circles — z-10 so they render above the line */}
        <div className="relative flex items-start justify-between">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isComplete = stepNum < currentStep;
            const isActive = stepNum === currentStep;
            return (
              <div key={label} className="flex flex-col items-center gap-1 z-10">
                <div
                  className={`w-8 h-8 flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isComplete
                      ? 'bg-emerald text-white'
                      : isActive
                      ? 'bg-emerald text-white ring-2 ring-emerald/30 ring-offset-2 ring-offset-obsidian'
                      : 'bg-obsidian border border-white/20 text-white/40'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  {isComplete ? '✓' : stepNum}
                </div>
                <span
                  className={`font-jetbrains text-[0.6rem] tracking-wider hidden sm:block transition-colors mt-1 ${
                    isActive ? 'text-gold' : isComplete ? 'text-cream-dim/60' : 'text-white/30'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
