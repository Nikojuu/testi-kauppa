"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ShipmentMethodsWithLocations,
  ShipmentMethods,
} from "@/app/utils/types";
import { useState } from "react";

export function SelectShipmentMethod({
  shipmentMethodsAndLocations,

  setChosenShipmentMethod,
}: {
  shipmentMethodsAndLocations: ShipmentMethodsWithLocations | null;

  setChosenShipmentMethod: (shipmentMethod: {
    shipmentMethodId: string;
    pickupId: string | null;
  }) => void;
}) {
  const [selectedShipmentMethod, setSelectedShipmentMethod] =
    useState<unknown>(null);

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
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Valitse toimitustapa</h2>
      </div>

      <RadioGroup
        value={selectedShipmentMethod as string}
        onValueChange={handleShipmentMethodChange}
        className="space-y-6 "
      >
        {/* Home Delivery / Custom Shipments Section */}
        {homeDeliveryOrCustomShipments.length > 0 && (
          <div className="space-y-4 ">
            <div className="flex flex-col gap-4 ">
              {homeDeliveryOrCustomShipments.map((shipment) => (
                <Card
                  key={shipment.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
                >
                  <CardContent className="p-4 ">
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem
                        value={JSON.stringify({
                          type: "method",
                          methodId: shipment.id,
                        })}
                        id={`method-${shipment.id}`}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`method-${shipment.id}`}
                          className="block cursor-pointer w-full"
                        >
                          <h4 className="font-medium text-lg">
                            {shipment.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Hinta: {shipment.price.toFixed(2)}€
                          </p>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        {pricedLocations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Pakettiautomaatti</h2>
            <div className="grid grid-cols-3 gap-4">
              {pricedLocations.map((location) => (
                <Card
                  key={location.id}
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
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
                        className="mt-1"
                      />

                      <Label
                        htmlFor={`location-${location.id}`}
                        className="block cursor-pointer w-full"
                      >
                        <h4 className="font-medium text-sm">{location.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Hinta:€
                        </p>
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </RadioGroup>
    </div>
  );
}
