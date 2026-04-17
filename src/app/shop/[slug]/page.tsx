import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { getAllProducts, getProductBySlug } from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import { ProductCard } from '@/components/ProductCard';
import { SchemaOrg } from '@/components/SchemaOrg';
import AddToCartButton from '@/components/AddToCartButton';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription || undefined,
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription || undefined,
    },
  };
}

export const revalidate = 300;

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const imageUrl = product.image
    ? urlFor(product.image).width(1200).height(900).url()
    : null;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.seoDescription,
    image: imageUrl || undefined,
    brand: { '@type': 'Brand', name: 'Greenstone Peptides' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.active
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <SchemaOrg schema={productSchema} />

      <section className="section-py">
        <div className="container-gr">
          {/* Breadcrumbs */}
          <nav className="mono mb-8" aria-label="Breadcrumb">
            <Link href="/shop" className="hover:text-gold">
              Shop
            </Link>
            <span className="mx-2 text-gold/40">/</span>
            <span className="text-cream">{product.name}</span>
          </nav>

          {/* Product hero */}
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-obsidian-light border border-gold/15">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.image?.alt || product.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-gold/30 font-cormorant text-6xl">
                  Rx
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.usaCompounded && <span className="badge badge-usa">USA Compounded</span>}
                {product.format && <span className="badge badge-injectable">{product.format}</span>}
              </div>

              <h1 className="font-cormorant">{product.name}</h1>
              {product.shortDescription && (
                <p className="mt-4 text-lg text-cream-dim">{product.shortDescription}</p>
              )}

              <dl className="mt-8 grid grid-cols-2 gap-4 p-6 border border-gold/10 rounded-lg">
                {product.strength && (
                  <div>
                    <dt className="mono">Strength</dt>
                    <dd className="text-cream mt-1">{product.strength}</dd>
                  </div>
                )}
                {product.size && (
                  <div>
                    <dt className="mono">Size</dt>
                    <dd className="text-cream mt-1">{product.size}</dd>
                  </div>
                )}
                {product.format && (
                  <div>
                    <dt className="mono">Format</dt>
                    <dd className="text-cream mt-1 capitalize">{product.format}</dd>
                  </div>
                )}
                <div>
                  <dt className="mono">Price</dt>
                  <dd className="font-cormorant text-gold text-3xl mt-1">
                    ${product.price.toFixed(0)}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-4">
                <AddToCartButton product={product} />
                <Link href="/contact" className="btn btn-ghost">
                  Questions? Contact Us →
                </Link>
              </div>
            </div>
          </div>

          {/* Clinical info accordion (plain semantic <details>) */}
          <div className="mt-20 max-w-3xl space-y-4">
            {product.description && (
              <details className="card-glass" open>
                <summary className="font-cormorant text-2xl text-white cursor-pointer">
                  Description
                </summary>
                <div className="mt-4 text-cream-dim space-y-3 prose-sm">
                  <PortableText value={product.description} />
                </div>
              </details>
            )}
            {product.storageInstructions && (
              <details className="card-glass">
                <summary className="font-cormorant text-2xl text-white cursor-pointer">
                  Storage
                </summary>
                <p className="mt-4 text-cream-dim">{product.storageInstructions}</p>
              </details>
            )}
            {product.safetyNotes && (
              <details className="card-glass">
                <summary className="font-cormorant text-2xl text-white cursor-pointer">
                  Safety Notes
                </summary>
                <p className="mt-4 text-cream-dim whitespace-pre-line">{product.safetyNotes}</p>
              </details>
            )}
          </div>

          {/* Related */}
          {product.relatedProducts && product.relatedProducts.length > 0 && (
            <div className="mt-24">
              <header className="text-center mb-12">
                <p className="eyebrow">Related</p>
                <h2>You may also consider</h2>
              </header>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {product.relatedProducts.map((rp) => (
                  <ProductCard key={rp._id} product={rp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
