"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/use-cart";
import { ProductFromApi, ProductVariationFromApi } from "@/app/utils/types";
import { toast } from "@/hooks/use-toast";

const AddToCartButton = ({
  product,
  selectedVariation,
}: {
  product: ProductFromApi;
  selectedVariation?: ProductVariationFromApi;
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

  const handleAddToCart = async () => {
    if (isOutOfStock) return; // Prevent action if out of stock

    try {
      await addItem(product, selectedVariation);
      setIsSuccess(true);
    } catch (error: any) {
      // Handle cart limit error
      if (error.code === "CART_LIMIT_EXCEEDED") {
        toast({
          variant: "destructive",
          title: "Ostoskorin raja täynnä",
          description: error.message || "Ostoskorissa voi olla maksimissaan rajallinen määrä eri tuotteita.",
        });
      } else {
        // Handle other errors
        toast({
          variant: "destructive",
          title: "Virhe",
          description: "Tuotteen lisääminen ostoskoriin epäonnistui. Yritä uudelleen.",
        });
      }
      console.error("Failed to add to cart:", error);
    }
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
