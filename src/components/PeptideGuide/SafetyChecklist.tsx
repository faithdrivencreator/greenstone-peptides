'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hand, Droplets, Eye, Pipette, RefreshCw, Trash2, Boxes,
  Clock, Pill, UtensilsCrossed, AlertTriangle, Thermometer,
  ShieldCheck, ArrowRight, CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GoalContent } from '@/data/guide-content';
import { GuideEyebrow } from './GuidePrimitives';

interface SafetyChecklistProps {
  content: GoalContent;
  onNext: () => void;
  onBack: () => void;
}

const SAFETY_ICONS: Record<string, LucideIcon> = {
  hands: Hand,
  supplies: Boxes,
  swab: Droplets,
  inspect: Eye,
  syringe: Pipette,
  rotate: RefreshCw,
  dispose: Trash2,
  clock: Clock,
  pill: Pill,
  'no-food': UtensilsCrossed,
  alert: AlertTriangle,
  store: Thermometer,
};

// Cinematic action backgrounds (generated via nano_banana_2)
const SAFETY_BG_IMAGE: Record<string, string> = {
  hands: '/images/guide/safety/hands.webp',
  supplies: '/images/guide/safety/supplies.webp',
  swab: '/images/guide/safety/swab.webp',
  inspect: '/images/guide/safety/inspect.webp',
  syringe: '/images/guide/safety/syringe.webp',
  rotate: '/images/guide/safety/rotate.webp',
  dispose: '/images/guide/safety/dispose.webp',
  clock: '/images/guide/safety/clock.webp',
  pill: '/images/guide/safety/pill.webp',
  'no-food': '/images/guide/safety/no-food.webp',
  alert: '/images/guide/safety/alert.webp',
  store: '/images/guide/safety/store.webp',
};

// One-line "why this matters" per icon key
const SAFETY_CONTEXT: Record<string, string> = {
  hands: 'Most contamination happens from unwashed hands. 20 seconds eliminates 99% of harmful bacteria.',
  supplies: 'Have it all in reach before you start: vial, fresh syringe, alcohol pad, sharps container. Calm prep means a clean injection.',
  swab: 'Alcohol needs 10 seconds to evaporate. Injecting through wet skin stings and can drive alcohol into tissue.',
  inspect: 'Peptides are temperature-sensitive. Cloudiness or particles means the vial has degraded — do not use.',
  syringe: 'Pinch a 1-inch fold of skin, insert at 45–90°, push slowly over 5–10 seconds, hold 5 seconds before withdrawing. Fast injection bruises.',
  rotate: 'Repeated injections in the same spot cause scar tissue that affects absorption over time.',
  dispose: 'Recapping needles causes most accidental needle sticks. Straight into the sharps container, never the trash.',
  clock: 'Food reduces sublingual absorption significantly. An empty stomach means faster, fuller onset.',
  pill: 'Swallowing sends the tablet through liver metabolism, cutting bioavailability. Under the tongue only.',
  'no-food': 'Eating or drinking activates saliva flow which washes the dissolving tablet away before absorption.',
  alert: 'Nitrates combined with PDE5 inhibitors cause dangerous blood pressure drops. This is contraindicated.',
  store: 'Light and heat degrade ODT formulations rapidly. A cool, dark place preserves full potency.',
};

export function SafetyChecklist({ content, onNext, onBack }: SafetyChecklistProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const items = content.safetyItems;
  const item = items[current];
  const isLast = current === items.length - 1;
  const Icon = SAFETY_ICONS[item.icon] ?? ShieldCheck;
  const context = SAFETY_CONTEXT[item.icon] ?? '';
  const bgImage = SAFETY_BG_IMAGE[item.icon];

  function advance() {
    if (isLast) {
      onNext();
    } else {
      setDirection(1);
      setCurrent((c) => c + 1);
    }
  }

  function goBack() {
    if (current === 0) {
      onBack();
    } else {
      setDirection(-1);
      setCurrent((c) => c - 1);
    }
  }

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
      {/* Header */}
      <GuideEyebrow tone="gold" icon={ShieldCheck} className="mb-3">
        Step 2 · How to Administer Safely
      </GuideEyebrow>

      <h2
        className="font-cormorant text-white text-2xl sm:text-3xl text-center mb-6"
        style={{ fontWeight: 400 }}
      >
        The full walkthrough
      </h2>

      {/* Step dots */}
      <div className="flex gap-2 mb-6">
        {items.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded transition-all duration-300 ${
              i < current
                ? 'bg-emerald w-4'
                : i === current
                ? 'bg-emerald w-6'
                : 'bg-white/15 w-4'
            }`}
          />
        ))}
      </div>

      {/* Story card — full-bleed photographic background */}
      <div className="w-full relative overflow-hidden rounded-lg border border-white/10" style={{ minHeight: 420 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full"
            style={{ minHeight: 420 }}
          >
            {/* Background image — full bleed, Ken Burns slow zoom */}
            {bgImage && (
              <motion.div
                key={`bg-${current}`}
                initial={{ scale: 1.08 }}
                animate={{ scale: 1.0 }}
                transition={{ duration: 7, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={bgImage}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 640px) 640px, 100vw"
                  className="object-cover"
                />
              </motion.div>
            )}

            {/* Dark gradient overlay for legibility — left-to-right + bottom anchor */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(10,15,26,0.92) 0%, rgba(10,15,26,0.78) 38%, rgba(10,15,26,0.35) 65%, rgba(10,15,26,0.15) 100%), linear-gradient(0deg, rgba(10,15,26,0.65) 0%, rgba(10,15,26,0) 50%)',
              }}
            />

            {/* Subtle emerald vignette edge */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: 'inset 0 0 80px 8px rgba(26,158,110,0.15)',
              }}
            />

            {/* Content — anchored bottom-left so it sits on the dark zone */}
            <div className="relative z-10 flex flex-col items-start justify-end h-full min-h-[420px] p-8 sm:p-10 max-w-md">
              {/* Step counter */}
              <span className="font-jetbrains text-emerald text-[0.6rem] tracking-[0.25em] uppercase mb-4">
                Step {current + 1} of {items.length}
              </span>

              {/* Icon chip */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.15 }}
                className="w-12 h-12 rounded-md bg-emerald/20 backdrop-blur-sm border border-emerald/40 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(26,158,110,0.35)]"
              >
                <Icon className="w-6 h-6 text-emerald" />
              </motion.div>

              {/* Safety rule */}
              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-cormorant text-white text-2xl sm:text-3xl leading-tight mb-3"
                style={{ fontWeight: 500 }}
              >
                {item.text}
              </motion.h3>

              {/* Why it matters */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-cream-dim text-sm sm:text-base leading-relaxed"
              >
                {context}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 mt-6 w-full">
        <motion.button
          onClick={advance}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn btn-solid flex items-center justify-center gap-2 w-full !py-3.5"
        >
          {isLast ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              I&apos;m Ready to Administer
            </>
          ) : (
            <>
              Got it
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>

        <button
          onClick={goBack}
          className="text-cream-dim/50 hover:text-gold text-sm transition-colors"
        >
          ← {current === 0 ? 'Back' : 'Previous'}
        </button>
      </div>
    </div>
  );
}
