import {
  SelectedProduct,
  SelectedProductVariation,
} from "@/components/Product/ProductDetail";
import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product: SelectedProduct;
  cartQuantity: number;
  variation?: SelectedProductVariation;
};

type CartState = {
  items: CartItem[];
  addItem: (
    product: SelectedProduct,

    variation?: SelectedProductVariation
  ) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, variation) =>
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex !== -1) {
            // If the product already exists in the cart, increment the quantity
            const updatedItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, cartQuantity: item.cartQuantity + 1 }
                : item
            );
            return { items: updatedItems };
          } else {
            // If the product does not exist in the cart, add it with a quantity of 1
            return {
              items: [...state.items, { product, variation, cartQuantity: 1 }],
            };
          }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
      incrementQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === id
              ? { ...item, cartQuantity: item.cartQuantity + 1 }
              : item
          ),
        })),
      decrementQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === id && item.cartQuantity > 1
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
