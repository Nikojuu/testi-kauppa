"use server";

import { CartItem } from "@/hooks/use-cart";
import { Stripe } from "stripe";
import { stripe } from "../stripe";
import prisma from "@/app/utils/db";
import { isSaleActive } from "../utils";
import { randomUUID } from "crypto";
import { ItemType } from "@prisma/client";

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
      payment_method_types: ["card"],
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
      cancel_url: `${process.env.BASE_URL}/payment/cancel`,
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
  const shipmentMethods = await prisma.shipmentMethods.findMany({
    where: {
      storeId: process.env.TENANT_ID,
    },
    select: {
      id: true,
      name: true,
      price: true,
      min_estimate_delivery_days: true,
      max_estimate_delivery_days: true,
    },
  });

  return shipmentMethods.map(
    (method): Stripe.Checkout.SessionCreateParams.ShippingOption => ({
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: {
          amount: method.price,
          currency: "eur",
        },
        display_name: method.name,
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
}

async function confirmLineItems(
  items: CartItem[]
): Promise<Stripe.Checkout.SessionCreateParams.LineItem[]> {
  return Promise.all(
    items.map(async (item) => {
      const { product, variation } = item;

      const confirmedProduct = await prisma.product.findUnique({
        where: { id: product.id, storeId: process.env.TENANT_ID },
        include: { ProductVariation: true },
      });

      if (!confirmedProduct) {
        throw new CartError(
          `Pahoittelut tuotetta ${product.name || ""} ei löytynyt`,
          product.id
        );
      }

      let currentPrice = confirmedProduct.price;
      let confirmedVariation;

      if (variation) {
        confirmedVariation = confirmedProduct.ProductVariation.find(
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

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: product.name,
            description: variation
              ? `${product.name} - ${variation.optionName} (${variation.optionValue})`
              : product.name,
            images: product.images || [],
            metadata: {
              type: variation ? "VARIATION" : "PRODUCT",
              productCode: variation ? variation.id : product.id,
            },
          },
          unit_amount: currentPrice * 100, // Stripe expects amounts in cents
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
    quantity: item.quantity || 0,
    price: item.price_data?.unit_amount ? item.price_data.unit_amount / 100 : 0, // Convert cents to euros
    totalAmount:
      (item.quantity || 0) * ((item.price_data?.unit_amount ?? 0) / 100),
    // productCode: item.price_data.product_data.metadata.productCode,
    productCode: String(
      item.price_data?.product_data?.metadata?.productCode ?? ""
    ),
    itemType: item.price_data?.product_data?.metadata?.type as ItemType,
  }));

  await prisma.order.create({
    data: {
      id: orderId,
      status: "PENDING",
      storeId: process.env.TENANT_ID as string,
      totalAmount: orderLineItems.reduce(
        (sum, item) => sum + item.totalAmount,
        0
      ),

      OrderLineItems: {
        create: orderLineItems, // Use `create` to attach related items
      },
    },
  });
}
