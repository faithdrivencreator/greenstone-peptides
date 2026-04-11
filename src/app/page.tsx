import Link from 'next/link';
import type { Metadata } from 'next';
import { getFeaturedProducts, getRecentBlogPosts, getAllCategories } from '@/lib/queries';
import { ProductCard } from '@/components/ProductCard';
import { BlogCard } from '@/components/BlogCard';
import { SchemaOrg } from '@/components/SchemaOrg';
import { ShieldCheck, FlaskConical, Thermometer, Clock, ArrowRight } from 'lucide-react';

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

      {/* ---------- ANNOUNCEMENT BANNER ---------- */}
      <div className="bg-emerald text-obsidian py-2.5 text-center font-jetbrains text-[0.65rem] tracking-[0.15em] uppercase">
        New: Tirzepatide Triple Agonist formulations now available —{' '}
        <Link href="/shop?category=weight-loss" className="ml-1 underline underline-offset-2 font-bold hover:opacity-80 transition-opacity">
          View formulations →
        </Link>
      </div>

      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden section-py min-h-[80vh] flex items-center">
        {/* Full-bleed lab background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/images/hero-lab.png)' }}
          aria-hidden
        />
        {/* Dark overlay — keeps text readable, adds brand depth */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(105deg, rgba(13,17,23,0.92) 0%, rgba(13,17,23,0.75) 50%, rgba(13,17,23,0.55) 100%)' }}
          aria-hidden
        />
        {/* Emerald glow over image */}
        <div
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(26,158,110,0.20) 0%, transparent 70%)' }}
          aria-hidden
        />

        <div className="container-gr relative z-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
          {/* Left: compressed, conversion-focused copy */}
          <div>
            <p className="eyebrow text-emerald">USA-Compounded · Physician-Prescribed</p>
            <h1 className="font-cormorant">
              Pharmaceutical-grade
              <br />
              peptides.{' '}
              <em className="italic text-gold">Delivered.</em>
            </h1>
            <p className="mt-5 text-base text-cream-dim max-w-lg leading-relaxed">
              Every formulation synthesized inside a licensed USA compounding pharmacy.
              USP 797 sterile standard. Prescription-facilitated — clinically verified
              from synthesis to your door.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/shop" className="btn btn-primary">
                Shop All Products
              </Link>
              <Link href="/about" className="btn btn-ghost">
                Why Greenstone →
              </Link>
            </div>
            {/* Micro trust row */}
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {['USP 797 Certified', 'USA Synthesized', '25-yr Pharmacy Partner', 'Rx Facilitated'].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-cream-dim/70 font-jetbrains tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald flex-shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: live product mini-grid */}
          <div className="grid grid-cols-2 gap-3">
            {(featured.length > 0 ? featured.slice(0, 4) : [
              { _id: 'ph1', name: 'Semaglutide', category: { title: 'Weight Loss' }, price: 299, slug: { current: '' } },
              { _id: 'ph2', name: 'Tirzepatide', category: { title: 'Weight Loss' }, price: 349, slug: { current: '' } },
              { _id: 'ph3', name: 'Sermorelin', category: { title: 'GH Support' }, price: 189, slug: { current: '' } },
              { _id: 'ph4', name: 'NAD+', category: { title: 'Longevity' }, price: 149, slug: { current: '' } },
            ] as Array<{ _id: string; name: string; category?: { title: string }; price: number; slug: { current: string } }>).map((p) => (
              <Link
                key={p._id}
                href={p.slug.current ? `/shop/${p.slug.current}` : '/shop'}
                className="card-glass border-emerald/20 hover:border-emerald/50 p-4 group transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="w-full aspect-square mb-3 bg-obsidian-light border border-emerald/10 flex items-center justify-center overflow-hidden">
                  <span className="font-cormorant text-3xl text-emerald/30 group-hover:text-emerald/50 transition-colors">Rx</span>
                </div>
                <p className="font-cormorant text-base text-white leading-tight">{p.name}</p>
                {p.category?.title && (
                  <p className="font-jetbrains text-[0.6rem] tracking-wider uppercase text-emerald/70 mt-0.5">{p.category.title}</p>
                )}
                <p className="font-cormorant text-lg text-gold mt-1">from ${p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TRUST BAR ---------- */}
      <section className="bg-obsidian-mid/90 border-y border-emerald/25 py-5">
        <div className="container-gr">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {[
              'USP 797 Sterile Standard',
              '100% USA Compounded',
              'Prescription Facilitated',
              'Cold-Chain Shipping',
              '25 Years Pharmacy Experience',
              '24/7 Pharmacist Access',
            ].map((label) => (
              <span key={label} className="flex items-center gap-2 font-jetbrains text-[0.6rem] tracking-widest uppercase text-cream-dim/80">
                <span className="text-emerald font-bold text-xs">✓</span>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FEATURED PRODUCTS (moved above fold) ---------- */}
      {featured.length > 0 && (
        <section className="section-py">
          <div className="container-gr">
            <header className="text-center mb-12">
              <p className="eyebrow text-emerald">Most Popular</p>
              <h2>Top-Ordered Products</h2>
              <p className="mt-3 text-sm text-cream-dim/70 font-jetbrains tracking-wide">
                All formulations physician-prescribed · Ships within 48 hours of prescription approval
              </p>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/shop" className="inline-flex items-center gap-2 btn btn-primary">
                View Full Catalog of 53 Products <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------- SOCIAL PROOF ---------- */}
      <section className="section-py bg-emerald/[0.06] border-y border-emerald/20">
        <div className="container-gr">
          <header className="text-center mb-12">
            <p className="eyebrow text-emerald">Patient Outcomes</p>
            <h2>Clinically verified. Patient approved.</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: 'After 12 weeks on a tirzepatide protocol, I am down 34 pounds. My provider monitored every step. This is not a shortcut — it is medicine done right.',
                name: 'M. Rivera',
                detail: 'Miami, FL · Weight Management Protocol',
                stars: 5,
              },
              {
                quote: 'The quality difference between Greenstone and what I was using before is night and day. You can feel a properly dosed compound. Everything was consistent from the first vial to the last.',
                name: 'T. Harmon',
                detail: 'Atlanta, GA · GH Support Protocol',
                stars: 5,
              },
              {
                quote: 'Knowing my compounding pharmacy is held to the same sterility standard as a hospital IV prep made all the difference. I have peace of mind I never had with research-grade suppliers.',
                name: 'Dr. K. Osei',
                detail: 'Houston, TX · Longevity Protocol',
                stars: 5,
              },
            ].map((t) => (
              <div key={t.name} className="card-glass border-emerald/15 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <span key={i} className="text-gold text-sm">&#9733;</span>
                  ))}
                </div>
                <p className="text-sm text-cream-dim leading-relaxed italic flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-gold/10 pt-4 mt-5">
                  <p className="text-sm text-cream font-medium">{t.name}</p>
                  <p className="font-jetbrains text-[0.6rem] tracking-wider uppercase text-cream-dim/60 mt-0.5">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[0.6rem] text-cream-dim/40 mt-8 font-jetbrains tracking-wide uppercase">
            Patient outcomes vary. Individual results depend on protocol, compliance, and medical history.
          </p>
        </div>
      </section>

      {/* ---------- FEATURED CATEGORIES ---------- */}
      {categories.length > 0 && (
        <section className="section-py">
          <div className="container-gr">
            <header className="text-center mb-12">
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
      <section className="section-py bg-emerald/[0.09] border-y border-emerald/25 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(26,158,110,0.08), transparent 80%)' }}
          aria-hidden
        />
        <div className="container-gr relative z-10">
          <header className="text-center mb-16">
            <p className="eyebrow text-emerald">Quality Commitment</p>
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
                <Icon size={32} className="text-emerald mx-auto mb-4" aria-hidden />
                <h4 className="font-cormorant text-xl text-white mb-2">{title}</h4>
                <p className="text-sm text-cream-dim mx-auto">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- WHY SOURCE MATTERS ---------- */}
      <section className="section-py bg-emerald/[0.07] border-y border-emerald/30 relative overflow-hidden">
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
                label: 'FDA issued formal warning letters to research peptide companies. The "research use only" loophole is effectively dead.',
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
      <section className="section-py bg-emerald/[0.05] border-y border-emerald/15">
        <div className="container-gr">
          <header className="text-center mb-16">
            <p className="eyebrow text-emerald">Process</p>
            <h2>How it works</h2>
          </header>
          <ol className="grid gap-8 md:grid-cols-3">
            {[
              { n: '01', t: 'Consult', b: 'Speak with a licensed provider about your goals and medical history.' },
              { n: '02', t: 'Prescribe', b: 'Your provider writes a prescription routed to our pharmacy partner.' },
              { n: '03', t: 'Deliver', b: 'Your compounded medication ships cold-chain to your door.' },
            ].map((s) => (
              <li key={s.n} className="card-glass border-emerald/20 hover:border-emerald/40">
                <span className="mono !text-emerald">{s.n}</span>
                <h4 className="font-cormorant text-2xl text-white mt-3 mb-2">{s.t}</h4>
                <p className="text-sm text-cream-dim">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- RECENT BLOG ---------- */}
      {recentPosts.length > 0 && (
        <section className="section-py bg-emerald/[0.06] border-y border-emerald/20">
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
      <section className="section-py bg-emerald/[0.08] border-y border-emerald/25">
        <div className="container-gr">
          <div className="card-glass border-emerald/30 text-center max-w-3xl mx-auto">
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
      <section className="section-py border-t border-emerald/15">
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
              className="flex-1 bg-obsidian-light border border-gold/20 px-4 py-3 text-cream rounded focus:border-emerald/60 outline-none transition-colors"
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
