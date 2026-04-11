'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface GlpQuizModalProps {
  open: boolean;
  onClose: () => void;
}

type Answers = {
  heightIn: number | null;
  weightLb: number | null;
  condition: 'yes' | 'no' | null;
  pregnant: 'yes' | 'no' | null;
  goal: 'fat-loss' | 'metabolic' | 'general' | null;
};

const INITIAL: Answers = {
  heightIn: null,
  weightLb: null,
  condition: null,
  pregnant: null,
  goal: null,
};

function calcBmi(heightIn: number, weightLb: number) {
  // BMI = 703 * weight(lb) / height(in)^2
  return (703 * weightLb) / (heightIn * heightIn);
}

export function GlpQuizModal({ open, onClose }: GlpQuizModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Focus trap / Escape close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  // Candidate logic:
  //   (BMI >= 30) OR (BMI >= 27 AND condition) AND not pregnant => candidate
  const canEvaluate =
    answers.heightIn !== null &&
    answers.weightLb !== null &&
    answers.condition !== null &&
    answers.pregnant !== null;

  let isCandidate = false;
  let bmi = 0;
  if (canEvaluate) {
    bmi = calcBmi(answers.heightIn!, answers.weightLb!);
    isCandidate =
      answers.pregnant === 'no' && (bmi >= 30 || (bmi >= 27 && answers.condition === 'yes'));
  }

  const totalSteps = 5;
  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="glp-quiz-title"
      className="fixed inset-0 z-[200] grid place-items-center bg-obsidian/85 backdrop-blur-md p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="card-glass w-full max-w-xl relative animate-[fadeUp_400ms_ease]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-cream-dim hover:text-gold"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <p className="mono">Candidacy Quiz</p>
        <h3 id="glp-quiz-title" className="font-cormorant text-3xl text-white mt-2 mb-6">
          Are you a candidate for GLP-1 therapy?
        </h3>

        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                'h-1 flex-1 rounded-full transition-colors',
                i <= step ? 'bg-gold' : 'bg-gold/15'
              )}
            />
          ))}
        </div>

        {/* Step content */}
        {step === 0 && (
          <Step title="What is your height?">
            <label className="block">
              <span className="mono block mb-2">Height (inches)</span>
              <input
                ref={firstFieldRef}
                type="number"
                min={48}
                max={84}
                value={answers.heightIn ?? ''}
                onChange={(e) =>
                  setAnswers({ ...answers, heightIn: e.target.value ? +e.target.value : null })
                }
                className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
              />
            </label>
          </Step>
        )}

        {step === 1 && (
          <Step title="What is your weight?">
            <label className="block">
              <span className="mono block mb-2">Weight (pounds)</span>
              <input
                type="number"
                min={80}
                max={500}
                value={answers.weightLb ?? ''}
                onChange={(e) =>
                  setAnswers({ ...answers, weightLb: e.target.value ? +e.target.value : null })
                }
                className="w-full bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
              />
            </label>
          </Step>
        )}

        {step === 2 && (
          <Step title="Do you have a weight-related condition?">
            <p className="text-sm text-cream-dim mb-4">
              Type 2 diabetes, hypertension, sleep apnea, PCOS, or cardiovascular disease.
            </p>
            <Choices
              value={answers.condition}
              onChange={(v) => setAnswers({ ...answers, condition: v as 'yes' | 'no' })}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
          </Step>
        )}

        {step === 3 && (
          <Step title="Are you pregnant or planning to be?">
            <Choices
              value={answers.pregnant}
              onChange={(v) => setAnswers({ ...answers, pregnant: v as 'yes' | 'no' })}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ]}
            />
          </Step>
        )}

        {step === 4 && (
          <Step title="What is your primary goal?">
            <Choices
              value={answers.goal}
              onChange={(v) => setAnswers({ ...answers, goal: v as Answers['goal'] })}
              options={[
                { value: 'fat-loss', label: 'Fat loss' },
                { value: 'metabolic', label: 'Metabolic health' },
                { value: 'general', label: 'General wellness' },
              ]}
            />
          </Step>
        )}

        {step === totalSteps && (
          <div className="space-y-4 py-2">
            <p className="mono">Result</p>
            {isCandidate ? (
              <>
                <h4 className="font-cormorant text-2xl text-gold">
                  You may be a candidate for GLP-1 therapy.
                </h4>
                <p className="text-sm text-cream-dim">
                  Based on your responses (BMI {bmi.toFixed(1)}), you meet general clinical
                  thresholds. A licensed provider will review your full history before
                  prescribing.
                </p>
                <Link href="/contact" className="btn btn-primary mt-4 inline-flex">
                  Speak With a Provider
                </Link>
              </>
            ) : (
              <>
                <h4 className="font-cormorant text-2xl text-sage-light">
                  GLP-1 therapy may not be right for you.
                </h4>
                <p className="text-sm text-cream-dim">
                  Based on your responses, you may not meet the typical clinical threshold for
                  GLP-1 therapy. We offer many other peptide options that may better fit your
                  goals.
                </p>
                <Link href="/shop" className="btn btn-secondary mt-4 inline-flex">
                  Explore Other Options
                </Link>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        {step < totalSteps && (
          <div className="flex justify-between mt-8 pt-6 border-t border-gold/10">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="btn btn-ghost disabled:opacity-30"
            >
              Back
            </button>
            <button type="button" onClick={next} className="btn btn-primary">
              {step === totalSteps - 1 ? 'See Result' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 min-h-[180px]">
      <h4 className="font-cormorant text-xl text-white">{title}</h4>
      {children}
    </div>
  );
}

function Choices<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T | null;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="grid gap-3">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={clsx(
            'text-left px-4 py-3 border rounded transition-colors',
            value === o.value
              ? 'border-gold bg-gold/10 text-gold'
              : 'border-gold/20 text-cream hover:border-gold/50'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
