'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { ArrowUpRight, Check } from 'lucide-react';
import type { Product } from '@/types';
import { urlFor } from '@/lib/sanity';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

const FORMAT_LABEL: Record<string, string> = {
  injectable: 'Injectable',
  odt: 'ODT',
  'nasal-spray': 'Nasal Spray',
  cream: 'Cream',
  kit: 'Kit',
};

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image ? urlFor(product.image).width(640).height(480).url() : null;
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="card-glass group flex flex-col !p-0 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-obsidian-light">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.image?.alt || product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[600ms] ease-smooth group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gold/40 font-cormorant text-5xl">
            Rx
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {product.format && (
              <span
                className={clsx('badge', product.format === 'injectable' ? 'badge-injectable' : 'badge-odt')}
              >
                {FORMAT_LABEL[product.format] || product.format}
              </span>
            )}
          </div>
          {product.usaCompounded && (
            <span className="badge badge-usa flex-shrink-0">USA Compounded</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-cormorant text-2xl text-white leading-tight">{product.name}</h3>
          {product.category?.title && (
            <p className="mono mt-2 !text-cream-dim/80">{product.category.title}</p>
          )}
        </div>

        {product.shortDescription && (
          <p className="text-sm text-cream-dim line-clamp-3">{product.shortDescription}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-cream-dim/80 pt-1">
          {product.strength && <span>{product.strength}</span>}
          {product.strength && product.size && <span className="text-gold/40">/</span>}
          {product.size && <span>{product.size}</span>}
        </div>

        <div className="mt-auto flex items-end justify-between pt-4 border-t border-gold/10">
          <div>
            <p className="mono !text-cream-dim">Starting at</p>
            <p className="font-cormorant text-3xl text-gold">${product.price.toFixed(0)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link
              href={`/shop/${product.slug.current}`}
              className="text-xs uppercase tracking-wider text-cream-dim hover:text-gold transition-colors flex items-center gap-1"
            >
              Details <ArrowUpRight size={12} />
            </Link>
            <button
              onClick={handleAdd}
              className={`btn !py-2 !px-4 !text-xs transition-all ${
                added
                  ? 'btn-ghost !border-emerald/50 !text-emerald'
                  : 'btn-primary'
              }`}
            >
              {added ? (
                <span className="flex items-center gap-1.5"><Check size={11} /> Added</span>
              ) : (
                'Add to Cart'
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
