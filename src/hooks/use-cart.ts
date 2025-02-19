import { ProductFromApi, ProductVariationFromApi } from "@/app/utils/types";
import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product: ProductFromApi;
  cartQuantity: number;
  variation?: ProductVariationFromApi;
};

type CartState = {
  items: CartItem[];
  addItem: (
    product: ProductFromApi,

    variation?: ProductVariationFromApi
  ) => void;
  removeItem: (productId: string, variationId: string | undefined) => void;
  clearCart: () => void;
  incrementQuantity: (
    productId: string,
    variationId: string | undefined
  ) => void;
  decrementQuantity: (
    productId: string,
    variationId: string | undefined
  ) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, variation) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.variation?.id === variation?.id // Compare variation ID as well
          );

          if (existingItemIndex !== -1) {
            // If the product with the same variation exists, increment the quantity
            const updatedItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, cartQuantity: item.cartQuantity + 1 }
                : item
            );
            return { items: updatedItems };
          } else {
            // Add a new item to the cart with the selected variation
            return {
              items: [...state.items, { product, variation, cartQuantity: 1 }],
            };
          }
        }),
      removeItem: (id, variationId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              item.product.id !== id ||
              (variationId && item.variation?.id !== variationId)
          ),
        })),
      clearCart: () => set({ items: [] }),

      incrementQuantity: (id, variationId) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.product.id === id && item.variation?.id === variationId
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item
          ),
        })),

      decrementQuantity: (id, variationId) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.product.id === id &&
            item.variation?.id === variationId &&
            item.cartQuantity > 1
              ? { ...item, cartQuantity: item.cartQuantity - 1 }
              : item
          ),
        })),
    }),

    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
