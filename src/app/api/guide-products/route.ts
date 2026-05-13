import { NextResponse } from 'next/server';
import { staticProducts } from '@/data/products';
import { staticCategories } from '@/data/categories';

export async function GET() {
  try {
    const products = staticProducts
      .filter(p => p.active)
      .map(p => {
        const cat = staticCategories.find(c => c.id === p.categoryId);
        return {
          _id: p.id,
          _type: 'product',
          name: p.name,
          slug: { current: p.slug },
          category: cat
            ? { _id: cat.id, title: cat.title, slug: { current: cat.slug }, icon: cat.icon }
            : null,
          shortDescription: p.shortDescription,
          format: p.format,
          strength: p.strength,
          size: p.size,
          price: p.price,
          prescriptionRequired: p.prescriptionRequired,
          usaCompounded: p.usaCompounded,
          image: p.imageUrl ? { asset: { url: p.imageUrl } } : null,
        };
      });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}
