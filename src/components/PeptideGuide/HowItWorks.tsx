'use client';

import { motion } from 'framer-motion';
import { TrendingDown, Dumbbell, Leaf, Zap, Shield, Heart, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GoalContent } from '@/data/guide-content';
import type { GuideGoal } from '@/lib/guide-logic';
import { OdometerNumber } from './OdometerNumber';
import { GuideEyebrow, GuideHeading, PeptideCard, MechanismChain } from './GuidePrimitives';
import { GOAL_PEPTIDES, GOAL_MECHANISMS } from '@/data/guide-peptides';

interface HowItWorksProps {
  goal: GuideGoal;
  content: GoalContent;
  onNext: () => void;
}

const GOAL_ICONS: Record<GuideGoal, LucideIcon> = {
  'lose-weight': TrendingDown,
  'build-recover': Dumbbell,
  'anti-aging': Leaf,
  'energy-metabolism': Zap,
  'mens-health': Shield,
  'womens-health': Heart,
};

const GOAL_STATS: Record<GuideGoal, { stat: string; label: string }> = {
  'lose-weight':      { stat: '15-20%', label: 'average body weight lost in GLP-1 clinical trials' },
  'build-recover':    { stat: '4-8×',   label: 'faster tendon and ligament healing with BPC-157' },
  'anti-aging':       { stat: '50%',    label: 'decline in NAD+ between ages 40 and 60' },
  'energy-metabolism':{ stat: '37%',    label: 'improvement in mitochondrial efficiency with NAD+' },
  'mens-health':      { stat: '82%',    label: 'of men report improved performance with PDE5 therapy' },
  'womens-health':    { stat: '40%',    label: 'of women over 35 report hormone-tied fatigue' },
};

export function HowItWorks({ goal, content, onNext }: HowItWorksProps) {
  const Icon = GOAL_ICONS[goal];
  const stat = GOAL_STATS[goal];
  const peptides = GOAL_PEPTIDES[goal];
  const mechanism = GOAL_MECHANISMS[goal];

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto">
      {/* Header — perfectly centered eyebrow, icon, and title */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="w-14 h-14 bg-emerald/10 border border-emerald/30 flex items-center justify-center mb-4"
        style={{ borderRadius: '8px' }}
      >
        <Icon className="w-7 h-7 text-emerald" />
      </motion.div>

      <GuideHeading
        eyebrow={<GuideEyebrow tone="gold">Step 1 · How It Works</GuideEyebrow>}
        title={content.howItWorksTitle}
        className="mb-8"
      />

      {/* Stat callout — single big number, centered */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 24 }}
        className="card-glass w-full !p-6 mb-6 flex flex-col items-center text-center"
      >
        <OdometerNumber
          value={stat.stat}
          className="font-cormorant text-5xl sm:text-6xl text-emerald mb-2"
        />
        <p className="text-cream-dim text-sm leading-snug max-w-md">{stat.label}</p>
      </motion.div>

      {/* The Mechanism — VISUAL chain, not a sentence */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full mb-8"
      >
        <MechanismChain steps={mechanism.chain} caption={mechanism.caption} />
      </motion.div>

      {/* Product grid — the gist of "how it works" is the products themselves */}
      <div className="w-full mb-6 flex flex-col items-center">
        <GuideEyebrow className="mb-4">Your Anchor Peptides</GuideEyebrow>
        <p className="text-cream-dim text-sm text-center max-w-md mb-6">
          These are the compounds we'll recommend for your goal. Each one does one job, well.
        </p>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${peptides.length === 3 ? 'lg:grid-cols-3' : ''} gap-4 w-full`}
        >
          {peptides.map((p, i) => (
            <PeptideCard
              key={p.name}
              name={p.name}
              role={p.role}
              caption={p.caption}
              imageSrc={p.imageSrc}
              delay={0.35 + i * 0.1}
            />
          ))}
        </div>
      </div>

      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(26,158,110,0.35)' }}
        whileTap={{ scale: 0.97 }}
        className="btn btn-primary group flex items-center gap-2 mt-4"
      >
        Next: Safety & Preparation
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </div>
  );
}
