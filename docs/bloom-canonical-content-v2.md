# Bloom Canonical Content v2

Scraped 2026-05-20 via Playwright (Pete logged in as `pete+mystore1@fluidfaithsolutions.com`). This supersedes `bloom-canonical-content.md` for content fields. Use this doc as the source-of-truth when populating the extended `ParentProduct` schema in `src/data/parent-products.ts` and the new `src/data/treatment-areas.ts`.

Raw page captures are saved under `docs/scrape-tmp/*.json` (gitignored — temporary working data).

## Bloom URL structure (for reference, NOT to mirror)

- Category root: `/learn/<category>`
- Sub-area root (peptides only): `/learn/peptides-<area>`
- Molecule detail: `/learn/<category>/<slug>` (or `/learn/peptides-<area>/<slug>`)

Sub-areas are sibling slugs at `/learn/peptides-<area>`, NOT nested under `/learn/peptides/<area>`.

Slug map:

| Category | Bloom slug | Our `category` value |
|---|---|---|
| Weight Loss | `weight-loss` | `weight-loss` |
| Men's ED | `oral-ed` | `mens-ed` |
| Peptides — Healing & Recovery | `peptides-healing` | `peptides` (sub: `healing`) |
| Peptides — Growth Hormone Support | `peptides-growth-hormone` | `peptides` (sub: `growth-hormone`) |
| Peptides — Metabolism & Cellular Energy | `peptides-metabolism` | `peptides` (sub: `metabolism`) — OR `longevity` if NAD+/MOTS-c stay there |
| Peptides — Collagen & Skin | `peptides-collagen` | `peptides` (sub: `collagen`) — OR `longevity` if GHK-Cu stays there |

Per the locked plan, we keep our 4-category split. NAD+, MOTS-c (?), and GHK-Cu can stay in `longevity` on our side; Bloom's metabolism + collagen sub-area copy still applies as source material for the molecule explainers.

## Pricing observations

Bloom's posted "from $X" prices are ~10–15% below ours. Sync our variant prices to Bloom's during the data layer rebuild. Bloom variant counts also slightly differ — verify each.

| Molecule | Bloom from | Ours from | Bloom variants | Ours variants |
|---|---|---|---|---|
| Retatrutide | $263 | $277 | 3 | 3 |
| Semaglutide | $47 | $54 | 15 | 14 |
| Tirzepatide | $88 | $95 | 18 | 12 |
| BPC-157 | $109 | $115 | 2 | varies |
| TB-500 | $140 | $149 | 2 | varies |
| Sermorelin | $73 | $81 | 1 | varies |
| Tesamorelin | $109 | $115 | 1 | varies |
| MOTS-c | $140 | $149 | 1 | varies |
| NAD+ | $78 | $81 | 3 | varies |
| GHK-Cu | $140 | $149 | 1 | varies |
| Oral ED (Sildenafil/Tadalafil combo) | $109 | $115 | 1 | varies |

## Per-category content

### Weight Loss

- **Hero (H1):** GLP-1s changed _what's possible._
- **Lead:** For decades, sustained weight loss was a coin flip — willpower against biology. Biology usually won. A new class of medications changes the math. They work on the same hunger and satiety signals your body already uses, just louder and longer.
- **How this works in your body:** After you eat, your gut releases a hormone called GLP-1. It tells your pancreas to release insulin, slows stomach emptying, and tells your brain you've had enough. In many people that signal is weak or short-lived. GLP-1 medications are synthetic versions that last days instead of minutes. Some — like tirzepatide — also activate a second hormone, GIP, which seems to amplify the effect. You'll notice smaller portions feel like enough. The constant background hum of "what's next to eat" — what patients call food noise — quiets down.
- **Who does well:** Adults with a BMI over 27 who have tried calorie restriction and found it unsustainable. People with type 2 diabetes or pre-diabetes. Patients frustrated by diets that worked short-term but rebounded.
- **Who should wait:** Personal or family history of medullary thyroid cancer. Pregnancy or breastfeeding. Active gallbladder disease. History of pancreatitis. Your provider will screen for these during your intake.
- **What timelines actually look like:** Most patients lose 5–10% of starting weight in the first 3 months, 15–20% by month 6–9 on an optimal dose. Weight loss is not linear — expect plateaus. Side effects (nausea, constipation) are most common the week after each dose increase and fade with time.

### Men's ED

- **Hero (H1):** _(scraped Bloom URL returned "Category not found" for `/learn/mens-ed`; the active slug is `/learn/oral-ed` and clicking through shows the Oral ED therapies product directly. There's no separate Men's ED category landing page — just the single product.)_
- **For our `/treatments/mens-ed`:** Use the Oral ED product page's `How it works` + the v1 canonical content hero text "_When biology needs a nudge._" + the v1 PDE5 explainer paragraph (which Bloom's product page mirrors).

### Peptides

- **Hero (H1):** Short signals. _Real mechanism._
- **Lead:** Peptides are small protein fragments — 2 to 50 amino acids — that act as messengers. Insulin is a peptide. So is oxytocin. Modern peptide therapy uses synthetic versions to target specific signals: heal this tissue, release more growth hormone, improve mitochondrial function.
- **Why peptides, specifically:** Unlike small-molecule drugs, peptides typically bind one receptor and do one job. That specificity is the appeal — and the reason they're used alongside, not instead of, conventional treatment. Side-effect profiles tend to be narrower than systemic medications because the signal is shorter and more contained.
- **How we organize this category:** Peptides come in clusters by mechanism. Healing peptides (BPC-157, TB-500) speed soft-tissue repair. Growth-hormone peptides (CJC-1295, Ipamorelin, Sermorelin, Tesamorelin) signal your pituitary to pulse its own GH. Metabolic peptides (MOTS-c, NAD+) work on mitochondria. Collagen peptides (GHK-Cu) drive structural protein remodeling. Pick the goal first, then the molecule.

### Peptides — Healing & Recovery (sub-area)

- **Hero (H1):** When the body _is the bottleneck._
- **Lead:** Tendons, ligaments, and gut lining heal slowly because their blood supply is limited. Healing peptides act on local repair signals — promoting new vessel growth, reducing inflammation, and accelerating cellular turnover where the body is already trying to mend itself.
- **Common use cases:** Tendinopathies (chronic Achilles, tennis elbow, rotator cuff). Post-surgical recovery. Persistent gut inflammation when conventional treatment has plateaued. Athletes use them between hard training cycles.
- **Realistic timelines:** Most patients on a 4–8 week course report noticeable change in pain or range of motion. Imaging changes (when looked at) lag behind symptom improvement by weeks. These are rehab adjuncts, not standalone fixes — they work best alongside physical therapy.

### Peptides — Growth Hormone Support (sub-area)

- **Hero (H1):** Your pituitary, _recalibrated._
- **Lead:** Growth hormone falls steeply after age 30. Synthetic GH replaces it directly — but blunts the natural pulse pattern your body uses. GH-releasing peptides do something different: they tell your own pituitary to pulse harder. The result is a more physiologic rhythm, not a flat replacement.
- **What you might notice:** Better sleep depth in the first 2–3 weeks. Recovery from training showing up sooner. Body composition shifts — slightly leaner, slightly more lean tissue — over 8–12 weeks. These aren't dramatic changes; they're the kind of compounding optimization people pursue alongside training and nutrition.
- **Why timing matters:** Most GH peptides are dosed at bedtime because GH naturally pulses during deep sleep. Taking them before bed amplifies your existing rhythm rather than fighting it. Take them on a relatively empty stomach — high blood sugar suppresses GH release.

### Peptides — Metabolism & Cellular Energy (sub-area)

- **Hero (H1):** Cells run _on signals too._
- **Lead:** Your mitochondria — the power plants in every cell — have their own genome and their own signaling system. Peptides like MOTS-c and molecules like NAD+ act on that mitochondrial layer, supporting energy production, insulin sensitivity, and cellular cleanup that slows down with age.
- **What this is and isn't:** These are not stimulants. They don't make you feel a buzz. They support the underlying machinery that converts food into usable energy. Patients describe better stamina across the day rather than a noticeable peak.

### Peptides — Collagen & Skin (sub-area)

- **Hero (H1):** Repair starts _at the protein._
- **Lead:** Skin, scalp, and connective tissue are mostly collagen. As you age, collagen synthesis slows and breakdown speeds up. GHK-Cu binds copper and signals fibroblasts — the cells that build collagen — to start working again.
- **Where this fits:** GHK-Cu is most studied in skin: improved firmness, fewer fine lines, better wound healing. It's also used for hair density and as an adjunct to procedures that intentionally damage tissue (microneedling, laser) so the rebuild step goes faster.

### Longevity (our category, no Bloom equivalent)

Bloom has no top-level Longevity category. Our `longevity` bucket currently holds NAD+ and GHK-Cu. For our `/treatments/longevity` landing page, write original copy that frames the bucket as "longevity-focused metabolic and tissue-remodeling protocols" and pulls explainer language from the Metabolism + Collagen sub-areas as source.

Suggested hero: _Cellular maintenance. Compounding gains._ (write to feel)
Suggested lead: As you age, the cellular machinery that produces energy, repairs DNA, and rebuilds connective tissue slows down. Longevity protocols target those underlying systems — not the symptoms.

## Per-molecule content

Each molecule needs these 5 fields in the extended `ParentProduct` schema:
- `tagline` — one-line italic subhead under the H1
- `howItWorks` — paragraph
- `whoItsFor` — paragraph
- `whatToExpect` — paragraph (may include 4-stage timeline for GLP-1s)
- `contraindications` — paragraph ("Who should not take this")

Plus optional:
- `faq` — array of `{ q, a }`. Bloom shows ~1–3 questions per molecule but the answers are accordion-collapsed and we did not capture them in this pass. Questions captured below; answers must be written by us OR captured in a follow-up scrape with click-to-expand. **Recommend: ship v1 without FAQ answers, backfill later.**

---

### Retatrutide (`weight-loss`)

- **Tagline:** Triple agonist (GLP-1 + GIP + glucagon). Newer mechanism, strong early data.
- **How it works:** Retatrutide activates three receptors: GLP-1, GIP, and glucagon. The glucagon arm increases energy expenditure — your body burns more calories at rest — which differentiates it from the dual agonists.
- **Who it's for:** Patients who haven't reached their goal on tirzepatide or semaglutide. Those whose providers think additional metabolic-rate effect would help. Phase 2 trial data show some patients losing 24%+ at the highest doses.
- **What to expect:** Slow ramp over 4–8 months. Higher peak doses than other GLP-1s. Side-effect profile similar to tirzepatide; nausea on dose increases.
- **Who should not take this:** Same family of contraindications as semaglutide and tirzepatide. As a newer molecule, screening is even more careful.
- **FAQ questions (answers TBD):** Is this approved by the FDA?

### Semaglutide (`weight-loss`)

- **Tagline:** Once-weekly injection (or daily oral tablet) — the molecule that started this category.
- **How it works:** Semaglutide mimics GLP-1, a gut hormone you already produce after meals. It slows stomach emptying, dampens appetite signals in the brain, and improves how your body handles glucose. The effect builds over weeks — you're not retraining willpower, you're retraining the underlying signals.
- **Who it's for:** Adults seeking sustainable weight loss with a BMI over 27 (or over 30 without comorbidities). Patients with type 2 diabetes or prediabetes. People whose weight-loss attempts have stalled despite diet and exercise.
- **What to expect:**
  - *Weeks 1–4.* Starter dose. Appetite drops noticeably. Some nausea or fullness is normal and usually mild.
  - *Weeks 4–12.* Your provider will step up your dose monthly. Each step brings 2–4 days of digestive adjustment, then settles.
  - *Months 3–6.* Therapeutic dose reached. Weight loss of 5–10% is typical. Food thoughts quieter.
  - *Beyond 6 months.* Continue at maintenance, or taper under supervision.
- **Who should not take this:** Personal or family history of medullary thyroid carcinoma or MEN-2 syndrome. Pregnancy or planning pregnancy. Active pancreatitis or severe gallbladder disease.
- **FAQ questions (answers TBD):** Will I gain the weight back if I stop? · Oral tablet or injection — which is better? · How does compounded semaglutide compare to Ozempic or Wegovy?

### Tirzepatide (`weight-loss`)

- **Tagline:** Dual GLP-1 + GIP agonist. In head-to-head studies, more weight loss on average than GLP-1 alone.
- **How it works:** Tirzepatide activates two gut-hormone receptors: GLP-1 (the same one semaglutide hits) and GIP. The GIP component appears to amplify the appetite-suppression and metabolic effects, which is why head-to-head studies show greater average weight loss.
- **Who it's for:** Adults with significant weight to lose, particularly those who've tried a GLP-1 alone and found the results good but incomplete. Patients with type 2 diabetes — tirzepatide also has strong glycemic data.
- **What to expect:**
  - *Weeks 1–4.* Starter dose (2.5 mg). Modest appetite reduction. Mild GI side effects.
  - *Weeks 4–16.* Step-ups every 4 weeks: 5 mg → 7.5 mg → 10 mg. Each step has a few days of GI adjustment.
  - *Months 4–12.* Most patients land at 10–15 mg. 15–20% body weight loss is common in clinical data.
- **Who should not take this:** Same as semaglutide: medullary thyroid carcinoma history, MEN-2, pregnancy, active pancreatitis, severe gallbladder disease.
- **FAQ questions (answers TBD):** Why pick tirzepatide over semaglutide? · Is the side-effect profile worse?

### Oral ED therapies (`mens-ed`)

- **Tagline:** Sildenafil, tadalafil, vardenafil — discreet pills that work with arousal, not on top of it.
- **How it works:** These medications block the PDE5 enzyme. With PDE5 blocked, the natural cGMP signal that opens blood vessels in the penis stays active long enough for arousal to complete its job. They don't initiate arousal; they let it follow through.
- **Who it's for:** Men with situational or persistent erectile difficulty. Particularly useful for men over 40, those with cardiovascular risk factors, or men recovering from prostate surgery (under provider guidance).
- **What to expect:** Sildenafil: 30–60 minute onset, 4–6 hours of effect. Tadalafil: 30 minute onset, up to 36 hours of effect, or daily low-dose for ongoing readiness. Take with arousal as the trigger — they don't work on a dead start.
- **Who should not take this:** Nitrates (chest pain medications) — combining can crash blood pressure. Severe heart disease. Recent stroke or heart attack. Some interactions with HIV medications and antifungals.
- **FAQ questions (answers TBD):** Sildenafil or tadalafil — which? · Will I become dependent on these?

### BPC-157 (`peptides`, sub: healing)

- **Tagline:** Body Protection Compound — supports tendon, ligament, and gut healing.
- **How it works:** BPC-157 is a synthetic peptide derived from a protein in gastric juice. It promotes new blood vessel formation (angiogenesis), reduces inflammation, and accelerates healing of soft-tissue injuries — particularly tendons and ligaments that heal slowly because of poor blood supply.
- **Who it's for:** Patients with chronic tendinopathies (Achilles, tennis elbow, rotator cuff). Post-surgical recovery. GI inflammation that hasn't resolved with conventional treatment. Athletes managing recurring soft-tissue strains.
- **What to expect:**
  - *First 1–2 weeks.* Sometimes a brief flare in inflamed tissue — the repair process is being activated. Then steady reduction in pain and improvement in range of motion.
  - *Weeks 4–8.* Most patients report meaningful improvement by this point. Pair with physical therapy for best results.
- **Who should not take this:** Active cancer (the same vessel-growth signaling could theoretically support tumor growth — discuss with provider). Pregnancy.
- **FAQ questions (answers TBD):** Where do I inject it? · Can I cycle it?

### TB-500 (`peptides`, sub: healing)

- **Tagline:** Athletes' staple for soft-tissue recovery and inflammation.
- **How it works:** TB-500 is a synthetic version of Thymosin Beta-4, a protein your body produces in response to injury. It promotes cell migration, blood vessel formation, and reduces inflammation. Often stacked with BPC-157 for compound effect.
- **Who it's for:** Athletes with recurring soft-tissue strain. Post-injury recovery, particularly muscle tears. Patients also using BPC-157 — the two are commonly combined.
- **What to expect:** Loading phase: 2 mg twice weekly for 4 weeks. Maintenance: 2 mg weekly. Most patients notice meaningful change in 4–6 weeks.
- **Who should not take this:** Active cancer (theoretical concern around angiogenesis). Pregnancy.
- **FAQ questions (answers TBD):** Stack with BPC-157? · Is it banned in sports?

### Sermorelin (`peptides`, sub: growth-hormone)

- **Tagline:** Older GHRH analog — well-studied, gentle, slower onset.
- **How it works:** Sermorelin is a 29-amino-acid GHRH analog (CJC-1295's older cousin). Same mechanism — pituitary signaling — but a shorter half-life means daily dosing. Some patients prefer the more physiologic, gentler ramp.
- **Who it's for:** Patients new to GH peptide therapy. Those who prefer a daily ritual. Older patients where slower titration is preferable.
- **What to expect:** Improvements show up more gradually than CJC-1295/Ipamorelin combinations. Sleep first, then recovery, then composition over 3–6 months.
- **Who should not take this:** Active cancer. Pregnancy.
- **FAQ questions (answers TBD):** Why is sermorelin daily but CJC-1295 less frequent? · Is sermorelin still relevant?

### Tesamorelin (`peptides`, sub: growth-hormone)

- **Tagline:** GHRH analog with strong data on visceral fat reduction.
- **How it works:** Tesamorelin is a stabilized GHRH analog originally approved for HIV-associated lipodystrophy. It's notable for its visceral fat reduction effect — the deep abdominal fat that's most metabolically harmful.
- **Who it's for:** Patients with stubborn central abdominal fat that hasn't responded to caloric deficit. Those pursuing both GH support and metabolic improvement in one molecule.
- **What to expect:** Visceral fat reductions become measurable on imaging at 12–24 weeks. Other GH effects (sleep, recovery) similar to other GHRH analogs.
- **Who should not take this:** Active cancer. Pregnancy. Pituitary disease.
- **FAQ questions (answers TBD):** How is this different from CJC-1295? · Was it approved for something else?

### MOTS-c (`peptides`, sub: metabolism — OR `longevity` per our taxonomy)

- **Tagline:** Mitochondrial-derived peptide — cellular energy and insulin sensitivity.
- **How it works:** MOTS-c is a 16-amino-acid peptide encoded within mitochondrial DNA. It signals improved insulin sensitivity, glucose handling, and metabolic health from the cellular power plant level.
- **Who it's for:** Patients with metabolic syndrome features, prediabetic markers, or anyone pursuing longevity-focused metabolic support.
- **What to expect:** Subtle. Patients describe better stamina across the day rather than acute energy. Lab markers (insulin sensitivity, fasting glucose) may show improvement over 8–12 weeks.
- **Who should not take this:** Pregnancy.
- **FAQ questions (answers TBD):** How will I know it's working?

### NAD+ (`peptides`, sub: metabolism — OR `longevity` per our taxonomy)

- **Tagline:** Cellular coenzyme for energy production, DNA repair, and metabolic health.
- **How it works:** NAD+ is a coenzyme present in every cell, central to energy production and DNA repair. Levels decline with age. Supplementation aims to restore the substrate availability for these critical processes.
- **Who it's for:** Adults pursuing longevity-focused therapy. Patients with persistent fatigue or recovery issues. Available as injection (fastest absorption), oral, or nasal spray.
- **What to expect:** Some patients report energy improvement within days. Others see effects over weeks. Highly individual; dose and route matter.
- **Who should not take this:** Pregnancy. Discuss with provider if on cancer therapy.
- **FAQ questions (answers TBD):** Injection vs. tablet vs. nasal spray — which is best? · Will I feel a 'NAD rush' from injections?

### GHK-Cu (`peptides`, sub: collagen — OR `longevity` per our taxonomy)

- **Tagline:** Copper peptide that signals collagen remodeling — skin, scalp, wound healing.
- **How it works:** GHK-Cu is a tripeptide that binds copper. The complex activates fibroblasts (collagen-producing cells), tissue remodeling enzymes, and antioxidant pathways. Used both topically and as injection.
- **Who it's for:** Patients pursuing skin firmness, hair density, or accelerated wound/procedure recovery. Often used alongside microneedling or laser treatments.
- **What to expect:** Skin and scalp changes over 8–12 weeks. Effects continue with ongoing use; benefits gradually plateau if treatment stops.
- **Who should not take this:** Active cancer (theoretical, due to angiogenesis effects). Pregnancy.
- **FAQ questions (answers TBD):** Topical or injection?

## Starting-dose guidance (replaces dose finder per locked plan)

Bloom's dose finder uses sex + age + height + weight and returns a `Standard` (Light / Standard / Strong toggleable) dose recommendation per molecule. Captured defaults for a `M · 38y · 180 lbs · 5'10"` profile:

| Molecule | Standard dose suggestion |
|---|---|
| Retatrutide | 4 mg once a week |
| Semaglutide | 1 mg once a week |
| Tirzepatide | 5 mg once a week |
| Oral ED therapies | (no dose finder — 1 option only) |
| BPC-157 | 500 mcg every day (~43 mcg/kg/wk) |
| TB-500 | 2.5 mg 2× a week |
| Sermorelin | 300 mcg 5 days a week (~18 mcg/kg/wk) |
| Tesamorelin | 2 mg 5 days a week |
| MOTS-c | 2.5 mg 2× a week |
| NAD+ | 50 mg every day |
| GHK-Cu | 2 mg 5 days a week |

For each molecule, write a one-paragraph `startingDoseGuidance` field that frames these as **typical starting points** with the strict disclaimer:

> "Suggestions only — your physician reviews and approves the final protocol before any medication ships."

This phrase is Bloom's literal language and Pete-approved. Use it verbatim.

## What I did NOT capture (gaps to close later)

1. **FAQ answers.** Bloom shows them as accordions; we captured the questions but not the answers (no click-to-expand pass). Either write our own answers or do a 10-minute follow-up scrape with click-each-FAQ.
2. **Variant-level dose detail beyond the "from $X" landing prices.** Bloom shows e.g. "See all 15 options ↓" but the full variant list requires expansion. Our `parent-products.ts` already has the full variant matrix (47 SKUs); we can keep ours and just sync the "from $" base prices.
3. **Schema.org markup that Bloom uses.** Out of scope — we set our own JSON-LD via `SchemaOrg.tsx`.
4. **Product hero images on Bloom.** Bloom uses molecule-name text only on category cards. We have AI-generated product photography for our cards.

## Voice patterns (carry over from v1)

1. Plain, confident, modern. Not corporate. Not preachy.
2. Anti-willpower stance for GLP-1s ("reset hunger signals — not willpower").
3. Two-paragraph headers: short italicized phrase makes the headline (e.g. _"GLP-1s changed **what's possible.**"_).
4. Honest about timelines and side effects. State what's normal, what to expect, "who should wait" instead of euphemizing.
5. Doctor + pharmacy framing. Every dose mention ends with: "Suggestions only — your physician reviews and approves the final protocol before any medication ships."
6. "from $X" pricing language on all cards.

## Anti-patterns (carry over from v1)

- ❌ "Research use only" / "not for human consumption" / "for educational purposes"
- ❌ "Cutting-edge", "breakthrough", "revolutionary"
- ❌ Faith-driven / religious framing
- ❌ Hedge phrasing ("may support", "could help") when Bloom uses confident descriptive language
- ❌ "Free shipping" claim (Bloom shows it but Pete confirmed it isn't actually free)
- ❌ "10% off" / coupon promises (Bloom checkout doesn't honor our coupons)
