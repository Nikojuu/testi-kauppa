import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
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

      const { userId, orderId } = session.metadata || {
        userId: null,
        orderId: null,
      };
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      for (const item of lineItems.data) {
        const product = await stripe.products.retrieve(
          item.price?.product as string
        );
        console.log("Product metadata:", product.metadata);
      }

      if (!userId || !orderId) {
        throw new Error("Invalid session metadata");
      }

      const billingAddress = session.customer_details?.address;
      const shippingAddress = session.shipping_details?.address;

      console.log("Billing address:", billingAddress);
      console.log("Shipping address:", shippingAddress);
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
