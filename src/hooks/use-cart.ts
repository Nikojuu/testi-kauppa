"use client";

import { ProductFromApi, ProductVariationFromApi } from "@/app/utils/types";
import { create } from "zustand";
import {
  apiFetchCart,
  apiAddToCart,
  apiUpdateCartQuantity,
  apiRemoveFromCart,
  apiValidateCart,
  ValidateCartResponse,
} from "@/lib/actions/cartActions";

export type CartItem = {
  product: ProductFromApi;
  cartQuantity: number;
  variation?: ProductVariationFromApi;
};

type CartState = {
  items: CartItem[];
  loading: boolean;

  // Sync with Redis
  syncWithBackend: () => Promise<void>;

  // Cart operations (all call server actions)
  addItem: (
    product: ProductFromApi,
    variation?: ProductVariationFromApi
  ) => Promise<void>;

  removeItem: (productId: string, variationId?: string) => Promise<void>;

  incrementQuantity: (productId: string, variationId?: string) => Promise<void>;

  decrementQuantity: (productId: string, variationId?: string) => Promise<void>;

  validateCart: () => Promise<ValidateCartResponse>;
};

export const useCart = create<CartState>()((set, get) => ({
  items: [],
  loading: false,

  // Load cart from Redis
  syncWithBackend: async () => {
    set({ loading: true });
    try {
      const data = await apiFetchCart();
      set({ items: data.items, loading: false });
    } catch (error) {
      console.error("Failed to sync cart:", error);
      set({ loading: false });
    }
  },

  // Add item to cart
  addItem: async (product, variation) => {
    set({ loading: true });
    try {
      const data = await apiAddToCart(product.id, variation?.id, 1);
      set({ items: data.items, loading: false });
    } catch (error) {
      console.error("Failed to add item:", error);
      set({ loading: false });
      throw error;
    }
  },

  // Remove item from cart
  removeItem: async (productId, variationId) => {
    set({ loading: true });
    try {
      const data = await apiRemoveFromCart(productId, variationId);
      set({ items: data.items, loading: false });
    } catch (error) {
      console.error("Failed to remove item:", error);
      set({ loading: false });
      throw error;
    }
  },

  // Increment quantity (optimistic update)
  incrementQuantity: async (productId, variationId) => {
    const previousItems = get().items;

    // Optimistic: update UI immediately
    set({
      items: previousItems.map((item) =>
        item.product.id === productId && item.variation?.id === variationId
          ? { ...item, cartQuantity: item.cartQuantity + 1 }
          : item
      ),
    });

    try {
      const data = await apiUpdateCartQuantity(
        productId,
        +1, // Delta: increment by 1
        variationId
      );
      // Sync with server truth
      set({ items: data.items });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Rollback on error
      set({ items: previousItems });
      throw error;
    }
  },

  // Decrement quantity (optimistic update)
  decrementQuantity: async (productId, variationId) => {
    const previousItems = get().items;

    // Optimistic: update UI immediately
    set({
      items: previousItems.map((item) =>
        item.product.id === productId && item.variation?.id === variationId
          ? { ...item, cartQuantity: item.cartQuantity - 1 }
          : item
      ),
    });

    try {
      const data = await apiUpdateCartQuantity(
        productId,
        -1, // Delta: decrement by 1
        variationId
      );
      // Sync with server truth
      set({ items: data.items });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Rollback on error
      set({ items: previousItems });
      throw error;
    }
  },

  // Validate cart before checkout
  validateCart: async () => {
    set({ loading: true });
    try {
      const data = await apiValidateCart();
      set({ items: data.items, loading: false });
      return data;
    } catch (error) {
      console.error("Failed to validate cart:", error);
      set({ loading: false });
      throw error;
    }
  },
}));
