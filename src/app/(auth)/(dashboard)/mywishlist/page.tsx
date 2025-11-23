import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, ShoppingCart, Euro } from "lucide-react";
import Image from "next/image";
import { revalidatePath } from "next/cache";
import { isSaleActive } from "@/lib/utils";
import DeleteWishlistButton from "@/components/Auth/DeleteWishListButton";

// Define interfaces based on the database schema
interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  salePrice?: number;
  salePercent?: string;
  vatPercentage?: number;
  saleStartDate?: string;
  saleEndDate?: string;
}

interface ProductVariation {
  id: string;
  price?: number;
  images: string[];
  salePrice?: number;
  salePercent?: string;
  description?: string;
  saleStartDate?: string;
  saleEndDate?: string;
  options: {
    optionType: {
      name: string;
    };
    value: string;
  }[];
}

export interface WishlistItem {
  id: string;
  productId: string;
  variationId?: string;
  createdAt: string;
  product: ProductInfo;
  variation?: ProductVariation;
}

interface WishlistResponse {
  items: WishlistItem[];
}

const getWishlistItems = async (): Promise<WishlistResponse> => {
  const cookieStore = await cookies();
  const sessionIdCookie = cookieStore.get("session-id");

  if (!sessionIdCookie) {
    redirect("/login");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/customer/wishlist`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
          "x-session-id": sessionIdCookie.value,
        },
      }
    );

    if (!response.ok) {
      let errorMessage = "Failed to fetch wishlist items";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage);
    }

    const wishlistData: WishlistResponse = await response.json();
    return wishlistData;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw new Error("Jotain meni vikaan toivelistan haussa");
  }
};

const WishlistPage = async () => {
  const wishlistData = await getWishlistItems();
  const wishlistItems = wishlistData.items || [];

  // Helper function to get the display image
  const getDisplayImage = (item: WishlistItem) => {
    if (item.variation && item.variation.images.length > 0) {
      return item.variation.images[0];
    }
    return item.product.images[0] || "/placeholder-image.jpg";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Toivelista</h2>
        <p className="text-muted-foreground">
          Täältä löydät kaikki suosikkituotteesi
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="rounded-lg border bg-card text-center py-12">
          <div className="pt-6">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Toivelistasi on tyhjä</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Lisää tuotteita toivelistaan selatessasi kauppaa
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              asChild
            >
              <a href="/products">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Selaa tuotteita
              </a>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Näytetään {wishlistItems.length} tuotetta
          </p>

          {wishlistItems.map((item) => {
            const displayImage = getDisplayImage(item);

            // Calculate effective price using the same logic as cart page
            let effectivePrice: number;
            let isItemOnSale = false;
            let originalPrice: number;

            if (item.variation) {
              // Handle variation-specific pricing logic
              const isVariationOnSale =
                isSaleActive(
                  item.variation.saleStartDate
                    ? new Date(item.variation.saleStartDate)
                    : null,
                  item.variation.saleEndDate
                    ? new Date(item.variation.saleEndDate)
                    : null
                ) && item.variation.salePrice !== null;
              effectivePrice = isVariationOnSale
                ? (item.variation.salePrice ?? item.product.price) / 100
                : (item.variation.price ?? item.product.price) / 100;
              originalPrice =
                (item.variation.price ?? item.product.price) / 100;
              isItemOnSale = isVariationOnSale;
            } else {
              // Handle product-level pricing logic
              const isProductOnSale =
                isSaleActive(
                  item.product.saleStartDate
                    ? new Date(item.product.saleStartDate)
                    : null,
                  item.product.saleEndDate
                    ? new Date(item.product.saleEndDate)
                    : null
                ) && item.product.salePrice !== null;
              effectivePrice = isProductOnSale
                ? item.product.salePrice! / 100
                : item.product.price! / 100;
              originalPrice = item.product.price / 100;
              isItemOnSale = isProductOnSale;
            }

            return (
              <div
                key={item.id}
                className="rounded-lg border bg-card hover:shadow-md transition-shadow"
              >
                <div className="p-6 pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={displayImage}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">
                          {item.product.name}
                        </h4>
                        {item.variation && (
                          <div className="text-xs text-muted-foreground mb-2 space-y-0.5">
                            {item.variation.options.map((opt) => (
                              <div key={`${opt.optionType.name}-${opt.value}`}>
                                {opt.optionType.name}: {opt.value}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-medium flex items-center">
                            <Euro className="w-4 h-4" />
                            {effectivePrice.toFixed(2)}
                          </span>
                          {isItemOnSale && (
                            <>
                              <span className="text-sm text-muted-foreground line-through flex items-center">
                                <Euro className="w-3 h-3" />
                                {originalPrice.toFixed(2)}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                TARJOUS
                              </Badge>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" asChild>
                        <a href={`/product/${item.product.slug}`}>
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Katso tuote
                        </a>
                      </Button>
                      <DeleteWishlistButton
                        productId={item.productId}
                        variationId={item.variationId}
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <p className="text-sm text-muted-foreground">
                    Lisätty toivelistaan:{" "}
                    {new Date(item.createdAt).toLocaleDateString("fi-FI")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
