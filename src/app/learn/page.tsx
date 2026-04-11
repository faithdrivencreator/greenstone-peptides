import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/queries';
import { BlogCard } from '@/components/BlogCard';

export const metadata: Metadata = {
  title: 'Learn Center',
  description:
    'Clinical research, peptide protocols, and physician insights from the Greenstone Peptides team.',
};

export const revalidate = 300;

export default async function LearnPage() {
  const posts = await getAllBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <section className="section-py">
      <div className="container-gr">
        <header className="mb-16 text-center">
          <p className="eyebrow">Learn</p>
          <h1>Research & Protocols</h1>
          <p className="mt-4 mx-auto">
            Clinical research, dosing protocols, and physician insights.
          </p>
        </header>

        {featured && (
          <div className="mb-16">
            <BlogCard post={featured} />
          </div>
        )}

        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <BlogCard key={p._id} post={p} />
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <p className="text-cream-dim text-center">No posts published yet.</p>
        )}
      </div>
    </section>
  );
}
