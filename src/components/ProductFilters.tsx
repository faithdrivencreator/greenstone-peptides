'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Search } from 'lucide-react';
import type { Product, Category, ProductFormat } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductFiltersProps {
  products: Product[];
  categories: Category[];
}

type SortKey = 'featured' | 'name-asc' | 'price-asc' | 'price-desc';

const FORMAT_OPTIONS: { value: ProductFormat; label: string }[] = [
  { value: 'injectable', label: 'Injectable' },
  { value: 'odt', label: 'ODT' },
  { value: 'nasal-spray', label: 'Nasal Spray' },
  { value: 'cream', label: 'Cream' },
  { value: 'kit', label: 'Kit' },
];

export function ProductFilters({ products, categories }: ProductFiltersProps) {
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<ProductFormat[]>([]);
  const maxPrice = useMemo(
    () => Math.max(500, ...products.map((p) => p.price)),
    [products]
  );
  const [priceMax, setPriceMax] = useState(maxPrice);
  const [sort, setSort] = useState<SortKey>('featured');

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCats.length && (!p.category || !selectedCats.includes(p.category._id)))
        return false;
      if (selectedFormats.length && (!p.format || !selectedFormats.includes(p.format)))
        return false;
      if (p.price > priceMax) return false;
      return true;
    });

    switch (sort) {
      case 'name-asc':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name)
        );
    }

    return list;
  }, [products, search, selectedCats, selectedFormats, priceMax, sort]);

  const toggleCat = (id: string) =>
    setSelectedCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));
  const toggleFormat = (f: ProductFormat) =>
    setSelectedFormats((s) => (s.includes(f) ? s.filter((x) => x !== f) : [...s, f]));

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-10">
      {/* Sidebar */}
      <aside className="space-y-8">
        {/* Search */}
        <div>
          <label className="relative block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cream-dim"
              aria-hidden
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-obsidian-light border border-gold/15 pl-9 pr-4 py-3 text-sm text-cream rounded focus:border-gold outline-none"
            />
          </label>
        </div>

        {/* Sort */}
        <div>
          <h4 className="mono mb-3">Sort By</h4>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-full bg-obsidian-light border border-gold/15 px-3 py-2 text-sm text-cream rounded"
          >
            <option value="featured">Featured</option>
            <option value="name-asc">Name A-Z</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div>
            <h4 className="mono mb-3">Category</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <label className="flex items-center gap-2 text-sm text-cream-dim cursor-pointer hover:text-cream">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat._id)}
                      onChange={() => toggleCat(cat._id)}
                      className="accent-gold"
                    />
                    {cat.title}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Format */}
        <div>
          <h4 className="mono mb-3">Format</h4>
          <ul className="space-y-2">
            {FORMAT_OPTIONS.map((f) => (
              <li key={f.value}>
                <label className="flex items-center gap-2 text-sm text-cream-dim cursor-pointer hover:text-cream">
                  <input
                    type="checkbox"
                    checked={selectedFormats.includes(f.value)}
                    onChange={() => toggleFormat(f.value)}
                    className="accent-gold"
                  />
                  {f.label}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Price slider */}
        <div>
          <h4 className="mono mb-3">
            Max Price: <span className="text-gold">${priceMax}</span>
          </h4>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceMax}
            onChange={(e) => setPriceMax(+e.target.value)}
            className="w-full accent-gold"
          />
        </div>
      </aside>

      {/* Results */}
      <div>
        <p className={clsx('mono mb-6')}>
          {filtered.length} product{filtered.length === 1 ? '' : 's'} found
        </p>
        {filtered.length === 0 ? (
          <p className="text-cream-dim">No products match your filters.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
