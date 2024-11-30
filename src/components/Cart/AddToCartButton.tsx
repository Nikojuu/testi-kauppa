"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { CartItem, useCart } from "@/hooks/use-cart";
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

  // Determine stock availability
  const isUnlimitedStock = selectedVariation
    ? selectedVariation.quantity === null
    : product.quantity === null;

  const isOutOfStock = selectedVariation
    ? !isUnlimitedStock && (selectedVariation.quantity ?? 0) <= 0
    : !isUnlimitedStock && (product.quantity ?? 0) <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return; // Prevent action if out of stock
    addItem(product, selectedVariation);
    setIsSuccess(true);
  };

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
