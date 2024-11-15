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

  const handleAddToCart = () => {
    addItem(product, selectedVariation);
    setIsSuccess(true);
  };
  return (
    <Button onClick={handleAddToCart} size="lg" className="w-full">
      {isSuccess ? "Lisätty" : "Lisää ostoskoriin"}
    </Button>
  );
};

export default AddToCartButton;
