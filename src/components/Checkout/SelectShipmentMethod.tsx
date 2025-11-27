"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  ShipmentMethodsWithLocations,
  ShipmentMethods,
  Campaign,
} from "@/app/utils/types";
import { useState } from "react";
import { useCampaignCart } from "@/hooks/use-campaign-cart";
import { useCart } from "@/hooks/use-cart";

export function SelectShipmentMethod({
  shipmentMethodsAndLocations,

  setChosenShipmentMethod,
  freeShippingCampaign,
  buyXPayYCampaign,
}: {
  shipmentMethodsAndLocations: ShipmentMethodsWithLocations | null;

  setChosenShipmentMethod: (shipmentMethod: {
    shipmentMethodId: string;
    pickupId: string | null;
  }) => void;
  freeShippingCampaign: Campaign | undefined;
  buyXPayYCampaign?: Campaign;
}) {
  const [selectedShipmentMethod, setSelectedShipmentMethod] =
    useState<unknown>(null);
  const [showAllLocations, setShowAllLocations] = useState(false);

  // Number of parcel lockers to show initially
  const INITIAL_LOCATIONS_COUNT = 4;

  // Get cart items and free shipping status
  const items = useCart((state) => state.items);
  const { freeShipping } = useCampaignCart(
    items,
    buyXPayYCampaign,
    freeShippingCampaign
  );

  const { shipmentMethods, pricedLocations } = shipmentMethodsAndLocations || {
    shipmentMethods: [],
    pricedLocations: [],
  };

  const homeDeliveryOrCustomShipments: ShipmentMethods[] = [];
  const parcelLockerShipments: ShipmentMethods[] = [];

  shipmentMethods.forEach((method) => {
    if (method.shipitMethod?.onlyParchelLocker) {
      parcelLockerShipments.push(method);
    } else {
      homeDeliveryOrCustomShipments.push(method);
    }
  });

  // Helper function to check if a shipment method is eligible for free shipping
  const isShipmentMethodFreeShippingEligible = (shipmentMethodId: string) => {
    if (
      !freeShipping.isEligible ||
      !freeShippingCampaign?.FreeShippingCampaign
    ) {
      return false;
    }

    return freeShippingCampaign.FreeShippingCampaign.shipmentMethods?.some(
      (method) => method.id === shipmentMethodId
    );
  };

  // Helper function to check if a parcel location is eligible for free shipping
  const isParcelLocationFreeShippingEligible = (serviceId: string) => {
    if (
      !freeShipping.isEligible ||
      !freeShippingCampaign?.FreeShippingCampaign
    ) {
      return false;
    }

    // Find the shipment method that matches this serviceId
    const matchingShipmentMethod = parcelLockerShipments.find(
      (method) => method.shipitMethod?.serviceId === serviceId
    );

    if (!matchingShipmentMethod) return false;

    return freeShippingCampaign.FreeShippingCampaign.shipmentMethods?.some(
      (method) => method.id === matchingShipmentMethod.id
    );
  };

  // Helper function to format distance
  const formatDistance = (distanceInMeters: number) => {
    if (distanceInMeters < 1000) {
      return `${distanceInMeters}m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(1)}km`;
    }
  };

  // Helper function to format price with free shipping consideration
  const formatPrice = (merchantPrice: number | null) => {
    if (merchantPrice === null) return "Ilmainen";
    return `${(merchantPrice / 100).toFixed(2)}€`;
  };

  // Helper function to format shipment method price with free shipping consideration
  const formatShipmentMethodPrice = (shipment: ShipmentMethods) => {
    if (isShipmentMethodFreeShippingEligible(shipment.id)) {
      return "Ilmainen";
    }
    return `${(shipment.price / 100).toFixed(2)}€`;
  };

  // Helper function to format parcel location price with free shipping consideration
  const formatParcelLocationPrice = (location: {
    merchantPrice: number | null;
    serviceId: string;
  }) => {
    if (isParcelLocationFreeShippingEligible(location.serviceId)) {
      return "Ilmainen";
    }
    return formatPrice(location.merchantPrice);
  };

  const handleShipmentMethodChange = (value: string) => {
    setSelectedShipmentMethod(value);

    // Parse the JSON string back into an object
    const data = JSON.parse(value);

    if (data.type === "locker") {
      const { lockerId, serviceId } = data;

      // Find the shipment method that corresponds to the selected locker's service
      const shipmentMethod = parcelLockerShipments.find(
        (method) => method.shipitMethod?.serviceId === serviceId
      );

      if (shipmentMethod) {
        const shipmentMethodId = shipmentMethod.id;
        setChosenShipmentMethod({
          shipmentMethodId: shipmentMethodId,
          pickupId: lockerId,
        });
      } else {
        console.error(
          "Could not find a matching shipment method for serviceId:",
          serviceId
        );
      }
    } else if (data.type === "method") {
      // Handle regular shipment methods if needed
      const { methodId } = data;
      setChosenShipmentMethod({
        shipmentMethodId: methodId,
        pickupId: null,
      });
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Header with diamond decoration */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-2 h-2 bg-rose-gold/60 diamond-shape" />
          <div className="w-16 h-[1px] bg-gradient-to-r from-rose-gold/60 to-champagne/40" />
          <div className="w-1.5 h-1.5 bg-champagne/50 diamond-shape" />
          <div className="w-16 h-[1px] bg-gradient-to-l from-rose-gold/60 to-champagne/40" />
          <div className="w-2 h-2 bg-rose-gold/60 diamond-shape" />
        </div>
        <h2 className="text-3xl md:text-4xl font-primary text-charcoal tracking-tight">
          Valitse toimitustapa
        </h2>
        <div className="mt-4 h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent max-w-xs mx-auto" />
      </div>

      <RadioGroup
        value={selectedShipmentMethod as string}
        onValueChange={handleShipmentMethodChange}
        className="space-y-8"
      >
        {/* Home Delivery / Custom Shipments Section */}
        {homeDeliveryOrCustomShipments.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
              <h3 className="text-xl md:text-2xl font-primary text-charcoal">
                Kotiinkuljetus
              </h3>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-rose-gold/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {homeDeliveryOrCustomShipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className={`group relative bg-warm-white cursor-pointer transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "method",
                      methodId: shipment.id,
                    })
                      ? "shadow-lg"
                      : "hover:shadow-md"
                  }`}
                >
                  {/* Border frame */}
                  <div className={`absolute inset-0 border pointer-events-none transition-colors duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "method",
                      methodId: shipment.id,
                    })
                      ? "border-rose-gold/40"
                      : "border-rose-gold/10 group-hover:border-rose-gold/25"
                  }`} />

                  {/* Corner accents */}
                  <div className={`absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "method",
                      methodId: shipment.id,
                    })
                      ? "border-rose-gold/60 w-8 h-8"
                      : "border-rose-gold/30 group-hover:w-8 group-hover:h-8 group-hover:border-rose-gold/50"
                  }`} />
                  <div className={`absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "method",
                      methodId: shipment.id,
                    })
                      ? "border-rose-gold/60 w-8 h-8"
                      : "border-rose-gold/30 group-hover:w-8 group-hover:h-8 group-hover:border-rose-gold/50"
                  }`} />
                  <div className={`absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "method",
                      methodId: shipment.id,
                    })
                      ? "border-rose-gold/60 w-8 h-8"
                      : "border-rose-gold/30 group-hover:w-8 group-hover:h-8 group-hover:border-rose-gold/50"
                  }`} />
                  <div className={`absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "method",
                      methodId: shipment.id,
                    })
                      ? "border-rose-gold/60 w-8 h-8"
                      : "border-rose-gold/30 group-hover:w-8 group-hover:h-8 group-hover:border-rose-gold/50"
                  }`} />

                  <CardContent className="p-6 relative">
                    <div className="flex items-start space-x-4">
                      <RadioGroupItem
                        value={JSON.stringify({
                          type: "method",
                          methodId: shipment.id,
                        })}
                        id={`method-${shipment.id}`}
                        className="mt-1.5 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`method-${shipment.id}`}
                          className="block cursor-pointer w-full"
                        >
                          <div className="space-y-3">
                            {/* Shipment name */}
                            <h4 className="font-primary text-lg leading-tight line-clamp-2 text-charcoal">
                              {shipment.name}
                            </h4>

                            <p className="text-sm min-h-10 font-secondary text-charcoal/60 leading-relaxed">
                              {shipment.description
                                ? shipment.description
                                : shipment.name}
                            </p>

                            {/* Price */}
                            <div className="flex justify-between items-end pt-2">
                              {(shipment.min_estimate_delivery_days ||
                                shipment.max_estimate_delivery_days) && (
                                <div className="text-sm font-secondary text-charcoal/70">
                                  <span className="font-medium text-charcoal">
                                    Toimitus:{" "}
                                  </span>
                                  {shipment.min_estimate_delivery_days ===
                                  shipment.max_estimate_delivery_days
                                    ? `${shipment.min_estimate_delivery_days} päivää`
                                    : `${shipment.min_estimate_delivery_days}-${shipment.max_estimate_delivery_days} päivää`}
                                </div>
                              )}
                              <span className="font-primary text-xl text-charcoal bg-rose-gold/10 px-3 py-1.5 border border-rose-gold/20">
                                {formatShipmentMethodPrice(shipment)}
                              </span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parcel Locker Section */}
        {pricedLocations.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
              <h3 className="text-xl md:text-2xl font-primary text-charcoal">
                Pakettiautomaatti
              </h3>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-rose-gold/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(showAllLocations
                ? pricedLocations
                : pricedLocations.slice(0, INITIAL_LOCATIONS_COUNT)
              ).map((location) => (
                <div
                  key={location.id}
                  className={`group relative bg-warm-white cursor-pointer transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "locker",
                      lockerId: location.id,
                      serviceId: location.serviceId,
                    })
                      ? "shadow-lg"
                      : "hover:shadow-md"
                  }`}
                >
                  {/* Border frame */}
                  <div className={`absolute inset-0 border pointer-events-none transition-colors duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "locker",
                      lockerId: location.id,
                      serviceId: location.serviceId,
                    })
                      ? "border-rose-gold/40"
                      : "border-rose-gold/10 group-hover:border-rose-gold/25"
                  }`} />

                  {/* Corner accents */}
                  <div className={`absolute top-0 left-0 w-4 h-4 border-l border-t transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "locker",
                      lockerId: location.id,
                      serviceId: location.serviceId,
                    })
                      ? "border-rose-gold/60 w-6 h-6"
                      : "border-rose-gold/30 group-hover:w-6 group-hover:h-6 group-hover:border-rose-gold/50"
                  }`} />
                  <div className={`absolute top-0 right-0 w-4 h-4 border-r border-t transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "locker",
                      lockerId: location.id,
                      serviceId: location.serviceId,
                    })
                      ? "border-rose-gold/60 w-6 h-6"
                      : "border-rose-gold/30 group-hover:w-6 group-hover:h-6 group-hover:border-rose-gold/50"
                  }`} />
                  <div className={`absolute bottom-0 left-0 w-4 h-4 border-l border-b transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "locker",
                      lockerId: location.id,
                      serviceId: location.serviceId,
                    })
                      ? "border-rose-gold/60 w-6 h-6"
                      : "border-rose-gold/30 group-hover:w-6 group-hover:h-6 group-hover:border-rose-gold/50"
                  }`} />
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-r border-b transition-all duration-500 ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "locker",
                      lockerId: location.id,
                      serviceId: location.serviceId,
                    })
                      ? "border-rose-gold/60 w-6 h-6"
                      : "border-rose-gold/30 group-hover:w-6 group-hover:h-6 group-hover:border-rose-gold/50"
                  }`} />

                  <CardContent className="p-4 relative">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value={JSON.stringify({
                          type: "locker",
                          lockerId: location.id,
                          serviceId: location.serviceId,
                        })}
                        id={`location-${location.id}`}
                        className="mt-1.5 flex-shrink-0"
                      />

                      <Label
                        htmlFor={`location-${location.id}`}
                        className="block cursor-pointer w-full min-w-0"
                      >
                        <div className="space-y-3">
                          {/* Header with carrier logo and name */}
                          <div className="flex items-center space-x-2 min-w-0 bg-cream/40 px-2 py-1 border border-rose-gold/10">
                            {location.carrierLogo && (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={location.carrierLogo}
                                alt={location.carrier}
                                className="w-5 h-5 object-contain flex-shrink-0"
                              />
                            )}
                            <span className="text-xs font-secondary font-medium text-charcoal/70 truncate">
                              {location.carrier}
                            </span>
                          </div>

                          {/* Location name */}
                          <h4 className="font-secondary font-medium text-sm leading-tight line-clamp-2 min-h-10 text-charcoal">
                            {location.name}
                          </h4>

                          {/* Address */}
                          <div className="text-xs font-secondary text-charcoal/60 space-y-1 bg-cream/30 p-2 border border-rose-gold/10">
                            <p className="truncate font-medium">
                              {location.address1}
                            </p>
                            <p className="truncate">
                              {location.zipcode} {location.city}
                            </p>
                          </div>

                          {/* Price and Distance */}
                          <div className="flex justify-between items-center pt-1">
                            <span className="font-primary text-base text-charcoal bg-rose-gold/10 px-2 py-1 border border-rose-gold/20">
                              {formatParcelLocationPrice(location)}
                            </span>
                            <span className="text-charcoal/60 text-xs font-secondary font-medium bg-cream/40 px-2 py-1 border border-rose-gold/10">
                              {formatDistance(location.distanceInMeters)}
                            </span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>

            {/* Show More/Less Button */}
            {pricedLocations.length > INITIAL_LOCATIONS_COUNT && (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setShowAllLocations(!showAllLocations)}
                  className="inline-flex items-center gap-3 px-8 py-3 border border-charcoal/30 text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold"
                >
                  {showAllLocations
                    ? `Näytä vähemmän (${INITIAL_LOCATIONS_COUNT}/${pricedLocations.length})`
                    : `Näytä lisää (${pricedLocations.length - INITIAL_LOCATIONS_COUNT} lisää)`}
                </button>
              </div>
            )}
          </div>
        )}
      </RadioGroup>
    </div>
  );
}
