import { PriceInfo, Product } from "@/app/utils/types";
import { SelectedProduct } from "@/components/Product/ProductDetail";
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

export const getPriceInfo = (item: Product): PriceInfo => {
  // Handle product without variations
  if (!item.ProductVariation || item.ProductVariation.length === 0) {
    const isActive = isSaleActive(item.saleStartDate, item.saleEndDate);

    return {
      currentPrice: item.price,
      salePrice: isActive && item.salePrice ? item.salePrice : null,
      salePercent: isActive && item.salePrice ? item.salePercent || null : null,
      isOnSale: isActive && !!item.salePrice,
    };
  }

  // Find variation with lowest effective price among active sales
  const variations = item.ProductVariation.map((variation) => {
    const isActive = isSaleActive(
      variation.saleStartDate,
      variation.saleEndDate
    );

    return {
      currentPrice: variation.price || 0,
      salePrice: isActive && variation.salePrice ? variation.salePrice : null,
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
  product: SelectedProduct,
  variation?: {
    price: number | null;
    salePrice: number | null;
    saleStartDate: Date | null;
    saleEndDate: Date | null;
  }
) => {
  if (variation) {
    // Handle variation-specific pricing logic
    const isVariationOnSale =
      isSaleActive(variation.saleStartDate, variation.saleEndDate) &&
      variation.salePrice !== null;
    return isVariationOnSale ? variation.salePrice : variation.price;
  }

  // Fallback to product-level pricing logic
  const isProductOnSale =
    isSaleActive(product.saleStartDate, product.saleEndDate) &&
    product.salePrice !== null;
  return isProductOnSale ? product.salePrice : product.price;
};

export const OPEN_GRAPH_IMAGE = "/kuva1.jpg";
export const TWITTER_IMAGE = "/kuva2.jpg";
