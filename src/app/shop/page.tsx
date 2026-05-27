import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  PARENT_PRODUCTS,
  CATEGORY_ORDER,
  fromPrice,
  type ParentProduct,
} from '@/data/parent-products';

export const metadata: Metadata = {
  title: 'Formulary · GS Wellness Pharmacy',
  description:
    'A curated formulary of compounded GLP-1, peptide, and oral therapies — selected by our clinic and prepared by Greenstone Rx, a 503A pharmacy in Florida.',
  alternates: { canonical: '/shop' },
};

export default function ShopPage() {
  const byCategory = CATEGORY_ORDER.map((cat) => ({
    ...cat,
    items: PARENT_PRODUCTS.filter((p) => p.category === cat.slug),
  })).filter((g) => g.items.length > 0);

  const totalVariants = PARENT_PRODUCTS.reduce(
    (sum, p) => sum + p.variants.length,
    0,
  );

  return (
    <section className="section-py">
      <div className="container-gr">
        <header className="mb-16 max-w-3xl mx-auto text-center">
          <p className="eyebrow text-emerald">// Formulary</p>
          <h1 className="font-cormorant">A curated formulary.</h1>
          <p className="mt-5 text-cream-dim leading-relaxed">
            {PARENT_PRODUCTS.length} medications across {byCategory.length} treatment areas, with {totalVariants} dose and size options. Each prescription is compounded by Greenstone Rx, a Florida 503A pharmacy, after a licensed physician reviews your health screening.
          </p>
        </header>

        {byCategory.map((group) => (
          <div key={group.slug} className="mb-20 last:mb-0">
            <header className="flex items-baseline justify-between mb-8 pb-3 border-b border-emerald/15">
              <h2 className="font-cormorant text-3xl text-white">{group.label}</h2>
              <p className="font-jetbrains text-[0.65rem] tracking-[0.22em] uppercase text-emerald/80">
                {group.items.length} {group.items.length === 1 ? 'option' : 'options'}
              </p>
            </header>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((p) => (
                <ParentCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        ))}

        <p className="text-center text-xs mt-12 font-jetbrains tracking-[0.2em] uppercase text-cream-dim/70">
          Prescription required · Reviewed by a licensed U.S. physician
        </p>
      </div>
    </section>
  );
}

function ParentCard({ product }: { product: ParentProduct }) {
  const from = fromPrice(product);
  const variantCount = product.variants.length;
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="card-glass border-emerald/15 hover:border-emerald/40 transition-colors flex flex-col group/card overflow-hidden"
    >
      <div className="relative aspect-[4/3] -mx-6 -mt-6 mb-6 bg-obsidian-mid overflow-hidden border-b border-emerald/15">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.04]"
        />
      </div>

      <h3 className="font-cormorant text-2xl text-white leading-tight">{product.name}</h3>
      <p className="mt-3 text-sm text-cream-dim leading-relaxed flex-1">
        {product.shortDescription}
      </p>

      <div className="mt-6 flex items-end justify-between gap-3 pt-4 border-t border-emerald/10">
        <div>
          <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-emerald/80 mb-0.5">From</p>
          <p className="font-cormorant text-2xl text-gold leading-none">${from}</p>
        </div>
        <div className="text-right">
          <p className="font-jetbrains text-[0.6rem] tracking-[0.2em] uppercase text-cream-dim/60 mb-0.5">
            {variantCount} {variantCount === 1 ? 'option' : 'options'}
          </p>
          <span className="inline-flex items-center gap-1 font-jetbrains text-[0.65rem] tracking-[0.18em] uppercase text-emerald group-hover/card:text-emerald-light transition-colors">
            View <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}
