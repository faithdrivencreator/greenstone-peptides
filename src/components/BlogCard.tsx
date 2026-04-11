import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import type { BlogPost } from '@/types';
import { urlFor } from '@/lib/sanity';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(800).height(480).url() : null;
  const primaryCategory = post.categories?.[0];

  return (
    <Link
      href={`/learn/${post.slug.current}`}
      className="card-glass group flex flex-col !p-0 overflow-hidden"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-obsidian-light">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover transition-transform duration-[600ms] ease-smooth group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-gold/30 font-cormorant text-4xl">
            Learn
          </div>
        )}
        {primaryCategory && (
          <span className="badge badge-odt absolute left-4 top-4">{primaryCategory.title}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <h3 className="font-cormorant text-2xl text-white leading-tight group-hover:text-gold transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-cream-dim line-clamp-3">{post.excerpt}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gold/10 text-xs text-cream-dim/80">
          <div className="flex flex-col">
            {post.author?.name && <span className="text-cream">{post.author.name}</span>}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            )}
          </div>
          {post.readingTime ? (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {post.readingTime} min read
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
