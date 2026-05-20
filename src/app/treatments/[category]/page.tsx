import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SchemaOrg } from '@/components/SchemaOrg';
import { MoleculeCard } from '@/components/MoleculeCard';
import {
  PARENT_PRODUCTS,
  type ParentProduct,
  type PeptideSubArea,
} from '@/data/parent-products';
import {
  TREATMENT_AREAS,
  getTreatmentAreaByCategory,
  type SubAreaContent,
  type TreatmentExplainer,
} from '@/data/treatment-areas';

interface PageProps {
  params: { category: string };
}

export function generateStaticParams() {
  return TREATMENT_AREAS.map((t) => ({ category: t.category }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const area = getTreatmentAreaByCategory(
    params.category as ParentProduct['category'],
  );
  if (!area) return {};
  return {
    title: `${area.label} · Greenstone Wellness`,
    description: area.lead,
    alternates: { canonical: `/treatments/${params.category}` },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  'weight-loss': 'Weight Loss',
  peptides: 'Peptides',
  longevity: 'Longevity',
  'mens-ed': "Men's ED",
};

export default function TreatmentAreaPage({ params }: PageProps) {
  const area = getTreatmentAreaByCategory(
    params.category as ParentProduct['category'],
  );
  if (!area) notFound();

  const molecules = PARENT_PRODUCTS.filter(
    (p) => p.category === area.category,
  );

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greenstonewellness.store/' },
      { '@type': 'ListItem', position: 2, name: 'Treatments', item: 'https://greenstonewellness.store/treatments' },
      { '@type': 'ListItem', position: 3, name: area.label, item: `https://greenstonewellness.store/treatments/${params.category}` },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${area.heroLine1} ${area.heroLine2}`,
    description: area.lead,
    author: { '@type': 'Organization', name: 'Greenstone Wellness' },
    publisher: { '@type': 'Organization', name: 'Greenstone Wellness' },
  };

  return (
    <>
      <SchemaOrg schema={breadcrumbSchema} />
      <SchemaOrg schema={articleSchema} />

      <section className="section-py">
        <div className="container-gr">
          {/* Breadcrumbs */}
          <nav className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim/70 mb-10" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-emerald transition-colors">Home</Link>
            <span className="mx-2 text-emerald/30">/</span>
            <Link href="/shop" className="hover:text-emerald transition-colors">Shop</Link>
            <span className="mx-2 text-emerald/30">/</span>
            <span className="text-cream">{area.label}</span>
          </nav>

          {/* ---------- HERO ---------- */}
          <header className="max-w-3xl">
            <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-5">
              // {area.eyebrow}
            </p>
            <h1 className="font-cormorant text-display-lg text-white leading-[1.05] mb-8" style={{ fontWeight: 400 }}>
              {area.heroLine1}
              <br />
              <em className="text-gold not-italic-fallback italic">{area.heroLine2}</em>
            </h1>
            <p className="text-lg text-cream-dim leading-relaxed max-w-2xl">
              {area.lead}
            </p>
          </header>

          {/* ---------- 4 EXPLAINER BLOCKS ---------- */}
          <div className="mt-20 max-w-3xl space-y-12">
            {area.explainers.map((ex) => (
              <ExplainerBlock key={ex.heading} item={ex} />
            ))}
          </div>

          {/* ---------- SUB-AREAS (Peptides only) ---------- */}
          {area.subAreas && area.subAreas.length > 0 && (
            <div className="mt-28 space-y-24">
              {area.subAreas.map((sub) => (
                <SubAreaSection
                  key={sub.id}
                  sub={sub}
                  molecules={molecules.filter(
                    (m) => m.peptideSubArea === sub.id,
                  )}
                  categoryLabel={sub.label}
                />
              ))}
            </div>
          )}

          {/* ---------- FORMULARY GRID (non-peptides categories) ---------- */}
          {!area.subAreas && molecules.length > 0 && (
            <div className="mt-24">
              <header className="mb-10 pb-4 border-b border-emerald/15">
                <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                  // Available in this store
                </p>
                <h2 className="font-cormorant text-3xl text-white" style={{ fontWeight: 400 }}>
                  Greenstone Wellness {area.label.toLowerCase()} formulary
                </h2>
              </header>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {molecules.map((m) => (
                  <MoleculeCard
                    key={m.slug}
                    product={m}
                    categoryLabel={area.label}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ---------- FOOTER DISCLAIMER ---------- */}
          <p className="mt-24 text-xs leading-relaxed text-cream-dim/70 max-w-3xl mx-auto text-center">
            Prescription required. Reviewed by a licensed U.S. physician. Compounded by Greenstone Rx, a Florida 503A pharmacy.{' '}
            <Link href="/safety" className="underline underline-offset-2 hover:text-cream transition-colors">
              Full disclaimer
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

function ExplainerBlock({ item }: { item: TreatmentExplainer }) {
  return (
    <section>
      <h3 className="font-cormorant text-2xl text-cream leading-tight mb-3" style={{ fontWeight: 500 }}>
        {item.heading}
      </h3>
      <p className="text-base text-cream-dim leading-relaxed">{item.body}</p>
    </section>
  );
}

function SubAreaSection({
  sub,
  molecules,
  categoryLabel,
}: {
  sub: SubAreaContent;
  molecules: ParentProduct[];
  categoryLabel: string;
}) {
  return (
    <section
      id={`sub-${sub.id}`}
      className="scroll-mt-32"
      aria-labelledby={`sub-${sub.id}-heading`}
    >
      <header className="max-w-3xl mb-12">
        <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-5">
          // {sub.label}
        </p>
        <h2
          id={`sub-${sub.id}-heading`}
          className="font-cormorant text-4xl sm:text-5xl text-white leading-[1.08] mb-7"
          style={{ fontWeight: 400 }}
        >
          {sub.heroLine1}
          <br />
          <em className="text-gold italic">{sub.heroLine2}</em>
        </h2>
        <p className="text-base text-cream-dim leading-relaxed">{sub.lead}</p>
      </header>

      <div className="max-w-3xl space-y-10 mb-14">
        {sub.explainers.map((ex) => (
          <ExplainerBlock key={ex.heading} item={ex} />
        ))}
      </div>

      {molecules.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {molecules.map((m) => (
            <MoleculeCard key={m.slug} product={m} categoryLabel={categoryLabel} />
          ))}
        </div>
      )}
    </section>
  );
}
