import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'string',
      description: 'One-line summary for cards and meta descriptions',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {
        list: [
          { title: 'Injectable', value: 'injectable' },
          { title: 'Oral Disintegrating Tablet (ODT)', value: 'odt' },
          { title: 'Nasal Spray', value: 'nasal-spray' },
          { title: 'Cream', value: 'cream' },
          { title: 'Kit', value: 'kit' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'strength',
      title: 'Strength',
      type: 'string',
      description: 'e.g. 5mg/mL',
    }),
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      description: 'e.g. 5mL',
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'stripePaymentLink',
      title: 'Stripe Payment Link',
      type: 'url',
      description: 'Full URL to the Stripe Payment Link for this product',
    }),
    defineField({
      name: 'prescriptionRequired',
      title: 'Prescription Required',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'usaCompounded',
      title: 'USA Compounded',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'storageInstructions',
      title: 'Storage Instructions',
      type: 'string',
    }),
    defineField({
      name: 'safetyNotes',
      title: 'Safety Notes',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'string',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'strength',
      media: 'image',
    },
  },
});
