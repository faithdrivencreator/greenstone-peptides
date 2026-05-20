'use client';

import { motion } from 'framer-motion';
import { BadgeCheck, Stethoscope, Package } from 'lucide-react';

type Step = {
  n: string;
  title: string;
  body: string;
  detail: string;
  Icon: typeof BadgeCheck;
};

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Choose your protocol',
    body: 'Browse the formulary or take a 3-minute consult.',
    detail: '11 medications · 4 treatment areas',
    Icon: BadgeCheck,
  },
  {
    n: '02',
    title: 'Physician review',
    body: 'A U.S.-licensed physician reviews your health screening — usually within 1–4 hours.',
    detail: 'Same-day approvals · No video call required',
    Icon: Stethoscope,
  },
  {
    n: '03',
    title: 'Pharmacy ships',
    body: 'Greenstone Rx, a 503A compounding pharmacy in Florida, prepares and ships your medication.',
    detail: 'USP 797 sterile · Specialized cold-chain packaging',
    Icon: Package,
  },
];

export function HeroHowItWorks() {
  return (
    <div className="relative" aria-label="How it works">
      {/* Eyebrow above the timeline */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="font-jetbrains text-[0.65rem] tracking-[0.25em] uppercase text-emerald/80 mb-5 pl-14"
      >
        // How it works
      </motion.p>

      {/* Timeline container — relative so the spine + markers stack */}
      <div className="relative">
        {/* Vertical connecting spine (gradient emerald → transparent at the bottom) */}
        <div
          className="absolute left-[22px] top-2 bottom-2 w-px pointer-events-none overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(26,158,110,0.55) 0%, rgba(26,158,110,0.35) 60%, rgba(26,158,110,0) 100%)',
            }}
          />
          {/* Scanning emerald gradient that travels down the spine */}
          <motion.div
            className="absolute left-0 right-0 h-24"
            style={{
              background:
                'linear-gradient(to bottom, transparent 0%, rgba(38,201,138,0.9) 50%, transparent 100%)',
              filter: 'blur(1px)',
            }}
            initial={{ top: '-25%' }}
            animate={{ top: '110%' }}
            transition={{
              duration: 4.5,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          />
        </div>

        <ol className="space-y-4">
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;
            return (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative pl-14"
              >
                {/* Numbered marker — sits over the spine */}
                <div className="absolute left-0 top-3 z-10">
                  <div className="relative w-[46px] h-[46px] flex items-center justify-center">
                    {/* Glow ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(26,158,110,0.35) 0%, rgba(26,158,110,0) 70%)',
                      }}
                      aria-hidden
                    />
                    {/* Marker circle */}
                    <motion.div
                      className="relative w-[34px] h-[34px] rounded-full flex items-center justify-center bg-obsidian border border-emerald/50"
                      style={{
                        boxShadow:
                          '0 0 0 1px rgba(26,158,110,0.15), 0 0 18px rgba(26,158,110,0.18) inset',
                      }}
                      animate={
                        isLast
                          ? { opacity: [0.7, 1, 0.7] }
                          : { opacity: 1 }
                      }
                      transition={
                        isLast
                          ? {
                              duration: 3,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }
                          : undefined
                      }
                    >
                      <span className="font-cormorant italic text-2xl leading-none text-gold pb-[2px]">
                        {i + 1}
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Card */}
                <div
                  className="card-glass border-emerald/20 hover:border-emerald/45 transition-all duration-300 hover:-translate-y-[2px] !px-5 !py-4"
                  style={{ willChange: 'transform' }}
                >
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="font-cormorant text-xl text-cream leading-tight">
                      {step.title}
                    </h3>
                    <step.Icon
                      size={16}
                      className="text-emerald/70 flex-shrink-0 mt-1"
                      aria-hidden
                    />
                  </div>
                  <p className="text-sm text-cream-dim leading-relaxed mb-3">
                    {step.body}
                  </p>
                  <p className="font-jetbrains text-[0.65rem] tracking-wider uppercase text-emerald/80">
                    {step.detail}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default HeroHowItWorks;
