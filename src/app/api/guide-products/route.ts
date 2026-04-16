import { sanityClient } from '@/lib/sanity';
import { NextResponse } from 'next/server';

const PRODUCTS_QUERY = `*[_type == "product" && active == true] {
  _id,
  _type,
  name,
  slug,
  category->,
  shortDescription,
  format,
  strength,
  size,
  price,
  prescriptionRequired,
  usaCompounded,
  image { asset->{ url } }
}`;

export async function GET() {
  try {
    const products = await sanityClient.fetch(PRODUCTS_QUERY);
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([]);
  }
}
