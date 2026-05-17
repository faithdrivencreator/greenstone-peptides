// Category-keyed reason templates for the prescription request form.
// Selecting a reason auto-fills a 2-sentence paragraph that the customer
// can still edit. Keeps the form low-effort while giving the pharmacist
// enough context to review.

export interface ReasonOption {
  label: string;
  text: string; // 2 sentences, written as if the customer is speaking
}

const GENERIC_FALLBACK: ReasonOption[] = [
  {
    label: 'Personal research protocol',
    text: 'I am running a personal research protocol and have decided this product fits my current goals. I have done my reading and feel comfortable with the dosing and handling.',
  },
  {
    label: 'Reorder — already familiar',
    text: 'I have used this product before and am restocking. Dosing and handling are already familiar to me.',
  },
  {
    label: 'Recommended by my coach / practitioner',
    text: 'This was recommended to me by my coach or practitioner as part of a broader plan. I would like to begin with the standard starting protocol.',
  },
  {
    label: 'Other (I will write notes below)',
    text: '',
  },
];

const REASONS_BY_CATEGORY: Record<string, ReasonOption[]> = {
  'Weight Loss & GLP-1': [
    {
      label: 'Sustained weight management',
      text: 'I am working on sustained weight management and want a steady, well-tolerated protocol. I plan to start at a conservative dose and titrate up as my body adjusts.',
    },
    {
      label: 'Appetite and cravings regulation',
      text: 'I am looking to regulate appetite and curb between-meal cravings as part of a structured lifestyle change. I would prefer the lowest effective starting dose.',
    },
    {
      label: 'Plateau breakthrough (returning user)',
      text: 'I have been on a GLP-1 protocol previously and want to break through a plateau. I am comfortable with injection technique and side-effect management.',
    },
    {
      label: 'Metabolic reset after the holidays / off-season',
      text: 'I want a short, focused reset after a period of higher intake. I am looking for guidance on the right starting strength for a 12-week run.',
    },
    {
      label: 'Pre-event / wedding / photoshoot timeline',
      text: 'I have a specific event on the calendar and want a structured protocol that lands me at goal before that date. Please advise on dosing cadence.',
    },
  ],

  'Recovery & Repair': [
    {
      label: 'Joint and tendon recovery',
      text: 'I am dealing with nagging joint or tendon discomfort that is slowing my training. I want to support healing without a long break from activity.',
    },
    {
      label: 'Post-surgery or post-injury recovery',
      text: 'I am recovering from a recent injury or procedure and want to support soft-tissue healing. Please advise on a sensible duration for my situation.',
    },
    {
      label: 'Gut lining repair',
      text: 'I am working on gut-lining repair as part of a broader digestive plan. I would like to start with the standard protocol.',
    },
    {
      label: 'Skin regeneration and scar support',
      text: 'I want to support skin regeneration and reduce the appearance of older scars or marks. I am comfortable with the topical / subcutaneous routine.',
    },
    {
      label: 'General training-recovery stack',
      text: 'I train hard and want to shorten the gap between sessions. I am looking for a maintenance-style protocol I can run alongside my normal program.',
    },
  ],

  'Anti-Aging & Longevity': [
    {
      label: 'Cellular energy and longevity protocol',
      text: 'I am building a long-term longevity protocol and want a cellular-energy foundation. I plan to integrate this with sleep, training, and nutrition work I already do.',
    },
    {
      label: 'Skin, hair, and visible aging support',
      text: 'I want to support skin tone, hair quality, and the visible markers of aging. I am open to a multi-month run if that is what the protocol calls for.',
    },
    {
      label: 'Mitochondrial / metabolic health',
      text: 'I am focused on mitochondrial and metabolic health markers and want to add this to the stack. I will be tracking labs across the run.',
    },
    {
      label: 'Brain fog and mid-day energy crashes',
      text: 'I notice afternoon energy dips and slower mental sharpness and want a foundational reset. Please advise on dose for a sedentary-leaning week.',
    },
  ],

  'Energy & Metabolism': [
    {
      label: 'Daily energy and stamina',
      text: 'I want a sustainable lift in daily energy without stimulants. A maintenance protocol I can run for several months is ideal.',
    },
    {
      label: 'Athletic performance support',
      text: 'I am an active trainer and want better intra-week recovery and stamina. I would like to start at the standard performance dose.',
    },
    {
      label: 'Metabolic optimization alongside training',
      text: 'I am pairing this with a structured training and nutrition block and want metabolic support layered in. Please advise on cadence.',
    },
    {
      label: 'Post-illness rebuild',
      text: 'I am rebuilding after a stretch of illness or fatigue and want a gentle reset. I am open to starting at a lower dose and ramping up.',
    },
  ],

  'Growth Hormone Support': [
    {
      label: 'Sleep quality and overnight recovery',
      text: 'I want to deepen sleep and improve overnight recovery quality. I am comfortable with an evening protocol.',
    },
    {
      label: 'Lean-mass and body recomposition',
      text: 'I am working on lean-mass gains and body recomposition. I am running consistent training and want growth-hormone support layered on top.',
    },
    {
      label: 'Mid-life recovery support',
      text: 'Recovery between sessions has slowed with age and I want to support that. I am looking for a sustainable, non-aggressive protocol.',
    },
    {
      label: 'Injury rehab adjunct',
      text: 'I am using this as an adjunct alongside an injury-rehab plan. Please advise on duration relative to my recovery timeline.',
    },
  ],

  "Men's Health": [
    {
      label: 'On-demand performance support',
      text: 'I want reliable on-demand support without committing to a daily medication. The ODT format fits my routine well.',
    },
    {
      label: 'Daily low-dose protocol',
      text: 'I prefer a low daily dose for steady support rather than on-demand timing. Please advise on the right starting strength.',
    },
    {
      label: 'Confidence and consistency in new relationship',
      text: 'I want consistency and confidence in a newer relationship. A reliable starting protocol that I can adjust over time is what I am after.',
    },
    {
      label: 'Stack with existing wellness routine',
      text: 'I already run a wellness routine and want to add this in. I am comfortable adjusting dose based on response.',
    },
  ],

  'Kits & Starter Packs': [
    {
      label: 'First-time peptide protocol',
      text: 'This is my first peptide protocol and I want a curated kit so I do not have to assemble it myself. I will follow the included starting cadence.',
    },
    {
      label: 'Convenience and simplicity over piecing it together',
      text: 'I have used individual products before and want the convenience of a single kit going forward. Please ship the standard configuration.',
    },
    {
      label: 'Gift / shared protocol with partner',
      text: 'I am setting this up to share with a partner and want everything in one package. Please confirm the kit covers both of us for the listed duration.',
    },
    {
      label: 'Travel-friendly bundle',
      text: 'I travel often and want a bundle that is easy to dose on the road. Please advise on storage logistics during transit.',
    },
  ],

  'Specialty Therapeutics': [
    {
      label: 'Targeted therapeutic use',
      text: 'I am using this for a specific, targeted purpose I have already researched. I am comfortable with the dosing protocol on the product page.',
    },
    {
      label: 'Anti-parasitic / detox protocol',
      text: 'I am running a focused anti-parasitic or detox protocol. Please advise on the standard course length.',
    },
    {
      label: 'Practitioner-directed research',
      text: 'I am running this under the direction of a practitioner who recommended this specific compound. I will keep my notes if you need any clarification.',
    },
    {
      label: 'Off-label research use',
      text: 'This is for personal research use within the framing on the product page. I have done my reading on dosing and handling.',
    },
  ],
};

export function reasonsForCategory(categoryTitle?: string): ReasonOption[] {
  if (categoryTitle && REASONS_BY_CATEGORY[categoryTitle]) {
    return [...REASONS_BY_CATEGORY[categoryTitle], ...GENERIC_FALLBACK];
  }
  return GENERIC_FALLBACK;
}
