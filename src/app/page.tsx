import Link from 'next/link';
import type { Metadata } from 'next';
import { getFeaturedProducts, getRecentBlogPosts, getAllCategories } from '@/lib/queries';
import { ProductCard } from '@/components/ProductCard';
import { BlogCard } from '@/components/BlogCard';
import { SchemaOrg } from '@/components/SchemaOrg';
import { ShieldCheck, FlaskConical, Thermometer, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Physician-Prescribed Peptide Therapy',
  description:
    'USA-compounded peptides through licensed pharmacy partners. 25 years of pharmaceutical experience, USP 795 & 797 compliance, temperature-controlled shipping.',
};

export const revalidate = 300;

export default async function HomePage() {
  const [featured, recentPosts, categories] = await Promise.all([
    getFeaturedProducts(),
    getRecentBlogPosts(3),
    getAllCategories(),
  ]);

  return (
    <>
      <SchemaOrg
        schema={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Greenstone Peptides',
          url: process.env.NEXT_PUBLIC_SITE_URL,
        }}
      />

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden section-py min-h-[90vh] flex items-center">
        <div
          className="absolute inset-0 bg-hero-glow pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-molecular bg-[length:50px_50px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
          aria-hidden
        />
        <div className="container-gr relative z-10 grid gap-12 lg:grid-cols-[1.3fr_1fr] items-center">
          <div>
            <p className="eyebrow">Precision Peptide Therapy</p>
            <h1 className="font-cormorant">
              Science-backed protocols.
              <br />
              <em className="italic text-gold">Physician-prescribed.</em>
            </h1>
            <p className="mt-8 text-lg text-cream-dim max-w-xl leading-relaxed">
              Greenstone Peptides facilitates USA-compounded peptide therapy through licensed pharmacy
              partners. Twenty-five years of pharmaceutical experience, delivered with clinical
              precision from Miami, Florida.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/shop" className="btn btn-primary">
                Explore Catalog
              </Link>
              <Link href="/learn" className="btn btn-ghost">
                Read the Science →
              </Link>
            </div>
          </div>

          {/* Side card */}
          <aside className="card-glass">
            <p className="mono mb-2">Quality Promise</p>
            <ul className="divide-y divide-gold/10">
              {[
                { t: 'USP 795 & 797 Compliant', s: 'Sterile and non-sterile standards' },
                { t: 'USA Compounded', s: 'Licensed pharmacy partners only' },
                { t: 'Temperature-Controlled', s: 'Cold-chain shipping nationwide' },
                { t: '24/7 Pharmacist Support', s: 'Clinical questions answered' },
              ].map((item) => (
                <li key={item.t} className="py-3 flex flex-col">
                  <strong className="text-cream text-sm">{item.t}</strong>
                  <span className="text-xs text-cream-dim">{item.s}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ---------- FEATURED CATEGORIES ---------- */}
      {categories.length > 0 && (
        <section className="section-py">
          <div className="container-gr">
            <header className="text-center mb-16">
              <p className="eyebrow">Browse by Need</p>
              <h2>Categories</h2>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/shop?category=${cat.slug.current}`}
                  className="card-glass text-center group/cat"
                >
                  <div className="w-8 h-px bg-emerald mx-auto mb-5 group-hover/cat:w-16 transition-all duration-500" />
                  <h3 className="font-cormorant text-2xl text-white mb-2">{cat.title}</h3>
                  {cat.description && (
                    <p className="text-sm text-cream-dim">{cat.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- QUALITY PROMISE ---------- */}
      <section className="section-py bg-obsidian-mid/40 border-y border-gold/10">
        <div className="container-gr">
          <header className="text-center mb-16">
            <p className="eyebrow">Quality Commitment</p>
            <h2>Built on precision</h2>
          </header>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: 'USP Compliant', body: 'Every compound meets USP 795 & 797 standards.' },
              { icon: FlaskConical, title: 'Pharmacist-Led', body: 'Clinical oversight at every step.' },
              { icon: Thermometer, title: 'Cold-Chain', body: 'Temperature-controlled shipping nationwide.' },
              { icon: Clock, title: '25 Years', body: 'Deep pharmaceutical expertise.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="text-center">
                <Icon size={32} className="text-gold mx-auto mb-4" aria-hidden />
                <h4 className="font-cormorant text-xl text-white mb-2">{title}</h4>
                <p className="text-sm text-cream-dim mx-auto">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY SOURCE MATTERS ---------- */}
      <section className="section-py bg-obsidian border-y border-emerald/20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-molecular bg-[length:60px_60px] opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
          aria-hidden
        />
        <div className="container-gr relative z-10">
          <header className="text-center mb-16 max-w-3xl mx-auto">
            <p className="eyebrow text-emerald">Source Integrity</p>
            <h2 className="font-cormorant">Why source matters</h2>
            <p className="mt-6 text-cream-dim leading-relaxed">
              The peptide market has a quality problem. Most of what is sold online is not what
              the label says it is. The chemistry is unregulated, the supply chain is opaque, and
              the consequences land on the person doing the injecting.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-3 mb-16">
            {[
              {
                stat: '70–90%',
                label: 'Of peptides sold online originate from bulk Chinese synthesis facilities with zero independent oversight.',
              },
              {
                stat: '1% – 100%',
                label: 'Purity range found in independent lab testing of research-grade peptides. The vial may contain almost none of the listed compound.',
              },
              {
                stat: 'March 2026',
                label: 'FDA issued formal warning letters to research peptide companies. The “research use only” loophole is effectively dead.',
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="card-glass border-emerald/20 hover:border-emerald/40 transition-colors"
              >
                <p className="font-cormorant text-5xl text-emerald mb-3">{item.stat}</p>
                <p className="text-sm text-cream-dim leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* The problem */}
            <div>
              <p className="mono text-emerald mb-3">// the problem</p>
              <h3 className="font-cormorant text-3xl text-white mb-6">
                The overseas supply chain is a black box
              </h3>
              <ul className="space-y-4 text-cream-dim text-sm leading-relaxed">
                <li className="pl-4 border-l border-emerald/30">
                  <strong className="text-cream block mb-1">Heavy metal contamination</strong>
                  Lead, cadmium, and mercury have been documented in overseas peptide imports.
                  These are injected directly into the bloodstream.
                </li>
                <li className="pl-4 border-l border-emerald/30">
                  <strong className="text-cream block mb-1">Counterfeit compounds</strong>
                  Illicit semaglutide seized by European regulators tested as an entirely
                  different substance. The vial said one thing, the contents said another.
                </li>
                <li className="pl-4 border-l border-emerald/30">
                  <strong className="text-cream block mb-1">Fabricated certificates</strong>
                  A Certificate of Analysis from an unaccredited source is a PDF, not a
                  guarantee. Many online sellers recycle the same fake document across batches.
                </li>
                <li className="pl-4 border-l border-emerald/30">
                  <strong className="text-cream block mb-1">Regulatory collapse</strong>
                  The FDA&rsquo;s March 2026 enforcement action gave non-compliant research
                  peptide sellers 15 days to cease shipments. Buyers lose their supplier
                  overnight — with no recourse.
                </li>
              </ul>
            </div>

            {/* The Greenstone difference */}
            <div>
              <p className="mono text-gold mb-3">// the greenstone standard</p>
              <h3 className="font-cormorant text-3xl text-white mb-6">
                Every compound traceable to a licensed pharmacy
              </h3>
              <ul className="space-y-4 text-cream-dim text-sm leading-relaxed">
                <li className="pl-4 border-l border-gold/30">
                  <strong className="text-cream block mb-1">USA compounding pharmacies only</strong>
                  Every formulation is produced inside a state-licensed compounding pharmacy,
                  not a chemical supplier. Pharmacists, not traders.
                </li>
                <li className="pl-4 border-l border-gold/30">
                  <strong className="text-cream block mb-1">USP 797 sterile compounding</strong>
                  ISO Class 5 clean room environment. 14-day sterility testing. Bacterial
                  endotoxin testing on every sterile lot.
                </li>
                <li className="pl-4 border-l border-gold/30">
                  <strong className="text-cream block mb-1">Batch-specific Certificate of Analysis</strong>
                  Real CoA from accredited labs, tied to the lot number on your vial. Potency,
                  purity, and contaminant testing — verifiable, not theatrical.
                </li>
                <li className="pl-4 border-l border-gold/30">
                  <strong className="text-cream block mb-1">Prescription-based dispensing</strong>
                  A licensed provider writes the script. A licensed pharmacist fills it. The
                  chain of custody is documented at every step.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link href="/learn/why-source-matters" className="btn btn-ghost">
              Read the full quality protocol →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section className="section-py">
        <div className="container-gr">
          <header className="text-center mb-16">
            <p className="eyebrow">Process</p>
            <h2>How it works</h2>
          </header>
          <ol className="grid gap-8 md:grid-cols-3">
            {[
              { n: '01', t: 'Consult', b: 'Speak with a licensed provider about your goals and medical history.' },
              { n: '02', t: 'Prescribe', b: 'Your provider writes a prescription routed to our pharmacy partner.' },
              { n: '03', t: 'Deliver', b: 'Your compounded medication ships cold-chain to your door.' },
            ].map((s) => (
              <li key={s.n} className="card-glass">
                <span className="mono">{s.n}</span>
                <h4 className="font-cormorant text-2xl text-white mt-3 mb-2">{s.t}</h4>
                <p className="text-sm text-cream-dim">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- FEATURED PRODUCTS ---------- */}
      {featured.length > 0 && (
        <section className="section-py">
          <div className="container-gr">
            <header className="text-center mb-16">
              <p className="eyebrow">Catalog Highlights</p>
              <h2>Featured products</h2>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/shop" className="btn btn-primary">
                View Full Catalog
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- RECENT BLOG ---------- */}
      {recentPosts.length > 0 && (
        <section className="section-py bg-obsidian-mid/40 border-y border-gold/10">
          <div className="container-gr">
            <header className="text-center mb-16">
              <p className="eyebrow">Learn</p>
              <h2>Latest from the clinic</h2>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- GLP-1 QUIZ CTA ---------- */}
      <section className="section-py">
        <div className="container-gr">
          <div className="card-glass text-center max-w-3xl mx-auto">
            <p className="eyebrow">Candidacy Check</p>
            <h2 className="font-cormorant">Is GLP-1 therapy right for you?</h2>
            <p className="text-cream-dim mt-4 mx-auto">
              Take our 2-minute candidacy quiz. Results are reviewed by a licensed provider.
            </p>
            <Link href="/contact" className="btn btn-primary mt-6 inline-flex">
              Start Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- NEWSLETTER ---------- */}
      <section className="section-py">
        <div className="container-gr max-w-2xl text-center">
          <p className="eyebrow">Stay Informed</p>
          <h2>Peptide research, delivered.</h2>
          <p className="text-cream-dim mt-4 mx-auto">
            One email a month. New protocols, clinical studies, and physician insights.
          </p>
          <form className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-gold outline-none"
            />
            <button type="submit" className="btn btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
