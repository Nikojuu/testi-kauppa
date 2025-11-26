# Schema-dts Implementation Guide

## Overview

This project uses [schema-dts](https://github.com/google/schema-dts) for type-safe structured data (JSON-LD) implementation. All schema markup is validated at compile-time by TypeScript, preventing schema errors before deployment.

## What is schema-dts?

`schema-dts` is a TypeScript library that provides type definitions for all schema.org types. It ensures your structured data conforms to schema.org standards at compile-time.

### Benefits:
✅ **Type Safety** - Catch schema errors during development, not in production
✅ **Auto-completion** - IDE suggests valid properties for each schema type
✅ **Documentation** - Type definitions serve as inline documentation
✅ **Refactoring Safety** - TypeScript catches breaking changes
✅ **SEO Confidence** - Know your schemas are valid before deployment

---

## Implemented Schemas

### 1. ProductSchema
**Location**: `src/components/StructuredData/ProductSchema.tsx`

**Type**: `WithContext<Product>`

**Features**:
- Product name, description, images
- Price with sale price support (`priceValidUntil`)
- Availability status (InStock/OutOfStock)
- SKU tracking
- Brand information
- Category classification

**Usage**:
```tsx
import ProductSchema from "@/components/StructuredData/ProductSchema";

<ProductSchema product={productData} />
```

---

### 2. OrganizationSchema
**Location**: `src/components/StructuredData/OrganizationSchema.tsx`

**Type**: `WithContext<Organization>`

**Features**:
- Business name and URL
- Logo and description
- Address (Finland)
- Contact point (customer service)
- Social media links (Instagram)

**Usage**:
```tsx
import OrganizationSchema from "@/components/StructuredData/OrganizationSchema";

// In layout.tsx <head>
<OrganizationSchema />
```

---

### 3. LocalBusinessSchema (Store)
**Location**: `src/components/StructuredData/LocalBusinessSchema.tsx`

**Type**: `WithContext<Store>`

**Features**:
- Store information (Tampere, Finland)
- Opening hours (24/7 online)
- Price range (€€)
- Accepted payment methods
- Email contact
- Social media

**Usage**:
```tsx
import LocalBusinessSchema from "@/components/StructuredData/LocalBusinessSchema";

// In layout.tsx <head>
<LocalBusinessSchema />
```

---

### 4. BreadcrumbSchema
**Location**: `src/components/StructuredData/BreadcrumbSchema.tsx`

**Type**: `WithContext<BreadcrumbList>`

**Features**:
- Navigation breadcrumb trail
- Position-based hierarchy
- URL and name for each item

**Usage**:
```tsx
import BreadcrumbSchema from "@/components/StructuredData/BreadcrumbSchema";

const breadcrumbItems = [
  { name: "Etusivu", url: "https://www.pupunkorvat.fi" },
  { name: "Tuotteet", url: "https://www.pupunkorvat.fi/products" },
  { name: product.name, url: `https://www.pupunkorvat.fi/product/${slug}` }
];

<BreadcrumbSchema items={breadcrumbItems} />
```

---

## Creating New Schemas

### Step 1: Import Types
```tsx
import { FAQPage, WithContext } from "schema-dts";
```

### Step 2: Define Schema with Type
```tsx
const schema: WithContext<FAQPage> = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I care for glass bead jewelry?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Avoid water and harsh chemicals..."
      }
    }
  ]
};
```

### Step 3: Render as JSON-LD
```tsx
return (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
  />
);
```

---

## Validation Utilities

### Location: `src/lib/schema-validation.ts`

### validateSchema()
Validates schema objects at compile-time (TypeScript) and runtime (optional).

```tsx
import { validateSchema } from "@/lib/schema-validation";

const schema = validateSchema({
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Example Product"
});
```

### stringifySchema()
Safely stringifies schema for JSON-LD injection.

```tsx
import { stringifySchema } from "@/lib/schema-validation";

const jsonLd = stringifySchema(schema);
// Returns: '{"@context":"https://schema.org","@type":"Product",...}'
```

### isValidSchema()
Type guard to check if a value is a valid schema.

```tsx
import { isValidSchema } from "@/lib/schema-validation";

if (isValidSchema(data)) {
  // TypeScript knows data is WithContext<Thing>
  console.log(data["@type"]);
}
```

---

## Type Safety Examples

### ✅ GOOD - Type-safe availability
```tsx
const availability: "https://schema.org/InStock" | "https://schema.org/OutOfStock" =
  quantity > 0
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
```

### ❌ BAD - Untyped string
```tsx
// TypeScript error: string is not assignable to ItemAvailability
const availability = "InStock"; // Wrong!
```

### ✅ GOOD - Conditional properties
```tsx
const offers = {
  "@type": "Offer" as const,
  price: "29.99",
  ...(saleEndDate ? { priceValidUntil: saleEndDate } : {})
};
```

### ✅ GOOD - Const assertions
```tsx
const schema = {
  "@type": "Product" as const, // Ensures literal type
  name: "Product Name"
};
```

---

## Testing Schemas

### 1. TypeScript Compilation
```bash
npm run build
```
If schemas are invalid, TypeScript will show errors at compile-time.

### 2. Google Rich Results Test
After deployment, test schemas:
```
https://search.google.com/test/rich-results
```

### 3. Schema Markup Validator
Validate against schema.org standards:
```
https://validator.schema.org/
```

### 4. Development Check
```bash
# Type check only (faster)
npx tsc --noEmit
```

---

## Common Schema Types

### Available in schema-dts:

| Schema Type | Use Case | Import |
|-------------|----------|--------|
| `Product` | Product pages | `import { Product } from "schema-dts"` |
| `Organization` | Business info | `import { Organization } from "schema-dts"` |
| `Store` | Local business | `import { Store } from "schema-dts"` |
| `BreadcrumbList` | Navigation | `import { BreadcrumbList } from "schema-dts"` |
| `FAQPage` | FAQ sections | `import { FAQPage } from "schema-dts"` |
| `Review` | Product reviews | `import { Review } from "schema-dts"` |
| `AggregateRating` | Rating summary | `import { AggregateRating } from "schema-dts"` |
| `Offer` | Price/availability | `import { Offer } from "schema-dts"` |
| `WebSite` | Site info | `import { WebSite } from "schema-dts"` |
| `CollectionPage` | Category pages | `import { CollectionPage } from "schema-dts"` |

---

## Future Schema Recommendations

### High Priority:
1. **Review Schema** - Customer reviews with ratings
2. **AggregateRating** - Add to ProductSchema when reviews exist
3. **FAQPage** - FAQ section with structured data
4. **WebSite Schema** - Enable sitelinks search box

### Medium Priority:
5. **CollectionPage** - For category pages
6. **VideoObject** - If adding product videos
7. **ImageObject** - Enhanced image metadata

---

## Troubleshooting

### Error: Type 'string' is not assignable to type 'SchemaValue<...>'

**Solution**: Use const assertions or explicit types
```tsx
// Wrong
const type = "Offer";

// Right
const type = "Offer" as const;
```

### Error: Property '...' does not exist on type

**Solution**: Use spread operator for conditional properties
```tsx
// Wrong
const obj = { name: "Test" };
if (condition) {
  obj.optional = "value"; // Error!
}

// Right
const obj = {
  name: "Test",
  ...(condition ? { optional: "value" } : {})
};
```

### Error: Element implicitly has an 'any' type

**Solution**: Add type assertions
```tsx
const obj = value as Record<string, unknown>;
```

---

## Resources

- **schema-dts GitHub**: https://github.com/google/schema-dts
- **schema.org**: https://schema.org/
- **Google Rich Results**: https://developers.google.com/search/docs/appearance/structured-data
- **Schema Validator**: https://validator.schema.org/

---

## Maintenance

### When adding new schemas:
1. Import type from `schema-dts`
2. Use `WithContext<Type>` for the schema object
3. Use `as const` for string literal types
4. Test with `npm run build`
5. Validate with Google Rich Results Test after deployment

### When updating existing schemas:
1. TypeScript will show errors if changes break the schema
2. Re-run `npm run build` to verify
3. Check Google Search Console for warnings

---

## Summary

✅ All schemas are type-safe with `schema-dts`
✅ Compile-time validation prevents errors
✅ IDE auto-completion speeds up development
✅ Production schemas guaranteed to be valid
✅ Easy to maintain and refactor

Your structured data is now enterprise-grade! 🚀
