'use client';

import { useEffect, useState } from 'react';
import { GuideWizard } from '@/components/PeptideGuide/GuideWizard';
import type { Product } from '@/types';

const PRODUCTS_API = `/api/guide-products`;

export function GuideWizardLoader() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(PRODUCTS_API)
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold/30 border-t-gold mx-auto mb-4" style={{ borderRadius: '4px', animation: 'spin 1s linear infinite' }} />
          <p className="font-jetbrains text-cream-dim/60 text-[0.7rem] tracking-widest uppercase">Loading your protocol builder...</p>
        </div>
      </div>
    );
  }

  return <GuideWizard allProducts={products} />;
}
