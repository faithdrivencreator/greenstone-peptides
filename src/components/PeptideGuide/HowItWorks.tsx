'use client';

import { motion } from 'framer-motion';
import { TrendingDown, Dumbbell, Leaf, Zap, Shield, Heart, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GoalContent } from '@/data/guide-content';
import type { GuideGoal } from '@/lib/guide-logic';
import { OdometerNumber } from './OdometerNumber';

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

const GOAL_STATS: Record<GuideGoal, { stat: string; label: string; color: string; bg: string }> = {
  'lose-weight':      { stat: '15-20%', label: 'average body weight lost in GLP-1 clinical trials', color: 'text-emerald-400', bg: 'from-emerald-900/30 to-transparent' },
  'build-recover':    { stat: '4-8×',   label: 'faster tendon and ligament healing with BPC-157',   color: 'text-blue-400',    bg: 'from-blue-900/30 to-transparent' },
  'anti-aging':       { stat: '50%',    label: 'decline in NAD+ between ages 40 and 60',            color: 'text-teal-400',    bg: 'from-teal-900/30 to-transparent' },
  'energy-metabolism':{ stat: '37%',    label: 'improvement in mitochondrial efficiency with NAD+ therapy', color: 'text-amber-400', bg: 'from-amber-900/30 to-transparent' },
  'mens-health':      { stat: '82%',    label: 'of men report improved performance with PDE5 inhibitor therapy', color: 'text-violet-400', bg: 'from-violet-900/30 to-transparent' },
  'womens-health':    { stat: '40%',    label: 'of women over 35 report fatigue and metabolic changes tied to hormonal decline', color: 'text-pink-400', bg: 'from-pink-900/30 to-transparent' },
};

const GOAL_FACTS: Record<GuideGoal, { keyword: string; detail: string }[]> = {
  'lose-weight': [
    { keyword: 'Burns fat without stimulants', detail: 'GLP-1 peptides work with your hormones — not against your body — to reduce hunger and shift your metabolism toward stored fat.' },
    { keyword: 'Stabilizes blood sugar', detail: 'Slower gastric emptying blunts the spikes that drive cravings and fat storage. You naturally eat less, feel fuller longer.' },
    { keyword: 'Preserves lean muscle', detail: 'Unlike crash diets, GLP-1 agonists like Semaglutide protect muscle mass while targeting fat — so the weight you lose stays off.' },
  ],
  'build-recover': [
    { keyword: 'Heals muscle, tendons & ligaments', detail: 'BPC-157 promotes new blood vessel formation in injured tissue — even in areas with poor circulation that would otherwise heal slowly.' },
    { keyword: 'Rebuilds at the cellular level', detail: 'TB-500 regulates actin, the protein that lets damaged cells migrate to injury sites. More actin activity = faster, more complete repair.' },
    { keyword: 'Naturally derived compounds', detail: 'BPC-157 is isolated from gastric juice; TB-500 mirrors a protein your body already uses in wound healing. Nothing synthetic.' },
  ],
  'anti-aging': [
    { keyword: 'Restores cellular energy', detail: 'NAD+ is the coenzyme every cell uses for DNA repair and energy production. Restoring it is one of the most direct levers for reversing biological age.' },
    { keyword: 'Rebuilds growth hormone naturally', detail: 'Sermorelin tells your pituitary to produce more growth hormone on its own — supporting skin thickness, muscle tone, and fat distribution.' },
    { keyword: 'Better sleep, sharper mind', detail: 'Growth hormone secreted during deep sleep drives skin regeneration, cognitive sharpness, and body composition — all of which improve when GH is restored.' },
  ],
  'energy-metabolism': [
    { keyword: 'Powers your mitochondria', detail: 'NAD+ is the fuel your mitochondria run on. When levels drop with age, so does every system that depends on cellular energy.' },
    { keyword: 'Activates your fat-burning switch', detail: 'MOTS-c activates AMPK — the master metabolic enzyme that signals cells to burn fat for fuel and improve insulin sensitivity.' },
    { keyword: 'Fights metabolic decline', detail: 'MOTS-c is encoded in mitochondrial DNA, making it one of the most naturally aligned metabolic compounds available.' },
  ],
  'mens-health': [
    { keyword: 'FDA-approved, fast-acting', detail: 'Sildenafil and Tadalafil have decades of safety data. In ODT form, they dissolve under the tongue for faster absorption than standard tablets.' },
    { keyword: 'Addresses the hormonal root cause', detail: 'Sexual function in men over 35 tracks closely with declining growth hormone. Sermorelin and Tesamorelin restore the hormonal foundation.' },
    { keyword: 'More energy, better body composition', detail: 'Growth hormone support affects energy levels, lean muscle mass, and recovery — benefits that compound well beyond sexual health.' },
  ],
  'womens-health': [
    { keyword: 'Restores hormonal balance naturally', detail: 'Sermorelin stimulates your pituitary gland to produce growth hormone on its natural schedule — supporting body composition, skin elasticity, and deep sleep without synthetic hormone replacement.' },
    { keyword: 'Fights fatigue at the cellular level', detail: 'NAD+ is the coenzyme every cell uses for energy production. Restoring declining NAD+ levels directly addresses the brain fog, low energy, and slow recovery that women experience after 35.' },
    { keyword: 'Metabolic support through perimenopause', detail: 'MOTS-c improves insulin sensitivity and activates AMPK — helping your body maintain metabolic flexibility during the hormonal shifts of perimenopause and beyond.' },
  ],
};

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
  },
};

export function HowItWorks({ goal, content, onNext }: HowItWorksProps) {
  const Icon = GOAL_ICONS[goal];
  const facts = GOAL_FACTS[goal];
  const stat = GOAL_STATS[goal];

  return (
    <div className="flex flex-col items-center max-w-2xl mx-auto">
      {/* Icon header */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="w-16 h-16 bg-emerald/10 border border-emerald/30 flex items-center justify-center mb-5"
        style={{ borderRadius: '8px' }}
      >
        <Icon className="w-8 h-8 text-emerald" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="font-cormorant text-3xl sm:text-4xl text-white mb-4 text-center"
        style={{ fontWeight: 400 }}
      >
        {content.howItWorksTitle}
      </motion.h2>

      {/* Odometer stat callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 24 }}
        className={`card-glass w-full bg-gradient-to-br ${stat.bg} !p-6 mb-5 text-center overflow-hidden`}
      >
        <OdometerNumber
          value={stat.stat}
          className={`text-5xl sm:text-6xl ${stat.color} mb-2`}
        />
        <p className="text-cream-dim text-sm leading-snug mt-2">{stat.label}</p>
      </motion.div>

      {/* Mechanism banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full bg-emerald/[0.08] border border-emerald/30 px-6 py-4 mb-6 text-center"
        style={{ borderRadius: '8px' }}
      >
        <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.2em] uppercase mb-1">The Mechanism</p>
        <p className="text-white font-semibold text-base">{content.howItWorksMechanism}</p>
      </motion.div>

      {/* Keyword-forward fact cards — staggered */}
      <motion.div
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="w-full flex flex-col gap-3 mb-8"
      >
        {facts.map((fact, i) => (
          <motion.div
            key={i}
            variants={stagger.item}
            className="card-glass flex items-start gap-4 !p-5 hover:!border-gold/30 transition-colors"
          >
            <div className="w-7 h-7 bg-emerald/15 flex items-center justify-center shrink-0 mt-0.5" style={{ borderRadius: '4px' }}>
              <span className="font-jetbrains text-emerald text-xs font-bold">{i + 1}</span>
            </div>
            <div>
              <p className="text-white font-medium text-base leading-snug mb-1.5">{fact.keyword}</p>
              <p className="text-cream-dim text-sm leading-relaxed">{fact.detail}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.03, boxShadow: '0 0 24px rgba(26,158,110,0.35)' }}
        whileTap={{ scale: 0.97 }}
        className="btn btn-primary group flex items-center gap-2"
      >
        Next: Safety & Preparation
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </div>
  );
}
