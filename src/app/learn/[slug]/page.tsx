import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
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
      authors: post.author?.name ? [post.author.name] : undefined,
    },
  };
}

export const revalidate = 300;

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const heroUrl = post.mainImage
    ? urlFor(post.mainImage).width(1600).height(900).url()
    : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: post.author?.name
      ? { '@type': 'Person', name: post.author.name }
      : undefined,
    image: heroUrl || undefined,
  };

  return (
    <>
      <SchemaOrg schema={articleSchema} />

      <article className="section-py">
        <div className="container-gr max-w-6xl">
          {/* Header */}
          <header className="mb-12 text-center max-w-3xl mx-auto">
            {post.categories?.[0] && (
              <p className="mono mb-4">{post.categories[0].title}</p>
            )}
            <h1 className="font-cormorant">{post.title}</h1>
            {post.excerpt && (
              <p className="mt-6 text-lg text-cream-dim mx-auto">{post.excerpt}</p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-cream-dim">
              {post.author?.name && (
                <span>
                  By <span className="text-cream">{post.author.name}</span>
                  {post.author.credentials && `, ${post.author.credentials}`}
                </span>
              )}
              {post.publishedAt && (
                <>
                  <span className="text-gold/30">·</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </>
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
            <div className="prose-article text-cream-dim max-w-none space-y-6">
              {post.body && (
                <PortableText
                  value={post.body}
                  components={{
                    block: {
                      h2: ({ children }) => (
                        <h2 className="font-cormorant text-3xl text-white mt-12 mb-4">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="font-cormorant text-2xl text-white mt-8 mb-3">{children}</h3>
                      ),
                      normal: ({ children }) => (
                        <p className="text-cream-dim leading-relaxed">{children}</p>
                      ),
                    },
                    marks: {
                      link: ({ value, children }) => (
                        <a
                          href={value?.href}
                          className="text-gold underline hover:text-gold-light"
                          rel="noopener"
                        >
                          {children}
                        </a>
                      ),
                    },
                  }}
                />
              )}
            </div>

            <aside className="space-y-8">
              {post.author && (
                <div className="card-glass">
                  <p className="mono mb-3">Author</p>
                  <p className="font-cormorant text-xl text-white">{post.author.name}</p>
                  {post.author.credentials && (
                    <p className="text-xs text-gold mt-1">{post.author.credentials}</p>
                  )}
                  {post.author.bio && (
                    <p className="text-sm text-cream-dim mt-3">{post.author.bio}</p>
                  )}
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
