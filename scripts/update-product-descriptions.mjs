/**
 * Greenstone Peptides — Product Description Updater
 * Run: node scripts/update-product-descriptions.mjs
 *
 * Patches the `description` field (PortableText) on every active product in Sanity.
 * Descriptions are keyed by peptide type — all variants of the same peptide share the same content.
 * Safe to re-run — uses patch().set() so existing data is replaced, not duplicated.
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env.local manually (no dotenv dependency needed)
const envPath = resolve(__dirname, '../.env.local');
const envFile = readFileSync(envPath, 'utf-8');
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

// ─── PORTABLE TEXT HELPERS ────────────────────────────────────────────────────

const block = (key, style, text) => ({
  _type: 'block',
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}s`, text, marks: [] }],
});

const p = (key, text) => block(key, 'normal', text);
const h2 = (key, text) => block(key, 'h2', text);
const h3 = (key, text) => block(key, 'h3', text);

// ─── QUALITY FOOTER (shared across all descriptions) ──────────────────────────

const qualityBlock = (key, peptideName) =>
  p(
    key,
    `Every ${peptideName} formulation from Greenstone Peptides is compounded in the USA by licensed pharmacy partners under USP 797 sterile standards. Each batch is third-party tested for potency, sterility, and endotoxin.`
  );

// ─── DESCRIPTIONS BY PEPTIDE TYPE ────────────────────────────────────────────

const descriptions = {

  // 1. SEMAGLUTIDE
  semaglutide: [
    h2('sema-h2', 'What is Semaglutide?'),
    p(
      'sema-p1',
      'Semaglutide is a GLP-1 (glucagon-like peptide-1) receptor agonist originally developed for type 2 diabetes management. It belongs to a class of medications that mimic a hormone your body naturally produces after eating. Today it is among the most studied and prescribed peptides for weight management in clinical practice.'
    ),
    h3('sema-h3-how', 'How It Works'),
    p(
      'sema-p2',
      'Semaglutide binds to GLP-1 receptors throughout the body — in the brain, pancreas, and digestive tract. In the brain, it signals satiety, reducing appetite and cravings. In the digestive tract, it slows gastric emptying, so you feel full longer after eating. In the pancreas, it supports insulin regulation in response to food intake. The result is a significant reduction in overall caloric intake without the willpower struggle.'
    ),
    h3('sema-h3-benefits', 'Key Benefits'),
    p(
      'sema-p3',
      'Research consistently shows semaglutide supports meaningful reductions in body weight over time. Clinical trials have demonstrated average weight loss of 10–15% of body weight in participants using therapeutic doses under medical supervision. Beyond weight, studies suggest improvements in blood sugar regulation, cardiovascular risk markers, and metabolic health. It is available both as a weekly subcutaneous injectable and as an orally disintegrating tablet (ODT) for patients who prefer a needle-free option.'
    ),
    h3('sema-h3-expect', 'What to Expect'),
    p(
      'sema-p4',
      'Most patients begin with a low starter dose to allow the body to adjust, then progress through gradual titration under physician guidance. Appetite changes are typically noticed within the first few weeks. Steady weight loss generally follows over a 3–6 month period. Mild gastrointestinal effects such as nausea are common early on and usually resolve as the body adapts.'
    ),
    h3('sema-h3-quality', 'Quality & Sourcing'),
    qualityBlock('sema-p5', 'semaglutide'),
  ],

  // 2. TIRZEPATIDE
  tirzepatide: [
    h2('tirz-h2', 'What is Tirzepatide?'),
    p(
      'tirz-p1',
      'Tirzepatide is a dual GIP (glucose-dependent insulinotropic polypeptide) and GLP-1 receptor agonist — a newer generation of weight management peptide that targets two metabolic pathways simultaneously. Where semaglutide activates one receptor, tirzepatide activates two, offering a distinct physiological profile that has shown strong results in clinical research.'
    ),
    h3('tirz-h3-how', 'How It Works'),
    p(
      'tirz-p2',
      'By engaging both GIP and GLP-1 receptors, tirzepatide addresses appetite regulation, insulin sensitivity, and metabolic rate in a complementary way. GIP receptors are involved in fat metabolism and energy storage, while GLP-1 receptors manage appetite signaling and gastric emptying. Activating both pathways together appears to produce a synergistic effect on body weight and metabolic function beyond what either pathway achieves alone.'
    ),
    h3('tirz-h3-benefits', 'Key Benefits'),
    p(
      'tirz-p3',
      'Phase 3 clinical trials for tirzepatide (the SURMOUNT program) reported average weight reductions of 15–22% of body weight — results that outperformed prior GLP-1 therapies in head-to-head comparisons. Participants also showed improvements in blood sugar control, triglyceride levels, and blood pressure. It is available as a weekly injectable and as an orally disintegrating tablet (ODT) for oral administration.'
    ),
    h3('tirz-h3-expect', 'What to Expect'),
    p(
      'tirz-p4',
      'Tirzepatide protocols typically start at a low dose with gradual weekly escalation. The dual-receptor mechanism means appetite suppression can be more pronounced than with single-agonist therapies. Most patients notice reduced hunger and improved satiety within the first 4 weeks. Gastrointestinal side effects are possible during dose titration and tend to decrease as the body adjusts.'
    ),
    h3('tirz-h3-quality', 'Quality & Sourcing'),
    qualityBlock('tirz-p5', 'tirzepatide'),
  ],

  // 3. RETATRUTIDE
  retatrutide: [
    h2('reta-h2', 'What is Retatrutide?'),
    p(
      'reta-p1',
      'Retatrutide is a triple agonist peptide — meaning it activates three metabolic receptors simultaneously: GIP, GLP-1, and glucagon. It represents the newest generation of weight management peptides, currently advancing through Phase 3 clinical trials. Its multi-receptor design is intended to address weight, metabolic rate, and energy expenditure from three distinct angles at once.'
    ),
    h3('reta-h3-how', 'How It Works'),
    p(
      'reta-p2',
      'The glucagon receptor adds a third dimension to the dual-agonist approach of tirzepatide. Glucagon stimulates the liver to increase energy expenditure and supports fat breakdown (lipolysis). Combined with the appetite and insulin effects of GIP and GLP-1 activation, this triple-pathway approach targets caloric intake, fat metabolism, and energy output simultaneously — a mechanism unlike any previously approved therapy.'
    ),
    h3('reta-h3-benefits', 'Key Benefits'),
    p(
      'reta-p3',
      'Early Phase 2 trial data for retatrutide showed average weight reductions approaching 24% of body weight at higher doses over 48 weeks — preliminary figures that surpassed other agents in equivalent trial designs. Metabolic markers including triglycerides, blood sugar, and liver fat also improved in study participants. As Phase 3 data continues to emerge, retatrutide is positioned as a significant advance in peptide-based metabolic therapy.'
    ),
    h3('reta-h3-expect', 'What to Expect'),
    p(
      'reta-p4',
      'Because retatrutide is newer, clinical protocols are still being refined. Current compounded use follows a gradual titration approach similar to other GLP-1 class peptides. Patients and prescribers should discuss timelines and dosing expectations carefully. As with other agents in this class, gastrointestinal adjustment is common at the beginning of therapy.'
    ),
    h3('reta-h3-quality', 'Quality & Sourcing'),
    qualityBlock('reta-p5', 'retatrutide'),
  ],

  // 4. BPC-157
  bpc157: [
    h2('bpc-h2', 'What is BPC-157?'),
    p(
      'bpc-p1',
      'BPC-157 stands for Body Protection Compound 157. It is a synthetic peptide derived from a protein naturally found in gastric juice. It consists of 15 amino acids and has been studied extensively in preclinical models for its effects on tissue repair, gut health, and recovery. Among athletes, trainers, and integrative medicine practitioners, it has become one of the most discussed peptides in recovery protocols.'
    ),
    h3('bpc-h3-how', 'How It Works'),
    p(
      'bpc-p2',
      'BPC-157 is thought to work through several pathways, including upregulation of growth factor receptors, promotion of angiogenesis (new blood vessel formation), and modulation of nitric oxide production. These mechanisms support accelerated tissue healing at injured sites — including tendons, ligaments, muscles, and the gut lining. Research also suggests it may support nerve regeneration and reduce inflammation at the site of injury.'
    ),
    h3('bpc-h3-benefits', 'Key Benefits'),
    p(
      'bpc-p3',
      'Preclinical studies have consistently shown BPC-157 accelerating recovery from tendon, ligament, and muscle injuries. Gut healing is another area of active research — studies suggest it may support recovery from inflammatory bowel conditions and intestinal permeability. In sports medicine contexts, it is often used to support healing between training cycles and after acute injuries. It is generally administered as a subcutaneous or intramuscular injectable.'
    ),
    h3('bpc-h3-expect', 'What to Expect'),
    p(
      'bpc-p4',
      'BPC-157 is typically used in cycles of 4–12 weeks depending on the indication and physician guidance. Effects on acute injury recovery may be noticeable within 2–4 weeks. It is often paired with TB-500 (Thymosin Beta-4) for a more comprehensive tissue repair protocol. Human clinical trial data is still emerging, so it is most commonly used in research and integrative clinical settings.'
    ),
    h3('bpc-h3-quality', 'Quality & Sourcing'),
    qualityBlock('bpc-p5', 'BPC-157'),
  ],

  // 5. TB-500
  tb500: [
    h2('tb500-h2', 'What is TB-500 (Thymosin Beta-4)?'),
    p(
      'tb500-p1',
      'TB-500 is a synthetic version of a peptide fragment derived from Thymosin Beta-4, a protein naturally produced throughout the body in nearly every cell type. Thymosin Beta-4 plays a central role in the regulation of actin — the structural protein responsible for cell movement, wound healing, and tissue repair. TB-500 isolates the most bioactive segment of this protein, making it a focused tool for recovery and healing.'
    ),
    h3('tb500-h3-how', 'How It Works'),
    p(
      'tb500-p2',
      'TB-500 promotes cell migration to sites of injury — effectively recruiting repair cells to where they are needed. It also stimulates the formation of new blood vessels (angiogenesis) and reduces inflammation at the injury site. Unlike BPC-157, which tends to work locally near the injection site, TB-500 has a more systemic distribution, allowing it to support healing at distant tissue sites throughout the body.'
    ),
    h3('tb500-h3-benefits', 'Key Benefits'),
    p(
      'tb500-p3',
      'Research and clinical use suggest TB-500 supports recovery from muscle tears, tendon injuries, ligament damage, and joint issues. It has also been studied for its role in cardiac tissue repair and neurological regeneration. In practice, TB-500 is commonly used by people recovering from sports injuries or managing chronic musculoskeletal conditions. It pairs particularly well with BPC-157 for a synergistic recovery stack that addresses both local and systemic repair.'
    ),
    h3('tb500-h3-expect', 'What to Expect'),
    p(
      'tb500-p4',
      'TB-500 is typically administered via subcutaneous injection 2–3 times per week during a loading phase, then reduced to a maintenance frequency. Most users report improvements in mobility and pain reduction within 3–6 weeks. Results depend on the severity of injury, overall health, and adherence to the protocol. As with all peptides, it should be used under the guidance of a licensed prescriber.'
    ),
    h3('tb500-h3-quality', 'Quality & Sourcing'),
    qualityBlock('tb500-p5', 'TB-500'),
  ],

  // 6. NAD+
  'nad-plus': [
    h2('nad-h2', 'What is NAD+?'),
    p(
      'nad-p1',
      'NAD+ stands for Nicotinamide Adenine Dinucleotide. It is a coenzyme found in every living cell and is essential to hundreds of metabolic processes. Without NAD+, cells cannot produce energy, repair DNA, or maintain normal function. The challenge is that NAD+ levels decline significantly with age — studies suggest levels drop by approximately 50% between the ages of 40 and 60 — contributing to the cellular slowdown associated with aging.'
    ),
    h3('nad-h3-how', 'How It Works'),
    p(
      'nad-p2',
      'NAD+ serves as a critical electron carrier in cellular respiration, enabling mitochondria to convert nutrients into ATP (cellular energy). It is also required by sirtuins — proteins associated with longevity and cellular stress responses — and by PARP enzymes involved in DNA repair. Supplementing NAD+ aims to restore depleted cellular levels, giving cells the substrate they need to function at a higher capacity.'
    ),
    h3('nad-h3-benefits', 'Key Benefits'),
    p(
      'nad-p3',
      'Research links NAD+ supplementation to improved energy levels, mental clarity, and cellular metabolism. Studies in aging models have shown associations between higher NAD+ levels and improved mitochondrial function, reduced inflammation, and better metabolic health markers. It is available in injectable form for direct systemic delivery and as a nasal spray for rapid intranasal absorption — both bypassing digestive breakdown for improved bioavailability compared to oral supplements.'
    ),
    h3('nad-h3-expect', 'What to Expect'),
    p(
      'nad-p4',
      'Injectable NAD+ is often described as producing a notable boost in energy and mental focus, sometimes within hours of administration. The nasal spray format offers a more convenient daily option with steady systemic absorption. Many patients use NAD+ as part of a broader longevity or metabolic optimization protocol alongside peptides like MOTS-c or sermorelin. Protocols vary widely — dosing and frequency should be determined with a prescribing physician.'
    ),
    h3('nad-h3-quality', 'Quality & Sourcing'),
    qualityBlock('nad-p5', 'NAD+'),
  ],

  // 7. GHK-Cu
  ghkcu: [
    h2('ghkcu-h2', 'What is GHK-Cu (Copper Peptide)?'),
    p(
      'ghkcu-p1',
      'GHK-Cu is a naturally occurring tripeptide — glycine-histidine-lysine — that binds copper ions. It was first isolated from human plasma in the 1970s and has since been studied extensively for its biological effects on tissue regeneration, wound healing, and anti-aging. Concentrations in the body are highest in youth and decline significantly with age: abundant in the 20s, minimal by age 60.'
    ),
    h3('ghkcu-h3-how', 'How It Works'),
    p(
      'ghkcu-p2',
      'GHK-Cu activates a broad range of biological processes. It stimulates collagen, elastin, and glycosaminoglycan synthesis — the structural proteins that give skin, joints, and connective tissue their integrity and elasticity. It also acts as a copper transporter, regulating the availability of copper in tissues where it is needed for enzymatic reactions. Research suggests it modulates gene expression in ways that promote healing and reduce oxidative stress.'
    ),
    h3('ghkcu-h3-benefits', 'Key Benefits'),
    p(
      'ghkcu-p3',
      'GHK-Cu has been studied for skin rejuvenation, wound healing acceleration, hair follicle stimulation, and connective tissue repair. Dermatological research suggests it increases skin thickness and elasticity, reduces fine lines, and improves skin density over time. In hair studies, it appears to support follicle health and growth phase extension. Beyond aesthetics, it is studied for its role in gut healing and systemic tissue remodeling — making it relevant for both cosmetic and recovery applications.'
    ),
    h3('ghkcu-h3-expect', 'What to Expect'),
    p(
      'ghkcu-p4',
      'GHK-Cu is used both topically and via subcutaneous injection, depending on the indication. Injectable administration provides systemic delivery for whole-body tissue support. Skin and hair benefits typically emerge over 8–16 weeks of consistent use. It is often included in anti-aging protocols alongside NAD+ and MOTS-c for comprehensive cellular support. As with all peptides, results vary by individual and protocol design.'
    ),
    h3('ghkcu-h3-quality', 'Quality & Sourcing'),
    qualityBlock('ghkcu-p5', 'GHK-Cu'),
  ],

  // 8. MOTS-c
  motsc: [
    h2('motsc-h2', 'What is MOTS-c?'),
    p(
      'motsc-p1',
      'MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA-c) is a peptide encoded by mitochondrial DNA — not the nuclear genome, making it unique among known peptides. Discovered in 2015, it has quickly drawn research interest for its role in regulating metabolism, insulin sensitivity, and cellular energy homeostasis. It is sometimes described as an "exercise mimetic" for its ability to activate metabolic pathways associated with physical activity.'
    ),
    h3('motsc-h3-how', 'How It Works'),
    p(
      'motsc-p2',
      'MOTS-c primarily activates AMPK (AMP-activated protein kinase), a master regulator of cellular energy balance. AMPK activation triggers pathways that increase glucose uptake into cells, improve fat oxidation, and enhance mitochondrial function — effects similar to those produced by aerobic exercise. Research also suggests MOTS-c plays a role in regulating the folate and methionine cycle, linking mitochondrial function to broader metabolic regulation.'
    ),
    h3('motsc-h3-benefits', 'Key Benefits'),
    p(
      'motsc-p3',
      'Studies have linked MOTS-c to improved insulin sensitivity, reduced fat accumulation, and enhanced physical endurance in preclinical models. In aging research, higher circulating MOTS-c levels are associated with healthier metabolic profiles. Human research is still in early stages, but the peptide is used in integrative and longevity medicine practices for metabolic support, weight management assistance, and energy optimization — often as part of a broader protocol with NAD+ or GLP-1 therapies.'
    ),
    h3('motsc-h3-expect', 'What to Expect'),
    p(
      'motsc-p4',
      'MOTS-c is administered via subcutaneous injection, typically several times per week. Some users report increased energy, improved exercise recovery, and better blood sugar stability over a 4–8 week period. Because the human research base is still developing, MOTS-c is most often used in clinical research or integrative medicine settings with close physician oversight. Dosing protocols are individualized based on health goals.'
    ),
    h3('motsc-h3-quality', 'Quality & Sourcing'),
    qualityBlock('motsc-p5', 'MOTS-c'),
  ],

  // 9. SERMORELIN
  sermorelin: [
    h2('serm-h2', 'What is Sermorelin?'),
    p(
      'serm-p1',
      'Sermorelin is a synthetic analog of GHRH — growth hormone releasing hormone. It is a 29-amino-acid peptide that stimulates the pituitary gland to produce and secrete growth hormone naturally. Unlike synthetic HGH injections, which introduce exogenous growth hormone directly, sermorelin works upstream by prompting the body\'s own pituitary gland to do the work — preserving the natural feedback loops that regulate growth hormone output.'
    ),
    h3('serm-h3-how', 'How It Works'),
    p(
      'serm-p2',
      'After administration, sermorelin binds to GHRH receptors on the pituitary gland, triggering pulsatile release of growth hormone in a pattern that mirrors the body\'s natural secretion rhythm. This is important because growth hormone is not meant to be constantly elevated — it is released in pulses, primarily during deep sleep. Sermorelin supports this natural pattern rather than overriding it, making it a more physiologically aligned approach than direct HGH administration.'
    ),
    h3('serm-h3-benefits', 'Key Benefits'),
    p(
      'serm-p3',
      'Clinical use of sermorelin is associated with improvements in lean muscle development, reduction in body fat, enhanced sleep quality, and increased energy over time. As growth hormone naturally declines with age (a process called somatopause), sermorelin is studied as a way to support physiological GH levels without the regulatory and safety considerations of synthetic HGH. It is also generally well tolerated, with a strong safety profile in published studies.'
    ),
    h3('serm-h3-expect', 'What to Expect'),
    p(
      'serm-p4',
      'Sermorelin is typically administered via subcutaneous injection before bedtime to align with the body\'s natural nighttime growth hormone pulse. Results are gradual — most patients notice improvements in sleep quality within the first few weeks, with body composition changes becoming more apparent over 3–6 months of consistent use. It is often combined with GHRP peptides for enhanced pituitary stimulation under physician guidance.'
    ),
    h3('serm-h3-quality', 'Quality & Sourcing'),
    qualityBlock('serm-p5', 'sermorelin'),
  ],

  // 10. TESAMORELIN
  tesamorelin: [
    h2('tesa-h2', 'What is Tesamorelin?'),
    p(
      'tesa-p1',
      'Tesamorelin is a synthetic analog of GHRH (growth hormone releasing hormone) composed of the full 44-amino-acid GHRH sequence with a trans-3-hexenoic acid modification that increases its stability and potency. It is FDA-approved under the brand name Egrifta for the treatment of HIV-associated lipodystrophy (abnormal fat distribution), making it one of the few GHRH analogs with a specific FDA approval. Its clinical track record sets it apart from many other peptides in this class.'
    ),
    h3('tesa-h3-how', 'How It Works'),
    p(
      'tesa-p2',
      'Like sermorelin, tesamorelin stimulates the pituitary gland to release growth hormone naturally. Its modified structure makes it more resistant to enzymatic degradation, resulting in a longer duration of action and more robust pituitary stimulation compared to shorter GHRH analogs. The result is a more sustained increase in growth hormone output, leading to downstream effects on IGF-1 levels, fat metabolism, and body composition.'
    ),
    h3('tesa-h3-benefits', 'Key Benefits'),
    p(
      'tesa-p3',
      'In FDA-approved clinical use, tesamorelin has demonstrated significant reductions in visceral abdominal fat — the metabolically active fat surrounding internal organs that is associated with cardiovascular and metabolic risk. Beyond its approved indication, it is studied and used in integrative medicine for body composition optimization, improved exercise capacity, and metabolic support. Research suggests it is more potent than sermorelin in stimulating growth hormone release in certain clinical comparisons.'
    ),
    h3('tesa-h3-expect', 'What to Expect'),
    p(
      'tesa-p4',
      'Tesamorelin is administered via daily subcutaneous injection. Clinical trials showed measurable reductions in visceral fat over 26 weeks of use. Body composition improvements — including leaner abdominal profile and improved muscle-to-fat ratio — are typically observable over a 3–6 month course. As with all GH-stimulating therapies, individual results depend on baseline hormone levels, diet, activity, and adherence to the protocol.'
    ),
    h3('tesa-h3-quality', 'Quality & Sourcing'),
    qualityBlock('tesa-p5', 'tesamorelin'),
  ],

  // 11. SEMAGLUTIDE + NAD+ COMBO
  'sema-nad-combo': [
    h2('sema-nad-h2', 'What is the Semaglutide + NAD+ Combination?'),
    p(
      'sema-nad-p1',
      'This formulation combines two distinct therapeutic agents into a single compounded vial: semaglutide, a GLP-1 receptor agonist for appetite regulation and weight management, and NAD+ (Nicotinamide Adenine Dinucleotide), a coenzyme essential for cellular energy production and metabolic function. Together, they address two complementary aspects of metabolic health — caloric regulation and cellular energy — in one convenient preparation.'
    ),
    h3('sema-nad-h3-how', 'How It Works'),
    p(
      'sema-nad-p2',
      'Semaglutide works via GLP-1 receptor activation to reduce appetite, slow gastric emptying, and support weight loss. NAD+ addresses the cellular energy side of metabolism — supporting mitochondrial function, DNA repair, and the enzymatic reactions that govern how efficiently the body processes nutrients and produces energy. While semaglutide reduces caloric intake, NAD+ supports the cells\' ability to use that energy more efficiently.'
    ),
    h3('sema-nad-h3-benefits', 'Key Benefits'),
    p(
      'sema-nad-p3',
      'Patients pursuing weight management often find that as weight decreases, fatigue can be a transient challenge. The addition of NAD+ to a semaglutide protocol may help support energy levels throughout the weight loss process. Research on each individual component is robust — NAD+ and GLP-1 therapies have both been studied extensively on their own. This combination offers the convenience of a single-vial protocol for patients already using both agents.'
    ),
    h3('sema-nad-h3-expect', 'What to Expect'),
    p(
      'sema-nad-p4',
      'The combination is administered as a weekly subcutaneous injection, following the same titration approach as standalone semaglutide. Patients often report the energy-supporting effects of NAD+ as a complement to the appetite-suppressing effects of semaglutide — particularly during the early weeks of therapy when dietary changes are most significant. Dosing and protocol design should be managed by a licensed prescribing physician.'
    ),
    h3('sema-nad-h3-quality', 'Quality & Sourcing'),
    qualityBlock('sema-nad-p5', 'semaglutide/NAD+ combination'),
  ],

  // 12. TIRZEPATIDE + GLYCINE COMBO
  'tirz-glycine': [
    h2('tirz-gly-h2', 'What is the Tirzepatide + Glycine Combination?'),
    p(
      'tirz-gly-p1',
      'This formulation pairs tirzepatide — a dual GIP/GLP-1 receptor agonist — with glycine, a simple amino acid with a surprisingly wide range of biological roles. Glycine is the most abundant amino acid in the body and serves as a building block for collagen, a regulator of the nervous system, and a metabolic cofactor. Together, the two agents address both weight management and broader metabolic and recovery support.'
    ),
    h3('tirz-gly-h3-how', 'How It Works'),
    p(
      'tirz-gly-p2',
      'Tirzepatide activates both GIP and GLP-1 receptors to reduce appetite, improve insulin sensitivity, and support fat metabolism. Glycine complements this through several pathways: it is required for the synthesis of glutathione (a key antioxidant), it supports collagen production in connective tissue, it has been studied for improvements in sleep quality and insulin sensitivity, and it acts as an inhibitory neurotransmitter that may reduce systemic inflammation.'
    ),
    h3('tirz-gly-h3-benefits', 'Key Benefits'),
    p(
      'tirz-gly-p3',
      'The combination may offer advantages over tirzepatide alone for patients focused on body composition rather than just weight reduction. As tirzepatide drives fat loss, glycine supports the preservation of connective tissue integrity and lean muscle through collagen synthesis pathways. Research on glycine independently suggests benefits for sleep quality, joint health, and metabolic regulation — all relevant for patients undergoing body composition changes.'
    ),
    h3('tirz-gly-h3-expect', 'What to Expect'),
    p(
      'tirz-gly-p4',
      'This combination is administered via weekly subcutaneous injection, following tirzepatide titration protocols. Patients typically notice appetite and weight effects from the tirzepatide component within the first 4 weeks. The glycine contribution is more subtle and cumulative — supporting recovery, joint comfort, and overall tissue integrity over time. As with all compounded formulations, prescription and physician oversight are required.'
    ),
    h3('tirz-gly-h3-quality', 'Quality & Sourcing'),
    qualityBlock('tirz-gly-p5', 'tirzepatide/glycine combination'),
  ],

  // 13. STARTER KITS
  'starter-kit': [
    h2('kit-h2', 'What is Included in a Greenstone Starter Kit?'),
    p(
      'kit-p1',
      'Greenstone Peptides starter kits are designed for patients beginning injectable peptide therapy. Every kit contains the supplies needed for proper, sterile self-administration: alcohol prep swabs, insulin-style syringes with fine-gauge needles, and clear usage instructions. Kits are available in 5, 10, 15, and 20-day configurations to align with your prescribed protocol length and physician guidance.'
    ),
    h3('kit-h3-how', 'How It Works'),
    p(
      'kit-p2',
      'The kit is not a therapeutic product itself — it is the delivery infrastructure for your prescribed peptide. Each item is selected for compatibility with standard subcutaneous peptide injections. Alcohol swabs ensure the injection site and vial top are properly sanitized before each use. The syringes are sized for precision dosing of the small volumes typical in peptide protocols. Having everything in one package eliminates the friction of sourcing supplies separately.'
    ),
    h3('kit-h3-benefits', 'Key Benefits'),
    p(
      'kit-p3',
      'For patients new to self-injection, having a properly curated supply kit reduces the chance of errors or contamination from incompatible equipment. Everything is pre-selected for sterile technique, appropriate needle gauge, and volume accuracy. The starter kit is particularly useful when beginning a new peptide protocol — it ensures you have exactly what you need from day one without having to navigate medical supply catalogs.'
    ),
    h3('kit-h3-expect', 'What to Expect'),
    p(
      'kit-p4',
      'Each kit is packaged cleanly and labeled clearly. The number of swabs and syringes corresponds to the day count of the kit. For patients on once-weekly injection protocols, a 5-day kit typically covers one injection cycle. For daily protocols, choose the kit size that matches your prescription length. If you have questions about which kit size is right for your protocol, consult with your prescribing provider.'
    ),
    h3('kit-h3-quality', 'Quality & Sourcing'),
    p(
      'kit-p5',
      'All supply components included in Greenstone starter kits are sourced from FDA-regulated manufacturers. Syringes and swabs meet standard sterile medical supply specifications. Kits are assembled and packaged in a controlled environment to maintain sterility through delivery.'
    ),
  ],
};

// ─── PEPTIDE TYPE MATCHER ─────────────────────────────────────────────────────

/**
 * Given a product _id, return the matching description key.
 * Matching is done by _id prefix/substring — mirrors the seed-products.mjs naming convention.
 */
function getDescriptionKey(productId) {
  if (productId.includes('sema-nad')) return 'sema-nad-combo';
  if (productId.includes('tirz-glycine')) return 'tirz-glycine';
  if (productId.includes('sema')) return 'semaglutide';
  if (productId.includes('tirz')) return 'tirzepatide';
  if (productId.includes('reta')) return 'retatrutide';
  if (productId.includes('bpc157') || productId.includes('bpc-157')) return 'bpc157';
  if (productId.includes('tb500') || productId.includes('tb-500')) return 'tb500';
  if (productId.includes('nad')) return 'nad-plus';
  if (productId.includes('ghkcu') || productId.includes('ghk-cu')) return 'ghkcu';
  if (productId.includes('motsc') || productId.includes('mots-c')) return 'motsc';
  if (productId.includes('sermorelin')) return 'sermorelin';
  if (productId.includes('tesamorelin')) return 'tesamorelin';
  if (productId.includes('kit')) return 'starter-kit';
  return null;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log('\nGreenstone Peptides — Product Description Updater');
  console.log(`Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}\n`);

  // Fetch all active products
  const products = await client.fetch(
    `*[_type == "product" && active == true]{ _id, name, slug }`
  );

  console.log(`Found ${products.length} active products.\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const key = getDescriptionKey(product._id);

    if (!key || !descriptions[key]) {
      console.log(`  SKIP  ${product.name} (${product._id}) — no description mapped`);
      skipped++;
      continue;
    }

    try {
      await client
        .patch(product._id)
        .set({ description: descriptions[key] })
        .commit();

      console.log(`  OK    ${product.name}`);
      updated++;
    } catch (err) {
      console.error(`  ERROR ${product.name}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\nDone.`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total processed: ${products.length}\n`);
}

run().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
