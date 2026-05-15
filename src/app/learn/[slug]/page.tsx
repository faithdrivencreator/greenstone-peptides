import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/queries';
import { productImageUrl } from '@/lib/product-image';
import { ProductCard } from '@/components/ProductCard';
import { SchemaOrg } from '@/components/SchemaOrg';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || undefined,
    alternates: { canonical: `/learn/${params.slug}` },
    openGraph: {
      type: 'article',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || undefined,
      publishedTime: post.publishedAt,
    },
  };
}

export const revalidate = false; // fully static, rebuild on deploy

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const heroUrl = productImageUrl(post.mainImage);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: heroUrl || undefined,
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />

      <article className="section-py">
        <div className="container-gr max-w-6xl">
          {/* Header */}
          <header className="mb-12 text-center max-w-3xl mx-auto">
            <h1 className="font-cormorant">{post.title}</h1>
            {post.excerpt && (
              <p className="mt-6 text-lg text-cream-dim mx-auto">{post.excerpt}</p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-cream-dim">
              {post.publishedAt && (
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </time>
              )}
              {post.readingTime && (
                <>
                  <span className="text-gold/30">·</span>
                  <span>{post.readingTime} min read</span>
                </>
              )}
            </div>
          </header>

          {/* Hero image */}
          {heroUrl && (
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-16 border border-gold/15">
              <Image
                src={heroUrl}
                alt={post.mainImage?.alt || post.title}
                fill
                priority
                sizes="(min-width: 1024px) 1200px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          {/* Body + sidebar */}
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            {post.body && (
              <div
                className="prose-article text-cream-dim max-w-none"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            )}

            <aside className="space-y-8">
              {post.tags && post.tags.length > 0 && (
                <div className="card-glass">
                  <p className="mono mb-3">Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="badge badge-odt">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {post.relatedProducts && post.relatedProducts.length > 0 && (
                <div>
                  <p className="mono mb-4">Related Products</p>
                  <div className="grid gap-4">
                    {post.relatedProducts.slice(0, 2).map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                </div>
              )}

              <Link href="/learn" className="btn btn-ghost">
                ← All Articles
              </Link>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
