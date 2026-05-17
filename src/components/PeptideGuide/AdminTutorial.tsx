'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Wind, ArrowRight, Syringe } from 'lucide-react';
import Image from 'next/image';
import type { GoalContent } from '@/data/guide-content';
import { GuideEyebrow, GuideHeading } from './GuidePrimitives';

interface AdminTutorialProps {
  content: GoalContent;
  onNext: () => void;
  onBack: () => void;
}

export function AdminTutorial({ content, onNext, onBack }: AdminTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  /* ---------- ORAL (ODT) ---------- */
  if (content.oralInstructions) {
    return (
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <GuideEyebrow tone="gold" icon={Pill} className="mb-3">
          Step 3 · Administration
        </GuideEyebrow>
        <GuideHeading
          title="How to take your ODT tablet"
          className="mb-8"
        />
        <div className="w-full card-glass !p-8 mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald/10 border border-emerald/30 flex items-center justify-center mb-5" style={{ borderRadius: '8px' }}>
            <Pill className="w-8 h-8 text-emerald" />
          </div>
          <p className="font-cormorant text-cream text-xl leading-relaxed text-center" style={{ fontWeight: 400 }}>
            {content.oralInstructions}
          </p>
        </div>
        <SeeProtocolButton onNext={onNext} />
        <BackLink onBack={onBack} />
      </div>
    );
  }

  /* ---------- NASAL ---------- */
  if (content.nasalInstructions) {
    return (
      <div className="flex flex-col items-center max-w-2xl mx-auto">
        <GuideEyebrow tone="gold" icon={Wind} className="mb-3">
          Step 3 · Administration
        </GuideEyebrow>
        <GuideHeading
          title="How to use your nasal spray"
          className="mb-8"
        />
        <div className="w-full card-glass !p-8 mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald/10 border border-emerald/30 flex items-center justify-center mb-5" style={{ borderRadius: '8px' }}>
            <Wind className="w-8 h-8 text-emerald" />
          </div>
          <p className="font-cormorant text-cream text-xl leading-relaxed text-center" style={{ fontWeight: 400 }}>
            {content.nasalInstructions}
          </p>
        </div>
        <SeeProtocolButton onNext={onNext} />
        <BackLink onBack={onBack} />
      </div>
    );
  }

  /* ---------- INJECTABLE ---------- */
  const steps = content.tutorialSteps;
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      <GuideEyebrow tone="gold" icon={Syringe} className="mb-3">
        Step 3 · Administration
      </GuideEyebrow>
      <GuideHeading
        title="How to administer your injection"
        subtitle={`Step ${currentStep + 1} of ${steps.length}`}
        className="mb-8"
      />

      <div className="w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col items-center text-center"
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
            <h3
              className="font-cormorant text-white text-2xl mb-3 text-center"
              style={{ fontWeight: 500 }}
            >
              {step.title}
            </h3>
            <p className="text-cream-dim text-sm leading-relaxed text-center max-w-prose mb-8">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            className={`h-1.5 rounded transition-all duration-300 ${
              i === currentStep
                ? 'bg-emerald w-6'
                : i < currentStep
                ? 'bg-emerald w-4'
                : 'bg-white/15 w-4'
            }`}
            aria-label={`Go to step ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="btn btn-primary !px-6 !py-2.5 !text-sm"
          >
            ← Previous
          </button>
        )}
        {isLast ? (
          <SeeProtocolButton onNext={onNext} />
        ) : (
          <button
            onClick={() => setCurrentStep((s) => s + 1)}
            className="btn btn-solid flex items-center gap-2 !px-7 !py-3"
          >
            Next Step
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {currentStep === 0 && <BackLink onBack={onBack} />}
    </div>
  );
}

/* ---------- shared sub-bits ---------- */

function SeeProtocolButton({ onNext }: { onNext: () => void }) {
  return (
    <motion.button
      onClick={onNext}
      whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(111,168,220,0.3)' }}
      whileTap={{ scale: 0.97 }}
      className="btn btn-solid flex items-center gap-2 !px-7 !py-3"
    >
      See My Protocol
      <ArrowRight className="w-4 h-4" />
    </motion.button>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button
      onClick={onBack}
      className="mt-5 text-cream-dim/50 hover:text-gold text-sm transition-colors"
    >
      ← Back
    </button>
  );
}
