import { cache } from "react";
import { StoreConfig } from "@/app/utils/types";

export const getStoreConfig = cache(async (): Promise<StoreConfig> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/store-config`,
    {
      headers: { "x-api-key": process.env.STOREFRONT_API_KEY || "" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch store config");
  }

  return res.json();
});
