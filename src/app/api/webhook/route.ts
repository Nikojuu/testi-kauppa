import prisma from "@/app/utils/db";
import {
  CustomerData,
  sendOrderConfirmationEmail,
} from "@/app/utils/sendOrderConfirmationEmail";
import { stripe } from "@/lib/stripe";
import { OrderLineItems } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { send } from "process";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    console.log("Received webhook event");
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("payment success Session metadata:", session.metadata);
      console.log(session);
      const { orderId } = session.metadata || {
        orderId: null,
      };

      //we dont need fetch line items from stripe as we already have the order line items in our database
      // const lineItems = await stripe.checkout.sessions.listLineItems(
      //   session.id
      // );

      // for (const item of lineItems.data) {
      //   const product = await stripe.products.retrieve(
      //     item.price?.product as string
      //   );
      //   console.log("Product metadata:", product.metadata);
      // }

      if (!orderId) {
        throw new Error("Invalid session metadata orderId missing");
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId, storeId: process.env.TENANT_ID },
        include: { OrderLineItems: true },
      });

      if (!order) {
        throw new Error("Order not found");
      }
      await prisma.storeOrderNumbers.upsert({
        where: { storeId: order.storeId! },
        update: { orderNumber: { increment: 1 } },
        create: { storeId: order.storeId!, orderNumber: 1 },
      });

      // Parse items from the order
      const orderItems = order.OrderLineItems;

      // Update product quantities
      for (const item of orderItems) {
        const type = item.itemType; // Extract type and ID from stamp

        if (type === "VARIATION") {
          await prisma.productVariation.update({
            where: { id: item.productCode },
            data: {
              quantity: {
                decrement: item.quantity,
              },
              soldQuantity: {
                increment: item.quantity,
              },
            },
          });
        } else if (type === "PRODUCT") {
          await prisma.product.update({
            where: { id: item.productCode },
            data: {
              quantity: {
                decrement: item.quantity,
              },
              soldQuantity: {
                increment: item.quantity,
              },
            },
          });
        } else if (type === "SHIPPING") {
          // No inventory update needed for shipping
          console.log("Shipping cost item processed");
        } else {
          throw new Error(`Unknown item type: ${type}`);
        }
      }

      const customerData: CustomerData = {
        first_name: session.customer_details?.name as string,
        last_name: session.customer_details?.name as string,
        email: session.customer_details?.email as string,
        address: session.shipping_details?.address?.line1 as string,
        postal_code: session.shipping_details?.address?.postal_code as string,
        city: session.shipping_details?.address?.city as string,
        phone: session.customer_details?.phone as string,
      };

      // export interface shipmentMethod {
      //   id: string;
      //   name: string;
      //   price: number;
      //   logo: string;
      // }

      const chosenShippingRateId = session.shipping_cost
        ?.shipping_rate as string;

      // Retrieve the full shipping rate details
      const shippingRate =
        await stripe.shippingRates.retrieve(chosenShippingRateId);

      // Create shipment
      const shipmentMethod = {
        id: shippingRate.id,
        name: shippingRate.display_name || "Postitus",
        price: shippingRate.fixed_amount?.amount ?? 0,
        logo: "https://via.placeholder.com/80x80?text=Toimitus",
      };

      await prisma.order.update({
        where: { id: orderId, storeId: process.env.TENANT_ID },
        data: {
          status: "PAID",
          shipmentMethod: JSON.stringify(shipmentMethod),
          customerData: JSON.stringify(customerData),
        },
      });

      const shippingLineItem: OrderLineItems = {
        orderId: orderId,
        id: shippingRate.id,
        totalAmount: shippingRate.fixed_amount?.amount ?? 0,
        itemType: "SHIPPING",
        productCode: shippingRate.id,

        quantity: 1,
        price: (shippingRate.fixed_amount?.amount ?? 0) / 100,
      };

      const orderItemsWithShipping = [
        ...order.OrderLineItems,
        shippingLineItem,
      ];

      sendOrderConfirmationEmail(
        customerData,
        orderItemsWithShipping,
        shipmentMethod,
        order.orderNumber
      );
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error) {
    console.log(console.error(error));

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
