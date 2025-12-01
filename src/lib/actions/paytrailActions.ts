"use server";
import { randomUUID } from "crypto";
import { getUser } from "./authActions";
import { ChosenShipmentType } from "@/components/Checkout/StripeCheckoutPage";
import { z } from "zod";
import {
  PaytrailCheckoutErrorResponse,
  PaytrailResponse,
} from "@/app/utils/paytrailTypes";
import { cookies } from "next/headers";

// Response types for the Stripe checkout endpoint

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
export async function apiCreatePaytrailCheckoutSession(
  chosenShipmentMethod: ChosenShipmentType | null,
  customerData: ServerCustomerData
): Promise<PaytrailResponse> {
  const orderId = randomUUID();
  const { user } = await getUser();
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cart-id")?.value;

  const paytrailRes = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/payments/paytrail/checkout`,
    {
      method: "POST",
      headers: { "x-api-key": process.env.STOREFRONT_API_KEY || "" },
      body: JSON.stringify({
        cartId,
        chosenShipmentMethod,
        customerData,
        orderId,
        customerId: user?.id,
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success/${orderId}`,
        cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel/${orderId}`,
      }),
    }
  );
  const responseData = (await paytrailRes.json()) as PaytrailResponse;

  // Handle API errors
  if (!paytrailRes.ok) {
    const { error, code, details } =
      responseData as unknown as PaytrailCheckoutErrorResponse;

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

  return responseData;
}
