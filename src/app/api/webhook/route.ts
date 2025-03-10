import { PAYMENT_METHODS } from "@/app/utils/constants";
import {
  CustomerData,
  sendOrderConfirmationEmail,
} from "@/app/utils/sendOrderConfirmationEmail";
import { ItemType, Order, OrderLineItems } from "@/app/utils/types";
import { stripe } from "@/lib/stripe";
import { calculateAverageVat } from "@/lib/utils";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    if (!PAYMENT_METHODS.includes("stripe")) {
      console.log("Stripe is not enabled. Acknowledging event:");
      return NextResponse.json("stripe not enabled", { status: 200 });
    }
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

      const { orderId } = session.metadata || {
        orderId: null,
      };

      if (!orderId) {
        throw new Error("Invalid session metadata orderId missing");
      }
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order/${orderId}`,
        {
          headers: {
            "x-api-key": process.env.STOREFRONT_API_KEY || "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to fetch order");
      }

      const order = (await orderResponse.json()) as Order;

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
        logo: "https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4ize6OWvnHfKmDy98cwRzTpvhL4l7J65kOBWr2",
      };

      const orderData = {
        status: "PAID",
        orderShipmentMethod: {
          id: shippingRate.id,
          name: shippingRate.display_name || "Postitus",
          price: shippingRate.fixed_amount?.amount ?? 0,
          vatRate: averageVatRate,
          logo: "https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4ize6OWvnHfKmDy98cwRzTpvhL4l7J65kOBWr2",
        },
        orderCustomerData: {
          firstName: customerData.first_name,
          lastName: customerData.last_name,
          email: customerData.email,
          address: customerData.address,
          postalCode: customerData.postal_code,
          city: customerData.city,

          phone: customerData.phone || "",
        },
      };
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order/${orderId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.STOREFRONT_API_KEY || "",
            },
            body: JSON.stringify(orderData),
          }
        );
      } catch (error) {
        console.error("Error updating order data:", error);
      }

      const shippingLineItem: OrderLineItems = {
        orderId: orderId,
        id: shippingRate.id,
        name: shippingRate.display_name || "Postitus",
        totalAmount: shippingRate.fixed_amount?.amount ?? 0,
        itemType: ItemType.SHIPPING,

        vatRate: averageVatRate,
        productCode: shippingRate.id,

        quantity: 1,
        price: shippingRate.fixed_amount?.amount ?? 0,
      };

      const orderItemsWithShipping = [
        ...order.OrderLineItems,
        shippingLineItem,
      ];

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

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order/cancel/${orderId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.STOREFRONT_API_KEY || "",
            },
            body: JSON.stringify({ status: "FAILED" }),
          }
        );
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    }
    // Handle canceled checkout session
    else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) throw new Error("Missing orderId in session metadata");

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order/cancel/${orderId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.STOREFRONT_API_KEY || "",
            },
            body: JSON.stringify({ status: "CANCELLED" }),
          }
        );
      } catch (error) {
        console.error("Error updating order status:", error);
      }
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
