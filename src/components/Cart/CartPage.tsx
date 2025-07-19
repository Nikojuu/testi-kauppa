"use client";

import Subtitle from "@/components/subtitle";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn, isSaleActive } from "@/lib/utils";
import { Loader2, Minus, Plus, X, XCircle } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckoutButton } from "./CheckoutButton";
import { createStripeCheckoutSession } from "@/lib/actions/stripeActions";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import ImageKitImage from "../ImageKitImage";
import { PAYMENT_METHODS } from "@/app/utils/constants";

export type ShipmentMethods = {
  id: string;
  name: string;
  min_estimate_delivery_days: number | null;
  max_estimate_delivery_days: number | null;
  cost: number;
};

const CartPage = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const items = useCart((state) => state.items);
  const incrementQuantity = useCart((state) => state.incrementQuantity);
  const decrementQuantity = useCart((state) => state.decrementQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const cartTotal = items.reduce(
    (total, { product, variation, cartQuantity }) => {
      let effectivePrice: number;

      if (variation) {
        // Handle variation-specific pricing logic
        const isVariationOnSale =
          isSaleActive(variation.saleStartDate, variation.saleEndDate) &&
          variation.salePrice !== null;
        effectivePrice = isVariationOnSale
          ? (variation.salePrice ?? product.price) / 100
          : variation.price! / 100;
      } else {
        // Handle product-level pricing logic
        const isProductOnSale =
          isSaleActive(product.saleStartDate, product.saleEndDate) &&
          product.salePrice !== null;
        effectivePrice = isProductOnSale
          ? product.salePrice! / 100
          : product.price! / 100;
      }

      // Multiply effective price by cart quantity, defaulting to 1 if cartQuantity is not defined
      return total + effectivePrice * (cartQuantity || 1);
    },
    0
  );

  const handleStripeCheckout = async () => {
    if (!PAYMENT_METHODS.includes("stripe")) {
      alert("Stripe ei ole käytettävissä");
      return;
    }
    try {
      const res = await createStripeCheckoutSession(items, cartTotal);

      if (res === null) {
        alert("Tilauksen luominen epäonnistui");
        return;
      }

      if (typeof res === "object" && res.error) {
        console.error("CartError:", res.message);

        toast({
          title: "Jotain meni pieleen",
          description: res.message || "Tuotetta ei ole varastossa",
          className:
            "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800",
          action: (
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
              <div className="flex flex-col"></div>
            </div>
          ),
        });

        return;
      }

      // If res is a string (session URL), redirect or handle success

      router.push(res as string);
    } catch (error) {
      alert("Tilauksen luominen epäonnistui");
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className="mt-24 md:mt-48">
      <Subtitle subtitle="Ostoskori" />
      <div className="mx-auto max-w-screen-2xl">
        <div className="md:mt-12 mt-0 p-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4i4qKGOmoWuI5hetYs2UbcZvCKz06lFmBSQgq9"
                    fill
                    loading="eager"
                    alt="empty shopping cart hippo"
                  />
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  isMounted && items.length > 0,
              })}
            >
              {items.map(({ product, variation, cartQuantity }, i) => {
                // Determine if the stock is unlimited or out of stock
                const isUnlimitedStock = variation
                  ? variation.quantity === null
                  : product.quantity === null;

                const isOutOfStock = variation
                  ? !isUnlimitedStock &&
                    (variation.quantity ?? 0) <= cartQuantity
                  : !isUnlimitedStock &&
                    (product.quantity ?? 0) <= cartQuantity;

                return (
                  <li className="flex py-6 sm:py-10" key={i}>
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24">
                        <ImageKitImage
                          src={variation?.images[0] || product.images[0]}
                          alt={product.name}
                          width={96}
                          height={96}
                          className="h-full w-full rounded-md object-cover object-center "
                          transformations="w-96,h-96"
                          quality={90}
                        />
                      </div>
                    </div>
                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link
                                href={`/product/${product.slug}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </Link>
                            </h3>
                          </div>
                          <div className="mt-2 flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                decrementQuantity(product.id, variation?.id)
                              }
                              disabled={cartQuantity === 1}
                            >
                              <Minus className="h-4 w-4" />
                              <span className="sr-only">Decrease quantity</span>
                            </Button>
                            <span className="w-8 text-center">
                              {cartQuantity || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                incrementQuantity(product.id, variation?.id)
                              }
                              disabled={isOutOfStock} // New logic here
                            >
                              <Plus className="h-4 w-4" />
                              <span className="sr-only">Increase quantity</span>
                            </Button>
                          </div>

                          {variation && (
                            <span className="text-xs text-muted-foreground space-y-0.5">
                              {variation.options.map((opt) => (
                                <div
                                  key={`${opt.optionType.name}-${opt.value}`}
                                >
                                  {opt.optionType.name}: {opt.value}
                                </div>
                              ))}
                            </span>
                          )}
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            {/* Check if there's a variation and its sale price */}
                            {variation ? (
                              isSaleActive(
                                variation?.saleStartDate ??
                                  product.saleStartDate,
                                variation?.saleEndDate ?? product.saleEndDate
                              ) && variation?.salePrice ? (
                                <>
                                  <span className="line-through text-gray-500 mr-2">
                                    {variation?.price !== null
                                      ? variation.price / 100
                                      : product.price / 100}
                                    €
                                  </span>
                                  <span>{variation?.salePrice / 100} €</span>
                                </>
                              ) : (
                                <span>
                                  {variation?.price !== null
                                    ? variation.price / 100
                                    : product.price / 100}{" "}
                                  €
                                </span>
                              )
                            ) : isSaleActive(
                                product.saleStartDate,
                                product.saleEndDate
                              ) && product.salePrice ? (
                              <>
                                <span className="line-through text-gray-500 mr-2">
                                  {product.price / 100} €
                                </span>
                                <span>{product.salePrice / 100} €</span>
                              </>
                            ) : (
                              <span>{product.price / 100} €</span>
                            )}
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                          <div className="absolute right-0 top-0">
                            <Button
                              aria-label="remove product"
                              onClick={() =>
                                removeItem(product.id, variation?.id)
                              }
                              variant="ghost"
                            >
                              <X className="h-5 w-5" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">
              Tilauksen yhteenveto
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Toimitusmaksu lisätään kun toimitustapa on valittu
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Yhteensä
                </div>
                <div className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    cartTotal + " €"
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/payment/checkout">
                <Button className="w-full" variant="gooeyLeft">
                  Jatka tilaukseen
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
