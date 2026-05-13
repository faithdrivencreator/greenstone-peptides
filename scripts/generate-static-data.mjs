/**
 * Greenstone Peptides — Sanity → Static Data Converter
 * Reads the Sanity export JSON and generates:
 *   src/data/blog-posts.ts
 *   src/data/products.ts
 *   src/data/categories.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const ROOT = resolve('/sessions/great-brave-wozniak/mnt/greenstone-rx/greenstone-rx');
const EXPORT = '/tmp/sanity-export.json';
const DATA_DIR = resolve(ROOT, 'src/data');

mkdirSync(DATA_DIR, { recursive: true });

const { products: rawProducts, categories: rawCategories, posts: rawPosts } = JSON.parse(readFileSync(EXPORT, 'utf-8'));

// ── Portable Text → HTML ──────────────────────────────────────────────────────
function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function renderSpans(children, markDefs) {
  if (!children) return '';
  return children.map(span => {
    if (span._type !== 'span') return '';
    let text = escHtml(span.text || '');
    for (const mark of (span.marks || [])) {
      if (mark === 'strong') { text = `<strong>${text}</strong>`; }
      else if (mark === 'em') { text = `<em>${text}</em>`; }
      else {
        const def = (markDefs || []).find(d => d._key === mark);
        if (def?._type === 'link') {
          const href = def.href || '#';
          const ext = !href.startsWith('/') ? ' target="_blank" rel="noopener noreferrer"' : '';
          text = `<a href="${href}"${ext}>${text}</a>`;
        }
      }
    }
    return text;
  }).join('');
}

function ptToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  const out = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (!b) { i++; continue; }

    if (b._type === 'image') {
      const url = b.asset?.url || '';
      const alt = escHtml(b.alt || '');
      if (url) out.push(`<img src="${url}" alt="${alt}" style="width:100%;border-radius:8px;margin:2rem 0;" loading="lazy" />`);
      i++; continue;
    }

    if (b._type !== 'block') { i++; continue; }

    // Collect consecutive list items
    if (b.listItem) {
      const isBullet = b.listItem === 'bullet';
      const tag = isBullet ? 'ul' : 'ol';
      const items = [];
      while (i < blocks.length && blocks[i]?._type === 'block' && blocks[i]?.listItem) {
        items.push(`<li>${renderSpans(blocks[i].children, blocks[i].markDefs)}</li>`);
        i++;
      }
      out.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }

    const text = renderSpans(b.children, b.markDefs);
    switch (b.style) {
      case 'h2': out.push(`<h2>${text}</h2>`); break;
      case 'h3': out.push(`<h3>${text}</h3>`); break;
      case 'h4': out.push(`<h4>${text}</h4>`); break;
      case 'blockquote': out.push(`<blockquote><p>${text}</p></blockquote>`); break;
      default: if (text.trim()) out.push(`<p>${text}</p>`); break;
    }
    i++;
  }
  return out.join('\n');
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────
const categories = rawCategories.map(c => ({
  id: c._id,
  title: c.title,
  slug: c.slug?.current || '',
  description: c.description || null,
  icon: c.icon || null,
  order: c.order ?? 99,
  seoTitle: c.seoTitle || null,
  seoDescription: c.seoDescription || null,
}));

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
const products = rawProducts.map(p => ({
  id: p._id,
  name: p.name,
  slug: p.slug?.current || '',
  categoryId: p.category?._id || null,
  categorySlug: p.category?.slug?.current || null,
  categoryTitle: p.category?.title || null,
  shortDescription: p.shortDescription || null,
  description: ptToHtml(p.description),
  format: p.format || null,
  strength: p.strength || null,
  size: p.size || null,
  price: p.price,
  stripePaymentLink: p.stripePaymentLink || null,
  prescriptionRequired: !!p.prescriptionRequired,
  usaCompounded: p.usaCompounded !== false,
  storageInstructions: p.storageInstructions || null,
  safetyNotes: p.safetyNotes || null,
  seoTitle: p.seoTitle || null,
  seoDescription: p.seoDescription || null,
  imageUrl: p.image?.asset?.url || null,
  imageAlt: p.image?.alt || p.name,
  featured: !!p.featured,
  active: p.active !== false,
}));

// ── BLOG POSTS ────────────────────────────────────────────────────────────────
const posts = rawPosts.map(p => ({
  id: p._id,
  title: p.title,
  slug: p.slug?.current || '',
  publishedAt: p.publishedAt,
  excerpt: p.excerpt || null,
  content: ptToHtml(p.body),
  heroImage: p.mainImage?.asset?.url || null,
  heroAlt: p.mainImage?.alt || p.title,
  readingTime: p.readingTime || null,
  featured: !!p.featured,
  seoTitle: p.seoTitle || null,
  seoDescription: p.seoDescription || null,
  tags: p.tags || [],
  relatedProductIds: (p.relatedProducts || []).map(rp => rp._id),
}));

// ── Write TypeScript files ────────────────────────────────────────────────────
function jsonTs(varName, typeName, data) {
  return `// AUTO-GENERATED — do not edit by hand. Run scripts/generate-static-data.mjs to regenerate.
// Last generated: ${new Date().toISOString()}

export type ${typeName} = (typeof ${varName})[number];

export const ${varName} = ${JSON.stringify(data, null, 2)} as const;
`;
}

// categories.ts
writeFileSync(resolve(DATA_DIR, 'categories.ts'), jsonTs('staticCategories', 'StaticCategory', categories));
console.log(`✅ categories.ts — ${categories.length} categories`);

// products.ts
writeFileSync(resolve(DATA_DIR, 'products.ts'), jsonTs('staticProducts', 'StaticProduct', products));
console.log(`✅ products.ts — ${products.length} products`);

// blog-posts.ts — write without body (bodies go in separate content files to keep TS file manageable)
// Actually, include bodies inline since we're going full static
writeFileSync(resolve(DATA_DIR, 'blog-posts.ts'), jsonTs('staticBlogPosts', 'StaticBlogPost', posts));
console.log(`✅ blog-posts.ts — ${posts.length} posts`);

console.log('\nDone. Files written to src/data/');
