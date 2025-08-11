"use client";

import Subtitle from "@/components/subtitle";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useCampaignCart } from "@/hooks/use-campaign-cart";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Campaign } from "@/app/utils/types";
import { CampaignAddedCartItems } from "./CampaignAddedCartItems";

export type ShipmentMethods = {
  id: string;
  name: string;
  min_estimate_delivery_days: number | null;
  max_estimate_delivery_days: number | null;
  cost: number;
};

const CartPage = ({ campaigns }: { campaigns: Campaign[] }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const items = useCart((state) => state.items);

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
              <CampaignAddedCartItems
                buyXPayYCampaign={buyXPayYCampaign}
                calculatedItems={calculatedItems}
              />
            </ul>
          </div>
          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">
              Tilauksen yhteenveto
            </h2>
            <div className="mt-6 space-y-4">
              {/* Show campaign savings if applicable */}
              {totalSavings > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Alkuperäinen hinta
                    </div>
                    <div className="text-sm text-gray-600">
                      {isMounted ? (
                        `${originalTotal.toFixed(2)} €`
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-green-600">
                      Kampanja säästö
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      {isMounted ? (
                        `-${totalSavings.toFixed(2)} €`
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Free shipping status */}
              {freeShippingCampaign && (
                <div className="border-t border-gray-200 pt-4">
                  {freeShipping.isEligible ? (
                    <div className="text-center">
                      <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                        🚚 <strong>Ilmainen toimitus!</strong>
                        <div className="text-xs mt-1">
                          {freeShipping.campaignName}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                        <div className="font-medium">
                          Lisää tuotteita{" "}
                          {freeShipping.remainingAmount.toFixed(2)} € arvosta
                        </div>
                        <div className="text-xs mt-1 text-blue-500">
                          ja saat ilmaisen toimituksen! 🚚
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {freeShipping.isEligible
                    ? "Ilmainen toimitus sisällytetty!"
                    : "Toimitusmaksu lisätään kun toimitustapa on valittu"}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Yhteensä
                </div>
                <div className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    `${cartTotal.toFixed(2)} €`
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              {totalSavings > 0 && (
                <div className="text-center">
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                    🎉 Säästät {totalSavings.toFixed(2)} € kampanjalla!
                  </div>
                </div>
              )}
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
