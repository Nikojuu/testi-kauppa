import { Product, WithContext } from "schema-dts";
import { ProductFromApi } from "@/app/utils/types";
import { STORE_NAME, STORE_DOMAIN } from "@/app/utils/constants";

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
  const availability: "https://schema.org/InStock" | "https://schema.org/OutOfStock" =
    quantity !== null && quantity > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  // Use product ID as SKU fallback (TODO: add sku field to database)
  const sku = product.id;

  const offers: any = {
    "@type": "Offer" as const,
    price: priceInEuros,
    priceCurrency: "EUR",
    availability: availability,
    url: `${STORE_DOMAIN}/product/${product.slug}`,
    seller: {
      "@type": "Organization" as const,
      name: STORE_NAME,
    },
  };

  if (isSaleActive && saleEndDate !== null) {
    offers.priceValidUntil = new Date(saleEndDate).toISOString().split("T")[0];
  }

  const schema: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.metaDescription || "",
    image: product.images || [],
    brand: {
      "@type": "Brand",
      name: STORE_NAME,
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
