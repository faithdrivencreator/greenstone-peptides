'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Wind, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import type { GoalContent } from '@/data/guide-content';

interface AdminTutorialProps {
  content: GoalContent;
  onNext: () => void;
  onBack: () => void;
}

export function AdminTutorial({ content, onNext, onBack }: AdminTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (content.oralInstructions) {
    return (
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-lg bg-emerald/10 border border-emerald/30 flex items-center justify-center mb-5">
          <Pill className="w-8 h-8 text-emerald" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          How to Take Your ODT Tablet
        </h2>
        <div className="w-full bg-white/5 border border-white/10 rounded-lg p-8 mb-8">
          <p className="text-cream text-lg leading-relaxed text-center">
            {content.oralInstructions}
          </p>
        </div>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-emerald text-white font-semibold rounded hover:bg-emerald/90 transition-colors"
        >
          See My Protocol →
        </button>
        <button
          onClick={onBack}
          className="mt-4 text-cream-dim/50 hover:text-gold text-sm transition-colors"
        >
          ← Back
        </button>
      </div>
    );
  }

  if (content.nasalInstructions) {
    return (
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-lg bg-emerald/10 border border-emerald/30 flex items-center justify-center mb-5">
          <Wind className="w-8 h-8 text-emerald" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          How to Use Your Nasal Spray
        </h2>
        <div className="w-full bg-white/5 border border-white/10 rounded-lg p-8 mb-8">
          <p className="text-cream text-lg leading-relaxed text-center">
            {content.nasalInstructions}
          </p>
        </div>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-emerald text-white font-semibold rounded hover:bg-emerald/90 transition-colors"
        >
          See My Protocol →
        </button>
        <button
          onClick={onBack}
          className="mt-4 text-cream-dim/50 hover:text-gold text-sm transition-colors"
        >
          ← Back
        </button>
      </div>
    );
  }

  const steps = content.tutorialSteps;
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">
        How to Administer Your Injection
      </h2>
      <p className="text-cream-dim mb-8 text-center">
        Step {currentStep + 1} of {steps.length}
      </p>

      <div className="w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <div className="w-full aspect-video relative rounded-lg overflow-hidden bg-white/5 border border-white/10 mb-6">
              <Image
                src={step.imagePath}
                alt={step.title}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute top-4 left-4 w-10 h-10 rounded bg-emerald flex items-center justify-center text-white font-bold">
                {step.step}
              </div>
            </div>
            <h3 className="text-white font-semibold text-xl mb-2 text-center">{step.title}</h3>
            <p className="text-cream-dim text-center mb-8">{step.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-2 rounded transition-all ${
              i === currentStep ? 'bg-emerald w-4' : 'bg-white/20 w-2'
            }`}
          />
        ))}
      </div>

      <div className="flex gap-4">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="px-6 py-3 border border-white/20 text-white/70 rounded hover:border-white/40 transition-colors"
          >
            ← Previous
          </button>
        )}
        {isLast ? (
          <button
            onClick={onNext}
            className="px-8 py-3 bg-emerald text-white font-semibold rounded hover:bg-emerald/90 transition-colors"
          >
            See My Protocol →
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            className="px-8 py-3 bg-emerald text-white font-semibold rounded hover:bg-emerald/90 transition-colors"
          >
            Next Step →
          </button>
        )}
      </div>
      {currentStep === 0 && (
        <button
          onClick={onBack}
          className="mt-4 text-cream-dim/50 hover:text-gold text-sm transition-colors"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
