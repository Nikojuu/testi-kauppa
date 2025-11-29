import { cache } from "react";
import { StoreConfig } from "@/app/utils/types";

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
