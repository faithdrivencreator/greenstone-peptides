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
  {
    step: 1,
    title: 'Gather Your Supplies',
    description: 'Before you begin, lay out everything on a clean, flat surface: your peptide vial, a new sealed syringe (typically 29–31 gauge insulin syringe), an alcohol prep pad, and a sharps disposal container. Make sure the vial has been stored properly in the refrigerator and check the expiration date. Wash your hands thoroughly with soap and warm water for at least 20 seconds and dry with a clean towel.',
    imagePath: '/images/guide/inject-step-1.png',
  },
  {
    step: 2,
    title: 'Draw the Dose',
    description: 'Remove the cap from a new syringe. Pull back the plunger to draw in a small amount of air equal to your dose volume — this makes it easier to withdraw the liquid. Clean the rubber stopper on top of the vial with an alcohol swab and let it dry. Insert the needle through the rubber stopper, push the air into the vial, then turn the vial upside down. Slowly pull back the plunger to your indicated dose marking. Tap the syringe gently to move any air bubbles to the top, then push the plunger slightly to expel them.',
    imagePath: '/images/guide/inject-step-2.png',
  },
  {
    step: 3,
    title: 'Clean the Injection Site',
    description: 'Choose your injection site — the most common areas are the lower abdomen (at least 2 inches from the belly button), the front of the thigh, or the back of the upper arm. Rotate sites with each injection to prevent tissue irritation. Open a new alcohol prep pad and wipe the area in a circular motion, starting from the center and moving outward. Let the skin air dry completely — do not blow on it or fan it. Injecting into wet skin can sting.',
    imagePath: '/images/guide/inject-step-3.png',
  },
  {
    step: 4,
    title: 'Pinch the Skin',
    description: 'Using your non-dominant hand, gently pinch a fold of skin about 1 to 2 inches wide between your thumb and index finger. This lifts the subcutaneous fat layer away from the muscle beneath, ensuring the peptide is delivered into the fatty tissue where it absorbs properly. Hold the pinch throughout the injection — do not let go until the needle is removed. Keep the skin relaxed, not tense.',
    imagePath: '/images/guide/inject-step-4.png',
  },
  {
    step: 5,
    title: 'Insert & Inject Slowly',
    description: 'With the skin still pinched, hold the syringe like a pencil and insert the needle at a 45 to 90 degree angle in one smooth, quick motion. A 45-degree angle is better if you have less body fat at the injection site; 90 degrees works well for areas with more tissue. Once the needle is in, release the skin pinch and slowly push the plunger all the way down over 5 to 10 seconds. Injecting too fast can cause discomfort or bruising. After the plunger is fully depressed, wait 5 seconds before withdrawing the needle to ensure the full dose is delivered.',
    imagePath: '/images/guide/inject-step-5.png',
  },
  {
    step: 6,
    title: 'Dispose Safely',
    description: 'Pull the needle straight out at the same angle it went in. If there is a small drop of blood, apply gentle pressure with a clean cotton ball or gauze — do not rub the site, as this can push the peptide out or cause bruising. Place the used syringe directly into a sharps disposal container immediately. Never recap a used needle, bend it, or throw it in the regular trash. If you do not have a sharps container, a thick plastic laundry detergent bottle with a screw cap works as a temporary alternative. Store your peptide vial back in the refrigerator.',
    imagePath: '/images/guide/inject-step-6.png',
  },
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
  'womens-health': {
    goal: 'womens-health',
    label: "Women's Health",
    tagline: 'Hormone balance, energy, and vitality',
    howItWorksTitle: "How Women's Health Peptides Work",
    howItWorksBody:
      "Women's hormonal health shifts significantly after 30 — declining growth hormone, slower metabolism, reduced collagen production, and disrupted sleep patterns. Sermorelin restores natural growth hormone pulsatility, which directly supports body composition, skin quality, sleep depth, and energy. NAD+ addresses the cellular energy decline that drives fatigue, brain fog, and accelerated aging. MOTS-c improves insulin sensitivity and metabolic flexibility — particularly important for women navigating perimenopause and beyond.",
    howItWorksMechanism: 'Sermorelin → GH restoration → Metabolism + skin + sleep + energy',
    safetyItems: INJECTABLE_SAFETY_ITEMS,
    tutorialSteps: INJECTABLE_TUTORIAL_STEPS,
  },
};
