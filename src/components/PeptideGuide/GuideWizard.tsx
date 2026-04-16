'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Product } from '@/types';
import type { GuideGoal, GuideExperience, GuideBudget } from '@/lib/guide-logic';
import { getRecommendedSlugs } from '@/lib/guide-logic';
import { ProgressBar } from './ProgressBar';
import { StepWelcome } from './StepWelcome';
import { StepGoal } from './StepGoal';
import { StepExperience } from './StepExperience';
import { StepBudget } from './StepBudget';
import { StepEducation } from './StepEducation';
import { StepRecommendation } from './StepRecommendation';

interface GuideWizardProps {
  allProducts: Product[];
}

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const slideVariants = {
  enter: { opacity: 0, y: 32, scale: 0.98 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -24, scale: 0.98 },
};

export function GuideWizard({ allProducts }: GuideWizardProps) {
  const [step, setStep] = useState<Step>(0);
  const [goal, setGoal] = useState<GuideGoal | null>(null);
  const [experience, setExperience] = useState<GuideExperience | null>(null);
  const [budget, setBudget] = useState<GuideBudget | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (goal && experience && budget && step === 5) {
      const slugs = getRecommendedSlugs({ goal, experience, budget });
      const matched = allProducts.filter((p) => slugs.includes(p.slug.current));
      setRecommendedProducts(matched);
    }
  }, [goal, experience, budget, step, allProducts]);

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {step > 0 && <ProgressBar currentStep={step} totalSteps={5} />}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          >
            {step === 0 && (
              <StepWelcome onStart={() => setStep(1)} />
            )}
            {step === 1 && (
              <StepGoal
                onSelect={(g) => {
                  setGoal(g);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && (
              <StepExperience
                onSelect={(e) => {
                  setExperience(e);
                  setStep(3);
                }}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepBudget
                onSelect={(b) => {
                  setBudget(b);
                  setStep(4);
                }}
                onBack={() => setStep(2)}
              />
            )}
            {step === 4 && goal && (
              <StepEducation
                goal={goal}
                onComplete={() => setStep(5)}
                onBack={() => setStep(3)}
              />
            )}
            {step === 5 && (
              <StepRecommendation
                products={recommendedProducts}
                onBack={() => setStep(3)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
