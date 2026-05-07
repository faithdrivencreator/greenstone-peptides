import type { MetadataRoute } from 'next';
import { groq } from 'next-sanity';
import { sanityClient } from '@/lib/sanity';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://greenstonewellness.store';

export const revalidate = 3600;

async function getProductSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(
    groq`*[_type == "product" && active == true && defined(slug.current)]{ "slug": slug.current }`
  );
  return slugs.map((s) => s.slug);
}

async function getBlogSlugs(): Promise<string[]> {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(
    groq`*[_type == "blogPost" && defined(publishedAt) && defined(slug.current)]{ "slug": slug.current }`
  );
  return slugs.map((s) => s.slug);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/shop', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/learn', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/guide', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/safety', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/provider', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/wholesale', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/free/peptides-made-easy', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/free/peptides-unlocked', priority: 0.8, changeFrequency: 'monthly' as const },
  ];

  const [productSlugs, blogSlugs] = await Promise.all([
    getProductSlugs(),
    getBlogSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_URL}/shop/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}
