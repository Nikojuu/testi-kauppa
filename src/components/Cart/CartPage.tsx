"use client";

import Subtitle from "@/components/subtitle";
import { useCart } from "@/hooks/use-cart";
import { useCampaignCart } from "@/hooks/use-campaign-cart";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { CampaignAddedCartItems } from "./CampaignAddedCartItems";
import { Campaign } from "@/app/utils/types";

export type ShipmentMethods = {
  id: string;
  name: string;
  min_estimate_delivery_days: number | null;
  max_estimate_delivery_days: number | null;
  cost: number;
};

const CartPage = ({ campaigns }: { campaigns: Campaign[] }) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const router = useRouter();
  const cart = useCart();

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
  } = useCampaignCart(cart.items, buyXPayYCampaign, freeShippingCampaign);

  const handleCheckout = async () => {
    try {
      setValidationError(null); // Clear previous errors
      const validation = await cart.validateCart();
      console.log("validation", validation);

      if (validation.hasChanges) {
        // Build toast message from changes
        const messages: string[] = [];
        if (validation.changes.removedItems > 0) {
          messages.push(
            `${validation.changes.removedItems} tuotetta poistettiin (loppu varastosta tai poistettu)`
          );
        }
        if (validation.changes.quantityAdjusted > 0) {
          messages.push(
            `${validation.changes.quantityAdjusted} tuotteen määrää vähennettiin varastotilanteen mukaan`
          );
        }
        if (validation.changes.priceChanged > 0) {
          messages.push(
            `${validation.changes.priceChanged} tuotteen hinta päivitettiin`
          );
        }

        // Show warning toast
        toast({
          title:
            "Ostoskorissa on tapahtunut muutoksia. Tarkista ostoskori ennen jatkamista.",
          description: messages.join(". "),
          variant: "default",
          className:
            "bg-amber-50 border-amber-200 dark:bg-amber-900 dark:border-amber-800",
        });

        // Set persistent error banner
        setValidationError(
          "Tuotteissa on tapahtunut muutoksia tarkista ostoskori ennen jatkamista"
        );

        // BLOCK navigation - user stays on cart page
        return;
      }

      // Validation passed - proceed to checkout
      router.push("/payment/checkout");
    } catch (error) {
      console.error("Validation failed:", error);
      toast({
        title: "Virhe",
        description: "Ostoskorin tarkistus epäonnistui. Yritä uudelleen.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="pt-8 md:pt-16 pb-16 bg-warm-white">
      <Subtitle subtitle="Ostoskori" />

      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Cart Items Section */}
          <div className="lg:col-span-7">
            <h2 className="sr-only">Ostoskorin tuotteet</h2>

            {cart.loading ? (
              /* Loading skeleton */
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative p-6 bg-cream/30 border border-rose-gold/10 animate-pulse"
                  >
                    <div className="flex gap-6">
                      {/* Image skeleton */}
                      <div className="w-24 h-24 bg-rose-gold/20 rounded" />
                      {/* Content skeleton */}
                      <div className="flex-1 space-y-3">
                        <div className="h-5 bg-rose-gold/20 rounded w-3/4" />
                        <div className="h-4 bg-rose-gold/20 rounded w-1/2" />
                        <div className="h-4 bg-rose-gold/20 rounded w-1/4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : cart.items.length === 0 ? (
              +(
                (
                  /* Empty cart state */
                  <div className="relative p-8 md:p-12 bg-cream/30 border border-rose-gold/10">
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/30" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/30" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/30" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/30" />

                    <div className="flex flex-col items-center justify-center text-center">
                      {/* Decorative element */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose-gold/40" />
                        <div className="w-2 h-2 bg-rose-gold/30 diamond-shape" />
                        <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose-gold/40" />
                      </div>

                      <div
                        aria-hidden="true"
                        className="relative mb-6 h-40 w-40"
                      >
                        <Image
                          src="https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4i4qKGOmoWuI5hetYs2UbcZvCKz06lFmBSQgq9"
                          fill
                          loading="eager"
                          alt="Tyhjä ostoskori"
                          className="object-contain opacity-80"
                        />
                      </div>

                      <h3 className="font-primary text-4xl text-charcoal mb-2">
                        Ostoskorisi on tyhjä
                      </h3>
                      <p className="text-base font-secondary text-charcoal/60 mb-8">
                        Löydä itsellesi sopiva koru kokoelmastamme
                      </p>

                      <Link
                        href="/products"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold"
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
                    </div>
                  </div>
                )
              )
            ) : (
              /* Cart items list */
              <div className="space-y-4">
                <CampaignAddedCartItems
                  buyXPayYCampaign={buyXPayYCampaign}
                  calculatedItems={calculatedItems}
                />
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          <section className="mt-12 lg:mt-0 lg:col-span-5">
            <div className="relative bg-cream/40 p-6 md:p-8">
              {/* Border frame */}
              <div className="absolute inset-0 border border-rose-gold/15 pointer-events-none" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/40" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/40" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/40" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/40" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
                <h2 className="font-primary text-4xl text-charcoal">
                  Tilauksen yhteenveto
                </h2>
              </div>

              <div className="space-y-4">
                {/* Campaign savings */}
                {totalSavings > 0 && (
                  <div className="space-y-3 pb-4 border-b border-rose-gold/15">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-secondary text-charcoal/60">
                        Alkuperäinen hinta
                      </span>
                      <span className="text-base font-secondary text-charcoal/60">
                        {`${originalTotal.toFixed(2)} €`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-secondary text-deep-burgundy">
                        Kampanja säästö
                      </span>
                      <span className="text-base font-secondary text-deep-burgundy font-medium">
                        {`-${totalSavings.toFixed(2)} €`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Free shipping status */}
                {freeShippingCampaign && (
                  <div className="py-4 border-b border-rose-gold/15">
                    <div className="relative p-4 text-center">
                      <div className="absolute inset-0 border border-rose-gold/20 pointer-events-none" />
                      {freeShipping.isEligible ? (
                        <div>
                          <p className="text-base font-secondary text-charcoal">
                            <span className="text-rose-gold">✓</span> Ilmainen
                            toimitus!
                          </p>
                          <p className="text-sm font-secondary text-charcoal/50 mt-1">
                            {freeShipping.campaignName}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-base font-secondary text-charcoal/70">
                            Lisää tuotteita{" "}
                            <span className="text-rose-gold font-medium">
                              {freeShipping.remainingAmount.toFixed(2)} €
                            </span>{" "}
                            arvosta
                          </p>
                          <p className="text-sm font-secondary text-charcoal/50 mt-1">
                            ja saat ilmaisen toimituksen!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Shipping note */}
                <div className="py-3">
                  <p className="text-sm font-secondary text-charcoal/50">
                    {freeShipping.isEligible
                      ? "Ilmainen toimitus sisällytetty!"
                      : "Toimitusmaksu lisätään kun toimitustapa on valittu"}
                  </p>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-rose-gold/20">
                  <span className="font-secondary text-charcoal uppercase tracking-wider text-base">
                    Yhteensä
                  </span>
                  <span className="text-lg text-charcoal ">
                    {`${cartTotal.toFixed(2)} €`}
                  </span>
                </div>

                {/* Savings badge */}
                {totalSavings > 0 && (
                  <div className="text-center pt-2">
                    <span className="inline-block text-sm font-secondary text-deep-burgundy bg-deep-burgundy/10 px-4 py-2">
                      Säästät {totalSavings.toFixed(2)} € kampanjalla!
                    </span>
                  </div>
                )}
              </div>

              {/* Checkout button - only show if cart has items */}
              {cart.items.length > 0 && (
                <div className="mt-8">
                  {/* Validation error banner */}
                  {validationError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800">
                      <p className="text-sm font-secondary">
                        {validationError}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={cart.loading}
                    className="group w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cart.loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        <span>Jatka tilaukseen</span>
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
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Continue shopping link */}
              <div className="mt-4 text-center">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-sm font-secondary text-charcoal/60 hover:text-rose-gold transition-colors duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16l-4-4m0 0l4-4m-4 4h18"
                    />
                  </svg>
                  <span>Jatka ostoksia</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
