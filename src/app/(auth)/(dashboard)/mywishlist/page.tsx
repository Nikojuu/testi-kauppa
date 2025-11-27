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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
          <h2 className="text-2xl md:text-3xl font-primary text-charcoal">Toivelista</h2>
        </div>
        <p className="font-secondary text-charcoal/60 ml-5">
          Täältä löydät kaikki suosikkituotteesi
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="relative bg-warm-white p-12 text-center">
          <div className="absolute inset-0 border border-rose-gold/10 pointer-events-none" />
          <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-rose-gold/30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-rose-gold/30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-rose-gold/30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-rose-gold/30" />
          <div className="relative">
            <Heart className="w-16 h-16 text-charcoal/20 mx-auto mb-6" />
            <h3 className="text-xl font-primary text-charcoal mb-3">Toivelistasi on tyhjä</h3>
            <p className="text-sm font-secondary text-charcoal/60 mb-6">
              Lisää tuotteita toivelistaan selatessasi kauppaa
            </p>
            <a
              href="/products"
              className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold"
            >
              <ShoppingCart className="w-4 h-4" />
              Selaa tuotteita
            </a>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <p className="text-sm font-secondary text-charcoal/60">
              Näytetään {wishlistItems.length} tuotetta
            </p>
          </div>

          <div className="space-y-6">
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
                className="group relative bg-warm-white p-6 transition-all duration-300 hover:shadow-md"
              >
                {/* Border frame */}
                <div className="absolute inset-0 border border-rose-gold/10 pointer-events-none group-hover:border-rose-gold/25 transition-colors" />

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />

                <div className="relative">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="relative w-24 h-24 overflow-hidden bg-cream/30 border border-rose-gold/10 flex-shrink-0">
                        <Image
                          src={displayImage}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-primary text-lg text-charcoal mb-2">
                          {item.product.name}
                        </h4>
                        {item.variation && (
                          <div className="text-xs font-secondary text-charcoal/60 mb-3 space-y-0.5">
                            {item.variation.options.map((opt) => (
                              <div key={`${opt.optionType.name}-${opt.value}`}>
                                {opt.optionType.name}: {opt.value}
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl font-primary text-charcoal flex items-center">
                            <Euro className="w-5 h-5 mr-1" />
                            {effectivePrice.toFixed(2)}
                          </span>
                          {isItemOnSale && (
                            <>
                              <span className="text-sm font-secondary text-charcoal/50 line-through flex items-center">
                                <Euro className="w-3 h-3" />
                                {originalPrice.toFixed(2)}
                              </span>
                              <span className="px-2 py-1 bg-deep-burgundy/10 border border-deep-burgundy/30 text-deep-burgundy text-xs font-secondary tracking-wider uppercase">
                                TARJOUS
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs font-secondary text-charcoal/50">
                          Lisätty: {new Date(item.createdAt).toLocaleDateString("fi-FI")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                      <a
                        href={`/product/${item.product.slug}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold whitespace-nowrap"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Katso tuote
                      </a>
                      <DeleteWishlistButton
                        productId={item.productId}
                        variationId={item.variationId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
