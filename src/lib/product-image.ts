/**
 * Resolve a product or blog image object to its URL string.
 *
 * Catalog data (src/data/products.ts, src/data/blog-posts.ts) is adapted to
 * the shape `{ asset: { url: string }, alt: string }` by src/lib/queries.ts.
 * This helper unwraps that to a plain URL string. Next.js <Image> handles
 * resizing/optimization — no image pipeline needed.
 */

interface ImageLike {
  asset?: { url?: string };
  url?: string;
}

export function productImageUrl(image: ImageLike | null | undefined): string | null {
  return image?.asset?.url || image?.url || null;
}
