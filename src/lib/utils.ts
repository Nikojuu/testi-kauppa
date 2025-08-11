import {
  ApiResponseProductCardType,
  OrderLineItems,
  PreOrderLineItems,
  PriceInfo,
  Product,
  ProductFromApi,
  ProductVariationFromApi,
} from "@/app/utils/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// priceUtils.ts

export const isSaleActive = (
  startDate: Date | null | undefined,
  endDate: Date | null | undefined
): boolean => {
  // If no dates are set, sale is considered active
  if (!startDate && !endDate) {
    return true;
  }

  const now = new Date();
  // Convert dates to comparable format
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // If only start date is set
  if (start && !end) {
    return now >= start;
  }

  // If only end date is set
  if (!start && end) {
    return now <= end;
  }

  // If both dates are set
  if (start && end) {
    return now >= start && now <= end;
  }

  return true;
};

export const getPriceInfo = (item: ApiResponseProductCardType): PriceInfo => {
  const convertToEuros = (cents: number | null): number | null =>
    cents !== null ? Number((cents / 100).toFixed(2)) : null;

  // Handle product without variations
  if (!item.variations || item.variations.length === 0) {
    const isActive = isSaleActive(item.saleStartDate, item.saleEndDate);

    return {
      currentPrice: convertToEuros(item.price) ?? item.price / 100,
      salePrice:
        isActive && item.salePrice ? convertToEuros(item.salePrice) : null,
      salePercent: isActive && item.salePrice ? item.salePercent || null : null,
      isOnSale: isActive && !!item.salePrice,
    };
  }

  // Find variation with lowest effective price among active sales
  const variations = item.variations.map((variation) => {
    const isActive = isSaleActive(
      variation.saleStartDate,
      variation.saleEndDate
    );

    return {
      currentPrice: convertToEuros(variation.price ?? null) || 0,
      salePrice:
        isActive && variation.salePrice
          ? convertToEuros(variation.salePrice)
          : null,
      salePercent:
        isActive && variation.salePrice ? variation.salePercent || null : null,
      isOnSale: isActive && !!variation.salePrice,
    };
  });

  // Find the variation with the lowest effective price
  const lowestPriceVariation = variations.reduce((lowest, current) => {
    const currentEffectivePrice = current.salePrice || current.currentPrice;
    const lowestEffectivePrice = lowest.salePrice || lowest.currentPrice;
    return currentEffectivePrice < lowestEffectivePrice ? current : lowest;
  });

  return lowestPriceVariation;
};

export const getDisplayPriceSelectedProduct = (
  product: ProductFromApi,
  variation?: ProductVariationFromApi
) => {
  if (variation) {
    // Handle variation-specific pricing logic
    const isVariationOnSale =
      isSaleActive(variation.saleStartDate, variation.saleEndDate) &&
      variation.salePrice !== null;
    return isVariationOnSale
      ? (variation.salePrice ?? 0) / 100
      : (variation.price ?? 0) / 100;
  }

  // Fallback to product-level pricing logic
  const isProductOnSale =
    isSaleActive(product.saleStartDate, product.saleEndDate) &&
    product.salePrice !== null;
  return isProductOnSale && product.salePrice !== null
    ? product.salePrice / 100
    : product.price / 100;
};

export const OPEN_GRAPH_IMAGE = "/kuva1.jpg";
export const TWITTER_IMAGE = "/kuva2.jpg";

// export function calculateAverageVat(
//   items: OrderLineItems[] | PreOrderLineItems[]
// ): number {
//   const nonShippingItems = items.filter((item) => item.itemType !== "SHIPPING");

//   let totalVAT = 0;
//   let totalPrice = 0;

//   for (const item of nonShippingItems) {
//     totalVAT += item.price * item.quantity * (item.vatRate / 100);
//     totalPrice += item.price * item.quantity;
//   }

//   return totalPrice === 0 ? 0 : (totalVAT / totalPrice) * 100;
// }
