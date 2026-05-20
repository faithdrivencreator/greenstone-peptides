/**
 * Parent-product catalog — 14 molecule-level entries that consolidate the
 * 47 dose/size SKUs in `products.ts`.
 *
 * The front-end shop is intentionally lightweight: visitors get a clean
 * overview (one card per molecule, a variant price table on the detail page,
 * a single "Continue to Pharmacy" CTA). All purchase + dose selection happens
 * on the pharmacy storefront (Bloom). We don't duplicate Bloom's flow here.
 *
 * Bloom deep-link target: pulled from `docs/bloom-storefront-flow.md`.
 */

export type Variant = {
  /** Short label shown in the table row (e.g. "Starter · 1 mL"). */
  label: string;
  /** Strength descriptor (e.g. "2.5 mg/mL"). */
  dose: string;
  /** Pack size / format (e.g. "1 mL vial" or "30 ct ODT"). */
  size: string;
  /** Listed retail price in USD. */
  price: number;
};

/** Multi-stage timeline used for GLP-1s and similar step-up protocols. */
export type ExpectationStage = {
  /** Phase label, e.g. "Weeks 1–4". */
  phase: string;
  /** What the patient should expect during that phase. */
  detail: string;
};

/** Peptide sub-area used by the Peptides treatment landing page. */
export type PeptideSubArea =
  | 'healing'
  | 'growth-hormone'
  | 'metabolism'
  | 'collagen';

export type ParentProduct = {
  slug: string;
  name: string;
  /** Treatment vertical — maps the parent into the four-vertical strip. */
  category: 'weight-loss' | 'peptides' | 'mens-ed' | 'longevity';
  /** Short tagline shown on the catalog card. */
  shortDescription: string;
  /** Two- to three-sentence overview for the detail page hero. */
  longDescription: string;
  /** Bullet point highlights (3–4 items) for the detail page. */
  highlights: string[];
  /** Hero image path. */
  image: string;
  imageAlt: string;
  /** Variant matrix — every dose/size combo and its price. */
  variants: Variant[];

  // ---- Extended content sections (Bloom-equivalent depth) ----
  /** Mechanism of action — paragraph after the hero. */
  howItWorks: string;
  /** Indications / target patient — paragraph. */
  whoItsFor: string;
  /** Realistic timelines + side-effect framing. String for a single paragraph,
   *  or array of stages for step-up protocols (GLP-1s, BPC-157, etc.). */
  whatToExpect: string | ExpectationStage[];
  /** Contraindications — "Who should not take this" paragraph. */
  contraindications: string;
  /** Pharmacy-style typical starting dose. Replaces a dose-finder calculator.
   *  Always include the Bloom-verbatim disclaimer:
   *  "Suggestions only — your physician reviews and approves the final
   *  protocol before any medication ships." */
  startingDoseGuidance: string;
  /** Optional FAQ Q&A pairs. Bloom shows ~1–3 per molecule. */
  faq?: Array<{ q: string; a: string }>;
  /** Peptides only — which sub-area this molecule belongs to. */
  peptideSubArea?: PeptideSubArea;
};

const v = (label: string, dose: string, size: string, price: number): Variant => ({
  label,
  dose,
  size,
  price,
});

/** Standard pharmacy disclaimer for dose-guidance sections. Use verbatim. */
export const DOSE_DISCLAIMER =
  'Suggestions only — your physician reviews and approves the final protocol before any medication ships.';

export const PARENT_PRODUCTS: ParentProduct[] = [
  {
    slug: 'semaglutide',
    name: 'Semaglutide',
    category: 'weight-loss',
    shortDescription:
      'Once-weekly injection (or daily oral tablet) — the molecule that started this category.',
    longDescription:
      'Semaglutide is the most-studied GLP-1 receptor agonist in clinical practice today. As a compounded medication, it offers a flexible alternative to brand-name formulations — available as both injectable and oral dissolving tablet, in starter and maintenance doses.',
    highlights: [
      'Available as injectable or oral dissolving tablet (ODT)',
      'Compounded in an ISO Class 5 cleanroom · USP 797 sterile',
      'Third-party tested for potency and purity (HPLC ≥98%)',
      'Physician reviews your screening before any vial ships',
    ],
    image: '/images/products/semaglutide-2-5mg-ml-2ml.jpg',
    imageAlt: 'Semaglutide compounded injection vial',
    howItWorks:
      "Semaglutide mimics GLP-1, a gut hormone you already produce after meals. It slows stomach emptying, dampens appetite signals in the brain, and improves how your body handles glucose. The effect builds over weeks — you're not retraining willpower, you're retraining the underlying signals.",
    whoItsFor:
      'Adults seeking sustainable weight loss with a BMI over 27 (or over 30 without comorbidities). Patients with type 2 diabetes or prediabetes. People whose weight-loss attempts have stalled despite diet and exercise.',
    whatToExpect: [
      {
        phase: 'Weeks 1–4',
        detail:
          'Starter dose. Appetite drops noticeably. Some nausea or fullness is normal and usually mild.',
      },
      {
        phase: 'Weeks 4–12',
        detail:
          'Your provider will step up your dose monthly. Each step brings 2–4 days of digestive adjustment, then settles.',
      },
      {
        phase: 'Months 3–6',
        detail:
          'Therapeutic dose reached. Weight loss of 5–10% is typical. Food thoughts quieter.',
      },
      {
        phase: 'Beyond 6 months',
        detail: 'Continue at maintenance, or taper under supervision.',
      },
    ],
    contraindications:
      'Personal or family history of medullary thyroid carcinoma or MEN-2 syndrome. Pregnancy or planning pregnancy. Active pancreatitis or severe gallbladder disease.',
    startingDoseGuidance:
      'A typical starting protocol is 0.25 mg once weekly for the first month, then 0.5 mg weekly. Your physician will adjust on review. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    variants: [
      v('Starter injectable · 0.5 mL', '2.5 mg/mL', '0.5 mL vial', 47),
      v('Starter injectable · 1 mL', '2.5 mg/mL', '1 mL vial', 57),
      v('ODT starter · 30 ct', '0.5 mg', '30 tablets', 73),
      v('Standard injectable · 2 mL', '2.5 mg/mL', '2 mL vial', 88),
      v('ODT starter · 60 ct', '0.5 mg', '60 tablets', 103),
      v('Standard injectable · 3 mL', '2.5 mg/mL', '3 mL vial', 109),
      v('Standard injectable · 4 mL', '2.5 mg/mL', '4 mL vial', 119),
      v('ODT starter · 90 ct', '0.5 mg', '90 tablets', 134),
      v('Maintenance injectable · 2 mL', '5 mg', '2 mL vial', 134),
      v('ODT maintenance · 30 ct', '1.5 mg', '30 tablets', 140),
      v('High-concentration · 5 mL', '5 mg/mL', '5 mL vial', 165),
      v('ODT maintenance · 60 ct', '1.5 mg', '60 tablets', 212),
      v('Maximum concentration · 5 mL', '10 mg/mL', '5 mL vial', 227),
      v('ODT maintenance · 90 ct', '1.5 mg', '90 tablets', 248),
    ],
  },
  {
    slug: 'tirzepatide',
    name: 'Tirzepatide',
    category: 'weight-loss',
    shortDescription:
      'Dual GLP-1 + GIP agonist. In head-to-head studies, more weight loss on average than GLP-1 alone.',
    longDescription:
      'Tirzepatide activates both GIP and GLP-1 receptors — the same dual pathway as branded Mounjaro and Zepbound. In SURPASS and SURMOUNT trials, tirzepatide demonstrated greater average weight loss than semaglutide. Available compounded in injectable and ODT formats across starter, standard, and maintenance doses.',
    highlights: [
      'Dual incretin pathway · GIP + GLP-1 receptor activation',
      'Injectable + ODT formats · weekly or daily protocols',
      'Compounded under USP 797 sterile standards',
      'Same active molecule as Mounjaro / Zepbound',
    ],
    image: '/images/products/tirzepatide-10mg-1ml.jpg',
    imageAlt: 'Tirzepatide compounded injection vial',
    howItWorks:
      'Tirzepatide activates two gut-hormone receptors: GLP-1 (the same one semaglutide hits) and GIP. The GIP component appears to amplify the appetite-suppression and metabolic effects, which is why head-to-head studies show greater average weight loss.',
    whoItsFor:
      "Adults with significant weight to lose, particularly those who've tried a GLP-1 alone and found the results good but incomplete. Patients with type 2 diabetes — tirzepatide also has strong glycemic data.",
    whatToExpect: [
      {
        phase: 'Weeks 1–4',
        detail:
          'Starter dose (2.5 mg). Modest appetite reduction. Mild GI side effects.',
      },
      {
        phase: 'Weeks 4–16',
        detail:
          'Step-ups every 4 weeks: 5 mg → 7.5 mg → 10 mg. Each step has a few days of GI adjustment.',
      },
      {
        phase: 'Months 4–12',
        detail:
          'Most patients land at 10–15 mg. 15–20% body weight loss is common in clinical data.',
      },
    ],
    contraindications:
      'Same as semaglutide: medullary thyroid carcinoma history, MEN-2, pregnancy, active pancreatitis, severe gallbladder disease.',
    startingDoseGuidance:
      'A typical starting protocol is 2.5 mg once weekly for the first month, with stepped increases of 2.5 mg every 4 weeks as tolerated. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    variants: [
      v('ODT starter · 30 ct', '0.5 mg', '30 tablets', 88),
      v('Starter injectable · 1 mL', '10 mg', '1 mL vial', 88),
      v('Mid-dose injectable · 1 mL', '15 mg', '1 mL vial', 103),
      v('ODT starter · 60 ct', '0.5 mg', '60 tablets', 119),
      v('Standard injectable · 2 mL', '10 mg/mL', '2 mL vial', 119),
      v('High-dose injectable · 1 mL', '20 mg', '1 mL vial', 119),
      v('ODT starter · 90 ct', '0.5 mg', '90 tablets', 150),
      v('Standard injectable · 3 mL', '10 mg', '3 mL vial', 155),
      v('Mid-dose injectable · 2 mL', '15 mg', '2 mL vial', 155),
      v('Standard injectable · 4 mL', '10 mg/mL', '4 mL vial', 196),
      v('Mid-dose injectable · 3 mL', '15 mg', '3 mL vial', 201),
      v('Standard injectable · 5 mL', '10 mg/mL', '5 mL vial', 227),
      v('Mid-dose injectable · 4 mL', '15 mg', '4 mL vial', 248),
      v('High-dose injectable · 3 mL', '20 mg', '3 mL vial', 248),
      v('High-dose injectable · 5 mL', '20 mg', '5 mL vial', 304),
    ],
  },
  {
    slug: 'retatrutide',
    name: 'Retatrutide',
    category: 'weight-loss',
    shortDescription:
      'Triple agonist (GLP-1 + GIP + glucagon). Newer mechanism, strong early data.',
    longDescription:
      'Retatrutide is a triple agonist — activating GLP-1, GIP, and glucagon receptors simultaneously. In Phase 2 trials, retatrutide produced the largest average weight-loss signals to date. Compounded as an injectable at 20 mg/mL across three vial sizes for stepped titration.',
    highlights: [
      'Triple-pathway agonist · GLP-1 + GIP + glucagon',
      'Highest reported weight-loss signal of compounded GLP-class options',
      'Compounded under USP 797 sterile standards',
      'Three vial sizes for titration and maintenance',
    ],
    image: '/images/products/retatrutide-20mg-ml-3ml.jpg',
    imageAlt: 'Retatrutide compounded injection vial',
    howItWorks:
      'Retatrutide activates three receptors: GLP-1, GIP, and glucagon. The glucagon arm increases energy expenditure — your body burns more calories at rest — which differentiates it from the dual agonists.',
    whoItsFor:
      "Patients who haven't reached their goal on tirzepatide or semaglutide. Those whose providers think additional metabolic-rate effect would help. Phase 2 trial data show some patients losing 24%+ at the highest doses.",
    whatToExpect:
      'Slow ramp over 4–8 months. Higher peak doses than other GLP-1s. Side-effect profile similar to tirzepatide; nausea on dose increases.',
    contraindications:
      'Same family of contraindications as semaglutide and tirzepatide. As a newer molecule, screening is even more careful.',
    startingDoseGuidance:
      'A typical starting protocol is 2 mg once weekly, with slow titration over 4–8 months toward a higher peak dose than other GLP-1s. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    variants: [
      v('Introductory · 1 mL', '20 mg/mL', '1 mL vial', 263),
      v('Standard · 3 mL', '20 mg/mL', '3 mL vial', 371),
      v('Best value · 5 mL', '20 mg/mL', '5 mL vial', 433),
    ],
  },
  {
    slug: 'semaglutide-nad',
    name: 'Semaglutide + NAD⁺',
    category: 'weight-loss',
    shortDescription:
      'Combined GLP-1 + cellular energy support. Pairs appetite control with mitochondrial optimization.',
    longDescription:
      'A dual-action compounded injectable that pairs semaglutide (GLP-1 receptor agonist for appetite regulation) with NAD⁺ (mitochondrial coenzyme for cellular energy). Patients on weight-loss protocols sometimes report low energy during titration; this formulation aims to address both signals in one injection.',
    highlights: [
      'Combined GLP-1 + NAD⁺ in a single sterile vial',
      'Pairs appetite control with cellular energy support',
      'Compounded under USP 797 sterile standards',
      'Single weekly injection protocol',
    ],
    image: '/images/products/semaglutide-nad-combo.jpg',
    imageAlt: 'Semaglutide + NAD+ combined compounded vial',
    howItWorks:
      'Two molecules in one injection. The semaglutide arm mimics GLP-1 — slowing stomach emptying and quieting appetite signals so smaller portions feel like enough. The NAD⁺ arm restores a coenzyme central to mitochondrial energy production and DNA repair, addressing the lower-energy weeks that some patients report during weight-loss titration.',
    whoItsFor:
      'Patients pursuing weight loss who also want metabolic / energy support — particularly anyone who has tried semaglutide alone and felt the low-energy effect during titration. Adults with a BMI over 27 who fit the usual GLP-1 criteria.',
    whatToExpect:
      'Appetite suppression follows the standard semaglutide curve. Some patients report better daytime energy than with semaglutide alone, attributed to the NAD⁺ component. Weekly injection protocol.',
    contraindications:
      'Same as semaglutide alone: medullary thyroid carcinoma history, MEN-2 syndrome, pregnancy or planning pregnancy, active pancreatitis, severe gallbladder disease. Discuss with provider if on cancer therapy.',
    startingDoseGuidance:
      'A typical starting protocol is one combination injection weekly, dosed to match a semaglutide starter. Your physician will determine the right starting dose during the screening. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    variants: [v('Combination injectable', '2.5 mg sema + 50 mg NAD⁺', '5 mL vial', 155)],
  },
  {
    slug: 'tirzepatide-nad',
    name: 'Tirzepatide + NAD⁺',
    category: 'weight-loss',
    shortDescription:
      'Dual incretin + mitochondrial energy. Pairs tirzepatide with NAD⁺ in a single vial.',
    longDescription:
      'A dual-action compounded injectable pairing tirzepatide (dual GLP-1 + GIP agonist for appetite and glycemic control) with NAD⁺ (cellular energy and mitochondrial support). 100 mg tirzepatide and 1,000 mg NAD⁺ per vial.',
    highlights: [
      'Tirzepatide (dual incretin) + NAD⁺ in one sterile vial',
      'Designed for patients seeking both weight-loss and energy support',
      'Compounded under USP 797 sterile standards',
      'Single weekly injection protocol',
    ],
    image: '/images/products/tirzepatide-nad-combo.jpg',
    imageAlt: 'Tirzepatide + NAD+ combined compounded vial',
    howItWorks:
      'Tirzepatide activates both GLP-1 and GIP gut-hormone receptors — the dual mechanism that produces greater average weight loss than GLP-1 alone in head-to-head trials. The NAD⁺ component restores a coenzyme central to mitochondrial energy production, supporting daytime stamina that can dip during weight-loss titration.',
    whoItsFor:
      'Patients pursuing significant weight loss who also want metabolic and energy support. Adults whose providers think the GIP component plus NAD⁺ would help when single-agent options have plateaued.',
    whatToExpect:
      'Appetite and weight-loss curve follows the standard tirzepatide protocol. Many patients report better daytime stamina than tirzepatide alone, attributed to the NAD⁺ component. Weekly injection protocol.',
    contraindications:
      'Same as tirzepatide alone: medullary thyroid carcinoma history, MEN-2 syndrome, pregnancy, active pancreatitis, severe gallbladder disease. Discuss with provider if on cancer therapy.',
    startingDoseGuidance:
      'A typical starting protocol is one combination injection weekly, dosed to match a tirzepatide starter. Your physician will determine the right starting dose during the screening. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    variants: [v('Combination injectable', '20 mg tirz + 200 mg NAD⁺', '10 mL vial', 303)],
  },
  {
    slug: 'tirzepatide-glycine',
    name: 'Tirzepatide + Glycine',
    category: 'weight-loss',
    shortDescription:
      'Tirzepatide paired with glycine for lean-mass preservation during weight loss.',
    longDescription:
      'Compounded tirzepatide formulation with added glycine — an amino acid associated with collagen synthesis, glutathione production, and lean tissue support. Pairing aims to support fat loss while preserving lean muscle mass during weight-loss protocols.',
    highlights: [
      'Tirzepatide + glycine in one sterile vial',
      'Targets fat loss with lean-mass preservation',
      'Compounded under USP 797 sterile standards',
      'Single weekly injection protocol',
    ],
    image: '/images/products/tirzepatide-glycine-20mg-5mg.jpg',
    imageAlt: 'Tirzepatide + Glycine combined compounded vial',
    howItWorks:
      'Tirzepatide is a dual GLP-1 + GIP agonist that drives appetite and glycemic control — the same mechanism behind branded Mounjaro and Zepbound. Glycine, an amino acid, supports collagen synthesis and glutathione production. The pairing aims to keep lean tissue intact while body fat drops.',
    whoItsFor:
      'Patients pursuing weight loss who are also actively training and want to preserve lean muscle mass. Adults whose providers want to mitigate the lean-mass loss that sometimes accompanies aggressive GLP-1 protocols.',
    whatToExpect:
      'Standard tirzepatide weight-loss curve. Lean-mass impact varies; pairing with resistance training maximizes the glycine contribution. Weekly injection protocol.',
    contraindications:
      'Same as tirzepatide alone: medullary thyroid carcinoma history, MEN-2 syndrome, pregnancy, active pancreatitis, severe gallbladder disease.',
    startingDoseGuidance:
      'A typical starting protocol is one combination injection weekly, dosed to match a tirzepatide starter. Your physician will determine the right starting dose during the screening. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    variants: [v('Combination injectable', '20 mg tirz + 5 mg glycine', '5 mL vial', 309)],
  },
  {
    slug: 'nad',
    name: 'NAD⁺',
    category: 'longevity',
    shortDescription:
      'Cellular coenzyme for energy production, DNA repair, and metabolic health.',
    longDescription:
      'Nicotinamide adenine dinucleotide (NAD⁺) is a coenzyme found in every living cell. It is essential for mitochondrial function, ATP production, DNA repair via sirtuin activation, and redox balance. NAD⁺ levels decline with age — clinical and integrative practice often supplements it directly via injectable or intranasal routes.',
    highlights: [
      'Three delivery routes · subcutaneous, IM, intranasal',
      'Pairs with longevity, energy, and recovery protocols',
      'Compounded under USP 797 sterile standards',
      'Third-party tested for potency and identity',
    ],
    image: '/images/products/nad-plus-200mg-ml.jpg',
    imageAlt: 'NAD+ compounded vial',
    howItWorks:
      'NAD⁺ is a coenzyme present in every cell, central to energy production and DNA repair. Levels decline with age. Supplementation aims to restore the substrate availability for these critical processes.',
    whoItsFor:
      'Adults pursuing longevity-focused therapy. Patients with persistent fatigue or recovery issues. Available as injection (fastest absorption), oral, or nasal spray.',
    whatToExpect:
      'Some patients report energy improvement within days. Others see effects over weeks. Highly individual; dose and route matter.',
    contraindications:
      'Pregnancy. Discuss with provider if on cancer therapy.',
    startingDoseGuidance:
      'A typical starting protocol is 50 mg subcutaneous injection daily, or an equivalent intranasal dose. Your physician will tailor the route and dose during the screening. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    peptideSubArea: 'metabolism',
    variants: [
      v('Standard injectable', '50 mg', '1 mL vial', 78),
      v('High-concentration injectable', '200 mg/mL', '5 mL vial', 119),
      v('Intranasal spray', '300 mg/mL', '5 mL bottle', 155),
    ],
  },
  {
    slug: 'mots-c',
    name: 'MOTS-c',
    category: 'longevity',
    shortDescription:
      'Mitochondrial-derived peptide — cellular energy and insulin sensitivity.',
    longDescription:
      'MOTS-c is a peptide encoded within the mitochondrial genome. It activates the AMPK pathway, improves insulin sensitivity, and has been studied for its role in metabolic health and exercise capacity. Used in longevity protocols alongside NAD⁺ and other metabolic peptides.',
    highlights: [
      'Mitochondria-derived peptide · AMPK pathway activation',
      'Studied for insulin sensitivity and metabolic health',
      'Compounded under USP 797 sterile standards',
      'Third-party tested for potency and purity',
    ],
    image: '/images/products/mots-c-20mg.jpg',
    imageAlt: 'MOTS-c compounded vial',
    howItWorks:
      'MOTS-c is a 16-amino-acid peptide encoded within mitochondrial DNA. It signals improved insulin sensitivity, glucose handling, and metabolic health from the cellular power plant level.',
    whoItsFor:
      'Patients with metabolic syndrome features, prediabetic markers, or anyone pursuing longevity-focused metabolic support.',
    whatToExpect:
      'Subtle. Patients describe better stamina across the day rather than acute energy. Lab markers (insulin sensitivity, fasting glucose) may show improvement over 8–12 weeks.',
    contraindications: 'Pregnancy.',
    startingDoseGuidance:
      'A typical starting protocol is 2.5 mg subcutaneous injection twice weekly. Your physician will adjust on review. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    peptideSubArea: 'metabolism',
    variants: [v('Standard injectable', '20 mg', '2 mL vial', 140)],
  },
  {
    slug: 'sermorelin',
    name: 'Sermorelin',
    category: 'peptides',
    shortDescription:
      'Older GHRH analog — well-studied, gentle, slower onset.',
    longDescription:
      'Sermorelin is an analogue of growth hormone-releasing hormone (GHRH). Unlike direct growth hormone administration, sermorelin works by stimulating the pituitary gland’s natural pulsatile release of growth hormone — preserving the body’s own feedback loop. Used in anti-aging, recovery, and lean-mass protocols.',
    highlights: [
      'GHRH analogue · stimulates natural pulsatile GH release',
      'Preserves the body’s own pituitary feedback loop',
      'Compounded under USP 797 sterile standards',
      'Third-party tested for potency and identity',
    ],
    image: '/images/products/sermorelin-4mg.jpg',
    imageAlt: 'Sermorelin compounded vial',
    howItWorks:
      "Sermorelin is a 29-amino-acid GHRH analog (CJC-1295's older cousin). Same mechanism — pituitary signaling — but a shorter half-life means daily dosing. Some patients prefer the more physiologic, gentler ramp.",
    whoItsFor:
      'Patients new to GH peptide therapy. Those who prefer a daily ritual. Older patients where slower titration is preferable.',
    whatToExpect:
      'Improvements show up gradually. Sleep first, then recovery, then composition over 3–6 months.',
    contraindications: 'Active cancer. Pregnancy.',
    startingDoseGuidance:
      'A typical starting protocol is 300 mcg subcutaneous injection 5 days a week, dosed at bedtime to align with your natural GH pulse. Your physician will adjust based on body weight. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    peptideSubArea: 'growth-hormone',
    variants: [v('Standard injectable', '4 mg', '2 mL vial', 73)],
  },
  {
    slug: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'peptides',
    shortDescription:
      'GHRH analog with strong data on visceral fat reduction.',
    longDescription:
      'Tesamorelin is an FDA-approved synthetic GHRH analogue. It has been studied extensively for visceral adipose tissue reduction and growth-hormone stimulation. Used in body composition, longevity, and lipodystrophy protocols.',
    highlights: [
      'FDA-approved GHRH analogue',
      'Studied for visceral fat reduction and GH stimulation',
      'Compounded under USP 797 sterile standards',
      'Third-party tested for potency and purity',
    ],
    image: '/images/products/tesamorelin-5mg.jpg',
    imageAlt: 'Tesamorelin compounded vial',
    howItWorks:
      "Tesamorelin is a stabilized GHRH analog originally approved for HIV-associated lipodystrophy. It's notable for its visceral fat reduction effect — the deep abdominal fat that's most metabolically harmful.",
    whoItsFor:
      "Patients with stubborn central abdominal fat that hasn't responded to caloric deficit. Those pursuing both GH support and metabolic improvement in one molecule.",
    whatToExpect:
      'Visceral fat reductions become measurable on imaging at 12–24 weeks. Other GH effects (sleep, recovery) similar to other GHRH analogs.',
    contraindications: 'Active cancer. Pregnancy. Pituitary disease.',
    startingDoseGuidance:
      'A typical starting protocol is 2 mg subcutaneous injection 5 days a week, dosed at bedtime. Your physician will adjust on review. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    peptideSubArea: 'growth-hormone',
    variants: [v('Standard injectable', '5 mg', '2 mL vial', 109)],
  },
  {
    slug: 'bpc-157',
    name: 'BPC-157',
    category: 'peptides',
    shortDescription:
      'Body Protection Compound — supports tendon, ligament, and gut healing.',
    longDescription:
      'BPC-157 is a synthetic peptide derived from a protein found in gastric juice. Preclinical research suggests it accelerates tendon, ligament, and gut tissue repair via angiogenesis, growth factor upregulation, and nitric oxide modulation. Often paired with TB-500 in comprehensive recovery protocols.',
    highlights: [
      'Studied for tendon, ligament, and gut tissue repair',
      'Often paired with TB-500 for comprehensive recovery',
      'Compounded under USP 797 sterile standards',
      'Third-party tested for potency and purity',
    ],
    image: '/images/products/bpc-157-5mg.jpg',
    imageAlt: 'BPC-157 compounded vial',
    howItWorks:
      'BPC-157 is a synthetic peptide derived from a protein in gastric juice. It promotes new blood vessel formation (angiogenesis), reduces inflammation, and accelerates healing of soft-tissue injuries — particularly tendons and ligaments that heal slowly because of poor blood supply.',
    whoItsFor:
      "Patients with chronic tendinopathies (Achilles, tennis elbow, rotator cuff). Post-surgical recovery. GI inflammation that hasn't resolved with conventional treatment. Athletes managing recurring soft-tissue strains.",
    whatToExpect: [
      {
        phase: 'First 1–2 weeks',
        detail:
          'Sometimes a brief flare in inflamed tissue — the repair process is being activated. Then steady reduction in pain and improvement in range of motion.',
      },
      {
        phase: 'Weeks 4–8',
        detail:
          'Most patients report meaningful improvement by this point. Pair with physical therapy for best results.',
      },
    ],
    contraindications:
      'Active cancer (the same vessel-growth signaling could theoretically support tumor growth — discuss with provider). Pregnancy.',
    startingDoseGuidance:
      'A typical starting protocol is 500 mcg subcutaneous injection daily (≈43 mcg/kg/week, adjusted for body weight). Your physician will adjust on review. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    peptideSubArea: 'healing',
    variants: [
      v('Standard injectable', '5 mg', '5 mL vial', 109),
      v('High-concentration injectable', '10 mg/mL', '5 mL vial', 155),
    ],
  },
  {
    slug: 'ghk-cu',
    name: 'GHK-Cu',
    category: 'peptides',
    shortDescription:
      'Copper peptide that signals collagen remodeling — skin, scalp, wound healing.',
    longDescription:
      'GHK-Cu is a tripeptide bound to copper. It plays a role in collagen synthesis, tissue remodeling, and anti-inflammatory pathways. Used in skin, hair, and wound-healing protocols, and increasingly studied for systemic anti-aging effects.',
    highlights: [
      'Copper-bound tripeptide · collagen synthesis pathway',
      'Studied for tissue remodeling and skin / hair support',
      'Compounded under USP 797 sterile standards',
      'Third-party tested for potency and identity',
    ],
    image: '/images/products/ghk-cu-50mg.jpg',
    imageAlt: 'GHK-Cu compounded vial',
    howItWorks:
      'GHK-Cu is a tripeptide that binds copper. The complex activates fibroblasts (collagen-producing cells), tissue remodeling enzymes, and antioxidant pathways. Used both topically and as injection.',
    whoItsFor:
      'Patients pursuing skin firmness, hair density, or accelerated wound/procedure recovery. Often used alongside microneedling or laser treatments.',
    whatToExpect:
      'Skin and scalp changes over 8–12 weeks. Effects continue with ongoing use; benefits gradually plateau if treatment stops.',
    contraindications:
      'Active cancer (theoretical, due to angiogenesis effects). Pregnancy.',
    startingDoseGuidance:
      'A typical starting protocol is 2 mg subcutaneous injection 5 days a week. Your physician will adjust on review. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    peptideSubArea: 'collagen',
    variants: [v('Standard injectable', '50 mg', '5 mL vial', 140)],
  },
  {
    slug: 'tb-500',
    name: 'TB-500 (Thymosin Beta-4)',
    category: 'peptides',
    shortDescription:
      "Athletes' staple for soft-tissue recovery and inflammation.",
    longDescription:
      'TB-500 is a synthetic fragment of Thymosin Beta-4, a naturally occurring protein involved in cellular migration and tissue repair. Preclinical research suggests TB-500 supports recovery from soft-tissue injury via systemic mechanisms rather than localized action. Often paired with BPC-157.',
    highlights: [
      'Thymosin Beta-4 fragment · systemic tissue repair',
      'Often paired with BPC-157 for comprehensive recovery',
      'Compounded under USP 797 sterile standards',
      'Third-party tested for potency and purity',
    ],
    image: '/images/products/tb-500-5mg.jpg',
    imageAlt: 'TB-500 compounded vial',
    howItWorks:
      'TB-500 is a synthetic version of Thymosin Beta-4, a protein your body produces in response to injury. It promotes cell migration, blood vessel formation, and reduces inflammation. Often stacked with BPC-157 for compound effect.',
    whoItsFor:
      'Athletes with recurring soft-tissue strain. Post-injury recovery, particularly muscle tears. Patients also using BPC-157 — the two are commonly combined.',
    whatToExpect:
      'Loading phase: 2 mg twice weekly for 4 weeks. Maintenance: 2 mg weekly. Most patients notice meaningful change in 4–6 weeks.',
    contraindications:
      'Active cancer (theoretical concern around angiogenesis). Pregnancy.',
    startingDoseGuidance:
      'A typical starting protocol is 2.5 mg subcutaneous injection twice weekly during the loading phase, dropping to weekly for maintenance. Your physician will adjust on review. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    peptideSubArea: 'healing',
    variants: [
      v('Standard injectable', '5 mg', '5 mL vial', 140),
      v('High-concentration injectable', '10 mg/mL', '5 mL vial', 186),
    ],
  },
  {
    slug: 'sildenafil-tadalafil',
    name: 'Sildenafil / Tadalafil ODT',
    category: 'mens-ed',
    shortDescription:
      'Sildenafil, tadalafil, vardenafil — discreet pills that work with arousal, not on top of it.',
    longDescription:
      'A compounded oral dissolving tablet combining sildenafil and tadalafil — the active molecules in Viagra and Cialis. The combination is designed to deliver the fast onset of sildenafil with the longer duration of tadalafil, all without water. Discreetly shipped.',
    highlights: [
      'Combined sildenafil + tadalafil in one tablet',
      'Fast onset · long duration · no water needed',
      'Discreet shipping',
      'Compounded by a US-licensed pharmacy partner',
    ],
    image: '/images/products/sildenafil-tadalafil-55-22mg-odt.jpg',
    imageAlt: 'Sildenafil / Tadalafil combined ODT',
    howItWorks:
      "These medications block the PDE5 enzyme. With PDE5 blocked, the natural cGMP signal that opens blood vessels in the penis stays active long enough for arousal to complete its job. They don't initiate arousal; they let it follow through.",
    whoItsFor:
      'Men with situational or persistent erectile difficulty. Particularly useful for men over 40, those with cardiovascular risk factors, or men recovering from prostate surgery (under provider guidance).',
    whatToExpect:
      "Sildenafil: 30–60 minute onset, 4–6 hours of effect. Tadalafil: 30 minute onset, up to 36 hours of effect, or daily low-dose for ongoing readiness. Take with arousal as the trigger — they don't work on a dead start.",
    contraindications:
      'Nitrates (chest pain medications) — combining can crash blood pressure. Severe heart disease. Recent stroke or heart attack. Some interactions with HIV medications and antifungals.',
    startingDoseGuidance:
      'A typical starting protocol is one 55/22 mg ODT taken 30–60 minutes before activity, as needed. Your physician will confirm based on your full history. Suggestions only — your physician reviews and approves the final protocol before any medication ships.',
    variants: [v('Combination ODT', '55 mg sildenafil + 22 mg tadalafil', '30 tablets', 109)],
  },
];

/** Helper — compute "from $X" for a parent (its cheapest variant). */
export function fromPrice(p: ParentProduct): number {
  return Math.min(...p.variants.map((v) => v.price));
}

/** Helper — look up a parent by slug. */
export function getParentBySlug(slug: string): ParentProduct | undefined {
  return PARENT_PRODUCTS.find((p) => p.slug === slug);
}

/** Categories present in the catalog, in display order. */
export const CATEGORY_ORDER: ReadonlyArray<{
  slug: ParentProduct['category'];
  label: string;
}> = [
  { slug: 'weight-loss', label: 'Weight Loss' },
  { slug: 'peptides', label: 'Peptides' },
  { slug: 'longevity', label: 'Longevity' },
  { slug: 'mens-ed', label: "Men's ED" },
];
