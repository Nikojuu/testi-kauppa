"use client";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { ProductFromApi, ProductVariationFromApi } from "@/app/utils/types";

interface WishlistButtonProps {
  product: ProductFromApi;
  selectedVariation?: ProductVariationFromApi;
}

const WishlistButton = ({ product, selectedVariation }: WishlistButtonProps) => {
  const handleAddToWishlist = () => {
    // Logic to add the product to the wishlist
    const wishlistItem = {
      productId: product.id,
      variationId: selectedVariation?.id || null,
    };
    
    console.log("Adding to wishlist:", wishlistItem);
    // TODO: Send to backend API
  };  return (
    <div>
      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={handleAddToWishlist}
        aria-label="Add to wishlist"
      >
        Lisää toivelistalle
        <Heart className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default WishlistButton;
