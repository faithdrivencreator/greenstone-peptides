// src/data/guide-content.ts
import type { GuideGoal } from '@/lib/guide-logic';

export interface SafetyItem {
  text: string;
  icon: string; // key into SAFETY_ICONS map in SafetyChecklist.tsx
}

export interface TutorialStep {
  step: number;
  title: string;
  description: string;
  imagePath: string; // stored in public/images/guide/
}

export interface GoalContent {
  goal: GuideGoal;
  label: string;
  tagline: string;
  howItWorksTitle: string;
  howItWorksBody: string;
  howItWorksMechanism: string;
  safetyItems: SafetyItem[];
  tutorialSteps: TutorialStep[];
  oralInstructions?: string;
  nasalInstructions?: string;
}

const INJECTABLE_TUTORIAL_STEPS: TutorialStep[] = [
  { step: 1, title: 'Gather Your Supplies', description: 'Vial, syringe, alcohol swab, sharps container', imagePath: '/images/guide/inject-step-1.png' },
  { step: 2, title: 'Draw the Dose', description: 'Pull back the plunger to your prescribed dose marking', imagePath: '/images/guide/inject-step-2.png' },
  { step: 3, title: 'Clean the Site', description: 'Wipe with alcohol swab in a circular motion. Wait 10 seconds.', imagePath: '/images/guide/inject-step-3.png' },
  { step: 4, title: 'Pinch the Skin', description: 'Gently pinch 1–2 inches of skin between thumb and finger', imagePath: '/images/guide/inject-step-4.png' },
  { step: 5, title: 'Insert & Inject Slowly', description: 'Insert at 45–90° angle, push plunger slowly and steadily', imagePath: '/images/guide/inject-step-5.png' },
  { step: 6, title: 'Dispose Safely', description: 'Place needle in sharps container immediately. Never recap.', imagePath: '/images/guide/inject-step-6.png' },
];

const INJECTABLE_SAFETY_ITEMS: SafetyItem[] = [
  { text: 'Wash hands thoroughly for 20 seconds', icon: 'hands' },
  { text: 'Clean injection site with alcohol swab — let dry', icon: 'swab' },
  { text: 'Inspect the vial: no particles or discoloration', icon: 'inspect' },
  { text: 'Use a new syringe every single time', icon: 'syringe' },
  { text: 'Rotate injection sites: abdomen, thigh, upper arm', icon: 'rotate' },
  { text: 'Dispose of needles in a sharps container', icon: 'dispose' },
];

export const GOAL_CONTENT: Record<GuideGoal, GoalContent> = {
  'lose-weight': {
    goal: 'lose-weight',
    label: 'Lose Weight',
    tagline: 'GLP-1 peptides that work with your body',
    howItWorksTitle: 'How GLP-1 Peptides Work',
    howItWorksBody:
      "Semaglutide and Tirzepatide mimic hormones your body naturally releases after eating. They signal your brain that you're full — so you eat less, your blood sugar stabilizes, and your body burns stored fat. Unlike stimulants, they work with your biology, not against it.",
    howItWorksMechanism: 'Gut → GLP-1 hormone signal → Brain: "I\'m full"',
    safetyItems: INJECTABLE_SAFETY_ITEMS,
    tutorialSteps: INJECTABLE_TUTORIAL_STEPS,
  },
  'build-recover': {
    goal: 'build-recover',
    label: 'Build & Recover',
    tagline: 'Peptides that accelerate tissue repair',
    howItWorksTitle: 'How Recovery Peptides Work',
    howItWorksBody:
      'BPC-157 and TB-500 are among the most studied recovery peptides. BPC-157 promotes blood vessel formation and accelerates tendon, ligament, and muscle healing. TB-500 regulates actin — a protein essential for cell movement — helping damaged tissue rebuild faster and more completely.',
    howItWorksMechanism: 'Peptide → Growth factors → Accelerated tissue repair',
    safetyItems: [
      { text: 'Wash hands thoroughly for 20 seconds', icon: 'hands' },
      { text: 'Clean injection site with alcohol swab — let dry', icon: 'swab' },
      { text: 'Inspect the vial: no particles or discoloration', icon: 'inspect' },
      { text: 'Use a new syringe every single time', icon: 'syringe' },
      { text: 'Rotate injection sites: near injury site or subcutaneous abdomen', icon: 'rotate' },
      { text: 'Dispose of needles in a sharps container', icon: 'dispose' },
    ],
    tutorialSteps: INJECTABLE_TUTORIAL_STEPS,
  },
  'anti-aging': {
    goal: 'anti-aging',
    label: 'Anti-Aging & Longevity',
    tagline: 'Cellular renewal from the inside out',
    howItWorksTitle: 'How Longevity Peptides Work',
    howItWorksBody:
      'NAD+ levels in the body decline by up to 50% between ages 40 and 60. NAD+ is a coenzyme essential for DNA repair, energy production, and cellular metabolism. Sermorelin stimulates your pituitary gland to naturally produce more growth hormone — supporting muscle tone, fat distribution, sleep quality, and skin thickness.',
    howItWorksMechanism: 'NAD+ → DNA repair + energy production → Cellular renewal',
    safetyItems: INJECTABLE_SAFETY_ITEMS,
    tutorialSteps: INJECTABLE_TUTORIAL_STEPS,
  },
  'energy-metabolism': {
    goal: 'energy-metabolism',
    label: 'Energy & Metabolism',
    tagline: 'Fuel your mitochondria',
    howItWorksTitle: 'How Metabolic Peptides Work',
    howItWorksBody:
      'NAD+ is the fuel your mitochondria run on. Every cell in your body uses it to convert food into energy. MOTS-c is a mitochondria-derived peptide that improves insulin sensitivity and activates AMPK — the enzyme that tells your cells to burn fat for fuel. Together they restore the metabolic function that naturally declines with age.',
    howItWorksMechanism: 'NAD+ + MOTS-c → Mitochondria → Cellular energy output',
    safetyItems: INJECTABLE_SAFETY_ITEMS,
    tutorialSteps: INJECTABLE_TUTORIAL_STEPS,
  },
  'mens-health': {
    goal: 'mens-health',
    label: "Men's Health",
    tagline: 'Performance and vitality support',
    howItWorksTitle: "How Men's Health Peptides Work",
    howItWorksBody:
      "Sildenafil and Tadalafil are FDA-approved PDE5 inhibitors that increase blood flow by relaxing smooth muscle tissue. In ODT (oral disintegrating tablet) form, they absorb faster than standard tablets. Sermorelin and Tesamorelin support natural growth hormone production — which affects energy, body composition, and sexual function in men over 35.",
    howItWorksMechanism: 'PDE5 inhibition → Vasodilation → Improved blood flow',
    safetyItems: [
      { text: 'Take ODT tablets on an empty stomach for best absorption', icon: 'clock' },
      { text: 'Place tablet under tongue — do not swallow whole', icon: 'pill' },
      { text: 'Do not eat or drink for 10 minutes after taking', icon: 'no-food' },
      { text: 'Do not combine with nitrate medications', icon: 'alert' },
      { text: 'Store in a cool, dry place away from light', icon: 'store' },
    ],
    tutorialSteps: [],
    oralInstructions:
      'Place tablet under your tongue. Let it dissolve completely — about 60–90 seconds. Do not eat or drink for 10 minutes. Do not swallow the tablet whole.',
  },
};
