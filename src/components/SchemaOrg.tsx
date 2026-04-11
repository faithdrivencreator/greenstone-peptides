// Renders JSON-LD structured data as a <script> tag.
// Accepts any typed schema object (Organization, Product, Article, etc.)

interface SchemaOrgProps {
  schema: Record<string, any> | Record<string, any>[];
}

export function SchemaOrg({ schema }: SchemaOrgProps) {
  return (
    <script
      type="application/ld+json"
      // Using dangerouslySetInnerHTML is the canonical Next.js pattern for JSON-LD.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
