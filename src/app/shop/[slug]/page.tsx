import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { SchemaOrg } from '@/components/SchemaOrg';
import { PARENT_PRODUCTS, getParentBySlug, fromPrice } from '@/data/parent-products';
import { PharmacyDeepLink } from './PharmacyDeepLink';

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
            <Link href="/shop" className="hover:text-emerald transition-colors">Formulary</Link>
            <span className="mx-2 text-emerald/30">/</span>
            <span className="text-cream">{product.name}</span>
          </nav>

          {/* Hero */}
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
                // {product.category.replace('-', ' ')}
              </p>
              <h1 className="font-cormorant text-display-lg text-white leading-tight">{product.name}</h1>
              <p className="mt-5 text-base text-cream-dim leading-relaxed">{product.shortDescription}</p>

              <p className="mt-6 text-sm text-cream/85 leading-relaxed">{product.longDescription}</p>

              <ul className="mt-8 space-y-3">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm text-cream-dim leading-relaxed">
                    <span className="text-emerald mt-0.5 flex-shrink-0">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Dual CTA — deep links to Greenstone Rx (Bloom).
                    · "Continue to Pharmacy" → lightweight storefront root for
                      patients ready to buy.
                    · "Use Dose Finder" → educational page with BMI calc and
                      dose-finder sidebar for patients still choosing a dose.
                  Both routed through the same /login?next= auth gate. */}
              <div className="mt-10">
                <PharmacyDeepLink
                  bloomLearn={product.bloomLearn}
                  slug={product.slug}
                />
                <p className="mt-4 text-xs text-cream-dim/60 leading-relaxed max-w-md">
                  Already know what you need? <strong className="text-cream">Continue to Pharmacy.</strong>{' '}
                  Still picking a dose? Use the <strong className="text-cream">Dose Finder</strong> for personalized recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* Variant pricing table */}
          <div className="mt-20 max-w-4xl mx-auto">
            <header className="mb-6">
              <p className="font-jetbrains text-[0.65rem] tracking-[0.2em] uppercase text-emerald mb-2">
                // Available options
              </p>
              <h2 className="font-cormorant text-3xl text-white">
                {product.variants.length === 1 ? '1 formulation' : `${product.variants.length} formulations`}
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

            <p className="mt-6 text-[0.65rem] font-jetbrains tracking-wider uppercase text-cream-dim/45 text-center">
              Compounded by Greenstone Rx · Florida 503A pharmacy · USP 797 sterile
            </p>
          </div>

          {/* Compliance footer */}
          <p className="mt-16 text-[10px] leading-relaxed text-cream-dim/50 max-w-3xl mx-auto text-center">
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
