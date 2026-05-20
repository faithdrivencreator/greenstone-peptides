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

export type ParentProduct = {
  slug: string;
  name: string;
  /** Treatment vertical — maps the parent into the four-vertical strip. */
  category: 'weight-loss' | 'peptides' | 'mens-ed' | 'longevity';
  /** Bloom /learn/<slug> educational route for this molecule. */
  bloomLearn: 'weight-loss' | 'peptides' | 'mens-ed';
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
};

const v = (label: string, dose: string, size: string, price: number): Variant => ({
  label,
  dose,
  size,
  price,
});

export const PARENT_PRODUCTS: ParentProduct[] = [
  {
    slug: 'semaglutide',
    name: 'Semaglutide',
    category: 'weight-loss',
    bloomLearn: 'weight-loss',
    shortDescription:
      'GLP-1 receptor agonist. Lowers appetite, slows gastric emptying, supports steady weight loss.',
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
    bloomLearn: 'weight-loss',
    shortDescription:
      'Dual GIP + GLP-1 agonist. Greater average weight loss than GLP-1 alone in head-to-head trials.',
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
    bloomLearn: 'weight-loss',
    shortDescription:
      'Triple GLP-1 / GIP / glucagon agonist. Investigational. Largest average weight-loss signal in early trials.',
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
    bloomLearn: 'weight-loss',
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
    variants: [v('Combination injectable', '2.5 mg sema + 50 mg NAD⁺', '5 mL vial', 155)],
  },
  {
    slug: 'tirzepatide-nad',
    name: 'Tirzepatide + NAD⁺',
    category: 'weight-loss',
    bloomLearn: 'weight-loss',
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
    variants: [v('Combination injectable', '20 mg tirz + 200 mg NAD⁺', '10 mL vial', 303)],
  },
  {
    slug: 'tirzepatide-glycine',
    name: 'Tirzepatide + Glycine',
    category: 'weight-loss',
    bloomLearn: 'weight-loss',
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
    variants: [v('Combination injectable', '20 mg tirz + 5 mg glycine', '5 mL vial', 309)],
  },
  {
    slug: 'nad',
    name: 'NAD⁺',
    category: 'longevity',
    bloomLearn: 'peptides',
    shortDescription:
      'Mitochondrial coenzyme. Supports cellular energy, DNA repair, and longevity protocols.',
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
    bloomLearn: 'peptides',
    shortDescription:
      'Mitochondria-derived peptide. AMPK activation, insulin sensitivity, metabolic health.',
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
    variants: [v('Standard injectable', '20 mg', '2 mL vial', 140)],
  },
  {
    slug: 'sermorelin',
    name: 'Sermorelin',
    category: 'peptides',
    bloomLearn: 'peptides',
    shortDescription:
      'GHRH analogue. Stimulates the body’s own pulsatile growth hormone release.',
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
    variants: [v('Standard injectable', '4 mg', '2 mL vial', 73)],
  },
  {
    slug: 'tesamorelin',
    name: 'Tesamorelin',
    category: 'peptides',
    bloomLearn: 'peptides',
    shortDescription:
      'FDA-approved GHRH analogue. Studied for visceral fat reduction and GH stimulation.',
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
    variants: [v('Standard injectable', '5 mg', '2 mL vial', 109)],
  },
  {
    slug: 'bpc-157',
    name: 'BPC-157',
    category: 'peptides',
    bloomLearn: 'peptides',
    shortDescription:
      'Body Protection Compound. Studied for tissue repair, gut healing, and recovery.',
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
    variants: [
      v('Standard injectable', '5 mg', '5 mL vial', 109),
      v('High-concentration injectable', '10 mg/mL', '5 mL vial', 155),
    ],
  },
  {
    slug: 'ghk-cu',
    name: 'GHK-Cu',
    category: 'peptides',
    bloomLearn: 'peptides',
    shortDescription:
      'Copper peptide. Collagen synthesis, tissue remodeling, and skin / hair support.',
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
    variants: [v('Standard injectable', '50 mg', '5 mL vial', 140)],
  },
  {
    slug: 'tb-500',
    name: 'TB-500 (Thymosin Beta-4)',
    category: 'peptides',
    bloomLearn: 'peptides',
    shortDescription:
      'Thymosin Beta-4 fragment. Systemic tissue repair and recovery.',
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
    variants: [
      v('Standard injectable', '5 mg', '5 mL vial', 140),
      v('High-concentration injectable', '10 mg/mL', '5 mL vial', 186),
    ],
  },
  {
    slug: 'sildenafil-tadalafil',
    name: 'Sildenafil / Tadalafil ODT',
    category: 'mens-ed',
    bloomLearn: 'mens-ed',
    shortDescription:
      'Sildenafil + tadalafil combined into one oral dissolving tablet. Fast onset, long duration.',
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
