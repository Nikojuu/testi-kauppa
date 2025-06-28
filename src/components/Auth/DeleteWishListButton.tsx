"use client";
import { WishlistItem } from "@/app/(auth)/(dashboard)/mywishlist/page";
import { Button } from "../ui/button";
import { Trash2, XCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteWishlistItem } from "@/lib/actions/authActions";

// Delete form component
const DeleteWishlistButton = ({
  productId,
  variationId,
}: {
  productId: string;
  variationId?: string | null;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteWishlistItem = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteWishlistItem(productId, variationId);

      if (result?.success) {
        toast({
          title: "Tuote poistettu toivelistalta",
          description: "Tuote on poistettu onnistuneesti toivelistaltasi.",
          className:
            "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800",
          action: (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
            </div>
          ),
        });
        // Refresh the page to show updated wishlist
        router.refresh();
      } else {
        toast({
          title: "Poistaminen epäonnistui",
          description: result?.error || "Yritä uudelleen.",
          className:
            "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
          action: (
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast({
        title: "Poistaminen epäonnistui",
        description: "Odottamaton virhe tapahtui. Yritä uudelleen.",
        className:
          "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
        action: (
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
          </div>
        ),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleDeleteWishlistItem}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      {isDeleting ? "Poistetaan..." : "Poista"}
    </Button>
  );
};

export default DeleteWishlistButton;
