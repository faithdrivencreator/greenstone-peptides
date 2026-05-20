import type { MetadataRoute } from 'next';
import { PARENT_PRODUCTS } from '@/data/parent-products';
import { staticBlogPosts } from '@/data/blog-posts';
import { TREATMENT_AREAS } from '@/data/treatment-areas';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';

export const revalidate = false; // static

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/shop', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/learn', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/guide', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/safety', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/research-use-only', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/shipping', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/provider', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wholesale', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/free/peptides-made-easy', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/free/peptides-unlocked', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const productEntries: MetadataRoute.Sitemap = PARENT_PRODUCTS.map((p) => ({
    url: `${SITE_URL}/shop/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = staticBlogPosts.map(p => ({
    url: `${SITE_URL}/learn/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const treatmentEntries: MetadataRoute.Sitemap = TREATMENT_AREAS.map((t) => ({
    url: `${SITE_URL}/treatments/${t.category}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries, ...treatmentEntries];
}
