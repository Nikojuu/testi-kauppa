"use client";

import { Campaign } from "@/app/utils/types";
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
          <div
            key={i}
            className="relative p-4 md:p-6 bg-cream/30 border border-rose-gold/10"
          >
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-rose-gold/30" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-rose-gold/30" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-rose-gold/30" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-rose-gold/30" />

            <div className="flex gap-4 md:gap-6">
              {/* Product image */}
              {product.slug ? (
                <Link
                  href={`/product/${product.slug}`}
                  className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden bg-warm-white group"
                >
                  <ImageKitImage
                    src={variation?.images[0] || product.images[0]}
                    alt={product.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    transformations="w-128,h-128"
                    quality={90}
                  />
                </Link>
              ) : (
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 overflow-hidden bg-warm-white">
                  <ImageKitImage
                    src={variation?.images[0] || product.images[0]}
                    alt={product.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    transformations="w-128,h-128"
                    quality={90}
                  />
                </div>
              )}

              {/* Product details */}
              <div className="flex-1 min-w-0">
                {/* Product name */}
                {product.slug ? (
                  <Link
                    href={`/product/${product.slug}`}
                    className="block font-secondary text-sm md:text-base text-charcoal hover:text-rose-gold transition-colors duration-300 line-clamp-2 mb-2"
                  >
                    {product.name}
                  </Link>
                ) : (
                  <span className="block font-secondary text-sm md:text-base text-charcoal line-clamp-2 mb-2">
                    {product.name}
                  </span>
                )}

                {/* Variation options */}
                {variation && (
                  <div className="space-y-0.5 mb-3">
                    {variation.options.map((opt) => (
                      <p
                        key={`${opt.optionType.name}-${opt.value}`}
                        className="text-xs font-secondary text-charcoal/50"
                      >
                        {opt.optionType.name}: {opt.value}
                      </p>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="mb-3">
                  {isOnSale && salePrice ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-secondary text-deep-burgundy font-medium">
                        {(salePrice / 100).toFixed(2)} €
                      </span>
                      <span className="text-xs font-secondary text-charcoal/40 line-through">
                        {(displayPrice / 100).toFixed(2)} €
                      </span>
                      <span className="text-xs font-secondary bg-deep-burgundy/10 text-deep-burgundy px-2 py-0.5">
                        ALE
                      </span>
                    </div>
                  ) : (
                    <span className="text-base font-secondary text-charcoal">
                      {(displayPrice / 100).toFixed(2)} €
                    </span>
                  )}
                </div>

                {/* Quantity controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decrementQuantity(product.id, variation?.id)}
                    disabled={cartQuantity === 1}
                    className="w-8 h-8 flex items-center justify-center border border-charcoal/20 text-charcoal/70 transition-colors duration-300 hover:border-rose-gold hover:text-rose-gold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                    <span className="sr-only">Vähennä määrää</span>
                  </button>
                  <span className="w-8 text-center text-sm font-secondary text-charcoal">
                    {cartQuantity || 0}
                  </span>
                  <button
                    onClick={() => incrementQuantity(product.id, variation?.id)}
                    disabled={isOutOfStock}
                    className="w-8 h-8 flex items-center justify-center border border-charcoal/20 text-charcoal/70 transition-colors duration-300 hover:border-rose-gold hover:text-rose-gold disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="sr-only">Lisää määrää</span>
                  </button>
                </div>

                {/* Campaign info */}
                {freeQuantity > 0 && (
                  <div className="mt-3 p-2 bg-soft-blush/30 border border-rose-gold/15">
                    <div className="flex items-center gap-3 text-xs font-secondary">
                      <span className="text-charcoal/70">
                        Maksat: {paidQuantity} kpl
                      </span>
                      <span className="text-rose-gold font-medium">
                        Ilmainen: {freeQuantity} kpl
                      </span>
                    </div>
                    <p className="text-xs font-secondary text-charcoal/50 mt-1">
                      Kampanja: Osta {buyXPayYCampaign?.BuyXPayYCampaign?.buyQuantity}, maksa{" "}
                      {buyXPayYCampaign?.BuyXPayYCampaign?.payQuantity}
                    </p>
                  </div>
                )}
              </div>

              {/* Remove button */}
              <button
                aria-label="Poista tuote"
                onClick={() => removeItem(product.id, variation?.id)}
                className="self-start p-2 text-charcoal/40 hover:text-deep-burgundy transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};
