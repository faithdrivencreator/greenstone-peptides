'use client';

import { motion } from 'framer-motion';
import { Dna, Zap, ShieldCheck, TrendingUp, FlaskConical, ArrowRight } from 'lucide-react';
import { OdometerNumber } from './OdometerNumber';

interface StepWelcomeProps {
  onStart: () => void;
}

const STATS = [
  { value: '7,000+', label: 'Naturally occurring peptides identified in the human body' },
  { value: '15–20%', label: 'Average body weight reduction seen in GLP-1 clinical trials' },
  { value: '50+', label: 'FDA-approved peptide-based medications currently on the market' },
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
      {/* Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald/10 border border-emerald/30 text-emerald text-sm font-medium tracking-wider uppercase mb-6" style={{ borderRadius: '4px' }}>
        <Dna className="w-4 h-4" />
        Personalized Protocol Builder
      </div>

      <h1 className="font-cormorant text-4xl sm:text-5xl text-white mb-4 leading-tight" style={{ fontWeight: 400 }}>
        Welcome to Your<br />
        <em className="italic text-gold">Peptide Journey</em>
      </h1>

      <p className="text-cream-dim text-lg leading-relaxed mb-8 max-w-2xl">
        Peptides are short chains of amino acids — the same building blocks your body already produces naturally.
        They work by signaling your cells to do what they already know how to do, just better.
        No synthetics forcing reactions. No stimulants overriding your biology. Just precise, targeted support.
      </p>

      {/* Stats with odometer counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 260, damping: 24 }}
            className="card-glass !p-5 text-left"
          >
            <OdometerNumber value={stat.value} className="font-cormorant text-3xl text-emerald mb-2" />
            <p className="text-cream-dim text-sm leading-snug">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* What peptides can support */}
      <div className="w-full bg-emerald/[0.05] border border-gold/15 p-6 mb-10" style={{ borderRadius: '8px' }}>
        <p className="font-jetbrains text-gold text-[0.65rem] uppercase tracking-[0.2em] mb-4 text-center">What peptides can support</p>
        <div className="flex flex-wrap justify-center gap-3">
          {BENEFITS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-gold/15 text-cream-dim text-sm" style={{ borderRadius: '4px' }}
            >
              <Icon className="w-4 h-4 text-emerald" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* How this works */}
      <p className="text-cream-dim/70 text-sm mb-6">
        Answer 3 quick questions. We match you to your protocol. You learn exactly how to use it safely.
      </p>

      <motion.button
        onClick={onStart}
        whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(201, 169, 110, 0.3)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="btn btn-solid group flex items-center gap-3 !px-10 !py-4 !text-lg hover:gap-4 transition-[gap] duration-200"
      >
        Begin Your Protocol
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </motion.button>

      <p className="text-cream-dim/40 font-jetbrains text-[0.65rem] tracking-wider mt-4">
        Takes about 3 minutes. No account required.
      </p>
    </div>
  );
}
