import { cache } from "react";
import { StoreConfig } from "@/app/utils/types";

/**
 * Generic fallback values for SEO when backend data is not available
 * These ensure the site always has basic metadata even if the API fails
 */
export const SEO_FALLBACKS = {
  title: "Verkkokauppa",
  description: "Laadukkaat tuotteet verkossa - löydä suosikkisi helposti",
  storeName: "Verkkokauppa",
  domain: process.env.NEXT_PUBLIC_BASE_URL || "https://example.com",
  city: "Helsinki",
  country: "FI",
  priceRange: "€€",
  businessType: "Verkkokauppa",
  logoUrl: "/logo.svg",
  openGraphImage: "/og-image.jpg",
  twitterImage: "/twitter-image.jpg",
} as const;

/**
 * Helper to get SEO-safe values with fallbacks
 */
export function getSEOValue<T>(value: T | null | undefined, fallback: T): T {
  return value ?? fallback;
}

export const getStoreConfig = cache(async (): Promise<StoreConfig> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/store-config`,
    {
      headers: { "x-api-key": process.env.STOREFRONT_API_KEY || "" },
      // Cache the response for 5 minutes on Next.js's data cache
      // This means even across page navigations, the same cached data is used
      // After 5 minutes, the cache is revalidated to get fresh data
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch store config");
  }

  return res.json();
});
