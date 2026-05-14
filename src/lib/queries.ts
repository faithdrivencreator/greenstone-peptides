/**
 * Greenstone Peptides, Data queries (static file edition)
 * All data served from src/data/*.ts, no Sanity dependency.
 */
import type { Product, Category, BlogPost } from '@/types';
import { staticProducts } from '@/data/products';
import { staticCategories } from '@/data/categories';
import { staticBlogPosts } from '@/data/blog-posts';

// ── Adapters: static shape → component-compatible shape ──────────────────────

function adaptCategory(c: (typeof staticCategories)[number]): Category {
  return {
    _id: c.id,
    _type: 'category',
    title: c.title,
    slug: { _type: 'slug', current: c.slug },
    description: c.description ?? undefined,
    icon: c.icon ?? undefined,
    order: c.order,
    seoTitle: c.seoTitle ?? undefined,
    seoDescription: c.seoDescription ?? undefined,
  };
}

function adaptProduct(
  p: (typeof staticProducts)[number],
  allCats: Category[],
  allProds?: (typeof staticProducts)[number][],
): Product {
  const category = allCats.find(c => c._id === p.categoryId);
  return {
    _id: p.id,
    _type: 'product',
    name: p.name,
    slug: { _type: 'slug', current: p.slug },
    category,
    shortDescription: p.shortDescription ?? undefined,
    description: p.description as unknown as string, // HTML string
    format: p.format as Product['format'],
    strength: p.strength ?? undefined,
    size: p.size ?? undefined,
    price: p.price,
    stripePaymentLink: p.stripePaymentLink ?? undefined,
    prescriptionRequired: p.prescriptionRequired,
    usaCompounded: p.usaCompounded,
    storageInstructions: p.storageInstructions ?? undefined,
    safetyNotes: p.safetyNotes ?? undefined,
    seoTitle: p.seoTitle ?? undefined,
    seoDescription: p.seoDescription ?? undefined,
    image: p.imageUrl
      ? { _type: 'image', asset: { _ref: '', _type: 'reference', url: p.imageUrl }, alt: p.imageAlt }
      : undefined,
    featured: p.featured,
    active: p.active,
    relatedProducts: allProds
      ? ([] as Product[]) // resolved separately in getProductBySlug
      : undefined,
  };
}

function adaptPost(
  p: (typeof staticBlogPosts)[number],
  allProds?: Product[],
): BlogPost {
  const relatedProducts = allProds
    ? p.relatedProductIds
        .map(id => allProds.find(prod => prod._id === id))
        .filter((x): x is Product => Boolean(x))
    : undefined;

  return {
    _id: p.id,
    _type: 'blogPost',
    title: p.title,
    slug: { _type: 'slug', current: p.slug },
    publishedAt: p.publishedAt,
    excerpt: p.excerpt ?? undefined,
    body: p.content as unknown as string, // HTML string
    mainImage: p.heroImage
      ? { _type: 'image', asset: { _ref: '', _type: 'reference', url: p.heroImage }, alt: p.heroAlt }
      : undefined,
    readingTime: p.readingTime ?? undefined,
    featured: p.featured,
    seoTitle: p.seoTitle ?? undefined,
    seoDescription: p.seoDescription ?? undefined,
    tags: [...p.tags] as string[],
    relatedProducts,
  };
}

// ── Category queries ──────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  return staticCategories
    .slice()
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map(adaptCategory);
}

// ── Product queries ───────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  const cats = await getAllCategories();
  return staticProducts
    .filter(p => p.active)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.name.localeCompare(b.name);
    })
    .map(p => adaptProduct(p, cats));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const raw = staticProducts.find(p => p.slug === slug);
  if (!raw) return null;
  const cats = await getAllCategories();
  const allProds = staticProducts.map(p => adaptProduct(p, cats));
  const product = adaptProduct(raw, cats);
  // Products don't carry related IDs in static data; return empty
  product.relatedProducts = [];
  return product;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const cats = await getAllCategories();
  return staticProducts
    .filter(p => p.active && p.categorySlug === categorySlug)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(p => adaptProduct(p, cats));
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const cats = await getAllCategories();
  return staticProducts
    .filter(p => p.active && p.featured)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(p => adaptProduct(p, cats));
}

// ── Blog post queries ─────────────────────────────────────────────────────────

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return staticBlogPosts
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map(p => adaptPost(p));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const raw = staticBlogPosts.find(p => p.slug === slug);
  if (!raw) return null;
  const cats = await getAllCategories();
  const allProds = staticProducts.map(p => adaptProduct(p, cats));
  return adaptPost(raw, allProds);
}

export async function getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
  return staticBlogPosts
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
    .map(p => adaptPost(p));
}

export async function getBlogPostsByCategory(): Promise<BlogPost[]> {
  // Category filtering removed; all posts returned sorted by date
  return getAllBlogPosts();
}

// Site settings no longer in Sanity, return null
export async function getSiteSettings() {
  return null;
}
