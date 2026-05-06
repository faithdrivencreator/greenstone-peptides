import type { Metadata } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/queries';
import { ProductFilters } from '@/components/ProductFilters';

export const metadata: Metadata = {
  title: 'Peptide Catalog',
  description:
    'Browse USA-compounded peptide formulations. Semaglutide, tirzepatide, BPC-157, NAD+, and more. Third-party tested under USP 797 sterile standards.',
  alternates: { canonical: '/shop' },
};

export const revalidate = 300;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  return (
    <section className="section-py">
      <div className="container-gr">
        <header className="mb-16 text-center">
          <p className="eyebrow">Catalog</p>
          <h1>Peptide Catalog</h1>
          <p className="mt-4 mx-auto">
            Every formulation is compounded in the USA under USP 797 sterile standards and third-party tested for potency and purity.
          </p>
        </header>

        <ProductFilters products={products} categories={categories} />
      </div>
    </section>
  );
}
