# SEO Implementation Guide

This guide shows how to implement the same SEO features from Hennan-Korukauppa into this storefront.

## Prerequisites

- Both projects use the same API endpoints and data structure
- Products have: `sku`, `salePrice`, `salePercent`, `saleStartDate`, `saleEndDate`
- Categories and products are fetched from the storefront API

---

## 1. TypeScript Types (src/app/utils/types.ts)

Ensure `ProductFromApi` includes these fields:

```typescript
export interface ProductFromApi {
  id: string;
  name: string;
  slug?: string;
  images: string[];
  price: number;
  quantity: number | null;
  description: string;
  sku?: string | null;  // ✅ Required for Product Schema
  metaTitle?: string;
  metaDescription?: string;
  salePercent: string | null;  // ✅ For Offer schema
  salePrice: number | null;
  saleStartDate: Date | null;
  saleEndDate: Date | null;
  categories: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  }[];
  variations: {
    id: string;
    sku?: string | null;  // ✅ Variation-level SKU
    price: number;
    salePrice: number | null;
    saleStartDate: Date | null;
    saleEndDate: Date | null;
    // ... other variation fields
  }[];
}
```

---

## 2. Structured Data Components

Create `src/components/StructuredData/` folder with these files:

### 2.1 OrganizationSchema.tsx

```typescript
export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "YOUR_STORE_NAME",  // 🔧 CHANGE THIS
    url: "https://YOUR_DOMAIN.com",  // 🔧 CHANGE THIS
    logo: "YOUR_LOGO_URL",  // 🔧 CHANGE THIS
    description: "YOUR_STORE_DESCRIPTION",  // 🔧 CHANGE THIS
    address: {
      "@type": "PostalAddress",
      addressCountry: "FI",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Finnish",
    },
    sameAs: [
      "https://www.instagram.com/YOUR_HANDLE",  // 🔧 CHANGE THIS
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 2.2 LocalBusinessSchema.tsx

```typescript
export default function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": "https://YOUR_DOMAIN.com/#store",  // 🔧 CHANGE THIS
    name: "YOUR_STORE_NAME",  // 🔧 CHANGE THIS
    description: "YOUR_STORE_DESCRIPTION",  // 🔧 CHANGE THIS
    url: "https://YOUR_DOMAIN.com",  // 🔧 CHANGE THIS
    logo: "YOUR_LOGO_URL",  // 🔧 CHANGE THIS
    image: "YOUR_LOGO_URL",  // 🔧 CHANGE THIS
    address: {
      "@type": "PostalAddress",
      addressLocality: "YOUR_CITY",  // 🔧 CHANGE THIS (e.g., "Helsinki")
      addressCountry: "FI",
    },
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Credit Card, Debit Card, Paytrail, Stripe",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
      description: "Verkkokauppa avoinna 24/7",
    },
    sameAs: ["https://www.instagram.com/YOUR_HANDLE"],  // 🔧 CHANGE THIS
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "YOUR_EMAIL@example.com",  // 🔧 CHANGE THIS
      availableLanguage: "Finnish",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 2.3 ProductSchema.tsx (WITH SALE SUPPORT)

```typescript
import { ProductFromApi } from "@/app/utils/types";

interface ProductSchemaProps {
  product: ProductFromApi;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
  const firstVariation = product.variations?.[0];

  // Determine prices (variation takes priority)
  const regularPrice = firstVariation?.price ?? product.price;
  const salePrice = firstVariation?.salePrice ?? product.salePrice;
  const saleStartDate = firstVariation?.saleStartDate ?? product.saleStartDate;
  const saleEndDate = firstVariation?.saleEndDate ?? product.saleEndDate;

  // Check if sale is currently active
  const now = new Date();
  const isSaleActive =
    salePrice !== null &&
    regularPrice !== null &&
    salePrice < regularPrice &&
    (saleStartDate === null || new Date(saleStartDate) <= now) &&
    (saleEndDate === null || new Date(saleEndDate) >= now);

  const displayPrice = isSaleActive && salePrice !== null ? salePrice : regularPrice;
  const priceInEuros = displayPrice ? (displayPrice / 100).toFixed(2) : "0.00";

  const quantity = firstVariation?.quantity ?? product.quantity;
  const availability =
    quantity !== null && quantity > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const sku = firstVariation?.sku || product.sku || product.id;

  const offers: any = {
    "@type": "Offer",
    price: priceInEuros,
    priceCurrency: "EUR",
    availability: availability,
    url: `https://YOUR_DOMAIN.com/product/${product.slug}`,  // 🔧 CHANGE THIS
    seller: {
      "@type": "Organization",
      name: "YOUR_STORE_NAME",  // 🔧 CHANGE THIS
    },
  };

  if (isSaleActive && saleEndDate !== null) {
    offers.priceValidUntil = new Date(saleEndDate).toISOString().split("T")[0];
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.metaDescription,
    image: product.images || [],
    brand: {
      "@type": "Brand",
      name: "YOUR_STORE_NAME",  // 🔧 CHANGE THIS
    },
    offers: offers,
    category: product.categories?.[0]?.name || "Products",
    sku: sku,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 2.4 BreadcrumbSchema.tsx

```typescript
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 2.5 CollectionPageSchema.tsx

```typescript
import { ApiResponseProductCardType } from "@/app/utils/types";

interface CollectionPageSchemaProps {
  name: string;
  description?: string;
  products: ApiResponseProductCardType[];
  categorySlug: string;
  totalCount?: number;
}

export default function CollectionPageSchema({
  name,
  description,
  products,
  categorySlug,
  totalCount,
}: CollectionPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `https://YOUR_DOMAIN.com/products/${categorySlug}`,  // 🔧 CHANGE THIS
    name: name,
    description: description || `Browse products in ${name} category`,
    url: `https://YOUR_DOMAIN.com/products/${categorySlug}`,  // 🔧 CHANGE THIS
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: totalCount || products.length,
      itemListElement: products.slice(0, 12).map((product, index) => {
        const price = product.salePrice || product.price;
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            "@id": `https://YOUR_DOMAIN.com/product/${product.slug}`,  // 🔧 CHANGE THIS
            name: product.name,
            description: product.description,
            image: product.images?.[0] || [],
            url: `https://YOUR_DOMAIN.com/product/${product.slug}`,  // 🔧 CHANGE THIS
            offers: {
              "@type": "Offer",
              price: (price / 100).toFixed(2),
              priceCurrency: "EUR",
              availability:
                product.quantity !== null && product.quantity > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              url: `https://YOUR_DOMAIN.com/product/${product.slug}`,  // 🔧 CHANGE THIS
            },
          },
        };
      }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## 3. Add to Root Layout (src/app/layout.tsx)

**IMPORTANT:** Next.js 14+ requires `viewport` and `themeColor` to be in a separate export, not in `metadata`.

```typescript
import type { Metadata, Viewport } from "next";
import OrganizationSchema from "@/components/StructuredData/OrganizationSchema";
import LocalBusinessSchema from "@/components/StructuredData/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "YOUR_STORE_NAME",  // 🔧 CHANGE THIS
  description: "YOUR_STORE_DESCRIPTION",  // 🔧 CHANGE THIS
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",  // 🔧 CHANGE THIS (from Google Search Console)
  },
};

// Separate viewport export (Next.js 14+ requirement)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },  // 🔧 CHANGE THIS
    { media: "(prefers-color-scheme: dark)", color: "#000000" },   // 🔧 CHANGE THIS
  ],
};

export default async function RootLayout({ children }) {
  return (
    <html lang="fi">
      <head>
        <OrganizationSchema />
        <LocalBusinessSchema />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 4. Add to Product Page (src/app/(storefront)/product/[slug]/page.tsx)

```typescript
import ProductSchema from "@/components/StructuredData/ProductSchema";
import BreadcrumbSchema from "@/components/StructuredData/BreadcrumbSchema";

export default async function ProductPage({ params }) {
  const product = await getProductDataFromApi(params.slug);

  const breadcrumbItems = [
    { name: "Home", url: "https://YOUR_DOMAIN.com" },  // 🔧 CHANGE THIS
    { name: "Products", url: "https://YOUR_DOMAIN.com/products" },  // 🔧 CHANGE THIS
    { name: product.name, url: `https://YOUR_DOMAIN.com/product/${params.slug}` },  // 🔧 CHANGE THIS
  ];

  return (
    <>
      <ProductSchema product={product} />
      <BreadcrumbSchema items={breadcrumbItems} />
      {/* Your product page content */}
    </>
  );
}
```

---

## 5. Add to Category Pages (src/app/(storefront)/products/[...slug]/page.tsx)

```typescript
import CollectionPageSchema from "@/components/StructuredData/CollectionPageSchema";
import BreadcrumbSchema from "@/components/StructuredData/BreadcrumbSchema";

export default async function CategoryPage({ params, searchParams }) {
  const products = await getProductsDataFromApi(params.slug);
  const categoryName = products?.name || "Products";
  const totalCount = products?.totalCount || 0;

  const breadcrumbItems = [
    { name: "Home", url: "https://YOUR_DOMAIN.com" },  // 🔧 CHANGE THIS
    { name: "Products", url: "https://YOUR_DOMAIN.com/products" },  // 🔧 CHANGE THIS
    { name: categoryName, url: `https://YOUR_DOMAIN.com/products/${params.slug.join("/")}` },  // 🔧 CHANGE THIS
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      {products && products.length > 0 && (
        <CollectionPageSchema
          name={categoryName}
          products={products}
          categorySlug={params.slug.join("/")}
          totalCount={totalCount}
        />
      )}
      {/* Your category page content */}
    </>
  );
}
```

---

## 6. Update Sitemap (src/app/sitemap.ts)

Change line with hardcoded date:

```typescript
// FROM:
lastModified: new Date(2024, 0, 1),

// TO:
lastModified: new Date(),
```

---

## 7. Checklist - Store-Specific Constants to Update

Search and replace these values across all schema files:

- [ ] `YOUR_STORE_NAME` - Store name
- [ ] `YOUR_DOMAIN.com` - Your domain (e.g., "testikauppa.fi")
- [ ] `YOUR_LOGO_URL` - Full URL to logo image
- [ ] `YOUR_STORE_DESCRIPTION` - Short description
- [ ] `YOUR_CITY` - City name for local SEO (e.g., "Helsinki")
- [ ] `YOUR_EMAIL@example.com` - Customer service email
- [ ] `https://www.instagram.com/YOUR_HANDLE` - Social media links
- [ ] `YOUR_GOOGLE_VERIFICATION_CODE` - From Google Search Console
- [ ] Theme colors in `themeColor` array

---

## 8. Testing

1. **Google Rich Results Test:**
   - https://search.google.com/test/rich-results
   - Test product and category URLs

2. **Schema Validator:**
   - https://validator.schema.org/
   - Paste your page HTML

3. **Check in Browser:**
   - View page source
   - Look for `<script type="application/ld+json">` tags

---

## Key Features Implemented

✅ **Product Schema** - Prices, availability, SKU, sale support
✅ **Organization Schema** - Business info
✅ **LocalBusiness Schema** - Local SEO, contact info
✅ **CollectionPage Schema** - Category pages
✅ **Breadcrumb Schema** - Navigation
✅ **Offer Schema** - Active sale validation with dates
✅ **Viewport & Theme Colors** - Mobile optimization
✅ **Dynamic Sitemap** - Current dates for static pages

---

## Notes

- All schemas use **type-safe** TypeScript
- Sale prices are **validated** (checks dates, price comparison)
- Prices converted from **cents to euros** (÷ 100)
- SKU **fallback chain**: variation SKU → product SKU → product ID
- Handles **nullable fields** properly (quantity, salePrice, etc.)
