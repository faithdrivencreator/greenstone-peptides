import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SchemaOrg } from '@/components/SchemaOrg';
import {
  PARENT_PRODUCTS,
  getParentBySlug,
  fromPrice,
  type ExpectationStage,
} from '@/data/parent-products';
import { PharmacyDeepLink } from './PharmacyDeepLink';
import { FAQAccordion } from '@/components/FAQAccordion';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return PARENT_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const product = getParentBySlug(params.slug);
  if (!product) return {};
  return {
    title: `${product.name} · Greenstone Wellness`,
    description: product.shortDescription,
    alternates: { canonical: `/shop/${params.slug}` },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  'weight-loss': 'Weight Loss',
  peptides: 'Peptides',
  longevity: 'Longevity',
  'mens-ed': "Men's ED",
};

function isStageArray(
  whatToExpect: string | ExpectationStage[],
): whatToExpect is ExpectationStage[] {
  return Array.isArray(whatToExpect);
}

export default function ParentDetailPage({ params }: PageProps) {
  const product = getParentBySlug(params.slug);
  if (!product) notFound();

  const from = fromPrice(product);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription,
    image: product.image,
    brand: { '@type': 'Brand', name: 'Greenstone Wellness' },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: from,
      highPrice: Math.max(...product.variants.map((v) => v.price)),
      priceCurrency: 'USD',
      offerCount: product.variants.length,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greenstonewellness.store/' },
      { '@type': 'ListItem', position: 2, name: 'Formulary', item: 'https://greenstonewellness.store/shop' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://greenstonewellness.store/shop/${params.slug}` },
    ],
  };

  return (
    <>
      <SchemaOrg schema={productSchema} />
      <SchemaOrg schema={breadcrumbSchema} />

      <section className="section-py">
        <div className="container-gr">
          {/* Breadcrumbs */}
          <nav className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-cream-dim/70 mb-10" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-emerald transition-colors">Home</Link>
            <span className="mx-2 text-emerald/30">/</span>
            <Link href={`/treatments/${product.category}`} className="hover:text-emerald transition-colors">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </Link>
            <span className="mx-2 text-emerald/30">/</span>
            <span className="text-cream">{product.name}</span>
          </nav>

          {/* ---------- HERO ---------- */}
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-start">
            <div className="relative aspect-square overflow-hidden bg-obsidian-mid border border-emerald/20">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald mb-3">
                // {CATEGORY_LABELS[product.category] ?? product.category}
              </p>
              <h1 className="font-cormorant text-display-lg text-white leading-tight">{product.name}</h1>
              <p className="mt-5 text-base text-cream-dim leading-relaxed italic">
                {product.shortDescription}
              </p>

              <ul className="mt-7 space-y-2.5">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-cream-dim leading-relaxed">
                    <span className="text-emerald mt-0.5 flex-shrink-0">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* ---------- HERO CTA — price block + primary CTA + secondary anchors ---------- */}
              <div className="mt-10 pt-8 border-t border-emerald/20">
                {/* Price — vertical hierarchy, eyebrow above price, no jumbled inline mash */}
                <p className="font-jetbrains text-[0.6rem] tracking-[0.25em] uppercase text-cream-dim/65 mb-2">
                  Starting from
                </p>
                <div className="flex items-baseline gap-5">
                  <p className="font-cormorant text-5xl sm:text-6xl text-gold leading-none" style={{ fontWeight: 400 }}>
                    ${from}
                  </p>
                  <a
                    href="#formulations"
                    className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald hover:text-emerald-light underline-offset-[6px] hover:underline transition-colors"
                  >
                    {product.variants.length === 1
                      ? 'View formulation ↓'
                      : `View all ${product.variants.length} formulations ↓`}
                  </a>
                </div>

                <p className="mt-6 text-sm text-cream-dim leading-relaxed">
                  Sign-in required. A licensed physician reviews every prescription before it ships.
                </p>

                {/* Primary CTA — full-width on its own row */}
                <div className="mt-6">
                  <PharmacyDeepLink slug={product.slug} />
                </div>

                {/* Secondary anchor — own row, tertiary visual weight */}
                <a
                  href="#details"
                  className="mt-6 inline-flex items-center gap-1.5 font-jetbrains text-[0.6rem] tracking-[0.22em] uppercase text-cream-dim/60 hover:text-emerald transition-colors"
                >
                  Read the full protocol ↓
                </a>
              </div>
            </div>
          </div>

          {/* ---------- VARIANT PRICING TABLE (moved up — sits directly under the hero so visitors see all formulations + prices without scrolling past the science) ---------- */}
          <div id="formulations" className="mt-16 max-w-4xl mx-auto scroll-mt-24">
            <header className="mb-6">
              <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald mb-2">
                // All formulations
              </p>
              <h2 className="font-cormorant text-2xl sm:text-3xl text-white" style={{ fontWeight: 400 }}>
                {product.variants.length === 1 ? '1 formulation available' : `${product.variants.length} formulations available`}
              </h2>
              <p className="mt-2 text-sm text-cream-dim">
                For orientation only — your physician confirms the final protocol on the pharmacy storefront.
              </p>
            </header>

            <div className="overflow-x-auto border border-emerald/20">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald/10 border-b border-emerald/25">
                    <th className="text-left font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald/90 py-3 px-4">Option</th>
                    <th className="text-left font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald/90 py-3 px-4 hidden sm:table-cell">Dose</th>
                    <th className="text-left font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald/90 py-3 px-4">Size</th>
                    <th className="text-right font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald/90 py-3 px-4">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {product.variants.map((v, i) => (
                    <tr key={`${v.label}-${i}`} className="border-b border-emerald/10 last:border-b-0 hover:bg-emerald/5 transition-colors">
                      <td className="py-3.5 px-4 text-cream font-medium">{v.label}</td>
                      <td className="py-3.5 px-4 text-cream-dim hidden sm:table-cell">{v.dose}</td>
                      <td className="py-3.5 px-4 text-cream-dim">{v.size}</td>
                      <td className="py-3.5 px-4 text-right font-cormorant text-xl text-gold">${v.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs font-jetbrains tracking-wider uppercase text-cream-dim/70">
                Compounded by Greenstone Rx · Florida 503A pharmacy
              </p>
              <PharmacyDeepLink slug={product.slug} />
            </div>
          </div>

          {/* ---------- EDUCATIONAL CONTENT BLOCKS ---------- */}
          <div id="details" className="mt-24 max-w-3xl mx-auto space-y-14 scroll-mt-24">
            <section>
              <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-3">
                // The science
              </p>
              <h2 className="font-cormorant text-3xl text-cream leading-tight mb-5" style={{ fontWeight: 400 }}>
                About {product.name}
              </h2>
              <p className="text-base text-cream-dim leading-relaxed">{product.longDescription}</p>
            </section>

            <ContentBlock heading="How it works" body={product.howItWorks} />
            <ContentBlock heading="Who it's for" body={product.whoItsFor} />

            {/* What to expect — supports string OR multi-stage array */}
            <section>
              <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-3">
                // What to expect
              </p>
              <h2 className="font-cormorant text-3xl text-cream leading-tight mb-5" style={{ fontWeight: 400 }}>
                Your timeline
              </h2>
              {isStageArray(product.whatToExpect) ? (
                <ol className="space-y-5 border-l border-emerald/30 pl-6">
                  {product.whatToExpect.map((stage) => (
                    <li key={stage.phase}>
                      <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald mb-1.5">
                        {stage.phase}
                      </p>
                      <p className="text-sm text-cream-dim leading-relaxed">
                        {stage.detail}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-base text-cream-dim leading-relaxed">{product.whatToExpect}</p>
              )}
            </section>

            <ContentBlock heading="Who should not take this" body={product.contraindications} />
            <ContentBlock
              heading="Typical starting dose"
              body={product.startingDoseGuidance}
            />
          </div>

          {/* ---------- FAQ ---------- */}
          {product.faq && product.faq.length > 0 && (
            <div className="mt-24 max-w-3xl mx-auto">
              <header className="mb-8">
                <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-3">
                  // Common questions
                </p>
                <h2 className="font-cormorant text-3xl text-cream" style={{ fontWeight: 400 }}>
                  Frequently asked
                </h2>
              </header>
              <FAQAccordion items={product.faq} />
            </div>
          )}

          {/* ---------- FINAL CTA ---------- */}
          <div className="mt-24 max-w-3xl mx-auto text-center">
            <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-4">
              // Ready when you are
            </p>
            <h2 className="font-cormorant text-3xl sm:text-4xl text-cream leading-tight mb-6" style={{ fontWeight: 400 }}>
              Start your prescription.
            </h2>
            <p className="text-sm text-cream-dim leading-relaxed max-w-md mx-auto mb-8">
              You'll complete a short health screening on the pharmacy storefront.
              A licensed physician reviews every order before any medication ships.
            </p>
            <PharmacyDeepLink slug={product.slug} />
          </div>

          {/* Compliance footer */}
          <p className="mt-20 text-xs leading-relaxed text-cream-dim/70 max-w-3xl mx-auto text-center">
            Compounded by a 503A licensed pharmacy pursuant to a valid prescription. Not an FDA-approved drug. Not intended to diagnose, treat, cure, or prevent any disease. Individual results vary.{' '}
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

/** Standard content block used by How it works / Who it's for / Contraindications / Dose guidance. */
function ContentBlock({ heading, body }: { heading: string; body: string }) {
  return (
    <section>
      <p className="font-jetbrains text-emerald text-[0.65rem] tracking-[0.25em] uppercase mb-3">
        // {heading}
      </p>
      <h2 className="font-cormorant text-3xl text-cream leading-tight mb-5" style={{ fontWeight: 400 }}>
        {heading}
      </h2>
      <p className="text-base text-cream-dim leading-relaxed">{body}</p>
    </section>
  );
}
