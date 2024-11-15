import { shipitCreateShipment } from "@/app/actions";
import { calculateHmac } from "@/app/utils/calculateHmac";
import prisma from "@/app/utils/db";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkoutParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith("checkout-")) {
      checkoutParams[key] = value;
    }
  });

  const receivedSignature = searchParams.get("signature");
  const calculatedSignature = calculateHmac(
    process.env.PAYTRAIL_MERCHANT_SECRET!,
    checkoutParams,
    null
  );

  if (receivedSignature !== calculatedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const transactionId = checkoutParams["checkout-transaction-id"];
  const status = checkoutParams["checkout-status"];
  const reference = checkoutParams["checkout-reference"];

  try {
    const order = await prisma.order.findUnique({
      where: { id: reference },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (status === "ok") {
      // Update order status
      await prisma.order.update({
        where: { id: reference },
        data: {
          status: "PAID",
          paytrailTransactionId: transactionId,
        },
      });

      // Parse items from the order
      const orderItems = JSON.parse(order.items as string) as Array<{
        productCode: string;
        units: number;
        stamp: string; // tells type of product (variation or product or shipping)
      }>;

      // Update product quantities
      for (const item of orderItems) {
        if (item.stamp === "variation") {
          // Update variation quantity if applicable
          await prisma.productVariation.update({
            where: { id: item.productCode },
            data: {
              quantity: {
                decrement: item.units,
              },
            },
          });
        } else if (item.stamp === "product") {
          // Update product quantity
          await prisma.product.update({
            where: { id: item.productCode },
            data: {
              quantity: {
                decrement: item.units,
              },
            },
          });
        }
      }

      // Create shipment
      const shipmentMethod = order.shipmentMethod
        ? JSON.parse(order.shipmentMethod as string)
        : null;
      const customerData = JSON.parse(order.customerData as string);

      if ("serviceId" in shipmentMethod) {
        const shipitResponse = await shipitCreateShipment(
          shipmentMethod,
          customerData
        );

        // Update order with shipment information
        await prisma.order.update({
          where: { id: reference },
          data: {
            trackingNumber: shipitResponse.trackingNumber,
            trackingUrls: shipitResponse.trackingUrls,
            shipitOrderId: shipitResponse.orderId,
            freightDoc: shipitResponse.freightDoc,
          },
        });
      }
      return NextResponse.redirect(new URL("/payment/success", request.url));
    } else {
      // Update order status to FAILED
      await prisma.order.update({
        where: { id: reference },
        data: {
          status: "FAILED",
          paytrailTransactionId: transactionId,
        },
      });

      // Redirect to cancel page
      const cancelUrl = new URL("/payment/cancel", request.url);
      cancelUrl.searchParams.set("orderId", reference);
      return NextResponse.redirect(cancelUrl);
    }
  } catch (error) {
    console.error("Error processing payment confirmation:", error);
    const errorUrl = new URL("/error", request.url);
    errorUrl.searchParams.set("type", "payment_confirmation");
    return NextResponse.redirect(errorUrl);
  }
}
