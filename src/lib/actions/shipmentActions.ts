// "use server";

// import prisma from "@/app/utils/db";
// import { ShipitShippingMethod } from "@prisma/client";
// import { CustomerData } from "../zodSchemas";

// export async function getShipmentMethods() {
//   // make aktive shipment method in database TODO later§

//   const customShipmentMethods = await prisma.shipmentMethods.findMany({
//     where: {
//       storeId: process.env.TENANT_ID,
//       active: true,
//     },
//   });

//   const shipitShipmentMethods = await prisma.shipitShippingMethod.findMany({
//     where: {
//       storeId: process.env.TENANT_ID,
//       onlyParchelLocker: false,
//     },
//   });

//   // Sanitize the data by setting storeId to null
//   const sanitizedCustomMethods = customShipmentMethods.map(({ ...method }) => ({
//     ...method,
//     storeId: null,
//   }));

//   const sanitizedShipitMethods = shipitShipmentMethods.map(({ ...method }) => ({
//     ...method,
//     storeId: null,
//   }));

//   return {
//     customShipmentMethods: sanitizedCustomMethods,
//     shipitShipmentMethods: sanitizedShipitMethods,
//   };
// }
// // this is currently for paytrail only
// export const shipitCreateShipment = async (
//   shipmentMethod: ShipitShippingMethod,
//   data: CustomerData
// ) => {
//   const url =
//     process.env.NODE_ENV === "production"
//       ? "https://api.shipit.ax/v1/shipment"
//       : "https://apitest.shipit.ax/v1/shipment";

//   const senderData = await prisma.storeSettings.findFirst({
//     where: {
//       storeId: process.env.TENANT_ID,
//     },
//     select: {
//       ownerFirstName: true,
//       ownerLastName: true,
//       email: true,
//       phone: true,
//       address: true,
//       postalCode: true,
//       city: true,
//       country: true,
//       businessId: true,
//     },
//   });

//   if (!senderData) {
//     return { error: "Kauppiasta ei löytynyt" };
//   }

//   const body = {
//     sender: {
//       name: senderData.ownerFirstName + " " + senderData.ownerLastName,
//       email: senderData.email,
//       phone: senderData.phone,
//       address: senderData.address,
//       city: senderData.city,
//       postcode: senderData.postalCode,
//       country: senderData.country,
//       isCompany: senderData.businessId ? true : false,
//       contactPerson: senderData.ownerFirstName + " " + senderData.ownerLastName,
//       vatNumber: senderData.businessId,
//     },
//     receiver: {
//       /* your receiver data */
//       name: data.first_name + " " + data.last_name,
//       email: data.email,
//       phone: data.phone,
//       address: data.address,
//       city: data.city,
//       postcode: data.postal_code,
//       country: "FI",
//     },
//     parcels: [
//       {
//         type: shipmentMethod.type,
//         length: shipmentMethod.length,
//         width: shipmentMethod.width,
//         height: shipmentMethod.height,
//         weight: shipmentMethod.weight,
//       },
//     ],
//     dropinId: shipmentMethod.pickupPoint ? shipmentMethod.id : null,
//     pickup: shipmentMethod.pickupPoint,
//     serviceId: shipmentMethod.serviceId,
//   };

//   const options = {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "application/json",
//       "X-SHIPIT-KEY": process.env.SHIPIT_API_KEY!,
//     },
//     body: JSON.stringify(body),
//   };

//   try {
//     const response = await fetch(url, options);
//     const shipitData = await response.json();

//     if (!response.ok) {
//       throw new Error(`Shipping error: ${shipitData.message}`);
//     }

//     return shipitData;
//   } catch (error) {
//     console.error("Shipit API error:", error);
//     throw error;
//   }
// };

// export const getDropInLocations = async ({
//   customerPostalCode,
// }: {
//   customerPostalCode: string;
// }) => {
//   const dropInServiceIds = await prisma.shipitShippingMethod.findMany({
//     where: {
//       storeId: process.env.TENANT_ID,
//     },
//     select: {
//       serviceId: true,
//       price: true,
//     },
//   });
//   if (dropInServiceIds.length === 0) {
//     return [];
//   }

//   const url =
//     process.env.NODE_ENV === "development"
//       ? "https://apitest.shipit.ax/v1/agents"
//       : "https://api.shipit.ax/v1/agents";

//   const requestBody = {
//     postcode: customerPostalCode,
//     country: "FI",
//     serviceId: dropInServiceIds.map((method) => method.serviceId),
//     type: "PICKUP",
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-SHIPIT-KEY": process.env.SHIPIT_API_KEY!,
//       },
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       throw new Error(`API call failed with status: ${response.status}`);
//     }

//     const data = await response.json();
//     if (!data.locations) {
//       console.log("No locations found");
//       return [];
//     }
//     // this basically just adds the price from database to the location returned from the API
//     const enrichedData = data.locations
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       .map((location: any) => {
//         const matchingMethod = dropInServiceIds.find(
//           (method) => method.serviceId === location.serviceId
//         );

//         return {
//           ...location,
//           merchantPrice: matchingMethod ? matchingMethod.price : null,
//         };
//       })
//       .slice(0, 20);

//     return enrichedData; // Return the enriched data
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error; // Optionally rethrow to handle it in the calling function
//   }
// };
