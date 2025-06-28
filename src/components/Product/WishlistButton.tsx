"use client";
import { useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { ProductFromApi, ProductVariationFromApi } from "@/app/utils/types";
import { addToWishlist } from "@/lib/actions/authActions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  product: ProductFromApi;
  selectedVariation?: ProductVariationFromApi;
}

const WishlistButton = ({
  product,
  selectedVariation,
}: WishlistButtonProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const handleAddToWishlist = async () => {
    startTransition(async () => {
      const currentPath = window.location.pathname + window.location.search;
      const result = await addToWishlist(
        product.id,
        currentPath,
        selectedVariation?.id
      );

      if (result.requiresLogin) {
        router.push(
          `/login?returnUrl=${encodeURIComponent(result.returnUrl || "/mypage")}`
        );
        return;
      }
      if (result.error) {
        toast({
          title: "Virhe",
          description: "Tuotetta ei voitu lisätä toivelistalle",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Onnistui",
          description: "Tuote lisätty toivelistalle",
        });
      }
    });
  };
  return (
    <div>
      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={handleAddToWishlist}
        aria-label="Add to wishlist"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            Lisää toivelistalle
            <Heart className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default WishlistButton;
