'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Dumbbell, Leaf, Zap, Shield } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { GuideGoal } from '@/lib/guide-logic';
import { GOAL_CONTENT } from '@/data/guide-content';

interface StepGoalProps {
  onSelect: (goal: GuideGoal) => void;
}

const GOALS: GuideGoal[] = [
  'lose-weight',
  'build-recover',
  'anti-aging',
  'energy-metabolism',
  'mens-health',
];

const GOAL_ICONS: Record<GuideGoal, LucideIcon> = {
  'lose-weight': TrendingDown,
  'build-recover': Dumbbell,
  'anti-aging': Leaf,
  'energy-metabolism': Zap,
  'mens-health': Shield,
};

const GOAL_GLOW: Record<GuideGoal, string> = {
  'lose-weight': 'rgba(26,158,110,0.12)',
  'build-recover': 'rgba(59,130,246,0.12)',
  'anti-aging': 'rgba(20,184,166,0.12)',
  'energy-metabolism': 'rgba(245,158,11,0.12)',
  'mens-health': 'rgba(139,92,246,0.12)',
};

const stagger = {
  container: {
    animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  },
  item: {
    initial: { opacity: 0, y: 24, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 280, damping: 26 } },
  },
};

function SpotlightCard({
  goal,
  onSelect,
}: {
  goal: GuideGoal;
  onSelect: (g: GuideGoal) => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const content = GOAL_CONTENT[goal];
  const Icon = GOAL_ICONS[goal];
  const glow = GOAL_GLOW[goal];

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    card.style.setProperty('--spotlight', glow);
  }

  return (
    <motion.button
      ref={cardRef}
      variants={stagger.item}
      onClick={() => onSelect(goal)}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="card-glass group flex flex-col items-start gap-4 !p-6 text-left relative overflow-hidden cursor-pointer"
      style={{
        backgroundImage: 'radial-gradient(circle 200px at var(--mx, 50%) var(--my, 50%), var(--spotlight, transparent), transparent)',
      }}
    >
      <div className="absolute inset-0 border border-white/0 group-hover:border-gold/30 transition-colors duration-300 pointer-events-none" style={{ borderRadius: '8px' }} />

      <div className="w-12 h-12 bg-emerald/10 border border-emerald/30 flex items-center justify-center group-hover:bg-emerald/20 transition-colors" style={{ borderRadius: '8px' }}>
        <Icon className="w-6 h-6 text-emerald" />
      </div>
      <div>
        <div className="font-cormorant text-xl text-white leading-tight group-hover:text-gold transition-colors">
          {content.label}
        </div>
        <div className="text-cream-dim text-sm mt-1.5 leading-snug">{content.tagline}</div>
      </div>
      <div className="font-jetbrains text-gold text-[0.65rem] tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
        Select →
      </div>
    </motion.button>
  );
}

export function StepGoal({ onSelect }: StepGoalProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-cormorant text-3xl sm:text-4xl text-white mb-3 text-center"
        style={{ fontWeight: 400 }}
      >
        What&apos;s your primary goal?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="text-cream-dim mb-10 text-center max-w-lg"
      >
        We&apos;ll build your personalized peptide protocol around this.
      </motion.p>

      <motion.div
        variants={stagger.container}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl"
      >
        {GOALS.map((goal) => (
          <SpotlightCard key={goal} goal={goal} onSelect={onSelect} />
        ))}
      </motion.div>
    </div>
  );
}
