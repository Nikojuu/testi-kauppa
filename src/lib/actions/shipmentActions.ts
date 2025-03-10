"use server";

// import { ShipitShippingMethod } from "@prisma/client";
import { CustomerData } from "../zodSchemas";
import { ApiResponseShipmentMethods } from "@/app/utils/types";

export async function getShipmentMethods() {
  // make aktive shipment method in database TODO later§

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/shipment-methods`,
      {
        method: "GET",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.error || "Failed to fetch shipment methods from API"
      );
    }

    const apiResponse: ApiResponseShipmentMethods = await res.json();

    // Get both types of shipment methods
    const customShipmentMethods = apiResponse.shipmentMethods || [];
    const shipitShipmentMethods =
      apiResponse.shipitShipmentMethods.filter(
        (method) => method.onlyParchelLocker === false
      ) || [];

    return { customShipmentMethods, shipitShipmentMethods };
  } catch (error) {
    console.error("Error fetching shipment methods:", error);
    throw error;
  }
}

export const getDropInLocations = async ({
  customerPostalCode,
}: {
  customerPostalCode: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/shipment-methods`,
    {
      method: "GET",
      headers: {
        "x-api-key": process.env.STOREFRONT_API_KEY || "",
      },
    }
  );
  const shipmentMethods: ApiResponseShipmentMethods = await res.json();
  const shipitShipmentMethods = shipmentMethods.shipitShipmentMethods;

  if (shipitShipmentMethods.length === 0) {
    return [];
  }

  const url =
    process.env.NODE_ENV === "development"
      ? "https://apitest.shipit.ax/v1/agents"
      : "https://api.shipit.ax/v1/agents";

  const requestBody = {
    postcode: customerPostalCode,
    country: "FI",
    serviceId: shipitShipmentMethods.map((method) => method.serviceId),
    type: "PICKUP",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SHIPIT-KEY": process.env.SHIPIT_API_KEY!,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.locations) {
      console.log("No locations found");
      return [];
    }
    // this basically just adds the price from database to the location returned from the API
    const enrichedData = data.locations
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((location: any) => {
        const matchingMethod = shipitShipmentMethods.find(
          (method) => method.serviceId === location.serviceId
        );

        return {
          ...location,
          merchantPrice: matchingMethod ? matchingMethod.price : null,
        };
      })
      .slice(0, 20);

    return enrichedData; // Return the enriched data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Optionally rethrow to handle it in the calling function
  }
};
