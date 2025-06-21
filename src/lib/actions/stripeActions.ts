"use server";

import { CartItem } from "@/hooks/use-cart";
import { Stripe } from "stripe";
import { stripe } from "../stripe";
import { isSaleActive } from "../utils";
import { randomUUID } from "crypto";
import {
  ApiResponseShipmentMethods,
  ProductFromApi,
  ShipmentMethods,
} from "@/app/utils/types";
import { default as nodeFetch } from "node-fetch";
import { PAYMENT_METHODS } from "@/app/utils/constants";
import { getUser } from "./authActions";

class CartError extends Error {
  productId: string;
  variationId?: string;

  constructor(message: string, productId: string, variationId?: string) {
    super(message);
    this.productId = productId;
    this.variationId = variationId;
  }
}
export async function createStripeCheckoutSession(
  items: CartItem[]
): Promise<
  | string
  | { error: boolean; message: string; productId: string; variationId?: string }
  | null
> {
  if (!PAYMENT_METHODS.includes("stripe")) {
    throw new CartError("Stripe is not enabled", "stripe-disabled");
  }
  try {
    const orderId = randomUUID();
    const lineItems = await confirmLineItems(items);

    const shipping_options = await getFormattedShippingOptions();

    if (items.length === 0) {
      throw new CartError("Ostoskori on tyhjä", "cart-empty");
    }
    if (!shipping_options.length) {
      throw new CartError(
        "Toimitustapoja ei ole saatavilla (shipit toimitustavat eivät ole tällä hetkellä saatavilla Stripe Checkoutissa)",
        "no-shipping-options"
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna"],
      line_items: lineItems,
      automatic_tax: {
        enabled: true,
      },
      shipping_address_collection: {
        allowed_countries: ["FI"],
      },
      locale: "fi",
      phone_number_collection: {
        enabled: true,
      },
      shipping_options: shipping_options,
      mode: "payment",
      metadata: {
        orderId: orderId,
      },

      success_url: `${process.env.BASE_URL}/payment/success/${orderId}`,
      cancel_url: `${process.env.BASE_URL}/payment/cancel/${orderId}`,
    });

    // create pending order in database
    await createPendingOrder(lineItems, orderId);
    return session.url;
    // Create line items for the Stripe Checkout session and make sure cart items matches database items
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
}

async function getFormattedShippingOptions(): Promise<
  Stripe.Checkout.SessionCreateParams.ShippingOption[]
> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/shipment-methods`,
      {
        method: "GET", // Use GET method to fetch shipment methods
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.error || "Failed to fetch shipment methods from API"
      );
    }

    const apiResponse: ApiResponseShipmentMethods = await res.json(); // Type the API response
    const shipmentMethods: ShipmentMethods[] = apiResponse.shipmentMethods; // Extract shipmentMethods array

    return shipmentMethods.map(
      (method): Stripe.Checkout.SessionCreateParams.ShippingOption => ({
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: method.price,
            currency: "eur",
          },
          display_name: method.name.substring(0, 50),
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: method.min_estimate_delivery_days ?? 1,
            },
            maximum: {
              unit: "business_day",
              value: method.max_estimate_delivery_days ?? 1,
            },
          },
          metadata: {
            shipmentMethodId: method.id,
          },
        },
      })
    );
  } catch (error) {
    console.error("Error fetching and formatting shipment options:", error);
    return []; // Or handle error in a way appropriate for your application (e.g., display error message to user)
  }
}
async function confirmLineItems(
  items: CartItem[]
): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> {
  const defaultVatRate = await (async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/default-vat-rate`,
        {
          headers: {
            "x-api-key": process.env.STOREFRONT_API_KEY || "",
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch VAT rate");
      }
      return data;
    } catch (error) {
      console.error("Error fetching default VAT rate:", error);
      throw error;
    }
  })();

  return Promise.all(
    items.map(async (item) => {
      const { product, variation } = item;

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
      const confirmedProduct: ProductFromApi = await productResponse.json();

      if (!confirmedProduct) {
        throw new CartError(
          `Pahoittelut tuotetta ${product.name || ""} ei löytynyt`,
          product.id
        );
      }

      let currentPrice = confirmedProduct.price;
      let confirmedVariation;

      if (variation) {
        confirmedVariation = confirmedProduct.variations.find(
          (v) => v.id === variation.id
        );

        if (!confirmedVariation) {
          throw new CartError(
            `Pahoittelut ${product.name} ei löytynyt`,
            product.id,
            variation.id
          );
        }

        const isOnSale = isSaleActive(
          confirmedVariation.saleStartDate,
          confirmedVariation.saleEndDate
        );

        currentPrice =
          isOnSale && confirmedVariation.salePrice
            ? confirmedVariation.salePrice
            : (confirmedVariation.price ?? currentPrice);

        if (
          confirmedVariation.quantity !== null &&
          confirmedVariation.quantity < item.cartQuantity
        ) {
          throw new CartError(
            `Pahoittelut tuotetta ${product.name} ei ole riittävästi varastossa`,
            product.id,
            variation.id
          );
        }
      } else {
        const isOnSale = isSaleActive(
          confirmedProduct.saleStartDate,
          confirmedProduct.saleEndDate
        );

        currentPrice =
          isOnSale && confirmedProduct.salePrice
            ? confirmedProduct.salePrice
            : (confirmedProduct.price ?? currentPrice);

        if (
          confirmedProduct.quantity !== null &&
          confirmedProduct.quantity < item.cartQuantity
        ) {
          throw new CartError(
            `Tuotetta ${product.name} ei ole riittävästi varastossa`,
            product.id
          );
        }
      }
      const variationOptionName = variation?.options
        .map((o) => o.optionType.name)
        .join(", ");

      const variationOptionValue = variation?.options
        .map((o) => o.value)
        .join(", ");

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: variation
              ? `${product.name} - ${variationOptionName} (${variationOptionValue})`
              : product.name,
            images: product.images || [],
            metadata: {
              type: variation ? "VARIATION" : "PRODUCT",
              productCode: variation ? variation.id : product.id,
              vatRate: confirmedProduct.vatPercentage ?? defaultVatRate,
            },
          },
          unit_amount: currentPrice, // Stripe expects amounts in cents
          tax_behavior: "inclusive",
        },
        quantity: item.cartQuantity,
      };
    })
  );
}

async function createPendingOrder(
  confirmedItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string
) {
  // Convert Stripe line items into the required database schema
  const orderLineItems = confirmedItems.map((item) => ({
    name: item.price_data?.product_data?.name ?? "",
    quantity: item.quantity || 0,
    price: item.price_data?.unit_amount ?? 0,
    totalAmount: (item.quantity ?? 1) * (item.price_data?.unit_amount ?? 0),
    productCode: String(
      item.price_data?.product_data?.metadata?.productCode ?? ""
    ),
    itemType: item.price_data?.product_data?.metadata?.type,
    vatRate: Number(item.price_data?.product_data?.metadata?.vatRate) || 25.5,
  }));

  try {

    const { user } = await getUser();
    const body: {
      orderId: string;
      confirmedItems: typeof orderLineItems;
      totalAmount: number;
      customerId?: string;
    } = {
      orderId: orderId,
      confirmedItems: orderLineItems,
      totalAmount: orderLineItems.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      ),
    };

    if (user && user.id) {
      body.customerId = user.id; // Add customerId if logged in
    }

    const res = await nodeFetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
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
