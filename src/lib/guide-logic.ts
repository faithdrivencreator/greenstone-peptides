// src/lib/guide-logic.ts

export type GuideGoal =
  | 'lose-weight'
  | 'build-recover'
  | 'anti-aging'
  | 'energy-metabolism'
  | 'mens-health'
  | 'womens-health';

export type GuideExperience = 'newcomer' | 'some' | 'experienced';

export type GuideBudget = 'under-100' | '100-200' | '200-plus';

export interface GuideSelections {
  goal: GuideGoal;
  experience: GuideExperience;
  budget: GuideBudget;
}

// Maps selections to Sanity product slugs (from seed-products.mjs)
const RECOMMENDATION_MAP: Record<
  GuideGoal,
  Record<GuideBudget, string[]>
> = {
  'lose-weight': {
    'under-100': ['semaglutide-0-5mg-odt-30ct'],
    '100-200': ['semaglutide-2-5mg-ml-2ml'],
    '200-plus': ['tirzepatide-15mg-5ml'],
  },
  'build-recover': {
    'under-100': ['bpc-157-5mg'],
    '100-200': ['bpc-157-5mg', 'tb-500-5mg'],
    '200-plus': ['bpc-157-10mg-ml', 'tb-500-10mg-ml'],
  },
  'anti-aging': {
    'under-100': ['sermorelin-4mg'],
    '100-200': ['nad-plus-50mg', 'sermorelin-4mg'],
    '200-plus': ['nad-plus-200mg-ml', 'mots-c-20mg'],
  },
  'energy-metabolism': {
    'under-100': ['nad-plus-50mg'],
    '100-200': ['nad-plus-200mg-ml'],
    '200-plus': ['nad-plus-200mg-ml', 'mots-c-20mg'],
  },
  'mens-health': {
    'under-100': ['sildenafil-tadalafil-55-22mg-odt'],
    '100-200': ['sildenafil-tadalafil-55-22mg-odt', 'sermorelin-4mg'],
    '200-plus': ['sermorelin-4mg', 'tesamorelin-5mg', 'sildenafil-tadalafil-55-22mg-odt'],
  },
  'womens-health': {
    'under-100': ['sermorelin-4mg'],
    '100-200': ['sermorelin-4mg', 'nad-plus-50mg'],
    '200-plus': ['sermorelin-4mg', 'nad-plus-200mg-ml', 'mots-c-20mg'],
  },
};

export function getRecommendedSlugs(selections: GuideSelections): string[] {
  return RECOMMENDATION_MAP[selections.goal][selections.budget] ?? [];
}
