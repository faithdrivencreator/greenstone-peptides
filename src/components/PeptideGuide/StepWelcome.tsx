'use client';

import { motion } from 'framer-motion';
import { Dna, Zap, ShieldCheck, TrendingUp, FlaskConical, ArrowRight } from 'lucide-react';
import { OdometerNumber } from './OdometerNumber';
import { GuideEyebrow, GuideHeading } from './GuidePrimitives';

interface StepWelcomeProps {
  onStart: () => void;
}

const STATS = [
  { value: '7,000+', label: 'peptides identified in the human body' },
  { value: '15-20%', label: 'body weight reduction in GLP-1 trials' },
  { value: '50+', label: 'FDA-approved peptide medications' },
];

const BENEFITS = [
  { icon: TrendingUp, label: 'Weight & Metabolism' },
  { icon: Zap, label: 'Energy & Recovery' },
  { icon: ShieldCheck, label: 'Cellular Repair' },
  { icon: Dna, label: 'Hormone Support' },
  { icon: FlaskConical, label: 'Longevity & Anti-Aging' },
];

export function StepWelcome({ onStart }: StepWelcomeProps) {
  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto text-center">
      <GuideEyebrow icon={Dna} className="mb-6">
        Personalized Protocol Builder
      </GuideEyebrow>

      <GuideHeading
        title={
          <>
            Welcome to Your<br />
            <em className="italic text-gold">Peptide Journey</em>
          </>
        }
        subtitle="Same building blocks your body already produces — used to signal your cells to do what they already know how to do, just better."
        className="mb-10"
      />

      {/* Stats — centered text inside centered cards (fixes the off-look) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
            className="card-glass !p-5 flex flex-col items-center text-center"
          >
            <OdometerNumber value={stat.value} className="font-cormorant text-3xl text-emerald mb-2" />
            <p className="text-cream-dim text-xs leading-snug">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* What peptides can support — eyebrow now uses the shared primitive, perfectly centered */}
      <div
        className="w-full card-glass !p-6 mb-10 flex flex-col items-center"
      >
        <GuideEyebrow tone="gold" className="mb-5">
          What peptides can support
        </GuideEyebrow>
        <div className="flex flex-wrap justify-center gap-2.5">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3.5 py-2 bg-white/[0.03] border border-gold/15 text-cream-dim text-xs sm:text-sm"
              style={{ borderRadius: '4px' }}
            >
              <Icon className="w-3.5 h-3.5 text-emerald" />
              {label}
            </div>
          ))}
        </div>
      </div>

      <p className="font-jetbrains text-cream-dim/60 text-[0.65rem] tracking-[0.18em] uppercase mb-5">
        3 questions · 3 minutes · no account
      </p>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(111,168,220,0.3)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="btn btn-solid group flex items-center gap-3 !px-10 !py-4 !text-lg hover:gap-4 transition-[gap] duration-200"
      >
        Begin Your Protocol
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </div>
  );
}
