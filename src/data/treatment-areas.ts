/**
 * Treatment area content for the `/treatments/<slug>` landing pages.
 *
 * Mirrors Bloom's educational layout structure:
 *   - Hero (italic, 2-line headline)
 *   - Lead paragraph
 *   - 4 explainer blocks (vary by category)
 *
 * Sub-areas (peptides only) carry their own hero + lead + 2 explainer blocks.
 *
 * Source: docs/bloom-canonical-content-v2.md (scraped 2026-05-20 from
 * bloom.greenstonerx.com/dtp/<clinic-id>/learn). Longevity content is original
 * — Bloom doesn't have a Longevity category; our NAD+, MOTS-c, and GHK-Cu
 * live there per our taxonomy.
 */

import type { ParentProduct, PeptideSubArea } from './parent-products';

/** A single explainer block on a treatment-area landing page. */
export type TreatmentExplainer = {
  heading: string;
  body: string;
};

/** A peptides sub-area (Healing / Growth Hormone / Metabolism / Collagen). */
export type SubAreaContent = {
  id: PeptideSubArea;
  /** Display label used in headings and breadcrumbs. */
  label: string;
  /** 2-line italic hero — break point handled in the renderer. */
  heroLine1: string;
  heroLine2: string;
  /** Lead paragraph below the hero. */
  lead: string;
  /** 2 explainer blocks per sub-area (matches Bloom). */
  explainers: TreatmentExplainer[];
};

export type TreatmentArea = {
  /** Matches `ParentProduct['category']`. */
  category: ParentProduct['category'];
  /** Display label (singular form, used in headings). */
  label: string;
  /** Eyebrow text above the hero, all-caps. */
  eyebrow: string;
  /** 2-line italic hero — break point handled in the renderer. */
  heroLine1: string;
  heroLine2: string;
  /** Lead paragraph below the hero. */
  lead: string;
  /** 4 explainer blocks (Bloom standard structure: How this works / Who does
   *  well / Who should wait / Timelines — or category-specific variations). */
  explainers: TreatmentExplainer[];
  /** Peptides only — the 4 sub-areas in display order. */
  subAreas?: SubAreaContent[];
};

export const TREATMENT_AREAS: TreatmentArea[] = [
  {
    category: 'weight-loss',
    label: 'Weight Loss',
    eyebrow: 'Weight Loss',
    heroLine1: 'GLP-1s changed',
    heroLine2: "what's possible.",
    lead:
      'For decades, sustained weight loss was a coin flip — willpower against biology. Biology usually won. A new class of medications changes the math. They work on the same hunger and satiety signals your body already uses, just louder and longer.',
    explainers: [
      {
        heading: 'How this works in your body',
        body:
          'After you eat, your gut releases a hormone called GLP-1. It tells your pancreas to release insulin, slows stomach emptying, and tells your brain you\'ve had enough. In many people that signal is weak or short-lived. GLP-1 medications are synthetic versions that last days instead of minutes. Some — like tirzepatide — also activate a second hormone, GIP, which seems to amplify the effect. You\'ll notice smaller portions feel like enough. The constant background hum of "what\'s next to eat" — what patients call food noise — quiets down.',
      },
      {
        heading: 'Who does well',
        body:
          'Adults with a BMI over 27 who have tried calorie restriction and found it unsustainable. People with type 2 diabetes or pre-diabetes. Patients frustrated by diets that worked short-term but rebounded.',
      },
      {
        heading: 'Who should wait',
        body:
          'Personal or family history of medullary thyroid cancer. Pregnancy or breastfeeding. Active gallbladder disease. History of pancreatitis. Your provider will screen for these during your intake.',
      },
      {
        heading: 'What timelines actually look like',
        body:
          'Most patients lose 5–10% of starting weight in the first 3 months, 15–20% by month 6–9 on an optimal dose. Weight loss is not linear — expect plateaus. Side effects (nausea, constipation) are most common the week after each dose increase and fade with time.',
      },
    ],
  },

  {
    category: 'peptides',
    label: 'Peptides',
    eyebrow: 'Peptides',
    heroLine1: 'Short signals.',
    heroLine2: 'Real mechanism.',
    lead:
      'Peptides are small protein fragments — 2 to 50 amino acids — that act as messengers. Insulin is a peptide. So is oxytocin. Modern peptide therapy uses synthetic versions to target specific signals: heal this tissue, release more growth hormone, improve mitochondrial function.',
    explainers: [
      {
        heading: 'Why peptides, specifically',
        body:
          'Unlike small-molecule drugs, peptides typically bind one receptor and do one job. That specificity is the appeal — and the reason they\'re used alongside, not instead of, conventional treatment. Side-effect profiles tend to be narrower than systemic medications because the signal is shorter and more contained.',
      },
      {
        heading: 'How we organize this category',
        body:
          'Peptides come in clusters by mechanism. Healing peptides (BPC-157, TB-500) speed soft-tissue repair. Growth-hormone peptides (Sermorelin, Tesamorelin) signal your pituitary to pulse its own GH. Pick the goal first, then the molecule.',
      },
      {
        heading: 'How protocols work',
        body:
          'Most peptide protocols run in defined cycles — a loading phase, then maintenance, then a planned pause. The exact pattern depends on the molecule and your goal. Injectable peptides are typically self-administered with a small subcutaneous needle, similar to insulin.',
      },
      {
        heading: 'What to be careful about',
        body:
          'Peptides are not a stack-everything category. Doubling up molecules with similar mechanisms doesn\'t double the effect — and can make side effects harder to attribute. Active cancer is a contraindication for several peptides because they signal cell growth and vessel formation. Pregnancy is a contraindication for nearly all peptide protocols. Your physician will screen for these.',
      },
    ],
    subAreas: [
      {
        id: 'healing',
        label: 'Healing & Recovery',
        heroLine1: 'When the body',
        heroLine2: 'is the bottleneck.',
        lead:
          'Tendons, ligaments, and gut lining heal slowly because their blood supply is limited. Healing peptides act on local repair signals — promoting new vessel growth, reducing inflammation, and accelerating cellular turnover where the body is already trying to mend itself.',
        explainers: [
          {
            heading: 'Common use cases',
            body:
              'Tendinopathies (chronic Achilles, tennis elbow, rotator cuff). Post-surgical recovery. Persistent gut inflammation when conventional treatment has plateaued. Athletes use them between hard training cycles.',
          },
          {
            heading: 'Realistic timelines',
            body:
              'Most patients on a 4–8 week course report noticeable change in pain or range of motion. Imaging changes (when looked at) lag behind symptom improvement by weeks. These are rehab adjuncts, not standalone fixes — they work best alongside physical therapy.',
          },
        ],
      },
      {
        id: 'growth-hormone',
        label: 'Growth Hormone Support',
        heroLine1: 'Your pituitary,',
        heroLine2: 'recalibrated.',
        lead:
          'Growth hormone falls steeply after age 30. Synthetic GH replaces it directly — but blunts the natural pulse pattern your body uses. GH-releasing peptides do something different: they tell your own pituitary to pulse harder. The result is a more physiologic rhythm, not a flat replacement.',
        explainers: [
          {
            heading: 'What you might notice',
            body:
              "Better sleep depth in the first 2–3 weeks. Recovery from training showing up sooner. Body composition shifts — slightly leaner, slightly more lean tissue — over 8–12 weeks. These aren't dramatic changes; they're the kind of compounding optimization people pursue alongside training and nutrition.",
          },
          {
            heading: 'Why timing matters',
            body:
              'Most GH peptides are dosed at bedtime because GH naturally pulses during deep sleep. Taking them before bed amplifies your existing rhythm rather than fighting it. Take them on a relatively empty stomach — high blood sugar suppresses GH release.',
          },
        ],
      },
      {
        id: 'metabolism',
        label: 'Metabolism & Cellular Energy',
        heroLine1: 'Cells run',
        heroLine2: 'on signals too.',
        lead:
          'Your mitochondria — the power plants in every cell — have their own genome and their own signaling system. Peptides like MOTS-c and molecules like NAD⁺ act on that mitochondrial layer, supporting energy production, insulin sensitivity, and cellular cleanup that slows down with age.',
        explainers: [
          {
            heading: "What this is and isn't",
            body:
              "These are not stimulants. They don't make you feel a buzz. They support the underlying machinery that converts food into usable energy. Patients describe better stamina across the day rather than a noticeable peak.",
          },
          {
            heading: 'Where it fits in a protocol',
            body:
              "These pair well with weight-loss and growth-hormone protocols where energy can dip during titration. Often used as standalone longevity protocols too — restoring mitochondrial co-factors that decline with age.",
          },
        ],
      },
      {
        id: 'collagen',
        label: 'Collagen & Skin',
        heroLine1: 'Repair starts',
        heroLine2: 'at the protein.',
        lead:
          'Skin, scalp, and connective tissue are mostly collagen. As you age, collagen synthesis slows and breakdown speeds up. GHK-Cu binds copper and signals fibroblasts — the cells that build collagen — to start working again.',
        explainers: [
          {
            heading: 'Where this fits',
            body:
              "GHK-Cu is most studied in skin: improved firmness, fewer fine lines, better wound healing. It's also used for hair density and as an adjunct to procedures that intentionally damage tissue (microneedling, laser) so the rebuild step goes faster.",
          },
          {
            heading: 'What to expect',
            body:
              'Skin and scalp changes over 8–12 weeks of consistent use. Effects continue with ongoing use; benefits gradually plateau if treatment stops. Often combined with topical retinoids and a clinical skincare routine.',
          },
        ],
      },
    ],
  },

  {
    category: 'longevity',
    label: 'Longevity',
    eyebrow: 'Longevity',
    heroLine1: 'Cellular maintenance.',
    heroLine2: 'Compounding gains.',
    lead:
      'As you age, the machinery that produces energy, repairs DNA, and rebuilds connective tissue slows down. Longevity protocols target those underlying systems — not the symptoms. The result is usually subtle: more stamina across the day, faster recovery, gradual changes in body composition over months.',
    explainers: [
      {
        heading: 'How this works in your body',
        body:
          'NAD⁺ is a coenzyme central to mitochondrial energy production and DNA repair. Its levels fall steeply with age. MOTS-c is a peptide encoded in your mitochondrial DNA that signals improved insulin sensitivity and glucose handling. Both work at the cellular layer rather than producing a felt effect — you don\'t feel a buzz; the machinery just runs better.',
      },
      {
        heading: 'Who does well',
        body:
          'Adults pursuing longevity-focused therapy. Patients with persistent fatigue or recovery issues. People with metabolic syndrome features or pre-diabetic markers. Often combined with strength training and a deliberate nutrition plan — these protocols compound when paired with the basics.',
      },
      {
        heading: 'Who should wait',
        body:
          'Pregnancy is a contraindication for these protocols. Discuss with your provider if you\'re on cancer therapy — both NAD⁺ and certain peptides have theoretical interactions worth screening for.',
      },
      {
        heading: 'What timelines look like',
        body:
          'Some patients report energy improvement within days on NAD⁺. Lab markers (insulin sensitivity, fasting glucose) tend to shift over 8–12 weeks. Body composition and recovery changes show up subtly over months. These aren\'t dramatic interventions — they\'re the kind of compounding optimization people pursue alongside the rest of their habits.',
      },
    ],
  },

  {
    category: 'mens-ed',
    label: "Men's ED",
    eyebrow: "Men's ED",
    heroLine1: 'When biology',
    heroLine2: 'needs a nudge.',
    lead:
      "Erectile dysfunction is mostly a circulation problem, not a desire problem. Modern oral therapies open up blood flow at the right moment. They don't change libido, they change capability — and that's usually what's actually missing.",
    explainers: [
      {
        heading: 'How these work',
        body:
          "PDE5 inhibitors — sildenafil, tadalafil, vardenafil — block an enzyme that breaks down a molecule called cGMP. With cGMP intact, blood vessels in the penis relax and fill predictably during arousal. They don't cause arousal; they let arousal complete its job.",
      },
      {
        heading: 'Sildenafil vs tadalafil',
        body:
          'Sildenafil works in 30–60 minutes and lasts 4–6 hours — best for planned activity. Tadalafil lasts up to 36 hours and can be taken daily at a low dose for ongoing readiness. Both are equivalent in efficacy for most men; the difference is timing. Our compounded ODT pairs both molecules so you get the fast onset of sildenafil plus the duration of tadalafil in one tablet.',
      },
      {
        heading: 'Who does well',
        body:
          'Men with situational or persistent erectile difficulty. Particularly useful for men over 40, those with cardiovascular risk factors, or men recovering from prostate surgery (under provider guidance).',
      },
      {
        heading: 'Who should wait',
        body:
          'Currently using nitrates for chest pain (combining can drop blood pressure dangerously). Severe heart, liver, or kidney disease. Recent stroke or heart attack. Your provider will review your full history.',
      },
    ],
  },
];

/** Look up a treatment area by category slug. */
export function getTreatmentAreaByCategory(
  category: ParentProduct['category'],
): TreatmentArea | undefined {
  return TREATMENT_AREAS.find((t) => t.category === category);
}

/** Look up a peptide sub-area within the Peptides treatment area. */
export function getPeptideSubArea(id: PeptideSubArea): SubAreaContent | undefined {
  const peptides = getTreatmentAreaByCategory('peptides');
  return peptides?.subAreas?.find((s) => s.id === id);
}
