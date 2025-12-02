"use server";

import { ChosenShipmentType } from "@/components/Checkout/StripeCheckoutPage";
import { z } from "zod";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";

// Response types for the Stripe checkout endpoint
type StripeCheckoutErrorCode =
  | "PRODUCT_NOT_FOUND"
  | "VARIATION_NOT_FOUND"
  | "INSUFFICIENT_INVENTORY"
  | "STORE_SETTINGS_NOT_FOUND";

type StripeCheckoutErrorResponse = {
  error: string;
  code?: StripeCheckoutErrorCode;
  details?: {
    productId?: string;
    variationId?: string;
    availableQuantity?: number;
    requestedQuantity?: number;
    // Allow backend to add more without breaking the client
    [key: string]: unknown;
  };
};

type StripeCheckoutSuccessResponse = {
  url: string;
};

// Server-side schema with simple phone number validation
const serverCustomerDataSchema = z.object({
  first_name: z.string({ message: "Anna etunimesi" }).min(1, "Anna etunimesi"),
  last_name: z.string({ message: "Anna sukunimesi" }).min(1, "Anna sukunimesi"),
  email: z
    .string({ message: "Sähköposti vaaditaan" })
    .email("Anna kelvollinen sähköpostiosoite"),
  address: z
    .string({ message: "Katuosoite vaaditaan" })
    .min(1, "Katuosoite vaaditaan"),
  postal_code: z
    .string({ message: "Postinumero vaaditaan" })
    .regex(/^\d{5}$/, "Postinumeron on oltava viisi numeroa"),
  city: z
    .string({ message: "Kaupunki vaaditaan" })
    .min(1, "Kaupunki vaaditaan"),
  phone: z.string().min(1, "Puhelin numero vaaditaan"),
});
type ServerCustomerData = z.infer<typeof serverCustomerDataSchema>;
class CartError extends Error {
  productId: string;
  variationId?: string;

  constructor(message: string, productId: string, variationId?: string) {
    super(message);
    this.name = "CartError";
    this.productId = productId;
    this.variationId = variationId;
  }
}
export async function apiCreateStripeCheckoutSession(
  chosenShipmentMethod: ChosenShipmentType | null,
  customerData: ServerCustomerData
): Promise<StripeCheckoutSuccessResponse> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cart-id")?.value;
  const sessionId = cookieStore.get("session-id")?.value;
  const orderId = randomUUID();

  // Build headers with session-id if logged in
  const headers: Record<string, string> = {
    "x-api-key": process.env.STOREFRONT_API_KEY || "",
    "Content-Type": "application/json",
    ...(cartId && { "x-cart-id": cartId }),
    ...(sessionId && { "x-session-id": sessionId }),
  };

  const stripeCheckoutSessionRes = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/payments/stripe/checkout`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        chosenShipmentMethod,
        customerData,
        orderId,
        // Backend derives customerId from x-session-id header - don't send in body
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success/${orderId}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel/${orderId}`,
      }),
    }
  );

  const stripeCheckoutSessionData = (await stripeCheckoutSessionRes.json()) as
    | StripeCheckoutSuccessResponse
    | StripeCheckoutErrorResponse;

  // Handle API errors
  if (!stripeCheckoutSessionRes.ok) {
    const { error, code, details } =
      stripeCheckoutSessionData as StripeCheckoutErrorResponse;

    switch (code) {
      case "PRODUCT_NOT_FOUND":
      case "VARIATION_NOT_FOUND":
        throw new CartError(
          error,
          (details && (details.productId as string)) || "",
          details && (details.variationId as string | undefined)
        );
      case "INSUFFICIENT_INVENTORY":
        throw new CartError(
          error,
          (details && (details.productId as string)) || "",
          details && (details.variationId as string | undefined)
        );
      default:
        throw new Error(error || "Checkout failed");
    }
  }

  return stripeCheckoutSessionData as StripeCheckoutSuccessResponse;
}
