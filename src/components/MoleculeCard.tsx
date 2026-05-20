/**
 * Compact molecule card for use on /treatments/<slug> landing pages. Smaller
 * footprint than the full ParentCard on /shop — image is wider and shorter
 * (16:9) so a row of 3 cards fits cleanly under a category explainer block.
 *
 * Mirrors Bloom's molecule cards: category eyebrow, "from $X", name, tagline,
 * options count, "Learn more →" link.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { fromPrice, type ParentProduct } from '@/data/parent-products';

type Props = {
  product: ParentProduct;
  /** Category label shown as the small eyebrow. */
  categoryLabel: string;
};

export function MoleculeCard({ product, categoryLabel }: Props) {
  const from = fromPrice(product);
  const variantCount = product.variants.length;

  return (
    <Link
      href={`/shop/${product.slug}`}
      data-track={`molecule-card-${product.slug}`}
      className="group/mol flex flex-col bg-obsidian-mid/60 border border-emerald/15 hover:border-emerald/40 hover:bg-obsidian-mid/80 transition-all overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald focus-visible:outline-offset-2"
    >
      <div className="relative aspect-[4/3] bg-obsidian-mid overflow-hidden border-b border-emerald/15">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover/mol:scale-[1.04]"
        />
        {/* Price corner badge — visible without scrolling, sales-first */}
        <div className="absolute top-3 right-3 bg-obsidian/85 backdrop-blur-sm border border-gold/35 px-3 py-1.5">
          <p className="font-jetbrains text-[0.55rem] tracking-[0.18em] uppercase text-cream-dim/70 leading-tight">
            From
          </p>
          <p className="font-cormorant text-xl text-gold leading-none mt-0.5" style={{ fontWeight: 400 }}>
            ${from}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="font-jetbrains text-[0.55rem] tracking-[0.22em] uppercase text-emerald/85 mb-1.5">
          {categoryLabel}
        </p>
        <h3 className="font-cormorant text-xl text-white leading-tight mb-1.5">{product.name}</h3>
        <p className="text-[0.82rem] text-cream-dim leading-snug line-clamp-2 flex-1">
          {product.shortDescription}
        </p>

        <div className="mt-4 pt-3 border-t border-emerald/10 flex items-center justify-between gap-3">
          <span className="font-jetbrains text-[0.55rem] tracking-[0.18em] uppercase text-cream-dim/65">
            {variantCount} {variantCount === 1 ? 'option' : 'options'}
          </span>
          <span className="inline-flex items-center gap-1.5 font-jetbrains text-[0.6rem] tracking-[0.18em] uppercase text-emerald group-hover/mol:text-emerald-light transition-colors">
            View <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  );
}
