import { useMemo } from "react";
import { CartItem } from "./use-cart";
import { Campaign } from "@/app/utils/types";
import { isSaleActive } from "@/lib/utils";

// Types for campaign calculations
interface EligibleUnit {
  price: number;
  productId: string;
  variationId?: string;
  originalItem: CartItem;
}

export interface CampaignCalculatedItem {
  item: CartItem;
  paidQuantity: number;
  freeQuantity: number;
  totalQuantity: number;
}

export interface FreeShippingStatus {
  isEligible: boolean;
  minimumSpend: number;
  remainingAmount: number;
  campaignName?: string;
}

export interface CampaignCartCalculation {
  calculatedItems: CampaignCalculatedItem[];
  cartTotal: number;
  originalTotal: number;
  totalSavings: number;
  freeShipping: FreeShippingStatus;
}

export function useCampaignCart(
  items: CartItem[],
  buyXPayYCampaign?: Campaign,
  freeShippingCampaign?: Campaign
): CampaignCartCalculation {
  return useMemo((): CampaignCartCalculation => {
    // Calculate original total (without campaign discounts)
    const originalTotal = items.reduce(
      (total, { product, variation, cartQuantity }) => {
        let effectivePrice: number;

        if (variation) {
          // Handle variation-specific pricing logic
          const isVariationOnSale =
            isSaleActive(variation.saleStartDate, variation.saleEndDate) &&
            variation.salePrice !== null;
          effectivePrice = isVariationOnSale
            ? (variation.salePrice ?? product.price) / 100
            : (variation.price ?? product.price) / 100;
        } else {
          // Handle product-level pricing logic
          const isProductOnSale =
            isSaleActive(product.saleStartDate, product.saleEndDate) &&
            product.salePrice !== null;
          effectivePrice = isProductOnSale
            ? (product.salePrice ?? product.price) / 100
            : product.price / 100;
        }

        // Multiply effective price by cart quantity
        return total + effectivePrice * (cartQuantity || 1);
      },
      0
    );

    if (!buyXPayYCampaign?.BuyXPayYCampaign) {
      // No Buy X Pay Y campaign, return items as-is with no free quantities
      const calculatedItems = items.map((item) => ({
        item,
        paidQuantity: item.cartQuantity,
        freeQuantity: 0,
        totalQuantity: item.cartQuantity,
      }));

      // Calculate free shipping status using the original total (no discounts applied)
      const freeShipping: FreeShippingStatus = (() => {
        if (!freeShippingCampaign?.FreeShippingCampaign) {
          return {
            isEligible: false,
            minimumSpend: 0,
            remainingAmount: 0,
          };
        }

        const minimumSpend =
          freeShippingCampaign.FreeShippingCampaign.minimumSpend; // Already in euros
        const isEligible = originalTotal >= minimumSpend;
        const remainingAmount = isEligible ? 0 : minimumSpend - originalTotal;

        return {
          isEligible,
          minimumSpend,
          remainingAmount,
          campaignName: freeShippingCampaign.name,
        };
      })();

      return {
        calculatedItems,
        cartTotal: originalTotal,
        originalTotal,
        totalSavings: 0,
        freeShipping,
      };
    }

    const { buyQuantity, payQuantity, applicableCategories } =
      buyXPayYCampaign.BuyXPayYCampaign;
    const applicableCategoryIds = new Set(
      applicableCategories.map((c) => c.id)
    );

    // Find all individual units eligible for the campaign
    const eligibleUnits: EligibleUnit[] = items.flatMap((item) => {
      const { product, variation } = item;
      const itemCategories = product.categories?.map((cat) => cat.id) || [];

      // Check if any of the product's categories are in the campaign's list
      const isEligible = itemCategories.some((id) =>
        applicableCategoryIds.has(id)
      );

      if (isEligible) {
        // Get current price (considering sales and variations)
        let currentPrice = product.price;

        if (variation) {
          const isOnSale = isSaleActive(
            variation.saleStartDate,
            variation.saleEndDate
          );
          currentPrice =
            isOnSale && variation.salePrice
              ? variation.salePrice
              : (variation.price ?? currentPrice);
        } else {
          const isOnSale = isSaleActive(
            product.saleStartDate,
            product.saleEndDate
          );
          currentPrice =
            isOnSale && product.salePrice ? product.salePrice : currentPrice;
        }

        // Create an entry for each single unit of the item
        return Array.from({ length: item.cartQuantity }, () => ({
          price: currentPrice,
          productId: product.id,
          variationId: variation?.id,
          originalItem: item,
        }));
      }

      return [];
    });

    // Check if campaign applies
    if (eligibleUnits.length < buyQuantity) {
      // Not enough eligible items, return original quantities
      const calculatedItems = items.map((item) => ({
        item,
        paidQuantity: item.cartQuantity,
        freeQuantity: 0,
        totalQuantity: item.cartQuantity,
      }));

      // Calculate free shipping status using the original total (no Buy X Pay Y discounts applied)
      const freeShipping: FreeShippingStatus = (() => {
        if (!freeShippingCampaign?.FreeShippingCampaign) {
          return {
            isEligible: false,
            minimumSpend: 0,
            remainingAmount: 0,
          };
        }

        const minimumSpend =
          freeShippingCampaign.FreeShippingCampaign.minimumSpend; // Already in euros
        const isEligible = originalTotal >= minimumSpend;
        const remainingAmount = isEligible ? 0 : minimumSpend - originalTotal;

        return {
          isEligible,
          minimumSpend,
          remainingAmount,
          campaignName: freeShippingCampaign.name,
        };
      })();

      return {
        calculatedItems,
        cartTotal: originalTotal,
        originalTotal,
        totalSavings: 0,
        freeShipping,
      };
    }

    // Sort by price to find the cheapest items to make free
    eligibleUnits.sort((a, b) => a.price - b.price);

    const numToMakeFree = buyQuantity - payQuantity;
    const itemsToMakeFree = eligibleUnits.slice(0, numToMakeFree);

    // Calculate total savings from free items
    const totalSavings = itemsToMakeFree.reduce(
      (sum, item) => sum + item.price / 100,
      0
    );

    // Create a map to count how many units of each product/variation should be free
    const freeCountMap = new Map<string, number>();
    for (const freebie of itemsToMakeFree) {
      const key = `${freebie.productId}${freebie.variationId ? `_${freebie.variationId}` : ""}`;
      freeCountMap.set(key, (freeCountMap.get(key) || 0) + 1);
    }

    // Calculate paid and free quantities for each item
    const calculatedItems = items.map((item) => {
      const key = `${item.product.id}${item.variation?.id ? `_${item.variation.id}` : ""}`;
      const freeQuantity = freeCountMap.get(key) || 0;
      const paidQuantity = item.cartQuantity - freeQuantity;

      return {
        item,
        paidQuantity: Math.max(0, paidQuantity),
        freeQuantity,
        totalQuantity: item.cartQuantity,
      };
    });

    // Calculate final cart total after Buy X Pay Y discounts
    const cartTotal = originalTotal - totalSavings;

    // Calculate free shipping status using the final cart total (including Buy X Pay Y discounts)
    const freeShipping: FreeShippingStatus = (() => {
      if (!freeShippingCampaign?.FreeShippingCampaign) {
        return {
          isEligible: false,
          minimumSpend: 0,
          remainingAmount: 0,
        };
      }

      const minimumSpend =
        freeShippingCampaign.FreeShippingCampaign.minimumSpend; // Already in euros
      const isEligible = cartTotal >= minimumSpend;
      const remainingAmount = isEligible ? 0 : minimumSpend - cartTotal;

      return {
        isEligible,
        minimumSpend,
        remainingAmount,
        campaignName: freeShippingCampaign.name,
      };
    })();

    return {
      calculatedItems,
      cartTotal,
      originalTotal,
      totalSavings,
      freeShipping,
    };
  }, [items, buyXPayYCampaign, freeShippingCampaign]);
}
