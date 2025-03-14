"use client";

import { useCart } from "@/hooks/use-cart";
import { X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { getDisplayPriceSelectedProduct } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImageKitImage from "../ImageKitImage";
import { ProductFromApi, ProductVariationFromApi } from "@/app/utils/types";

type CartItemProps = {
  product: ProductFromApi;
  variation?: ProductVariationFromApi;
};

export default function CartItem({ product, variation }: CartItemProps) {
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

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            <ImageKitImage
              src={variation?.images?.[0] ?? product.images[0]}
              alt={product.name}
              width={64}
              height={64}
              className="absolute object-cover"
              transformations="w-64,h-64"
              quality={90}
            />
          </div>
          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </span>
            {variation && (
              <span className="text-xs text-muted-foreground space-y-0.5">
                {variation.options.map((opt) => (
                  <div key={`${opt.optionType.name}-${opt.value}`}>
                    {opt.optionType.name}: {opt.value}
                  </div>
                ))}
              </span>
            )}
            <div className="mt-2 flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => decrementQuantity(product.id, variation?.id)}
                disabled={(cartItem?.cartQuantity || 0) <= 1}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="w-8 text-center">
                {cartItem?.cartQuantity || 0}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => incrementQuantity(product.id, variation?.id)}
                disabled={
                  isOutOfStock || // Disable if out of stock
                  (!isUnlimitedStock &&
                    (cartItem?.cartQuantity || 0) >= stockQuantity) // Disable if exceeds stock
                }
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity by one</span>
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <button
                onClick={() => removeItem(product.id, variation?.id)}
                className="flex items-center gap-0.5"
              >
                <X className="w-3 h-4" />
                Poista tuote
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium text-right">
          <span className="ml-auto line-clamp-1 text-sm">
            €{getDisplayPriceSelectedProduct(product, variation)?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
