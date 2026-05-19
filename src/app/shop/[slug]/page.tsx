import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts, getProductBySlug } from '@/lib/queries';
import { productImageUrl } from '@/lib/product-image';
import { ProductCard } from '@/components/ProductCard';
import { SchemaOrg } from '@/components/SchemaOrg';
import AddToCartButton from '@/components/AddToCartButton';
import ViewItemTracker from '@/components/ViewItemTracker';

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
    alternates: { canonical: `/shop/${params.slug}` },
    openGraph: {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription || undefined,
    },
  };
}

export const revalidate = false; // fully static

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const imageUrl = productImageUrl(product.image);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.seoDescription,
    image: imageUrl || undefined,
    brand: { '@type': 'Brand', name: 'Greenstone Wellness' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.active
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://greenstonewellness.store/' },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://greenstonewellness.store/shop' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://greenstonewellness.store/shop/${params.slug}` },
    ],
  };

  return (
    <>
      <SchemaOrg schema={productSchema} />
      <SchemaOrg schema={breadcrumbSchema} />
      <ViewItemTracker
        _id={product._id}
        name={product.name}
        price={product.price}
        strength={product.strength}
        format={product.format}
      />

      <section className="section-py">
        <div className="container-gr">
          {/* Breadcrumbs */}
          <nav className="mono mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            <span className="mx-2 text-gold/40">/</span>
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

              <ul className="mt-6 space-y-2 text-sm text-cream-dim">
                <li className="flex items-start gap-2">
                  <span className="text-gold leading-tight">🧪</span>
                  <span><strong className="text-cream">Compounded to order</strong> · 5–7 business days in the pharmacy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold leading-tight">✓</span>
                  <span><strong className="text-cream">$10 flat shipping</strong> · USPS Priority Mail, 3–5 business days after compounding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold leading-tight">✓</span>
                  <span><strong className="text-cream">Temperature-controlled</strong> packaging direct from US compounders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold leading-tight">✓</span>
                  <span><strong className="text-cream">Third-party tested</strong> for potency, sterility, and purity</span>
                </li>
              </ul>

              <p className="mt-6 text-[10px] leading-relaxed text-cream-dim/50">
                Compounded by a 503A licensed pharmacy pursuant to a valid prescription. Not an FDA-approved drug. Not intended to diagnose, treat, cure, or prevent any disease. Individual results vary.{' '}
                <Link href="/safety" className="underline underline-offset-2 hover:text-cream-dim transition-colors">
                  Full disclaimer
                </Link>
                .
              </p>

            </div>
          </div>

          {/* Clinical info accordion (plain semantic <details>) */}
          <div className="mt-20 max-w-3xl space-y-4">
            {product.description && (
              <details className="card-glass" open>
                <summary className="font-cormorant text-2xl text-white cursor-pointer">
                  Description
                </summary>
                <div
                  className="mt-4 text-cream-dim space-y-3 prose-sm"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
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
