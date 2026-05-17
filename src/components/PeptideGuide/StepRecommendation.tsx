'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FlaskConical, Plus, ArrowRight, Package, Sparkles } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { GuideEyebrow, GuideHeading } from './GuidePrimitives';

interface StepRecommendationProps {
  products: Product[];
  onBack: () => void;
}

export function StepRecommendation({ products, onBack }: StepRecommendationProps) {
  const { addItem, openCart } = useCart();

  function handleAdd(p: Product) {
    addItem(p);
  }

  function handleAddAll() {
    products.forEach((p) => addItem(p));
    openCart();
  }

  /* ---------- empty state ---------- */
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
        <GuideEyebrow tone="gold" icon={FlaskConical} className="mb-3">
          Your Protocol
        </GuideEyebrow>
        <GuideHeading
          title="No exact match yet"
          subtitle="We don't have a product that fits this exact goal-and-budget combination right now. Browse the full shop or revise your answers and we'll try again."
          className="mb-8"
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/shop" className="btn btn-solid !px-8 !py-3">
            Browse all products
          </Link>
          <button onClick={onBack} className="btn btn-primary !px-8 !py-3">
            Revise my answers
          </button>
        </div>
      </div>
    );
  }

  const [hero, ...supporting] = products;
  const hasSupporting = supporting.length > 0;

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <GuideEyebrow tone="gold" icon={Sparkles} className="mb-3">
        Your Personalized Protocol
      </GuideEyebrow>
      <GuideHeading
        title={
          <>
            Here&apos;s your <em className="italic text-gold">match</em>
          </>
        }
        subtitle="Compounded to order — about two weeks from approval to your door (5–7 business days in the pharmacy + 3–5 days shipping)."
        className="mb-10"
      />

      {/* HERO product — the answer */}
      <HeroProductCard product={hero} onAdd={handleAdd} />

      {/* Supporting stack */}
      {hasSupporting && (
        <div className="w-full mt-10 mb-2 flex flex-col items-center">
          <GuideEyebrow className="mb-4">Stacks With</GuideEyebrow>
          <div className={`grid grid-cols-1 ${supporting.length === 1 ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-5 w-full max-w-2xl`}>
            {supporting.map((p, i) => (
              <SupportingProductCard key={p._id} product={p} onAdd={handleAdd} delay={0.1 + i * 0.08} />
            ))}
          </div>
        </div>
      )}

      <p className="text-cream-dim/60 text-sm mt-10 mb-5 text-center max-w-md">
        Questions about your protocol?{' '}
        <Link href="/contact" className="text-gold hover:text-gold-light transition-colors">
          We&apos;re here to help.
        </Link>
      </p>

      <motion.button
        type="button"
        onClick={handleAddAll}
        whileHover={{ scale: 1.02, boxShadow: '0 0 28px rgba(111,168,220,0.32)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="btn btn-solid group flex items-center gap-3 !px-10 !py-4 !text-lg hover:gap-4 transition-[gap] duration-200"
      >
        Request My Protocol
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </motion.button>

      <button
        onClick={onBack}
        className="mt-5 text-cream-dim/50 hover:text-gold text-sm transition-colors"
      >
        ← Revise my answers
      </button>
    </div>
  );
}

/* ---------- HERO card (oversized, image-first, the climax) ---------- */

function HeroProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  const imageUrl = product.image?.asset?.url;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      className="card-glass w-full max-w-3xl !p-0 overflow-hidden grid grid-cols-1 md:grid-cols-2"
      style={{ borderColor: 'rgba(111,168,220,0.35)' }}
    >
      {/* Image */}
      <div className="relative w-full aspect-square md:aspect-auto md:min-h-[340px] bg-gradient-to-br from-emerald/15 to-obsidian flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
            priority
          />
        ) : (
          <Package className="w-16 h-16 text-emerald/40" />
        )}
        <div className="absolute top-4 left-4">
          <GuideEyebrow tone="gold">Recommended</GuideEyebrow>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 sm:p-8 text-center items-center md:text-left md:items-start">
        {product.format && (
          <div className="font-jetbrains text-emerald text-[0.55rem] tracking-[0.25em] uppercase mb-2">
            {product.format}
          </div>
        )}
        <h3
          className="font-cormorant text-white text-3xl sm:text-4xl leading-tight mb-2"
          style={{ fontWeight: 400 }}
        >
          {product.name}
        </h3>
        {product.strength && (
          <p className="font-jetbrains text-cream-dim/60 text-[0.7rem] tracking-wider mb-4">
            {product.strength}
            {product.size ? ` · ${product.size}` : ''}
          </p>
        )}
        {product.shortDescription && (
          <p className="text-cream-dim text-sm leading-relaxed mb-6">
            {product.shortDescription}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-auto w-full">
          <span className="font-cormorant text-gold text-3xl" style={{ fontWeight: 500 }}>
            ${product.price?.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="btn btn-primary flex items-center gap-2 !px-5 !py-2.5 !text-sm"
          >
            <Plus className="w-4 h-4" />
            Add to request
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- supporting card (smaller, secondary) ---------- */

function SupportingProductCard({
  product,
  onAdd,
  delay,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  delay: number;
}) {
  const imageUrl = product.image?.asset?.url;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 24 }}
      className="card-glass flex flex-row items-center !p-0 overflow-hidden hover:!border-gold/40 transition-colors"
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 bg-gradient-to-br from-emerald/15 to-obsidian">
        {imageUrl ? (
          <Image src={imageUrl} alt={product.name} fill sizes="128px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-emerald/40" />
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h4 className="font-cormorant text-white text-lg leading-tight mb-0.5" style={{ fontWeight: 500 }}>
          {product.name}
        </h4>
        {product.strength && (
          <p className="font-jetbrains text-cream-dim/60 text-[0.6rem] tracking-wider mb-2">
            {product.strength}
            {product.size ? ` · ${product.size}` : ''}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="font-cormorant text-gold text-lg">
            ${product.price?.toFixed(2)}
          </span>
          <button
            type="button"
            onClick={() => onAdd(product)}
            className="btn btn-primary !py-1.5 !px-3 !text-xs"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}
