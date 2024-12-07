"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/use-cart";
import {
  SelectedProduct,
  SelectedProductVariation,
} from "../Product/ProductDetail";

const AddToCartButton = ({
  product,
  selectedVariation,
}: {
  product: SelectedProduct;
  selectedVariation?: SelectedProductVariation;
}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const addItem = useCart((state) => state.addItem);
  const cartItems = useCart((state) => state.items);

  // Determine stock availability
  const availableStock = selectedVariation
    ? selectedVariation.quantity
    : product.quantity;

  const currentCartQuantity = cartItems.reduce((total, item) => {
    if (
      item.product.id === product.id &&
      (!selectedVariation || item.variation?.id === selectedVariation.id)
    ) {
      return total + item.cartQuantity;
    }
    return total;
  }, 0);

  const isOutOfStock =
    availableStock !== null && currentCartQuantity >= availableStock;

  const handleAddToCart = () => {
    if (isOutOfStock) return; // Prevent action if out of stock
    addItem(product, selectedVariation);
    setIsSuccess(true);
  };

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => setIsSuccess(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isSuccess]);

  return (
    <Button
      onClick={handleAddToCart}
      size="lg"
      className="w-full"
      disabled={isOutOfStock} // Disable button if out of stock
    >
      {isOutOfStock
        ? "Ei varastossa"
        : isSuccess
          ? "Lisätty"
          : "Lisää ostoskoriin"}
    </Button>
  );
};

export default AddToCartButton;
