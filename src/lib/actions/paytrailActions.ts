"use server";

import type { CartItem } from "@/hooks/use-cart";

import crypto, { randomUUID } from "crypto";
import { CustomerData } from "@/lib/zodSchemas";

import { calculateAverageVat, isSaleActive } from "@/lib/utils";

import { calculateHmac } from "@/app/utils/calculateHmac";
import {
  confirmedItems,
  ItemType,
  ProductFromApi,
  ShipmentMethodUnion,
} from "@/app/utils/types";
import fetch from "node-fetch";
import { PaytrailResponse } from "@/components/Checkout/PaytrailPayments";
import { PAYMENT_METHODS } from "@/app/utils/constants";

const createHeaders = (method: string): { [key: string]: string } => {
  if (!PAYMENT_METHODS.includes("paytrail")) {
    throw new Error("Payment method not available");
  }
  return {
    "checkout-account": process.env.PAYTRAIL_MERCHANT_ID!,
    "checkout-algorithm": "sha256",
    "checkout-method": method,
    "checkout-nonce": crypto.randomBytes(16).toString("hex"),
    "checkout-timestamp": new Date().toISOString(),
  };
};
class CartError extends Error {
  productId: string;
  variationId?: string;

  constructor(message: string, productId: string, variationId?: string) {
    super(message);
    this.productId = productId;
    this.variationId = variationId;
  }
}

export const payTrailCheckout = async (
  items: CartItem[],
  customerData: CustomerData,
  shipmentMethod: ShipmentMethodUnion
) => {
  try {
    if (!PAYMENT_METHODS.includes("paytrail")) {
      throw new Error("Payment method not available");
    }
    // If the shipment method is a DropInLocation, find the matching shipment method from the database and change the shipmentMethod variable to that
    const vatResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/default-vat-rate`,
      {
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
        },
      }
    );

    if (!vatResponse.ok) {
      throw new Error("Failed to fetch VAT rate");
    }

    const defaultVatRate = Number(await vatResponse.json());
    if (isNaN(defaultVatRate)) {
      throw new Error("Invalid VAT rate received from API");
    }

    if (
      "merchantPrice" in shipmentMethod &&
      typeof shipmentMethod.merchantPrice === "number" &&
      "serviceId" in shipmentMethod
    ) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/shipment-methods/${shipmentMethod.serviceId}`,
        {
          headers: {
            "x-api-key": process.env.STOREFRONT_API_KEY || "",
          },
        }
      );

      const shipmentMethodByDropInLocation =
        (await res.json()) as ShipmentMethodUnion;

      if (!shipmentMethodByDropInLocation) {
        throw new CartError(`Pahoitteluni Toimitustapaa ei löytynyt`, "0");
      }

      shipmentMethod = shipmentMethodByDropInLocation;
      // works this far
    }

    if (items && items.length > 0) {
      const confirmedItems = await confirmLineItems(items, defaultVatRate);

      // Add shipping cost to the order
      confirmedItems.push({
        unitPrice: shipmentMethod.price,
        units: 1,
        vatPercentage: defaultVatRate,
        productCode: shipmentMethod.id,
        description: "Shipping Cost",
        stamp: "SHIPPING",
      });

      const totalAmount = confirmedItems.reduce(
        (total, item) => total + item.unitPrice! * item.units!,
        0
      );

      const orderId = randomUUID();

      const headers = createHeaders("POST");
      const body = {
        stamp: randomUUID(),
        reference: orderId,
        amount: totalAmount,
        currency: "EUR",
        language: "FI",
        items: confirmedItems,
        customer: {
          email: customerData.email,
        },
        // redirectUrls: {
        //   success: `${process.env.BASE_URL}/payment/checkout/success-route`,
        //   cancel: `${process.env.BASE_URL}/payment/checkout/cancel-route`,
        // },

        redirectUrls: {
          success: `${process.env.BASE_URL}/payment/success/${orderId}`,
          cancel: `${process.env.BASE_URL}/payment/cancel/${orderId}`,
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

      const payTrailData = (await response.json()) as PaytrailResponse;
      if (response.ok) {
        // at this point payment is not yet confirmed, we need to save the order to database
        const transactionId = payTrailData.transactionId;

        await createPendingOrder(
          confirmedItems,
          customerData,
          shipmentMethod,
          totalAmount,
          orderId,
          transactionId
        );

        return payTrailData as PaytrailResponse;
      } else {
        console.log("Paytrail API error:", payTrailData);
        throw new Error("Paytrail API error");
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
  customerData: CustomerData,
  shipmentMethod: ShipmentMethodUnion,
  totalAmount: number,
  orderId: string,
  transactionId: string
) {
  // filter out shipping from items

  const orderLineItems = items
    .filter((item) => item.stamp !== "SHIPPING")
    .map((item) => ({
      name: item.description,
      quantity: item.units,
      price: item.unitPrice,
      totalAmount: item.units * item.unitPrice,
      productCode: String(item.productCode),
      itemType: item.stamp as ItemType,
      vatRate: Number(item.vatPercentage) || 25.5,
    }));
  const shipmentMethodVatRate = calculateAverageVat(orderLineItems);

  const orderShipmentMethod = {
    id: shipmentMethod.id,
    serviceId: "serviceId" in shipmentMethod ? shipmentMethod.serviceId : null,
    name: shipmentMethod.name,
    price: shipmentMethod.price,
    logo: "https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4ize6OWvnHfKmDy98cwRzTpvhL4l7J65kOBWr2",
    vatRate: shipmentMethodVatRate,
  };

  const orderCustomerData = {
    firstName: customerData.first_name,
    lastName: customerData.last_name,
    email: customerData.email,
    address: customerData.address,
    postalCode: customerData.postal_code,
    city: customerData.city,
    phone: customerData.phone || "",
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          confirmedItems: orderLineItems,
          totalAmount: orderLineItems.reduce(
            (acc, item) => acc + item.totalAmount,
            0
          ),
          orderShipmentMethod,
          orderCustomerData,
          transactionId,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        (errorData as { error?: string }).error ||
          "Failed to create pending order"
      );
    }
  } catch (error) {
    console.error("Error in createPendingOrder:", error);
    throw error;
  }
}

export const getPaymentMethods = async (amount: number, groups?: string[]) => {
  if (!PAYMENT_METHODS.includes("paytrail")) {
    throw new Error("Payment method not available");
  }
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

const confirmLineItems = async (
  items: CartItem[],
  defaultVatRate: number
): Promise<confirmedItems[]> => {
  // Fetch VAT rate

  // Process cart items
  const confirmedItems = await Promise.all(
    items.map(async (item: CartItem) => {
      const { product, variation } = item;

      const stamp = variation ? "VARIATION" : "PRODUCT";

      const productResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/product-by-id/${product.id}`,
        {
          headers: {
            "x-api-key": process.env.STOREFRONT_API_KEY || "",
          },
        }
      );
      if (!productResponse.ok) {
        throw new CartError(
          `Pahoittelut tuotetta ${product.name || ""} ei löytynyt`,
          product.id
        );
      }
      const confirmedProduct = (await productResponse.json()) as ProductFromApi;

      // Initialize current price based on product price
      let currentPrice = confirmedProduct.price; // Default to product price
      let confirmedVariation;

      // If a variation is specified, find it among the included variations
      if (variation) {
        confirmedVariation = confirmedProduct.variations.find(
          (v) => v.id === variation.id
        );

        // If the variation is not found, throw an error
        if (!confirmedVariation) {
          throw new CartError(
            `Variation not found for product ${confirmedProduct.name}`,
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
      if (!defaultVatRate && !confirmedProduct.vatPercentage) {
        throw new CartError("Kauppiaan asettamaa ALV:tä ei löytynyt", "0");
      }

      return {
        unitPrice: currentPrice,
        units: item.cartQuantity,
        vatPercentage: confirmedProduct.vatPercentage || defaultVatRate, // Use product or variation VAT if applicable
        productCode: variation ? variation.id : product.id,
        stamp,
        description: product.name,
      };
    })
  );

  return confirmedItems;
};
