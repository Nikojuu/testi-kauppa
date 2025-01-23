import prisma from "@/app/utils/db";
import { restoreItemQuantitys } from "@/app/utils/restoreItemQuantitys";
import {
  CustomerData,
  sendOrderConfirmationEmail,
} from "@/app/utils/sendOrderConfirmationEmail";
import {
  calculateAverageVat,
  processInventoryUpdates,
} from "@/app/utils/stripeWebhookUtils";
import { stripe } from "@/lib/stripe";
import { OrderLineItems } from "@prisma/client";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
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
      console.log("Session", session);
      const { orderId } = session.metadata || {
        orderId: null,
      };

      //we dont need fetch line items from stripe as we already have the order line items in our database because we want them to be ready for thank you page

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

      await processInventoryUpdates(order.OrderLineItems);

      const customerData: CustomerData = {
        first_name: session.customer_details?.name as string,
        last_name: session.customer_details?.name as string,
        email: session.customer_details?.email as string,
        address: session.shipping_details?.address?.line1 as string,
        postal_code: session.shipping_details?.address?.postal_code as string,
        city: session.shipping_details?.address?.city as string,
        phone: session.customer_details?.phone as string,
      };

      const chosenShippingRateId = session.shipping_cost
        ?.shipping_rate as string;

      // Retrieve the full shipping rate details
      const shippingRate =
        await stripe.shippingRates.retrieve(chosenShippingRateId);

      const averageVatRate = calculateAverageVat(order.OrderLineItems);

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

          OrderShipmentMethod: {
            create: {
              id: shippingRate.id,
              name: shippingRate.display_name || "Postitus",
              price: shippingRate.fixed_amount?.amount ?? 0,
              vatRate: averageVatRate,
              logo: "https://via.placeholder.com/80x80?text=Toimitus",
            },
          },
          orderCustomerData: {
            create: {
              firstName: customerData.first_name,
              lastName: customerData.last_name,
              email: customerData.email,
              address: customerData.address,
              postalCode: customerData.postal_code,
              city: customerData.city,

              phone: customerData.phone || "",
            },
          },
        },
      });

      const shippingLineItem: OrderLineItems = {
        orderId: orderId,
        id: shippingRate.id,
        name: shippingRate.display_name || "Postitus",
        totalAmount: shippingRate.fixed_amount?.amount ?? 0,
        itemType: "SHIPPING",

        vatRate: averageVatRate,
        productCode: shippingRate.id,

        quantity: 1,
        price: shippingRate.fixed_amount?.amount ?? 0,
      };

      const orderItemsWithShipping = [
        ...order.OrderLineItems,
        shippingLineItem,
      ];
      console.log("Order items with shipping sending", orderItemsWithShipping);

      await sendOrderConfirmationEmail(
        customerData,
        orderItemsWithShipping,
        shipmentMethod,
        order.orderNumber
      );
    } // Handle failed payment intent
    else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;

      if (!orderId)
        throw new Error("Missing orderId in payment intent metadata");

      await restoreItemQuantitys(orderId, "FAILED");
    }
    // Handle canceled checkout session
    else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) throw new Error("Missing orderId in session metadata");

      await restoreItemQuantitys(orderId, "CANCELLED");
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
