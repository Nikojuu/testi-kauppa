"use client";

import { ShoppingCart } from "lucide-react";

import Link from "next/link";

import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useCampaignCart } from "@/hooks/use-campaign-cart";

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
import { Campaign } from "@/app/utils/types";

const Cart = ({ campaigns = [] }: { campaigns?: Campaign[] }) => {
  const items = useCart((state) => state.items);
  const itemCount = items.length;

  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Find campaigns
  const freeShippingCampaign = campaigns.find(
    (campaign) => campaign.type === "FREE_SHIPPING"
  );
  const buyXPayYCampaign = campaigns.find(
    (campaign) => campaign.type === "BUY_X_PAY_Y"
  );

  // Use the campaign cart hook for calculations
  const {
    calculatedItems,
    cartTotal,
    originalTotal,
    totalSavings,
    freeShipping,
  } = useCampaignCart(items, buyXPayYCampaign, freeShippingCampaign);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
                {calculatedItems.map(({ item, paidQuantity, freeQuantity }) => (
                  <CartItem
                    product={item.product}
                    variation={item.variation}
                    paidQuantity={paidQuantity}
                    freeQuantity={freeQuantity}
                    key={`${item.product.id}-${item.variation?.id ?? "default"}`}
                  />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />

              {/* Show campaign savings if applicable */}
              {totalSavings > 0 && (
                <div className="space-y-1.5 text-sm">
                  <div className="flex text-xs text-gray-600">
                    <span className="flex-1">Alkuperäinen hinta</span>
                    <span>{originalTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex text-xs text-green-600">
                    <span className="flex-1">Kampanja säästö</span>
                    <span>-{totalSavings.toFixed(2)} €</span>
                  </div>
                </div>
              )}

              {/* Free shipping status in sidebar */}
              {freeShippingCampaign && (
                <div className="text-center">
                  {freeShipping.isEligible ? (
                    <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                      🚚 Ilmainen toimitus!
                    </div>
                  ) : (
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      <div>
                        Lisää {freeShipping.remainingAmount.toFixed(2)} €
                      </div>
                      <div>ilmaiseen toimitukseen! 🚚</div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Yhteensä</span>
                  <span>{cartTotal.toFixed(2)} €</span>
                </div>
                {totalSavings > 0 && (
                  <div className="text-xs text-green-600 text-center">
                    🎉 Säästät {totalSavings.toFixed(2)} € kampanjalla!
                  </div>
                )}
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
                src="https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4i4qKGOmoWuI5hetYs2UbcZvCKz06lFmBSQgq9"
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
