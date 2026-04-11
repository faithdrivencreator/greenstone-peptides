import { groq } from 'next-sanity';
import { sanityClient } from './sanity';
import type { Product, Category, BlogPost, SiteSettings } from '@/types';

// ------------------------------------------------------------------
// Reusable projections
// ------------------------------------------------------------------
const productProjection = groq`
  _id,
  _type,
  name,
  slug,
  shortDescription,
  description,
  format,
  strength,
  size,
  price,
  stripePaymentLink,
  prescriptionRequired,
  usaCompounded,
  storageInstructions,
  safetyNotes,
  seoTitle,
  seoDescription,
  image,
  featured,
  active,
  "category": category->{_id, title, slug, icon}
`;

const blogPostProjection = groq`
  _id,
  _type,
  title,
  slug,
  publishedAt,
  excerpt,
  body,
  mainImage,
  readingTime,
  featured,
  seoTitle,
  seoDescription,
  tags,
  "author": author->{_id, name, slug, image, credentials, title},
  "categories": categories[]->{_id, title, slug}
`;

// ------------------------------------------------------------------
// Product queries
// ------------------------------------------------------------------
export async function getAllProducts(): Promise<Product[]> {
  return sanityClient.fetch(
    groq`*[_type == "product" && active == true] | order(featured desc, name asc) {
      ${productProjection}
    }`
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return sanityClient.fetch(
    groq`*[_type == "product" && slug.current == $slug][0] {
      ${productProjection},
      "relatedProducts": relatedProducts[]->{ ${productProjection} }
    }`,
    { slug }
  );
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return sanityClient.fetch(
    groq`*[_type == "product" && active == true && category->slug.current == $categorySlug] | order(name asc) {
      ${productProjection}
    }`,
    { categorySlug }
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return sanityClient.fetch(
    groq`*[_type == "product" && active == true && featured == true] | order(name asc) {
      ${productProjection}
    }`
  );
}

// ------------------------------------------------------------------
// Category queries
// ------------------------------------------------------------------
export async function getAllCategories(): Promise<Category[]> {
  return sanityClient.fetch(
    groq`*[_type == "category"] | order(order asc, title asc) {
      _id, _type, title, slug, description, icon, order, image, seoTitle, seoDescription
    }`
  );
}

// ------------------------------------------------------------------
// Blog queries
// ------------------------------------------------------------------
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return sanityClient.fetch(
    groq`*[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc) {
      ${blogPostProjection}
    }`
  );
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return sanityClient.fetch(
    groq`*[_type == "blogPost" && slug.current == $slug][0] {
      ${blogPostProjection},
      "relatedProducts": relatedProducts[]->{ ${productProjection} }
    }`,
    { slug }
  );
}

export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  return sanityClient.fetch(
    groq`*[_type == "blogPost" && defined(publishedAt) && $categorySlug in categories[]->slug.current] | order(publishedAt desc) {
      ${blogPostProjection}
    }`,
    { categorySlug }
  );
}

export async function getRecentBlogPosts(limit = 3): Promise<BlogPost[]> {
  return sanityClient.fetch(
    groq`*[_type == "blogPost" && defined(publishedAt)] | order(publishedAt desc) [0...$limit] {
      ${blogPostProjection}
    }`,
    { limit }
  );
}

// ------------------------------------------------------------------
// Site settings (singleton)
// ------------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch(
    groq`*[_type == "siteSettings"][0]{
      _id, _type, siteTitle, siteDescription, disclaimer, mainNav, footerNav,
      socialLinks, phoneNumber, address, email
    }`
  );
}
