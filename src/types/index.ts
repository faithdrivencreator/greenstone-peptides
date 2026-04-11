// Greenstone Peptides — core TypeScript types (mirror of Sanity schemas)

export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: string;
}

export interface Slug {
  _type: 'slug';
  current: string;
}

export type ProductFormat = 'injectable' | 'odt' | 'nasal-spray' | 'cream' | 'kit';

export interface Category {
  _id: string;
  _type: 'category';
  title: string;
  slug: Slug;
  description?: string;
  icon?: string;
  order?: number;
  image?: SanityImage;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Product {
  _id: string;
  _type: 'product';
  name: string;
  slug: Slug;
  category?: Category;
  shortDescription?: string;
  description?: any[]; // PortableText blocks
  format?: ProductFormat;
  strength?: string;
  size?: string;
  price: number;
  stripePaymentLink?: string;
  prescriptionRequired: boolean;
  usaCompounded: boolean;
  storageInstructions?: string;
  safetyNotes?: string;
  relatedProducts?: Product[];
  seoTitle?: string;
  seoDescription?: string;
  image?: SanityImage;
  featured?: boolean;
  active: boolean;
}

export interface Author {
  _id: string;
  _type: 'author';
  name: string;
  slug: Slug;
  image?: SanityImage;
  bio?: string;
  credentials?: string;
  title?: string;
}

export interface BlogPost {
  _id: string;
  _type: 'blogPost';
  title: string;
  slug: Slug;
  author?: Author;
  publishedAt: string;
  categories?: Category[];
  excerpt?: string;
  body?: any[]; // PortableText
  mainImage?: SanityImage;
  relatedProducts?: Product[];
  readingTime?: number;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

export interface NavItem {
  title: string;
  href: string;
}

export interface SiteSettings {
  _id: string;
  _type: 'siteSettings';
  siteTitle: string;
  siteDescription?: string;
  disclaimer?: string;
  mainNav?: NavItem[];
  footerNav?: NavItem[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
  phoneNumber?: string;
  address?: string;
  email?: string;
}
