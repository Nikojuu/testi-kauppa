import { calculateHmac } from "@/app/utils/calculateHmac";
import { PAYMENT_METHODS } from "@/app/utils/constants";

import { NextResponse } from "next/server";
import fetch from "node-fetch";

export async function GET(request: Request) {
  if (!PAYMENT_METHODS.includes("paytrail")) {
    return NextResponse.json(
      { error: "Payment method not available" },
      { status: 404 }
    );
  }
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

  const reference = checkoutParams["checkout-reference"];

  try {
    const orderId = reference;

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
    return new Response("Payment cancelled", { status: 200 });
  } catch (error) {
    console.error("Error on cancel route", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 200 }
    );
  }
}
