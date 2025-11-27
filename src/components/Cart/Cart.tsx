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
      <SheetTrigger
        className="group flex items-center gap-2 p-2 transition-colors duration-300"
        aria-label={isMounted && itemCount > 0 ? `Avaa ostoskori, ${itemCount} tuotetta` : "Avaa ostoskori"}
      >
        <div className="relative">
          <ShoppingCart
            aria-hidden="true"
            className="h-5 w-5 text-charcoal/70 transition-colors duration-300 group-hover:text-rose-gold"
          />
          {isMounted && itemCount > 0 && (
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-gold text-warm-white text-[10px] font-secondary flex items-center justify-center rounded-full">
              {itemCount}
            </span>
          )}
        </div>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col sm:max-w-md bg-warm-white border-l border-rose-gold/20">
        {/* Header */}
        <SheetHeader className="pr-6 pb-4 border-b border-rose-gold/15">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
            <SheetTitle className="font-primary text-2xl md:text-3xl text-charcoal">
              Ostoskori
            </SheetTitle>
            <span className="text-sm font-secondary text-charcoal/50">
              ({itemCount})
            </span>
          </div>
        </SheetHeader>

        {itemCount > 0 ? (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-hidden pr-6">
              <ScrollArea className="h-full py-4">
                <div className="space-y-4">
                  {calculatedItems.map(
                    ({ item, paidQuantity, freeQuantity }) => (
                      <CartItem
                        product={item.product}
                        variation={item.variation}
                        paidQuantity={paidQuantity}
                        freeQuantity={freeQuantity}
                        key={`${item.product.id}-${item.variation?.id ?? "default"}`}
                      />
                    )
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Footer with totals */}
            <div className="pr-6 pt-4 border-t border-rose-gold/15 space-y-4">
              {/* Campaign savings */}
              {totalSavings > 0 && (
                <div className="space-y-2 text-sm font-secondary">
                  <div className="flex justify-between text-charcoal/60">
                    <span>Alkuperäinen hinta</span>
                    <span>{originalTotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-deep-burgundy">
                    <span>Kampanja säästö</span>
                    <span>-{totalSavings.toFixed(2)} €</span>
                  </div>
                </div>
              )}

              {/* Free shipping status */}
              {freeShippingCampaign && (
                <div className="relative p-3 text-center">
                  <div className="absolute inset-0 border border-rose-gold/20 pointer-events-none" />
                  {freeShipping.isEligible ? (
                    <p className="text-xs font-secondary text-charcoal/80">
                      <span className="text-rose-gold">✓</span> Ilmainen
                      toimitus!
                    </p>
                  ) : (
                    <p className="text-xs font-secondary text-charcoal/60">
                      Lisää{" "}
                      <span className="text-rose-gold font-medium">
                        {freeShipping.remainingAmount.toFixed(2)} €
                      </span>{" "}
                      ilmaiseen toimitukseen
                    </p>
                  )}
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center py-2">
                <span className="font-secondary text-charcoal uppercase tracking-wider text-sm">
                  Yhteensä
                </span>
                <span className="text-base text-charcoal font-bold">
                  {cartTotal.toFixed(2)} €
                </span>
              </div>

              {totalSavings > 0 && (
                <p className="text-xs font-secondary text-center text-deep-burgundy">
                  Säästät {totalSavings.toFixed(2)} € kampanjalla!
                </p>
              )}

              {/* Checkout button */}
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold"
                  >
                    <span>Siirry tilaamaan</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          /* Empty cart state */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            {/* Decorative element */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose-gold/40" />
              <div className="w-2 h-2 bg-rose-gold/30 diamond-shape" />
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose-gold/40" />
            </div>

            <div aria-hidden="true" className="relative mb-6 h-48 w-48">
              <Image
                src="https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4i4qKGOmoWuI5hetYs2UbcZvCKz06lFmBSQgq9"
                fill
                alt="Tyhjä ostoskori"
                className="object-contain opacity-80"
              />
            </div>

            <h3 className="font-primary text-xl md:text-2xl text-charcoal mb-2">
              Ostoskorisi on tyhjä
            </h3>
            <p className="text-sm md:text-base font-secondary text-charcoal/60 text-center mb-6">
              Löydä itsellesi sopiva koru kokoelmastamme
            </p>

            <SheetTrigger asChild>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 px-6 py-3 border border-charcoal/30 text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold"
              >
                <span>Selaa koruja</span>
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
