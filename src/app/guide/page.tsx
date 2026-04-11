import { sanityClient } from '@/lib/sanity';
import { GuideWizard } from '@/components/PeptideGuide/GuideWizard';
import type { Product } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Peptide Guide — Find Your Protocol | Greenstone Peptides',
  description:
    'Not sure which peptide is right for you? Answer 3 questions and get a personalized protocol recommendation from Greenstone Peptides.',
};

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
  usaCompounded
}`;

export default async function GuidePage() {
  const products: Product[] = await sanityClient.fetch(PRODUCTS_QUERY);

  return <GuideWizard allProducts={products} />;
}
