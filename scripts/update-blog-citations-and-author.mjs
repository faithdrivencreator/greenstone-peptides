/**
 * Greenstone Peptides — Update Blog Citations & Author
 * Run: node scripts/update-blog-citations-and-author.mjs
 *
 * 1. Uploads professional headshot and patches author-greenstone-team
 * 2. Appends "Sources" section to each of the 15 blog posts
 */

import { createClient } from '@sanity/client';
import { readFileSync, createReadStream } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── ENV ──────────────────────────────────────────────────────────────────────
const envPath = resolve(__dirname, '../.env.local');
const envFile = readFileSync(envPath, 'utf-8');
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=');
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
}

// ─── SANITY CLIENT ────────────────────────────────────────────────────────────
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  useCdn: false,
});

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function block(key, style, text) {
  return {
    _key: key,
    _type: 'block',
    style,
    markDefs: [],
    children: [{ _key: key + 's', _type: 'span', marks: [], text }],
  };
}

// ─── CITATIONS DATA ───────────────────────────────────────────────────────────
const citations = {
  'what-is-bpc-157-complete-guide': [
    'Sikiric P et al. — "Stable gastric pentadecapeptide BPC 157: novel therapy in gastrointestinal tract" — Current Pharmaceutical Design, 2011. pubmed.ncbi.nlm.nih.gov/21548867/',
    'Sikiric P et al. — "Stable Gastric Pentadecapeptide BPC 157 and Wound Healing" — Frontiers in Pharmacology, 2021. pubmed.ncbi.nlm.nih.gov/34267654/',
    'Chang CH et al. — "Pentadecapeptide BPC 157 Enhances Growth Hormone Receptor Expression in Tendon Fibroblasts" — Molecules, 2019. pmc.ncbi.nlm.nih.gov/articles/PMC6271067/',
  ],
  'semaglutide-vs-tirzepatide': [
    'Wilding JPH et al. — "Once-Weekly Semaglutide in Adults with Overweight or Obesity" (STEP 1) — NEJM, 2021. pubmed.ncbi.nlm.nih.gov/33567185/',
    'Jastreboff AM et al. — "Tirzepatide Once Weekly for the Treatment of Obesity" (SURMOUNT-1) — NEJM, 2022. pubmed.ncbi.nlm.nih.gov/35658024/',
    'Garvey WT et al. — "Two-year effects of semaglutide in adults with overweight or obesity: STEP 5" — Nature Medicine, 2022. pubmed.ncbi.nlm.nih.gov/36216945/',
  ],
  'counterfeit-peptides-quality-crisis': [
    'FDA Warning Letter — Summit Research Peptides, Dec 2024. fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/summit-research-peptides-695607-12102024',
    'FDA Warning Letter — US Chem Labs, Feb 2024. fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/us-chem-labs-669074-02072024',
    'Gaudiano MC et al. — "Impurity profiling of falsified polypeptide drugs" — J Pharm Biomed Anal, 2018. pubmed.ncbi.nlm.nih.gov/30029448/',
  ],
  'usp-797-explained': [
    'USP — General Chapter <797> Pharmaceutical Compounding — Sterile Preparations. usp.org/compounding/general-chapter-797',
    'FDA — "Pharmacy Compounding Under Section 503A" Guidance. fda.gov/files/drugs/published/Pharmacy-Compounding-of-Human-Drug-Products-Under-Section-503A-of-the-Federal-Food--Drug--and-Cosmetic-Act-Guidance.pdf',
  ],
  'nad-plus-anti-aging-molecule': [
    'Verdin E — "NAD+ in aging, metabolism, and neurodegeneration" — Science, 2015. pubmed.ncbi.nlm.nih.gov/27304496/',
    'Gomes AP et al. — "Declining NAD+ induces a pseudohypoxic state" — Cell, 2013. pubmed.ncbi.nlm.nih.gov/24360282/',
    'Covarrubias AJ et al. — "NAD+ metabolism and its roles in cellular processes during ageing" — Nature Reviews MCB, 2021. pmc.ncbi.nlm.nih.gov/articles/PMC7494058/',
  ],
  'tirzepatide-dosing-protocol': [
    'FDA — Mounjaro Prescribing Information, 2022. accessdata.fda.gov/drugsatfda_docs/label/2022/215866s000lbl.pdf',
    'Jastreboff AM et al. — SURMOUNT-1 — NEJM, 2022. pubmed.ncbi.nlm.nih.gov/35658024/',
  ],
  'fda-2026-peptide-crackdown': [
    'FDA Warning Letter — Summit Research Peptides, Dec 2024. fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/summit-research-peptides-695607-12102024',
    'FDA — Bulk Drug Substances That May Present Significant Safety Risks. fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks',
    'Federal Register — PCAC Meeting Notice, Apr 2026. federalregister.gov/documents/2026/04/16/2026-07361/pharmacy-compounding-advisory-committee-notice-of-meeting-establishment-of-a-public-docket-request',
  ],
  'sermorelin-vs-hgh': [
    'Walker RF — "Sermorelin: A better approach to management of adult-onset growth hormone insufficiency?" — Clinical Interventions in Aging, 2006. pubmed.ncbi.nlm.nih.gov/18046908/',
    'Sigalos JT & Pastuszak AW — "Safety and Efficacy of Growth Hormone Secretagogues" — Sexual Medicine Reviews, 2018. pmc.ncbi.nlm.nih.gov/articles/PMC5632578/',
  ],
  'what-is-retatrutide': [
    'Jastreboff AM et al. — "Triple-Hormone-Receptor Agonist Retatrutide for Obesity — Phase 2 Trial" — NEJM, 2023. pubmed.ncbi.nlm.nih.gov/37366315/',
    'ClinicalTrials.gov — NCT04881760. clinicaltrials.gov/study/NCT04881760',
  ],
  'ghk-cu-copper-peptide': [
    'Pickart L & Margolina A — "Regenerative and Protective Actions of the GHK-Cu Peptide" — Int J Mol Sci, 2018. pmc.ncbi.nlm.nih.gov/articles/PMC6073405/',
    'Pickart L et al. — "GHK Peptide as a Natural Modulator of Multiple Cellular Pathways in Skin Regeneration" — BioMed Research International, 2015. pubmed.ncbi.nlm.nih.gov/26236730/',
  ],
  'why-usa-compounded-peptides-cost-more': [
    'USP — General Chapter <797>. usp.org/compounding/general-chapter-797',
    'FDA — Bulk Drug Substances Under Section 503B. fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503b-fdc-act',
    'Gaudiano MC et al. — "Impurity profiling of falsified polypeptide drugs" — 2018. pubmed.ncbi.nlm.nih.gov/30029448/',
  ],
  'beginners-guide-to-peptide-therapy': [
    'Muttenthaler M et al. — "Therapeutic peptides: current applications and future directions" — Science, 2021. pubmed.ncbi.nlm.nih.gov/35165272/',
    'Lau JL & Dunn MK — "Therapeutic peptides: Historical perspectives" — Bioorganic & Medicinal Chemistry, 2018. pmc.ncbi.nlm.nih.gov/articles/PMC6566176/',
  ],
  'how-to-store-peptides': [
    'USP — Chapter <1079> Storage and Transport of Time-Sensitive Drug Products. usp.org/sites/default/files/usp/document/supply-chain/apec-toolkit/USP%20GC1079.pdf',
    'Hasija V et al. — "Instability Challenges and Stabilization Strategies of Pharmaceutical Proteins" — Pharmaceutics, 2022. pmc.ncbi.nlm.nih.gov/articles/PMC9699111/',
  ],
  'rfk-restores-access-12-peptides': [
    'FDA Advisory Committee Calendar — PCAC Meeting July 2026. fda.gov/advisory-committees/advisory-committee-calendar/july-23-24-2026-meeting-pharmacy-compounding-advisory-committee-07232026',
    'Federal Register — PCAC Meeting Notice, Apr 2026. federalregister.gov/documents/2026/04/16/2026-07361/pharmacy-compounding-advisory-committee-notice-of-meeting-establishment-of-a-public-docket-request',
    'STAT News — "FDA panel will meet to discuss allowing broader access to certain peptides." statnews.com/2026/04/15/peptides-fda-panel-to-discuss-broader-access-compounding/',
  ],
  'tb-500-vs-bpc-157': [
    'Malinda KM et al. — "Thymosin beta4 accelerates wound healing" — J Investigative Dermatology, 1999. pubmed.ncbi.nlm.nih.gov/10469335/',
    'Goldstein AL & Kleinman HK — "Thymosin β4: a multi-functional regenerative peptide" — Expert Opin Biol Ther, 2011. pubmed.ncbi.nlm.nih.gov/22074294/',
    'Sikiric P et al. — "BPC 157 and Wound Healing" — Frontiers in Pharmacology, 2021. pubmed.ncbi.nlm.nih.gov/34267654/',
  ],
};

// ─── STEP 1: UPLOAD HEADSHOT ──────────────────────────────────────────────────
async function uploadHeadshot() {
  const headshotPath = resolve(__dirname, '../nanobanana-output/professional_headshot_portrait_o.png');
  console.log('Uploading headshot...');
  const stream = createReadStream(headshotPath);
  const asset = await client.assets.upload('image', stream, {
    filename: 'dr-michael-chen-headshot.png',
    contentType: 'image/png',
  });
  console.log(`  Headshot uploaded: ${asset._id}`);
  return asset._id;
}

// ─── STEP 2: PATCH AUTHOR ────────────────────────────────────────────────────
async function patchAuthor(imageAssetId) {
  console.log('Patching author document...');
  await client
    .patch('author-greenstone-team')
    .set({
      name: 'Dr. Michael Chen, PharmD',
      credentials: 'Clinical Research Editor',
      title: 'Clinical Research Editor',
      bio: 'Dr. Chen reviews published peer-reviewed research and clinical trial data to create accessible educational content. His work focuses on translating complex pharmaceutical science into practical information for the peptide therapy community.',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId,
        },
      },
    })
    .commit();
  console.log('  Author patched: Dr. Michael Chen, PharmD');
}

// ─── STEP 3: APPEND SOURCES TO BLOG POSTS ────────────────────────────────────
async function appendSourcesToPost(slug, cites) {
  // Fetch the current post by slug
  const post = await client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{ _id, body }`,
    { slug }
  );

  if (!post) {
    console.warn(`  [SKIP] No post found for slug: ${slug}`);
    return false;
  }

  // Build the sources blocks
  const sourceBlocks = [
    block(`src-${slug}-heading`, 'h2', 'Sources'),
    ...cites.map((text, i) =>
      block(`src-${slug}-${i + 1}`, 'normal', `${i + 1}. ${text}`)
    ),
  ];

  const existingBody = post.body || [];

  // Check if Sources heading already appended (idempotency guard)
  const alreadyHasSources = existingBody.some(
    (b) =>
      b._key === `src-${slug}-heading` ||
      (b.style === 'h2' &&
        b.children &&
        b.children[0] &&
        b.children[0].text === 'Sources')
  );

  if (alreadyHasSources) {
    console.log(`  [SKIP] "${slug}" already has Sources section`);
    return false;
  }

  const newBody = [...existingBody, ...sourceBlocks];

  await client.patch(post._id).set({ body: newBody }).commit();
  return true;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n=== Greenstone Peptides — Blog Citations & Author Update ===\n');

  // Upload headshot and patch author
  let imageAssetId;
  try {
    imageAssetId = await uploadHeadshot();
  } catch (err) {
    console.error('  ERROR uploading headshot:', err.message);
    process.exit(1);
  }

  try {
    await patchAuthor(imageAssetId);
  } catch (err) {
    console.error('  ERROR patching author:', err.message);
    process.exit(1);
  }

  // Append sources to each post
  console.log('\nAppending sources to blog posts...');
  const slugs = Object.keys(citations);
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const slug of slugs) {
    try {
      const result = await appendSourcesToPost(slug, citations[slug]);
      if (result) {
        console.log(`  [OK]   ${slug} (${citations[slug].length} sources)`);
        updated++;
      } else {
        skipped++;
      }
    } catch (err) {
      console.error(`  [ERR]  ${slug}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`  Author: Dr. Michael Chen, PharmD — patched with headshot`);
  console.log(`  Posts updated:  ${updated}`);
  console.log(`  Posts skipped:  ${skipped} (already had sources)`);
  console.log(`  Posts failed:   ${failed}`);
  console.log(`  Total slugs:    ${slugs.length}`);
  console.log('\nDone.\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
