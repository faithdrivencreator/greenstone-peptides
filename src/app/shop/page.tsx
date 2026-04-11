import type { Metadata } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/queries';
import { ProductFilters } from '@/components/ProductFilters';

export const metadata: Metadata = {
  title: 'Peptide Catalog',
  description:
    'Browse physician-prescribed, USA-compounded peptides. Filter by category, format, and price.',
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
            Every product is physician-prescribed and compounded in USA-licensed pharmacies.
          </p>
        </header>

        <ProductFilters products={products} categories={categories} />
      </div>
    </section>
  );
}
