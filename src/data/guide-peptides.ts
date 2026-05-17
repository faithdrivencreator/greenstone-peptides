// src/data/guide-peptides.ts
//
// Maps each GuideGoal to the actual hero peptides for that goal, with image
// paths verified against /public/images/products/. Used by HowItWorks to
// render product imagery instead of paragraph copy.
//
// IMPORTANT: tirzepatide-15mg-5ml.jpg is confirmed present (see ls of
// public/images/products/) so we don't need the ODT fallback.

import type { GuideGoal } from '@/lib/guide-logic';
import type { MechanismLink } from '@/components/PeptideGuide/GuidePrimitives';

export interface GoalPeptide {
  name: string;
  role: string;     // eyebrow label — short
  caption: string;  // 1 sentence max
  imageSrc: string; // absolute public path
}

export interface GoalMechanism {
  /** A 3-node biological flow customers can read at a glance. */
  chain: MechanismLink[];
  /** One sentence that ties the chain together. */
  caption: string;
}

export const GOAL_PEPTIDES: Record<GuideGoal, GoalPeptide[]> = {
  'lose-weight': [
    {
      name: 'Semaglutide',
      role: 'GLP-1 Agonist',
      caption: 'Signals fullness, slows gastric emptying, reduces cravings.',
      imageSrc: '/images/products/semaglutide-2-5mg-ml-2ml.jpg',
    },
    {
      name: 'Tirzepatide',
      role: 'Dual GIP / GLP-1',
      caption: 'Two pathways at once — appetite control + insulin sensitivity.',
      imageSrc: '/images/products/tirzepatide-15mg-5ml.jpg',
    },
  ],
  'build-recover': [
    {
      name: 'BPC-157',
      role: 'Tissue Repair',
      caption: 'Drives new blood vessel formation in injured tendons and muscle.',
      imageSrc: '/images/products/bpc-157-5mg.jpg',
    },
    {
      name: 'TB-500',
      role: 'Cellular Regeneration',
      caption: 'Regulates actin so damaged cells can migrate to the injury site.',
      imageSrc: '/images/products/tb-500-5mg.jpg',
    },
  ],
  'anti-aging': [
    {
      name: 'Sermorelin',
      role: 'GH Restoration',
      caption: 'Cues your pituitary to release growth hormone on its own rhythm.',
      imageSrc: '/images/products/sermorelin-4mg.jpg',
    },
    {
      name: 'NAD+',
      role: 'Cellular Energy',
      caption: 'The coenzyme every cell uses for DNA repair and energy.',
      imageSrc: '/images/products/nad-plus-200mg-ml.jpg',
    },
  ],
  'energy-metabolism': [
    {
      name: 'NAD+',
      role: 'Mitochondrial Fuel',
      caption: 'Restores the coenzyme your mitochondria burn for energy.',
      imageSrc: '/images/products/nad-plus-200mg-ml.jpg',
    },
    {
      name: 'MOTS-c',
      role: 'Fat-Burn Switch',
      caption: 'Activates AMPK — the enzyme that tells cells to burn fat for fuel.',
      imageSrc: '/images/products/mots-c-20mg.jpg',
    },
  ],
  'mens-health': [
    {
      name: 'Sildenafil / Tadalafil ODT',
      role: 'PDE5 Inhibitor',
      caption: 'Dissolves under the tongue for faster absorption than tablets.',
      imageSrc: '/images/products/sildenafil-tadalafil-55-22mg-odt.jpg',
    },
    {
      name: 'Sermorelin',
      role: 'GH Support',
      caption: 'Restores the hormonal foundation that drives drive after 35.',
      imageSrc: '/images/products/sermorelin-4mg.jpg',
    },
  ],
  'womens-health': [
    {
      name: 'Sermorelin',
      role: 'GH Restoration',
      caption: 'Supports skin elasticity, deep sleep, and body composition.',
      imageSrc: '/images/products/sermorelin-4mg.jpg',
    },
    {
      name: 'NAD+',
      role: 'Cellular Energy',
      caption: 'Targets the cellular energy decline behind fatigue and brain fog.',
      imageSrc: '/images/products/nad-plus-200mg-ml.jpg',
    },
    {
      name: 'MOTS-c',
      role: 'Metabolic Support',
      caption: 'Helps maintain metabolic flexibility through perimenopause.',
      imageSrc: '/images/products/mots-c-20mg.jpg',
    },
  ],
};

/**
 * Visual mechanism chain per goal: hero peptide image -> biological output ->
 * outcome. Renders as `<MechanismChain />`.
 */
export const GOAL_MECHANISMS: Record<GuideGoal, GoalMechanism> = {
  'lose-weight': {
    chain: [
      {
        imageSrc: '/images/products/semaglutide-2-5mg-ml-2ml.jpg',
        sublabel: 'Peptide',
        label: 'GLP-1 agonist',
      },
      { sublabel: 'Signal', label: 'Brain: "I\'m full"' },
      { sublabel: 'Outcome', label: 'Sustained fat loss' },
    ],
    caption: 'GLP-1 peptides mimic the hormone your gut releases after eating — your brain reads fullness, cravings drop, and the body shifts toward stored fat.',
  },
  'build-recover': {
    chain: [
      {
        imageSrc: '/images/products/bpc-157-5mg.jpg',
        sublabel: 'Peptide',
        label: 'BPC-157',
      },
      { sublabel: 'Action', label: 'New blood vessels' },
      { sublabel: 'Outcome', label: 'Faster healing' },
    ],
    caption: 'BPC-157 promotes blood vessel formation in injured tissue, even in low-circulation areas like tendons and ligaments — TB-500 layers in cellular repair.',
  },
  'anti-aging': {
    chain: [
      {
        imageSrc: '/images/products/sermorelin-4mg.jpg',
        sublabel: 'Peptide',
        label: 'Sermorelin',
      },
      { sublabel: 'Action', label: 'Natural GH release' },
      { sublabel: 'Outcome', label: 'Cellular renewal' },
    ],
    caption: 'Sermorelin cues your own pituitary to release growth hormone on its natural pulse — and NAD+ restores the cellular energy that powers DNA repair.',
  },
  'energy-metabolism': {
    chain: [
      {
        imageSrc: '/images/products/nad-plus-200mg-ml.jpg',
        sublabel: 'Peptide',
        label: 'NAD+',
      },
      { sublabel: 'Action', label: 'Powers mitochondria' },
      { sublabel: 'Outcome', label: 'Sustained energy' },
    ],
    caption: 'NAD+ fuels every mitochondrion in your body; MOTS-c flips on AMPK, the enzyme that signals cells to burn fat instead of storing it.',
  },
  'mens-health': {
    chain: [
      {
        imageSrc: '/images/products/sildenafil-tadalafil-55-22mg-odt.jpg',
        sublabel: 'Compound',
        label: 'PDE5 inhibitor',
      },
      { sublabel: 'Action', label: 'Vasodilation' },
      { sublabel: 'Outcome', label: 'Improved performance' },
    ],
    caption: 'PDE5 inhibitors relax smooth muscle and improve blood flow on demand. Sermorelin layers in the hormonal foundation that supports it long-term.',
  },
  'womens-health': {
    chain: [
      {
        imageSrc: '/images/products/sermorelin-4mg.jpg',
        sublabel: 'Peptide',
        label: 'Sermorelin',
      },
      { sublabel: 'Action', label: 'GH restoration' },
      { sublabel: 'Outcome', label: 'Energy + sleep + skin' },
    ],
    caption: 'Sermorelin restores natural growth hormone rhythm; NAD+ and MOTS-c rebuild the cellular energy and metabolic flexibility that shift after 35.',
  },
};
