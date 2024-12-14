"use server";

import type { CartItem } from "@/hooks/use-cart";
import prisma from "./utils/db";
import crypto, { randomUUID } from "crypto";
import { CustomerData } from "@/lib/zodSchemas";
import { calculateHmac } from "./utils/calculateHmac";
import type { ShipitShippingMethod } from "@prisma/client";
import { confirmedItems, ShipmentMethodUnion } from "./utils/types";
import { isSaleActive } from "@/lib/utils";
import { z } from "zod";
import { Resend } from "resend";
import ContactFormEmail from "@/components/Email/ContactFormEmail";

export async function getShipmentMethods() {
  // make aktive shipment method in database TODO later§

  const customShipmentMethods = await prisma.shipmentMethods.findMany({
    where: {
      storeId: process.env.TENANT_ID,
      active: true,
    },
  });

  const shipitShipmentMethods = await prisma.shipitShippingMethod.findMany({
    where: {
      storeId: process.env.TENANT_ID,
      onlyParchelLocker: false,
    },
  });

  // Sanitize the data by setting storeId to null
  const sanitizedCustomMethods = customShipmentMethods.map(({ ...method }) => ({
    ...method,
    storeId: null,
  }));

  const sanitizedShipitMethods = shipitShipmentMethods.map(({ ...method }) => ({
    ...method,
    storeId: null,
  }));

  return {
    customShipmentMethods: sanitizedCustomMethods,
    shipitShipmentMethods: sanitizedShipitMethods,
  };
}

const createHeaders = (method: string): { [key: string]: string } => {
  return {
    "checkout-account": process.env.PAYTRAIL_MERCHANT_ID!,
    "checkout-algorithm": "sha256",
    "checkout-method": method,
    "checkout-nonce": crypto.randomBytes(16).toString("hex"),
    "checkout-timestamp": new Date().toISOString(),
  };
};

export const payTrailCheckout = async (
  items: CartItem[],
  data: CustomerData,
  shipmentMethod: ShipmentMethodUnion
) => {
  class CartError extends Error {
    productId: string;
    variationId?: string;

    constructor(message: string, productId: string, variationId?: string) {
      super(message);
      this.productId = productId;
      this.variationId = variationId;
    }
  }

  try {
    // If the shipment method is a DropInLocation, find the matching shipment method from the database and change the shipmentMethod variable to that
    const storeVatRate = await prisma.storeSettings.findFirst({
      where: {
        storeId: process.env.TENANT_ID,
      },
      select: { defaultVatRate: true },
    });
    if (!storeVatRate) {
      throw new CartError(
        `Pahoittelut kauppias ei ole asettanut ALV kantaa`,
        "0"
      );
    }

    if (
      "merchantPrice" in shipmentMethod &&
      typeof shipmentMethod.merchantPrice === "number" &&
      "serviceId" in shipmentMethod
    ) {
      const DropinLocationToShipmentMethod =
        await prisma.shipitShippingMethod.findFirst({
          where: {
            serviceId: shipmentMethod.serviceId,
            storeId: process.env.TENANT_ID,
          },
        });

      if (!DropinLocationToShipmentMethod) {
        throw new CartError(`Pahoitteluni Toimitustapaa ei löytynyt`, "0");
      }

      shipmentMethod = DropinLocationToShipmentMethod;
    }

    if (items && items.length > 0) {
      // Step 1: Prepare and validate cart items got from frontend matching the database
      const confirmedItems = await Promise.all(
        items.map(async (item: CartItem) => {
          const { product, variation } = item;

          const stamp = variation
            ? `variation-${variation.id}`
            : `product-${product.id}`;

          const confirmedProduct = await prisma.product.findUnique({
            where: {
              id: product.id,
              storeId: process.env.TENANT_ID,
            },
            include: {
              ProductVariation: true, // Include variations in the product query
            },
          });

          // Check if the product is found
          if (!confirmedProduct) {
            throw new CartError(
              `Pahoitteluni tuotteen ${product.name} ei lötynyt`,
              product.id
            );
          }

          // Initialize current price based on product price
          let currentPrice = confirmedProduct.price; // Default to product price
          let confirmedVariation;

          // If a variation is specified, find it among the included variations
          if (variation) {
            confirmedVariation = confirmedProduct.ProductVariation.find(
              (v) => v.id === variation.id
            );

            // If the variation is not found, throw an error
            if (!confirmedVariation) {
              throw new CartError(
                `Variation ${variation.optionName} not found for product ${confirmedProduct.name}`,
                product.id,
                variation.id
              );
            }

            const cartIsOnSale = isSaleActive(
              variation.saleStartDate,
              variation.saleEndDate
            );
            const isOnSale = isSaleActive(
              confirmedVariation.saleStartDate,
              confirmedVariation.saleEndDate
            );

            // Use salePrice if the variation is on sale
            currentPrice =
              isOnSale && confirmedVariation.salePrice
                ? confirmedVariation.salePrice
                : (confirmedVariation.price ?? currentPrice);

            if (cartIsOnSale !== isOnSale) {
              throw new CartError(
                `Pahoitteluni tuotteen ${product.name} hinnassa on tapahtunut muutos, lisää tuote uudestaan koriin`,
                product.id,
                variation.id
              );
            }
            if (
              variation.price !== confirmedVariation.price ||
              variation.salePrice !== confirmedVariation.salePrice
            ) {
              throw new CartError(
                `Pahoitteluni tuotteen ${product.name} hinnassa on tapahtunut muutos, lisää tuote uudestaan koriin`,
                product.id,
                variation.id
              );
            }
            if (
              confirmedVariation.quantity !== null &&
              confirmedVariation.quantity < item.cartQuantity
            ) {
              throw new CartError(
                `Pahoitteluni tuotetta ${product.name} ei ole tarpeeksi varastossa`,
                product.id,
                variation.id
              );
            }
          } else {
            const isOnSale = isSaleActive(
              confirmedProduct.saleStartDate,
              confirmedProduct.saleEndDate
            );
            const cartIsOnSale = isSaleActive(
              product.saleStartDate,
              product.saleEndDate
            );

            currentPrice =
              isOnSale && confirmedProduct.salePrice
                ? confirmedProduct.salePrice
                : (confirmedProduct.price ?? currentPrice);

            if (cartIsOnSale !== isOnSale) {
              throw new CartError(
                `Pahoitteluni tuotteen ${product.name} hinnassa on tapahtunut muutos, lisää tuote uudestaan koriin`,
                product.id
              );
            }
            if (
              product.price !== confirmedProduct.price ||
              product.salePrice !== confirmedProduct.salePrice
            ) {
              throw new CartError(
                `Pahoitteluni tuotteen ${product.name} hinnassa on tapahtunut muutos, lisää tuote uudestaan koriin`,
                product.id
              );
            }

            if (
              confirmedProduct.quantity !== null &&
              confirmedProduct.quantity < item.cartQuantity
            ) {
              throw new CartError(
                `Pahoitteluni tuotetta ${product.name} ei ole tarpeeksi varastossa`,
                product.id
              );
            }
          }
          if (!storeVatRate && !confirmedProduct.vatPercentage) {
            throw new CartError("Kauppiaan asettamaa ALV:tä ei löytynyt", "0");
          }

          return {
            unitPrice: currentPrice * 100,
            units: item.cartQuantity,
            vatPercentage:
              confirmedProduct.vatPercentage || storeVatRate.defaultVatRate, // Use product or variation VAT if applicable
            productCode: variation ? variation.id : product.id,
            stamp,
            description: variation
              ? `${product.name} - ${variation.optionName} (${variation.optionValue})`
              : product.name,
          };
        })
      );

      // Add shipping cost to the order
      confirmedItems.push({
        unitPrice: shipmentMethod.price,
        units: 1,
        vatPercentage: 0,
        productCode: shipmentMethod.id,
        description: "Shipping Cost",
        stamp: "shipping",
      });

      const totalAmount = confirmedItems.reduce(
        (total, item) => total + item.unitPrice! * item.units!,
        0
      );

      const referenceId = randomUUID();

      const headers = createHeaders("POST");
      const body = {
        stamp: randomUUID(),
        reference: referenceId,
        amount: totalAmount,
        currency: "EUR",
        language: "FI",
        items: confirmedItems,
        customer: {
          email: data.email,
        },
        redirectUrls: {
          success: `${process.env.BASE_URL}/payment/checkout/success-route`,
          cancel: `${process.env.BASE_URL}/payment/checkout/cancel-route`,
        },
      };

      const signature = calculateHmac(
        process.env.PAYTRAIL_MERCHANT_SECRET!,
        headers,
        body
      );
      headers.signature = signature;

      // Send API request to Paytrail
      const response = await fetch("https://services.paytrail.com/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(body),
      });

      const payTrailData = await response.json();
      if (response.ok) {
        // at this point payment is not yet confirmed, we need to save the order to database

        await createPendingOrder(
          confirmedItems,
          data,
          shipmentMethod,
          totalAmount,
          referenceId
        );

        return payTrailData;
      } else {
        console.log("Paytrail API error:", payTrailData);
      }
    }
  } catch (error) {
    if (error instanceof CartError) {
      console.error(
        "CartError:",
        error.message,
        error.productId,
        error.variationId
      );

      // Return the error information for frontend handling
      return {
        error: true,
        message: error.message,
        productId: error.productId,
        variationId: error.variationId,
      };
    } else {
      console.error("Unexpected error:", error);
      throw error; // Re-throw unexpected errors
    }
  }
};

async function createPendingOrder(
  items: confirmedItems[],
  data: CustomerData,
  shipmentMethod: ShipmentMethodUnion,
  totalAmount: number,
  referenceId: string
) {
  await prisma.order.create({
    data: {
      id: referenceId,
      customerData: JSON.stringify(data),

      storeId: process.env.TENANT_ID,
      status: "PENDING",
      totalAmount,

      shipmentMethod: JSON.stringify(shipmentMethod),
      items: JSON.stringify(items),
    },
  });
}

export const shipitCreateShipment = async (
  shipmentMethod: ShipitShippingMethod,
  data: CustomerData
) => {
  const url =
    process.env.NODE_ENV === "production"
      ? "https://api.shipit.ax/v1/shipment"
      : "https://apitest.shipit.ax/v1/shipment";

  const senderData = await prisma.storeSettings.findFirst({
    where: {
      storeId: process.env.TENANT_ID,
    },
    select: {
      ownerFirstName: true,
      ownerLastName: true,
      email: true,
      phone: true,
      address: true,
      postalCode: true,
      city: true,
      country: true,
      businessId: true,
    },
  });

  if (!senderData) {
    return { error: "Kauppiasta ei löytynyt" };
  }

  const body = {
    sender: {
      name: senderData.ownerFirstName + " " + senderData.ownerLastName,
      email: senderData.email,
      phone: senderData.phone,
      address: senderData.address,
      city: senderData.city,
      postcode: senderData.postalCode,
      country: senderData.country,
      isCompany: senderData.businessId ? true : false,
      contactPerson: senderData.ownerFirstName + " " + senderData.ownerLastName,
      vatNumber: senderData.businessId,
    },
    receiver: {
      /* your receiver data */
      name: data.first_name + " " + data.last_name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postcode: data.postal_code,
      country: "FI",
    },
    parcels: [
      {
        type: shipmentMethod.type,
        length: shipmentMethod.length,
        width: shipmentMethod.width,
        height: shipmentMethod.height,
        weight: shipmentMethod.weight,
      },
    ],
    dropinId: shipmentMethod.pickupPoint ? shipmentMethod.id : null,
    pickup: shipmentMethod.pickupPoint,
    serviceId: shipmentMethod.serviceId,
  };

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-SHIPIT-KEY": process.env.SHIPIT_API_KEY!,
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch(url, options);
    const shipitData = await response.json();

    if (!response.ok) {
      throw new Error(`Shipping error: ${shipitData.message}`);
    }

    return shipitData;
  } catch (error) {
    console.error("Shipit API error:", error);
    throw error;
  }
};

export const getPaymentMethods = async (amount: number, groups?: string[]) => {
  const url = "https://services.paytrail.com/merchants/payment-providers";
  const headers = createHeaders("GET");

  let queryParams = `?amount=${amount}`;
  if (groups && groups.length > 0) {
    queryParams += `&groups=${groups.join(",")}`;
  }

  const signature = calculateHmac(
    process.env.PAYTRAIL_MERCHANT_SECRET!,
    headers,
    null
  );
  headers.signature = signature;

  try {
    const response = await fetch(`${url}${queryParams}`, { headers });
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
};

export const getDropInLocations = async ({
  customerPostalCode,
}: {
  customerPostalCode: string;
}) => {
  const dropInServiceIds = await prisma.shipitShippingMethod.findMany({
    where: {
      storeId: process.env.TENANT_ID,
    },
    select: {
      serviceId: true,
      price: true,
    },
  });
  if (dropInServiceIds.length === 0) {
    return [];
  }

  const url =
    process.env.NODE_ENV === "development"
      ? "https://apitest.shipit.ax/v1/agents"
      : "https://api.shipit.ax/v1/agents";

  const requestBody = {
    postcode: customerPostalCode,
    country: "FI",
    serviceId: dropInServiceIds.map((method) => method.serviceId),
    type: "PICKUP",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-SHIPIT-KEY": process.env.SHIPIT_API_KEY!,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.locations) {
      console.log("No locations found");
      return [];
    }
    // this basically just adds the price from database to the location returned from the API
    const enrichedData = data.locations
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((location: any) => {
        const matchingMethod = dropInServiceIds.find(
          (method) => method.serviceId === location.serviceId
        );

        return {
          ...location,
          merchantPrice: matchingMethod ? matchingMethod.price : null,
        };
      })
      .slice(0, 20);

    return enrichedData; // Return the enriched data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Optionally rethrow to handle it in the calling function
  }
};
const resend = new Resend(process.env.RESEND_API_KEY);
const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  message: z.string().min(5, "Message must be at least 5 characters long"),
});

export async function submitContactForm(formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { firstName, lastName, email, message } = validatedFields.data;

  try {
    const { error } = await resend.emails.send({
      from: "Putiikkipalvelu <info@putiikkipalvelu.fi>",
      to: ["info@webdevniko.fi"],
      subject: "Sinulle on uusi yhteydenottopyyntö",
      react: ContactFormEmail({ firstName, lastName, email, message }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return { error: "Failed to send email. Please try again." };
    }

    return {
      success:
        "Kiitos yhteydenotostasi olen sinuun yhteydessä mahdollisimman pian!",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
