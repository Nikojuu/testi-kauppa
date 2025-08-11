"use client";

import { Campaign } from "@/app/utils/types";
import { Button } from "@/components/ui/button";
import { isSaleActive } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import ImageKitImage from "../ImageKitImage";
import { useCart } from "@/hooks/use-cart";
import { CampaignCalculatedItem } from "@/hooks/use-campaign-cart";

export const CampaignAddedCartItems = ({
  buyXPayYCampaign,
  calculatedItems,
}: {
  buyXPayYCampaign: Campaign | undefined;
  calculatedItems: CampaignCalculatedItem[];
}) => {
  const incrementQuantity = useCart((state) => state.incrementQuantity);
  const decrementQuantity = useCart((state) => state.decrementQuantity);
  const removeItem = useCart((state) => state.removeItem);

  return (
    <>
      {calculatedItems.map(({ item, paidQuantity, freeQuantity }, i) => {
        const { product, variation, cartQuantity } = item;

        // Determine if the stock is unlimited or out of stock
        const isUnlimitedStock = variation
          ? variation.quantity === null
          : product.quantity === null;

        const isOutOfStock = variation
          ? !isUnlimitedStock && (variation.quantity ?? 0) <= cartQuantity
          : !isUnlimitedStock && (product.quantity ?? 0) <= cartQuantity;

        // Get current price for display
        let displayPrice = product.price;
        let salePrice = null;
        let isOnSale = false;

        if (variation) {
          isOnSale = isSaleActive(
            variation.saleStartDate ?? product.saleStartDate,
            variation.saleEndDate ?? product.saleEndDate
          );
          displayPrice =
            variation.price !== null ? variation.price : product.price;
          salePrice = variation.salePrice;
        } else {
          isOnSale = isSaleActive(product.saleStartDate, product.saleEndDate);
          salePrice = product.salePrice;
        }

        return (
          <li className="flex py-6 sm:py-10" key={i}>
            <div className="flex-shrink-0">
              <div className="relative h-24 w-24">
                <ImageKitImage
                  src={variation?.images[0] || product.images[0]}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="h-full w-full rounded-md object-cover object-center "
                  transformations="w-96,h-96"
                  quality={90}
                />
              </div>
            </div>
            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
              <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-sm">
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-medium text-gray-700 hover:text-gray-800"
                      >
                        {product.name}
                      </Link>
                    </h3>
                  </div>

                  {/* Price display - moved up for better prominence */}
                  <div className="mt-2 text-base font-semibold">
                    {isOnSale && salePrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-red-600 text-lg">
                          {salePrice / 100} €
                        </span>
                        <span className="line-through text-gray-400 text-sm">
                          {displayPrice / 100}€
                        </span>
                        <span className="bg-red-100 text-red-500 text-xs px-2 py-1 rounded-full">
                          ALE
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-900">
                        {displayPrice / 100} €
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        decrementQuantity(product.id, variation?.id)
                      }
                      disabled={cartQuantity === 1}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <span className="w-8 text-center">{cartQuantity || 0}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        incrementQuantity(product.id, variation?.id)
                      }
                      disabled={isOutOfStock}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>

                  {variation && (
                    <span className="text-xs text-muted-foreground space-y-0.5">
                      {variation.options.map((opt) => (
                        <div key={`${opt.optionType.name}-${opt.value}`}>
                          {opt.optionType.name}: {opt.value}
                        </div>
                      ))}
                    </span>
                  )}

                  {/* Campaign info display */}
                  {freeQuantity > 0 && (
                    <div className="mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">
                          Maksat: {paidQuantity} kpl
                        </span>
                        <span className="text-green-600 font-medium">
                          Ilmainen: {freeQuantity} kpl
                        </span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        🎉 Kampanja: Osta{" "}
                        {buyXPayYCampaign?.BuyXPayYCampaign?.buyQuantity}, maksa{" "}
                        {buyXPayYCampaign?.BuyXPayYCampaign?.payQuantity}
                      </div>

                      {/* Campaign pricing breakdown */}
                      <div className="text-xs text-gray-600 mt-1">
                        {paidQuantity > 0 && (
                          <span>
                            {paidQuantity} ×{" "}
                            {(isOnSale && salePrice
                              ? salePrice
                              : displayPrice) / 100}
                            €
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                  <div className="absolute right-0 top-0">
                    <Button
                      aria-label="remove product"
                      onClick={() => removeItem(product.id, variation?.id)}
                      variant="ghost"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </>
  );
};
