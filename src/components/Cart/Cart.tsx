"use client";

import { ShoppingCart } from "lucide-react";

import Link from "next/link";

import Image from "next/image";
import { useCart } from "@/hooks/use-cart";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { buttonVariants } from "../ui/button";
import CartItem from "./CartItem";
import { isSaleActive } from "@/lib/utils";

const Cart = () => {
  const items = useCart((state) => state.items);
  const itemCount = items.length;

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartTotal = items.reduce(
    (total, { product, variation, cartQuantity }) => {
      let effectivePrice: number;

      if (variation) {
        // Handle variation-specific pricing logic
        const isVariationOnSale =
          isSaleActive(variation.saleStartDate, variation.saleEndDate) &&
          variation.salePrice !== null;
        effectivePrice = isVariationOnSale
          ? variation.salePrice!
          : variation.price!;
      } else {
        // Handle product-level pricing logic
        const isProductOnSale =
          isSaleActive(product.saleStartDate, product.saleEndDate) &&
          product.salePrice !== null;
        effectivePrice = isProductOnSale ? product.salePrice! : product.price!;
      }

      // Multiply effective price by cart quantity, defaulting to 1 if cartQuantity is not defined
      return total + (effectivePrice / 100) * (cartQuantity || 1);
    },
    0
  );

  return (
    <Sheet>
      <SheetTrigger className="group -m-2 flex items-center p-2 bg-white md:bg-transparent rounded-lg">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0   group-hover:text-primary"
        />
        <span className="ml-2 text-sm font-medium  group-hover:text-primary">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Ostoskori ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {items.map(({ product, variation }) => (
                  <CartItem
                    product={product}
                    variation={variation}
                    key={`${product.id}-${variation?.id ?? "default"}`}
                  />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Yhteensä</span>
                  <span>{cartTotal} €</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full",
                      variant: "gooeyLeft",
                    })}
                  >
                    Siirry tilaamaan!
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image
                src="/hippo-empty-cart.png"
                fill
                alt="empty shopping cart hippo"
              />
            </div>
            <div className="text-xl font-semibold">Ostoskorisi on tyhjä</div>
            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "gooeyLeft",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}
              >
                Aloita lisäämällä tuotteita
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
