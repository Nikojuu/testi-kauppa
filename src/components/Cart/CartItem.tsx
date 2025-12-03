"use client";

import { useCart } from "@/hooks/use-cart";
import { X, Plus, Minus } from "lucide-react";
import { isSaleActive } from "@/lib/utils";
import ImageKitImage from "../ImageKitImage";
import { ProductFromApi, ProductVariationFromApi } from "@/app/utils/types";

type CartItemProps = {
  product: ProductFromApi;
  variation?: ProductVariationFromApi;
  paidQuantity?: number;
  freeQuantity?: number;
};

export default function CartItem({
  product,
  variation,
  paidQuantity,
  freeQuantity,
}: CartItemProps) {
  const removeItem = useCart((state) => state.removeItem);
  const incrementQuantity = useCart((state) => state.incrementQuantity);
  const decrementQuantity = useCart((state) => state.decrementQuantity);
  const cartItem = useCart((state) =>
    state.items.find((item) =>
      variation
        ? item.product.id === product.id && item.variation?.id === variation.id
        : item.product.id === product.id
    )
  );

  // Determine stock logic based on variation or product
  const stockQuantity =
    variation?.quantity !== undefined ? variation.quantity : product.quantity;

  const isUnlimitedStock = stockQuantity === null;
  const isOutOfStock = stockQuantity === 0;

  // Use campaign quantities if provided, otherwise fall back to cart quantity
  const displayQuantity = cartItem?.cartQuantity || 0;
  const hasCampaignData =
    paidQuantity !== undefined && freeQuantity !== undefined;

  // Sale price logic
  let displayPrice = product.price;
  let salePrice = null;
  let isOnSale = false;

  if (variation) {
    isOnSale = isSaleActive(
      variation.saleStartDate ?? product.saleStartDate,
      variation.saleEndDate ?? product.saleEndDate
    );
    displayPrice = variation.price !== null ? variation.price : product.price;
    salePrice = variation.salePrice;
  } else {
    isOnSale = isSaleActive(product.saleStartDate, product.saleEndDate);
    salePrice = product.salePrice;
  }

  return (
    <div className="relative p-4 bg-cream/30 border border-rose-gold/10">
      {/* Small corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-rose-gold/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-rose-gold/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-rose-gold/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-rose-gold/30" />

      <div className="flex gap-4">
        {/* Product image */}
        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-warm-white">
          <ImageKitImage
            src={variation?.images?.[0] ?? product.images[0]}
            alt={product.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
            transformations="w-80,h-80"
            quality={90}
          />
        </div>

        {/* Product details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-secondary text-sm text-charcoal line-clamp-1 mb-1">
            {product.name}
          </h4>

          {/* Variation options */}
          {variation && (
            <div className="space-y-0.5 mb-2">
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

          {/* Campaign info */}
          {hasCampaignData && freeQuantity > 0 && (
            <div className="flex items-center gap-2 text-xs font-secondary mb-2">
              <span className="text-charcoal/60">Maksat: {paidQuantity}</span>
              <span className="text-rose-gold">Ilmainen: {freeQuantity}</span>
            </div>
          )}

          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => decrementQuantity(product.id, variation?.id)}
              disabled={displayQuantity <= 1}
              className="w-7 h-7 flex items-center justify-center border border-charcoal/20 text-charcoal/70 transition-colors duration-300 hover:border-rose-gold hover:text-rose-gold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-secondary text-charcoal">
              {displayQuantity}
            </span>
            <button
              onClick={() => incrementQuantity(product.id, variation?.id)}
              disabled={
                isOutOfStock ||
                (!isUnlimitedStock && displayQuantity >= stockQuantity)
              }
              className="w-7 h-7 flex items-center justify-center border border-charcoal/20 text-charcoal/70 transition-colors duration-300 hover:border-rose-gold hover:text-rose-gold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Price and remove */}
        <div className="flex flex-col items-end justify-between">
          {/* Price */}
          <div className="text-right">
            {isOnSale && salePrice ? (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-secondary text-deep-burgundy font-medium">
                    {(salePrice / 100).toFixed(2)} €
                  </span>
                  <span className="text-[10px] font-secondary bg-deep-burgundy/10 text-deep-burgundy px-1.5 py-0.5">
                    ALE
                  </span>
                </div>
                <span className="text-xs font-secondary text-charcoal/40 line-through">
                  {(displayPrice / 100).toFixed(2)} €
                </span>
              </>
            ) : (
              <span className="text-sm font-secondary text-charcoal">
                {(displayPrice / 100).toFixed(2)} €
              </span>
            )}

            {/* Campaign pricing breakdown */}
            {hasCampaignData && freeQuantity > 0 && (
              <div className="text-[10px] font-secondary text-charcoal/50 mt-1">
                {paidQuantity > 0 && (
                  <p>
                    {paidQuantity} ×{" "}
                    {(
                      (isOnSale && salePrice ? salePrice : displayPrice) / 100
                    ).toFixed(2)}{" "}
                    €
                  </p>
                )}
                {freeQuantity > 0 && (
                  <p className="text-rose-gold">{freeQuantity} × 0.00 €</p>
                )}
              </div>
            )}
          </div>

          {/* Remove button */}
          <button
            onClick={() => removeItem(product.id, variation?.id)}
            className="flex items-center gap-1 text-xs font-secondary text-charcoal/50 transition-colors duration-300 hover:text-deep-burgundy"
          >
            <X className="w-3 h-3" />
            <span>Poista</span>
          </button>
        </div>
      </div>
    </div>
  );
}
