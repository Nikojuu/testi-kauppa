//paytrail webhook

export async function POST(request: Request) {
  return new Response("not implemented", { status: 200 });
}
// import { calculateHmac } from "@/app/utils/calculateHmac";
// import prisma from "@/app/utils/db";
// import { sendOrderConfirmationEmail } from "@/app/utils/sendOrderConfirmationEmail";
// import { shipitCreateShipment } from "@/lib/actions/shipmentActions";

// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
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
//     const order = await prisma.order.findUnique({
//       where: { id: reference, storeId: process.env.TENANT_ID },
//       include: { OrderLineItems: true },
//     });

//     if (!order) {
//       throw new Error("Order not found");
//     }

//     if (order.status === "PAID") {
//       // Order already processed, just redirect to success page
//       return;
//     }

//     const storeOrderNumbers = await prisma.lastOrderNumber.upsert({
//       where: { storeId: process.env.TENANT_ID },
//       update: { lastOrderNumber: { increment: 1 } },
//       create: {
//         storeId: order.storeId!,
//         lastOrderNumber: 1,
//       },
//     });

//     if (status === "ok") {
//       // Update order status
//       await prisma.order.update({
//         where: { id: reference },
//         data: {
//           status: "PAID",
//           paytrailTransactionId: transactionId,
//         },
//       });

//       // Parse items from the order
//       const orderItems = order.OrderLineItems;

//       // Update product quantities
//       for (const item of orderItems) {
//         const type = item.itemType; // Extract type and ID from stamp

//         if (type === "VARIATION") {
//           await prisma.productVariation.update({
//             where: { id: item.productCode },
//             data: {
//               quantity: {
//                 decrement: item.quantity,
//               },
//               soldQuantity: {
//                 increment: item.quantity,
//               },
//             },
//           });
//         } else if (type === "PRODUCT") {
//           await prisma.product.update({
//             where: { id: item.productCode },
//             data: {
//               quantity: {
//                 decrement: item.quantity,
//               },
//               soldQuantity: {
//                 increment: item.quantity,
//               },
//             },
//           });
//         } else if (type === "SHIPPING") {
//           // No inventory update needed for shipping
//           console.log("Shipping cost item processed");
//         } else {
//           throw new Error(`Unknown item type: ${type}`);
//         }
//       }

//       // Create shipment
//       const shipmentMethod = order.shipmentMethod
//         ? JSON.parse(order.shipmentMethod as string)
//         : null;
//       const customerData = JSON.parse(order.customerData as string);

//       if ("serviceId" in shipmentMethod) {
//         const shipitResponse = await shipitCreateShipment(
//           shipmentMethod,
//           customerData
//         );

//         // Update order with shipment information
//         await prisma.order.update({
//           where: { id: reference },
//           data: {
//             trackingNumber: shipitResponse.trackingNumber,
//             trackingUrls: shipitResponse.trackingUrls,
//             shipitOrderId: shipitResponse.orderId,
//             freightDoc: shipitResponse.freightDoc,
//           },
//         });
//       }

//       await sendOrderConfirmationEmail(
//         customerData,
//         orderItems,
//         shipmentMethod,
//         storeOrderNumbers.lastOrderNumber
//       );

//       return new Response("Payment processed", { status: 200 });
//     } else {
//       // Update order status to FAILED
//       await prisma.order.update({
//         where: { id: reference },
//         data: {
//           status: "FAILED",
//           paytrailTransactionId: transactionId,
//         },
//       });

//       // Redirect to cancel page
//       return new Response("Error processing payment", { status: 500 });
//     }
//   } catch (error) {
//     console.error("Error processing payment confirmation:", error);
//     return new Response("Error processing payment", { status: 500 });
//   }
// }
