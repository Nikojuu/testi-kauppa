"use client";

import { useEffect } from "react";

import { useCart } from "@/hooks/use-cart";

export function ClearCart() {
  const clearCart = useCart((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
