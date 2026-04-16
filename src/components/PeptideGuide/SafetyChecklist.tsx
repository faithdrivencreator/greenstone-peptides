'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hand, Droplets, Eye, Pipette, RefreshCw, Trash2,
  Clock, Pill, UtensilsCrossed, AlertTriangle, Thermometer,
  ShieldCheck, ArrowRight, CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GoalContent } from '@/data/guide-content';

interface SafetyChecklistProps {
  content: GoalContent;
  onNext: () => void;
  onBack: () => void;
}

const SAFETY_ICONS: Record<string, LucideIcon> = {
  hands: Hand,
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

// One-line "why this matters" per icon key
const SAFETY_CONTEXT: Record<string, string> = {
  hands: 'Most contamination happens from unwashed hands. 20 seconds eliminates 99% of harmful bacteria.',
  swab: 'Alcohol needs 10 seconds to evaporate. Injecting through wet skin can drive it into the tissue.',
  inspect: 'Peptides are temperature-sensitive. Cloudiness or particles means the vial has degraded — do not use.',
  syringe: 'A used needle dulls instantly and carries contamination risk. Sterile means single-use, always.',
  rotate: 'Repeated injections in the same spot cause scar tissue that affects absorption over time.',
  dispose: 'Recapping needles causes most accidental needle sticks. Into the sharps container immediately.',
  clock: 'Food reduces sublingual absorption significantly. An empty stomach means faster, fuller onset.',
  pill: 'Swallowing sends the tablet through liver metabolism, cutting bioavailability. Under the tongue only.',
  'no-food': 'Eating or drinking activates saliva flow which washes the dissolving tablet away before absorption.',
  alert: 'Nitrates combined with PDE5 inhibitors cause dangerous blood pressure drops. This is contraindicated.',
  store: 'Light and heat degrade ODT formulations rapidly. A cool, dark place preserves full potency.',
};

const CARD_BG: Record<string, string> = {
  hands: 'from-emerald-900/40 to-[#0a0f1a]',
  swab: 'from-cyan-900/40 to-[#0a0f1a]',
  inspect: 'from-blue-900/40 to-[#0a0f1a]',
  syringe: 'from-teal-900/40 to-[#0a0f1a]',
  rotate: 'from-indigo-900/40 to-[#0a0f1a]',
  dispose: 'from-orange-900/30 to-[#0a0f1a]',
  clock: 'from-amber-900/30 to-[#0a0f1a]',
  pill: 'from-violet-900/30 to-[#0a0f1a]',
  'no-food': 'from-red-900/30 to-[#0a0f1a]',
  alert: 'from-yellow-900/30 to-[#0a0f1a]',
  store: 'from-sky-900/30 to-[#0a0f1a]',
};

export function SafetyChecklist({ content, onNext, onBack }: SafetyChecklistProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const items = content.safetyItems;
  const item = items[current];
  const isLast = current === items.length - 1;
  const Icon = SAFETY_ICONS[item.icon] ?? ShieldCheck;
  const context = SAFETY_CONTEXT[item.icon] ?? '';
  const bg = CARD_BG[item.icon] ?? 'from-emerald-900/40 to-[#0a0f1a]';

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
    <div className="flex flex-col items-center max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="w-4 h-4 text-emerald" />
        <span className="text-emerald text-xs font-semibold uppercase tracking-widest">
          Safety Walkthrough
        </span>
      </div>

      {/* Step dots */}
      <div className="flex gap-2 mb-8">
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

      {/* Story card */}
      <div className="w-full relative overflow-hidden rounded-lg" style={{ minHeight: 380 }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`w-full rounded-lg bg-gradient-to-br ${bg} border border-white/10 p-8 sm:p-10 flex flex-col items-center text-center`}
          >
            {/* Step counter */}
            <span className="text-cream-dim/40 text-xs uppercase tracking-widest mb-6">
              {current + 1} of {items.length}
            </span>

            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              className="w-24 h-24 rounded-lg bg-emerald/15 border border-emerald/30 flex items-center justify-center mb-6"
            >
              <Icon className="w-12 h-12 text-emerald" />
            </motion.div>

            {/* Safety rule */}
            <motion.h3
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-4"
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 mt-6 w-full">
        <motion.button
          onClick={advance}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-8 py-3.5 bg-emerald text-white font-semibold rounded text-base w-full justify-center hover:bg-emerald/90 transition-colors"
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
