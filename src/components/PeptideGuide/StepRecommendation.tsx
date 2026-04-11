'use client';

import Link from 'next/link';
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
      <div className="text-5xl mb-4">🧬</div>
      <h2 className="text-3xl font-bold text-white mb-2 text-center">
        Your Personalized Protocol
      </h2>
      <p className="text-white/60 mb-10 text-center">
        Based on your goals, here&apos;s what we recommend to start with.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-10">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#1A9E6E]/40 transition-all"
          >
            <div className="flex-1">
              <div className="inline-block px-2 py-0.5 rounded-full bg-[#1A9E6E]/20 text-[#1A9E6E] text-xs font-medium uppercase tracking-wider mb-3">
                {product.format}
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">{product.name}</h3>
              {product.strength && (
                <p className="text-white/40 text-sm">
                  {product.strength}
                  {product.size ? ` · ${product.size}` : ''}
                </p>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[#C9A96E] font-bold text-xl">
                ${product.price?.toFixed(2)}
              </span>
              <button
                onClick={() => handleAddToCart(product)}
                className="px-4 py-2 bg-[#1A9E6E] text-white text-sm font-semibold rounded-full hover:bg-[#1A9E6E]/90 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-white/40 text-sm mb-6 text-center">
        Not sure?{' '}
        <Link href="/contact" className="text-[#1A9E6E] hover:underline">
          Our clinical team is here to help.
        </Link>
      </p>

      <Link
        href="/cart"
        className="px-10 py-4 bg-[#C9A96E] text-[#0a0f1a] font-bold text-lg rounded-full hover:bg-[#C9A96E]/90 transition-colors"
      >
        Start My Protocol →
      </Link>

      <button
        onClick={onBack}
        className="mt-6 text-white/40 hover:text-white/70 text-sm transition-colors"
      >
        ← Revise my answers
      </button>
    </div>
  );
}
