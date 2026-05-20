import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SchemaOrg } from '@/components/SchemaOrg';
import {
  PARENT_PRODUCTS,
  fromPrice,
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

          {/* ---------- 2-COL HERO + PRODUCT RAIL ----------
              Desktop (lg+): hero copy on the left (7 cols), product rail
              on the right (5 cols, sticky). The rail spans both grid rows
              so it sits beside the hero AND beside the explainers below
              it — products are visible above the fold and stay visible
              while the visitor reads.

              Mobile: single column. Grid order is: header → product rail
              → explainers, which is exactly the conversion-first order
              we want (price + products visible right after the lede). */}
          <div className="grid gap-10 lg:gap-14 lg:grid-cols-12">
            <header className="lg:col-span-7 lg:row-start-1">
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

            <aside className="lg:col-span-5 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-24 lg:self-start">
              <ProductRail products={molecules} categoryLabel={area.label} />
            </aside>

            <div className="lg:col-span-7 lg:row-start-2 mt-4 lg:mt-12 space-y-12">
              {area.explainers.map((ex) => (
                <ExplainerBlock key={ex.heading} item={ex} />
              ))}
            </div>
          </div>

          {/* ---------- SUB-AREAS (Peptides only) ----------
              On peptides, the product rail above shows EVERY peptide. The
              sub-area sections below give context-rich groupings for
              visitors who want to drill into a specific use-case. */}
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

/**
 * Compact product rail used in the right column of the treatments hero.
 * Renders one horizontal row per product — small image + name + "From $X"
 * + arrow — so visitors see the full category catalog above the fold
 * without scrolling past educational content.
 */
function ProductRail({
  products,
  categoryLabel,
}: {
  products: ParentProduct[];
  categoryLabel: string;
}) {
  if (products.length === 0) return null;

  return (
    <div className="bg-obsidian-mid/60 border border-emerald/20 p-5 sm:p-6">
      <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-emerald/15">
        <p className="font-jetbrains text-emerald text-[0.6rem] tracking-[0.25em] uppercase">
          // Shop {categoryLabel.toLowerCase()}
        </p>
        <p className="font-jetbrains text-[0.55rem] tracking-[0.2em] uppercase text-cream-dim/55">
          {products.length} {products.length === 1 ? 'molecule' : 'molecules'}
        </p>
      </div>

      <ul className="space-y-1">
        {products.map((p) => {
          const from = fromPrice(p);
          return (
            <li key={p.slug}>
              <Link
                href={`/shop/${p.slug}`}
                data-track={`rail-${p.slug}`}
                className="group/rail flex items-center gap-3 p-2 -mx-2 border border-transparent hover:border-emerald/25 hover:bg-emerald/[0.04] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald focus-visible:outline-offset-2"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-obsidian overflow-hidden border border-emerald/20">
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cormorant text-lg sm:text-xl text-white leading-tight truncate">
                    {p.name}
                  </p>
                  <p className="text-[0.7rem] sm:text-xs text-cream-dim leading-snug truncate">
                    {p.shortDescription}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right pr-1">
                  <p className="font-jetbrains text-[0.55rem] tracking-[0.15em] uppercase text-cream-dim/65 leading-none">
                    From
                  </p>
                  <p className="font-cormorant text-lg text-gold leading-none mt-1" style={{ fontWeight: 400 }}>
                    ${from}
                  </p>
                </div>
                <ArrowUpRight
                  size={14}
                  className="flex-shrink-0 text-cream-dim/40 group-hover/rail:text-emerald group-hover/rail:translate-x-0.5 group-hover/rail:-translate-y-0.5 transition-all"
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 pt-4 border-t border-emerald/15 text-[0.7rem] text-cream-dim/65 leading-snug">
        All molecules are compounded by Greenstone Rx, a Florida 503A pharmacy. Prescription required.
      </p>
    </div>
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
      <div className="grid gap-10 lg:gap-14 lg:grid-cols-12">
        <header className="lg:col-span-7 lg:row-start-1">
          <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-5">
            // {sub.label}
          </p>
          <h2
            id={`sub-${sub.id}-heading`}
            className="font-cormorant text-3xl sm:text-4xl text-white leading-[1.08] mb-6"
            style={{ fontWeight: 400 }}
          >
            {sub.heroLine1}
            <br />
            <em className="text-gold italic">{sub.heroLine2}</em>
          </h2>
          <p className="text-base text-cream-dim leading-relaxed">{sub.lead}</p>
        </header>

        {molecules.length > 0 && (
          <aside className="lg:col-span-5 lg:row-start-1 lg:row-span-2 lg:self-start">
            <ProductRail products={molecules} categoryLabel={categoryLabel} />
          </aside>
        )}

        <div className="lg:col-span-7 lg:row-start-2 mt-2 lg:mt-8 space-y-8">
          {sub.explainers.map((ex) => (
            <ExplainerBlock key={ex.heading} item={ex} />
          ))}
        </div>
      </div>
    </section>
  );
}
