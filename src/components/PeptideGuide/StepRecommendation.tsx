'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FlaskConical, ShoppingCart, ArrowRight, Package } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface StepRecommendationProps {
  products: Product[];
  onBack: () => void;
}

export function StepRecommendation({ products, onBack }: StepRecommendationProps) {
  const { addItem, openCart } = useCart();

  function handleAddToCart(product: Product) {
    addItem(product);
    openCart();
  }

  return (
    <div className="flex flex-col items-center max-w-3xl mx-auto">
      <div className="w-16 h-16 bg-emerald/10 border border-emerald/30 flex items-center justify-center mb-5" style={{ borderRadius: '8px' }}>
        <FlaskConical className="w-8 h-8 text-emerald" />
      </div>
      <h2 className="font-cormorant text-3xl sm:text-4xl text-white mb-3 text-center" style={{ fontWeight: 400 }}>
        Your Personalized Protocol
      </h2>
      <p className="text-cream-dim mb-10 text-center max-w-lg">
        Based on your goal and budget, here&apos;s exactly what we recommend to start with.
        Add it to cart and your protocol ships in 2–3 business days.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-10">
        {products.map((product) => {
          const imageUrl = product.image?.asset?.url;
          return (
            <div
              key={product._id}
              className="card-glass flex flex-col !p-0 overflow-hidden hover:!border-gold/40 transition-all duration-300"
            >
              {/* Product image area */}
              <div className="relative w-full aspect-square bg-gradient-to-br from-emerald/10 to-obsidian flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <Package className="w-12 h-12 text-emerald" />
                  </div>
                )}
                {/* Format badge overlay */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-obsidian/80 backdrop-blur-sm border border-emerald/40 text-emerald font-jetbrains text-[0.6rem] tracking-[0.15em] uppercase" style={{ borderRadius: '2px' }}>
                    {product.format}
                  </span>
                </div>
              </div>

              {/* Product info */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-cormorant text-xl text-white leading-tight mb-1">{product.name}</h3>
                {product.strength && (
                  <p className="font-jetbrains text-cream-dim/60 text-[0.65rem] tracking-wider mb-3">
                    {product.strength}{product.size ? ` · ${product.size}` : ''}
                  </p>
                )}
                {product.shortDescription && (
                  <p className="text-cream-dim text-xs leading-relaxed mb-4 flex-1">
                    {product.shortDescription}
                  </p>
                )}
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-cormorant text-gold text-xl">
                    ${product.price?.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary !py-2 !px-4 !text-xs"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-cream-dim/50 text-sm mb-6 text-center">
        Questions about your protocol?{' '}
        <Link href="/contact" className="text-gold hover:text-gold-light transition-colors">
          Our clinical team is here to help.
        </Link>
      </p>

      <Link
        href="/cart"
        className="btn btn-solid group flex items-center gap-3 !px-10 !py-4 !text-lg hover:gap-4 transition-[gap] duration-200"
      >
        Start My Protocol
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </Link>

      <button onClick={onBack} className="mt-6 text-cream-dim/50 hover:text-gold text-sm transition-colors">
        ← Revise my answers
      </button>
    </div>
  );
}
