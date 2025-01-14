"use server";

import type { CartItem } from "@/hooks/use-cart";

import crypto, { randomUUID } from "crypto";
import { CustomerData } from "@/lib/zodSchemas";

import { isSaleActive } from "@/lib/utils";

import prisma from "@/app/utils/db";
import { calculateHmac } from "@/app/utils/calculateHmac";
import { confirmedItems, ShipmentMethodUnion } from "@/app/utils/types";

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
            ? `VARIATION-${variation.id}`
            : `PRODUCT-${product.id}`;

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
        vatPercentage: storeVatRate.defaultVatRate,
        productCode: shipmentMethod.id,
        description: "Shipping Cost",
        stamp: "SHIPPING",
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
        // redirectUrls: {
        //   success: `${process.env.BASE_URL}/payment/checkout/success-route`,
        //   cancel: `${process.env.BASE_URL}/payment/checkout/cancel-route`,
        // },

        redirectUrls: {
          success: `${process.env.BASE_URL}/payment/success/${referenceId}`,
          cancel: `${process.env.BASE_URL}/payment/cancel`,
        },
        callbackUrls: {
          success: `${process.env.BASE_URL}/payment/checkout/success-route`,
          cancel: `${process.env.BASE_URL}/payment/checkout/cancel-route`,
        },
        callbackDelay: 2,
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
  const orderLineItems = items.map((item) => {
    const [type] = item.stamp.split("-") as [
      "PRODUCT" | "VARIATION" | "SHIPPING",
    ];

    return {
      id: randomUUID(),
      productCode: item.productCode, // Product or variation ID
      itemType: type, // Specify if it's a product or variation or shipping
      quantity: item.units,
      price: item.unitPrice,
      totalAmount: item.unitPrice * item.units,
    };
  });
  // prisma wont allow to create order and orderCustomerData in one query because orderCustomerData is optional on stripe checkout we need to create it in a separate query
  await prisma.order.create({
    data: {
      storeId: process.env.TENANT_ID!,
      id: referenceId,
      status: "PENDING",
      totalAmount,
      OrderLineItems: {
        create: orderLineItems,
      },
      shipmentMethod: JSON.stringify(shipmentMethod),
    },
  });

  await prisma.order.update({
    where: { id: referenceId, storeId: process.env.TENANT_ID },
    data: {
      orderCustomerData: {
        create: {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          address: data.address,
          postalCode: data.postal_code,
          city: data.city,

          phone: data.phone || "",
        },
      },
    },
  });
}

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
