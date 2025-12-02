"use server";

import { CartItem } from "@/hooks/use-cart";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_STOREFRONT_API_URL;
const API_KEY = process.env.STOREFRONT_API_KEY;

/**
 * Get headers for cart API requests
 */
async function getCartHeaders() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cart-id")?.value;
  const sessionId = cookieStore.get("session-id")?.value;

  return {
    "x-api-key": API_KEY || "",
    "Content-Type": "application/json",
    ...(cartId && { "x-cart-id": cartId }),
    ...(sessionId && { "x-session-id": sessionId }),
  };
}

/**
 * Fetch cart from backend
 */
export async function apiFetchCart() {
  const headers = await getCartHeaders();

  const response = await fetch(`${API_URL}/api/storefront/v1/cart`, {
    headers,
  });

  if (!response.ok) {
    return { items: [], cartId: null };
  }

  const data = await response.json();

  // Store cartId in cookie if returned (guest users)
  if (data.cartId) {
    const cookieStore = await cookies();
    cookieStore.set("cart-id", data.cartId, {
      maxAge: 60 * 60 * 24 * 10, // 10 days
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return data;
}

/**
 * Add item to cart
 */
export async function apiAddToCart(
  productId: string,
  variationId?: string,
  quantity: number = 1
) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cart-id")?.value;
  const headers = await getCartHeaders();

  const response = await fetch(`${API_URL}/api/storefront/v1/cart`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      cartId,
      productId,
      variationId,
      quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    const errorObj = new Error(error.error || "Failed to add to cart");
    // Attach error code for specific handling
    (errorObj as any).code = error.code;
    throw errorObj;
  }

  const data = await response.json();

  // Store cartId in cookie if returned
  if (data.cartId) {
    cookieStore.set("cart-id", data.cartId, {
      maxAge: 60 * 60 * 24 * 10,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return data;
}

/**
 * Update item quantity
 */
export async function apiUpdateCartQuantity(
  productId: string,
  quantity: number,
  variationId?: string
) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cart-id")?.value;
  const headers = await getCartHeaders();

  const response = await fetch(`${API_URL}/api/storefront/v1/cart`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({
      cartId,
      productId,
      variationId,
      quantity,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update cart");
  }

  return response.json();
}

/**
 * Remove item from cart
 */
export async function apiRemoveFromCart(
  productId: string,
  variationId?: string
) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cart-id")?.value;
  const headers = await getCartHeaders();

  const response = await fetch(`${API_URL}/api/storefront/v1/cart`, {
    method: "DELETE",
    headers,
    body: JSON.stringify({
      cartId,
      productId,
      variationId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to remove from cart");
  }

  return response.json();
}

/**
 * Validate cart response type
 */
export type ValidateCartResponse = {
  items: CartItem[];
  hasChanges: boolean;
  changes: {
    removedItems: number;
    quantityAdjusted: number;
    priceChanged: number;
  };
};

/**
 * Validate cart before checkout
 * Checks product availability, stock, and prices
 * Auto-fixes issues and returns change metadata
 */
export async function apiValidateCart(): Promise<ValidateCartResponse> {
  const headers = await getCartHeaders();

  const response = await fetch(`${API_URL}/api/storefront/v1/cart/validate`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to validate cart");
  }

  return response.json();
}
