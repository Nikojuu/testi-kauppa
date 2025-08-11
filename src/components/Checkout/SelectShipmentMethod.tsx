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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Valitse toimitustapa
        </h2>
      </div>

      <RadioGroup
        value={selectedShipmentMethod as string}
        onValueChange={handleShipmentMethodChange}
        className="space-y-8"
      >
        {/* Home Delivery / Custom Shipments Section */}
        {homeDeliveryOrCustomShipments.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Kotiinkuljetus
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {homeDeliveryOrCustomShipments.map((shipment) => (
                <Card
                  key={shipment.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/60 hover:scale-[1.02] ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "method",
                      methodId: shipment.id,
                    })
                      ? "border-primary bg-primary/10 shadow-lg scale-[1.02] ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-primary/40"
                  }`}
                >
                  <CardContent className="p-5">
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
                            <h4 className="font-semibold text-lg leading-tight line-clamp-2 text-gray-900">
                              {shipment.name}
                            </h4>

                            <p className="text-sm min-h-10 text-gray-600 leading-relaxed">
                              {shipment.description
                                ? shipment.description
                                : shipment.name}
                            </p>

                            {/* Price */}
                            <div className="flex justify-between items-end">
                              {(shipment.min_estimate_delivery_days ||
                                shipment.max_estimate_delivery_days) && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium text-gray-700">
                                    Toimitus:{" "}
                                  </span>
                                  {shipment.min_estimate_delivery_days ===
                                  shipment.max_estimate_delivery_days
                                    ? `${shipment.min_estimate_delivery_days} päivää`
                                    : `${shipment.min_estimate_delivery_days}-${shipment.max_estimate_delivery_days} päivää`}
                                </div>
                              )}
                              <span className="font-bold text-xl text-primary bg-primary/10 px-3 py-1 rounded-lg">
                                {formatShipmentMethodPrice(shipment)}
                              </span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Parcel Locker Section */}
        {pricedLocations.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Pakettiautomaatti
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(showAllLocations
                ? pricedLocations
                : pricedLocations.slice(0, INITIAL_LOCATIONS_COUNT)
              ).map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary/60 hover:scale-[1.02] ${
                    selectedShipmentMethod ===
                    JSON.stringify({
                      type: "locker",
                      lockerId: location.id,
                      serviceId: location.serviceId,
                    })
                      ? "border-primary bg-primary/10 shadow-lg scale-[1.02] ring-2 ring-primary/20"
                      : "border-gray-200 hover:border-primary/40"
                  }`}
                >
                  <CardContent className="p-4">
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
                          <div className="flex items-center space-x-2 min-w-0 bg-gray-50 rounded-md px-2 py-1">
                            {location.carrierLogo && (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={location.carrierLogo}
                                alt={location.carrier}
                                className="w-5 h-5 object-contain flex-shrink-0"
                              />
                            )}
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {location.carrier}
                            </span>
                          </div>

                          {/* Location name */}
                          <h4 className="font-medium text-sm leading-tight line-clamp-2 min-h-10 text-gray-900">
                            {location.name}
                          </h4>

                          {/* Address */}
                          <div className="text-xs text-gray-600 space-y-1 bg-gray-50 rounded-md p-2">
                            <p className="truncate font-medium">
                              {location.address1}
                            </p>
                            <p className="truncate">
                              {location.zipcode} {location.city}
                            </p>
                          </div>

                          {/* Price and Distance */}
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-base text-primary bg-primary/10 px-2 py-1 rounded-md">
                              {formatParcelLocationPrice(location)}
                            </span>
                            <span className="text-gray-600 text-sm font-medium bg-gray-100 px-2 py-1 rounded-md">
                              {formatDistance(location.distanceInMeters)}
                            </span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Show More/Less Button */}
            {pricedLocations.length > INITIAL_LOCATIONS_COUNT && (
              <div className="flex justify-center pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAllLocations(!showAllLocations)}
                  className="px-8 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary hover:text-primary-foreground border-primary/20 text-primary hover:border-primary"
                >
                  {showAllLocations
                    ? `Näytä vähemmän (${INITIAL_LOCATIONS_COUNT}/${pricedLocations.length})`
                    : `Näytä lisää (${pricedLocations.length - INITIAL_LOCATIONS_COUNT} lisää)`}
                </Button>
              </div>
            )}
          </div>
        )}
      </RadioGroup>
    </div>
  );
}
