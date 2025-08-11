// //paytrail webhook

// import { calculateHmac } from "@/app/utils/calculateHmac";
// import { PAYMENT_METHODS } from "@/app/utils/constants";
// import {
//   CustomerData,
//   sendOrderConfirmationEmail,
// } from "@/app/utils/sendOrderConfirmationEmail";
// import {
//   ItemType,
//   Order,
//   OrderCustomerData,
//   OrderLineItems,
//   OrderShipmentMethod,
//   ShipitResponse,
//   ShipitShippingMethod,
//   StoreSettingsWithName,
// } from "@/app/utils/types";
// import { calculateAverageVat } from "@/lib/utils";

// import { NextResponse } from "next/server";
// import fetch from "node-fetch";

// export async function GET(request: Request) {
//   if (!PAYMENT_METHODS.includes("paytrail")) {
//     return NextResponse.json(
//       { error: "Payment method not available" },
//       { status: 404 }
//     );
//   }
//   const { searchParams } = new URL(request.url);
//   const checkoutParams: Record<string, string> = {};
//   searchParams.forEach((value, key) => {
//     if (key.startsWith("checkout-")) {
//       checkoutParams[key] = value;
//     }
//   });

//   const receivedSignature = searchParams.get("signature");
//   const calculatedSignature = calculateHmac(
//     process.env.PAYTRAIL_MERCHANT_SECRET!,
//     checkoutParams,
//     null
//   );

//   if (receivedSignature !== calculatedSignature) {
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
//   }

//   const transactionId = checkoutParams["checkout-transaction-id"];
//   const status = checkoutParams["checkout-status"];
//   const reference = checkoutParams["checkout-reference"];

//   try {
//     // Fetch order from the database
//     const orderId = reference;

//     const orderResponse = await fetch(
//       `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order/${orderId}`,
//       {
//         headers: {
//           "x-api-key": process.env.STOREFRONT_API_KEY || "",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!orderResponse.ok) {
//       throw new Error("Failed to fetch order");
//     }

//     const order = (await orderResponse.json()) as Order;
//     const shipmentMethod = order.orderShipmentMethod;
//     if (!shipmentMethod) {
//       throw new Error("No shipment method found");
//     }
//     const averageVatRate = calculateAverageVat(order.OrderLineItems);

//     const emailCustomerData: CustomerData = {
//       first_name: order.orderCustomerData?.firstName || "",
//       last_name: order.orderCustomerData?.lastName || "",
//       postal_code: order.orderCustomerData?.postalCode || "",
//       email: order.orderCustomerData?.email || "",
//       phone: order.orderCustomerData?.phone || "",
//       address: order.orderCustomerData?.address || "",
//       city: order.orderCustomerData?.city || "",
//     };

//     const emailShipmentMethod = {
//       id: shipmentMethod.id,
//       name: shipmentMethod.name,
//       price: shipmentMethod.price,
//       logo: shipmentMethod.logo || "",
//       trackingNumber: "",
//     };
//     const shippingLineItem: OrderLineItems = {
//       orderId: orderId,
//       id: shipmentMethod.id,
//       name: shipmentMethod.name || "Postitus",
//       totalAmount: shipmentMethod.price,
//       itemType: ItemType.SHIPPING,

//       vatRate: averageVatRate,
//       productCode: shipmentMethod.id,

//       quantity: 1,
//       price: shipmentMethod.price,
//     };

//     const orderItemsWithShipping = [...order.OrderLineItems, shippingLineItem];

//     if (status === "ok") {
//       const customerData = order.orderCustomerData;

//       if (shipmentMethod && shipmentMethod.serviceId && customerData) {
//         const shipitData = await shipitCreateShipment(
//           shipmentMethod,
//           customerData
//         );

//         // Update order with SHIPIT shipment information

//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order/${orderId}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//               "x-api-key": process.env.STOREFRONT_API_KEY || "",
//             },
//             body: JSON.stringify({
//               shipitData: shipitData,
//             }),
//           }
//         );
//         emailShipmentMethod.trackingNumber = shipitData.trackingNumber || "";

//         await sendOrderConfirmationEmail(
//           emailCustomerData,
//           orderItemsWithShipping,
//           emailShipmentMethod,
//           order.orderNumber
//         );
//       } else {
//         await fetch(
//           `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order/${orderId}`,
//           {
//             method: "PATCH",
//             headers: {
//               "Content-Type": "application/json",
//               "x-api-key": process.env.STOREFRONT_API_KEY || "",
//             },
//             body: JSON.stringify({}),
//           }
//         );

//         await sendOrderConfirmationEmail(
//           emailCustomerData,
//           orderItemsWithShipping,
//           emailShipmentMethod,
//           order.orderNumber
//         );
//       }

//       return new Response("Payment processed", { status: 200 });
//     } else if (status === "fail") {
//       // Handle cancelled payment

//       await fetch(
//         `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order/cancel/${orderId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             "x-api-key": process.env.STOREFRONT_API_KEY || "",
//           },
//           body: JSON.stringify({ status: "FAILED" }),
//         }
//       );
//       return new Response("Payment failed", { status: 200 });
//     }
//   } catch (error) {
//     console.error("Error processing payment confirmation:", error);
//     return new Response("Error processing payment", { status: 200 });
//   }
// }

// // this is currently for paytrail only
// const shipitCreateShipment = async (
//   shipmentMethod: OrderShipmentMethod,
//   data: OrderCustomerData
// ) => {
//   const infoResponse = await fetch(
//     `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/store-settings`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "x-api-key": process.env.STOREFRONT_API_KEY || "",
//       },
//     }
//   );
//   const shopInfo = (await infoResponse.json()) as StoreSettingsWithName;

//   const shipitRes = await fetch(
//     `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/shipment-methods/${shipmentMethod.serviceId}`,
//     {
//       headers: {
//         "x-api-key": process.env.STOREFRONT_API_KEY || "",
//       },
//     }
//   );

//   const shipitMethod = (await shipitRes.json()) as ShipitShippingMethod;

//   const body = {
//     sender: {
//       name: shopInfo.ownerFirstName + " " + shopInfo.ownerLastName,
//       email: shopInfo.email,
//       phone: shopInfo.phone,
//       address: shopInfo.address,
//       city: shopInfo.city,
//       postcode: shopInfo.postalCode,
//       country: shopInfo.country,
//       isCompany: shopInfo.businessId ? true : false,
//       contactPerson: shopInfo.ownerFirstName + " " + shopInfo.ownerLastName,
//       vatNumber: shopInfo.businessId,
//     },
//     receiver: {
//       /* your receiver data */
//       name: data.firstName + " " + data.lastName,
//       email: data.email,
//       phone: data.phone,
//       address: data.address,
//       city: data.city,
//       postcode: data.postalCode,
//       country: "FI",
//     },
//     parcels: [
//       {
//         type: shipitMethod.type,
//         length: shipitMethod.length,
//         width: shipitMethod.width,
//         height: shipitMethod.height,
//         weight: shipitMethod.weight,
//       },
//     ],
//     dropinId: shipitMethod.pickupPoint ? shipitMethod.id : null,
//     pickup: shipitMethod.pickupPoint,
//     serviceId: shipitMethod.serviceId,
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
//     const response = await fetch(
//       `${process.env.SHIPIT_API_URL!}/shipment`,
//       options
//     );
//     const shipitData = (await response.json()) as ShipitResponse;

//     if (!response.ok) {
//       throw new Error(`Shipping error`);
//     }

//     return shipitData;
//   } catch (error) {
//     console.error("Shipit API error:", error);
//     throw error;
//   }
// };
