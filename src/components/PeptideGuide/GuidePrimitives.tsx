'use client';

/**
 * Shared visual primitives for the Peptide Protocol Guide.
 * Keeps card style, eyebrow label, section heading, and the visual
 * mechanism-chain consistent across every step of the flow.
 */

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/* ---------- Eyebrow label ---------- */

interface GuideEyebrowProps {
  icon?: LucideIcon;
  children: ReactNode;
  tone?: 'emerald' | 'gold';
  className?: string;
}

export function GuideEyebrow({
  icon: Icon,
  children,
  tone = 'emerald',
  className = '',
}: GuideEyebrowProps) {
  const color = tone === 'gold' ? 'text-gold' : 'text-emerald';
  const border = tone === 'gold' ? 'border-gold/25' : 'border-emerald/30';
  const bg = tone === 'gold' ? 'bg-gold/[0.06]' : 'bg-emerald/[0.08]';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 ${bg} border ${border} ${color} font-jetbrains text-[0.6rem] tracking-[0.25em] uppercase ${className}`}
      style={{ borderRadius: '4px' }}
    >
      {Icon ? <Icon className="w-3.5 h-3.5" /> : null}
      {children}
    </div>
  );
}

/* ---------- Section heading (always centered) ---------- */

interface GuideHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export function GuideHeading({ eyebrow, title, subtitle, className = '' }: GuideHeadingProps) {
  return (
    <div className={`w-full flex flex-col items-center text-center ${className}`}>
      {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
      <h2
        className="font-cormorant text-white text-3xl sm:text-4xl leading-tight"
        style={{ fontWeight: 400 }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="text-cream-dim text-sm sm:text-base leading-relaxed max-w-xl mt-3">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- Peptide product mini-card (used on HowItWorks + recommendation supporting slots) ---------- */

interface PeptideCardProps {
  name: string;
  role: string; // one-line role label e.g. "GLP-1 agonist"
  caption: string; // one short sentence
  imageSrc: string;
  delay?: number;
}

export function PeptideCard({ name, role, caption, imageSrc, delay = 0 }: PeptideCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 24 }}
      className="card-glass flex flex-col !p-0 overflow-hidden hover:!border-gold/40 transition-colors"
    >
      <div className="relative w-full aspect-square bg-gradient-to-br from-emerald/15 to-obsidian">
        <Image
          src={imageSrc}
          alt={`${name} — ${role}`}
          fill
          sizes="(max-width: 640px) 50vw, 240px"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col items-center text-center px-4 pt-4 pb-5">
        <div className="font-jetbrains text-[0.55rem] tracking-[0.25em] uppercase text-emerald mb-1.5">
          {role}
        </div>
        <h4 className="font-cormorant text-white text-lg leading-tight mb-2" style={{ fontWeight: 500 }}>
          {name}
        </h4>
        <p className="text-cream-dim text-xs leading-snug">{caption}</p>
      </div>
    </motion.div>
  );
}

/* ---------- Mechanism chain (visual replacement for the text "A → B → C" band) ---------- */

export interface MechanismLink {
  /** Either an image path or a lucide icon — image wins if both. */
  imageSrc?: string;
  icon?: LucideIcon;
  label: string;
  sublabel?: string;
}

interface MechanismChainProps {
  steps: MechanismLink[];
  /** "What happens" caption shown under the chain on every breakpoint */
  caption?: string;
}

export function MechanismChain({ steps, caption }: MechanismChainProps) {
  return (
    <div className="w-full card-glass !p-5 sm:!p-6">
      <div className="flex flex-col items-center gap-3 mb-4">
        <GuideEyebrow tone="gold">The Mechanism</GuideEyebrow>
      </div>

      {/* Chain — horizontal on sm+, vertical on mobile */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-center gap-2 sm:gap-1">
            <MechanismNode link={s} />
            {i < steps.length - 1 ? (
              <ArrowRight className="w-5 h-5 text-gold/70 rotate-90 sm:rotate-0 shrink-0" />
            ) : null}
          </div>
        ))}
      </div>

      {caption ? (
        <p className="text-cream-dim text-xs sm:text-sm leading-relaxed text-center mt-5 max-w-md mx-auto">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

function MechanismNode({ link }: { link: MechanismLink }) {
  const { imageSrc, icon: Icon, label, sublabel } = link;

  return (
    <div className="flex flex-col items-center text-center w-32 sm:w-32">
      <div className="w-20 h-20 sm:w-20 sm:h-20 relative bg-gradient-to-br from-emerald/15 to-obsidian border border-emerald/25 flex items-center justify-center overflow-hidden mb-2"
        style={{ borderRadius: '8px' }}>
        {imageSrc ? (
          <Image src={imageSrc} alt={label} fill sizes="80px" className="object-cover" />
        ) : Icon ? (
          <Icon className="w-9 h-9 text-emerald" />
        ) : null}
      </div>
      <div className="font-jetbrains text-[0.55rem] tracking-[0.18em] uppercase text-emerald mb-0.5">
        {sublabel ?? ' '}
      </div>
      <div className="text-white text-xs sm:text-[0.78rem] leading-tight">{label}</div>
    </div>
  );
}
