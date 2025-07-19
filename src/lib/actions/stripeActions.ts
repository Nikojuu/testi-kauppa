"use server";

import { CartItem } from "@/hooks/use-cart";
import { Stripe } from "stripe";
import { stripe } from "../stripe";
import { isSaleActive } from "../utils";
import { randomUUID } from "crypto";
import {
  ApiResponseShipmentMethods,
  BuyXPayYCampaign,
  CampaignApiResponse,
  Category,
  ProductFromApi,
  ShipmentMethods,
} from "@/app/utils/types";
// import { default as fetch } from "node-fetch";
import { PAYMENT_METHODS } from "@/app/utils/constants";
import { getUser } from "./authActions";
import { ChosenShipmentType } from "@/components/Checkout/StripeCheckoutPage";
import { z } from "zod";

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
  phone: z
    .string()
    .min(1, "Puhelin numero vaaditaan")
    
});
 type ServerCustomerData = z.infer<typeof serverCustomerDataSchema>;
class CartError extends Error {
  productId: string;
  variationId?: string;

  constructor(message: string, productId: string, variationId?: string) {
    super(message);
    this.name = 'CartError';
    this.productId = productId;
    this.variationId = variationId;
  }
}
export async function createStripeCheckoutSession(
  items: CartItem[],
  cartTotal: number, // in euros
  chosenShipmentMethod: ChosenShipmentType | null,
  customerData: ServerCustomerData 
): Promise<
  | string
  | { error: boolean; message: string; productId: string; variationId?: string }
  | null
> {
  if (!PAYMENT_METHODS.includes("stripe")) {
    throw new CartError("Stripe is not enabled", "stripe-disabled");
  }
  
  // Validate customer data with Zod schema
  const validatedCustomerData = serverCustomerDataSchema.safeParse(customerData);
  if (!validatedCustomerData.success) {
    throw new CartError("Virheelliset asiakastiedot", "customer-data-invalid");
  }
  
  try {
    const orderId = randomUUID();
    const lineItems = await confirmLineItems(items);
    

    // const shipping_options = await getFormattedShippingOptions(cartTotal);
    const shipping_data = await getShippingData(chosenShipmentMethod, cartTotal);
    if (items.length === 0) {
      throw new CartError("Ostoskori on tyhjä", "cart-empty");
    }
    

    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna"],
      line_items: lineItems,
      locale: "fi",
      mode: "payment",
   
      custom_fields: [
        
      ],
      metadata: {
        orderId: orderId,
      },
     shipping_options: [
      shipping_data,
     ],
      customer_email: validatedCustomerData.data.email,
      payment_intent_data: {
        shipping: {
          name: `${validatedCustomerData.data.first_name} ${validatedCustomerData.data.last_name}`,
          phone: validatedCustomerData.data.phone,
          address: {
            line1: validatedCustomerData.data.address,
            country: "FI",
            city: validatedCustomerData.data.city,
            postal_code: validatedCustomerData.data.postal_code,
          },
        },

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

async function getShippingData(chosenShipmentMethod: ChosenShipmentType | null, cartTotal: number): Promise<Stripe.Checkout.SessionCreateParams.ShippingOption> {
  const shipmentMethodRes = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/shipment-methods/${chosenShipmentMethod?.shipmentMethodId}`,
    { headers: { "x-api-key": process.env.STOREFRONT_API_KEY || "" } }
  );
  const shippingData = await shipmentMethodRes.json();

   const campaignRes = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/campaigns/FREE_SHIPPING`,
      { headers: { "x-api-key": process.env.STOREFRONT_API_KEY || "" } }
    );
    const campaignData = await campaignRes.json();
    const freeShippingCampaign = campaignData.campaign?.FreeShippingCampaign;


    if (freeShippingCampaign && 
        freeShippingCampaign.shipmentMethods?.some((method: ShipmentMethods) => method.id === chosenShipmentMethod?.shipmentMethodId) && 
        cartTotal >= freeShippingCampaign.minimumSpend) {
      return {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "eur",
          },
          display_name: shippingData.name.substring(0, 50),
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: parseInt(shippingData.min_estimate_delivery_days?.toString() || "1", 10) || 1,
            },
            maximum: {
              unit: "business_day",
              value: parseInt(shippingData.max_estimate_delivery_days?.toString() || "1", 10) || 1,
            },
          },
          metadata: {
            shippingCampaignId: freeShippingCampaign.id,
          },
        },
      };
    }else{
      return {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: shippingData.price,
            currency: "eur",
          },
          display_name: shippingData.name.substring(0, 50),
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: parseInt(shippingData.min_estimate_delivery_days?.toString() || "1", 10) || 1,
            },
            maximum: {
              unit: "business_day",
              value: parseInt(shippingData.max_estimate_delivery_days?.toString() || "1", 10) || 1,
            },
          },
          metadata: {
            shippingCampaignId: null,
          },
        },
      }
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

  const campaignRes = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/campaigns/BUY_X_PAY_Y`,
      { headers: { "x-api-key": process.env.STOREFRONT_API_KEY || "" } }
  );
  const campaignData: CampaignApiResponse = await campaignRes.json();
  const buyXPayYCampaign: BuyXPayYCampaign | null | undefined = campaignData.campaign?.BuyXPayYCampaign;


  const confirmedLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = await Promise.all(
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
    // Prerequisite: Ensure ProductFromApi includes the categories array
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
            categories: confirmedProduct.categories?.map((category) => category.id).join(",") || "",
          },
        },
        unit_amount: currentPrice, // Stripe expects amounts in cents
        tax_behavior: "inclusive",
      },
      quantity: item.cartQuantity,
    };
  })
  );
if (buyXPayYCampaign) {
    return applyBuyXPayYCampaign(confirmedLineItems, buyXPayYCampaign);
  }



  return confirmedLineItems ;



}

function applyBuyXPayYCampaign(confirmedLineItems: Stripe.Checkout.SessionCreateParams.LineItem[], buyXPayYCampaign: BuyXPayYCampaign): Stripe.Checkout.SessionCreateParams.LineItem[] {

  const { buyQuantity, payQuantity, applicableCategories } = buyXPayYCampaign;
  const applicableCategoryIds = new Set(applicableCategories.map(c => c.id));
  const finalLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // --- 2. Find All Individual Units Eligible for the Campaign ---
  const eligibleUnits = confirmedLineItems.flatMap(item => {
    const metadata = item.price_data?.product_data?.metadata;
    const categoriesString = metadata?.categories as string | undefined;
    const itemCategories = categoriesString ? categoriesString.split(',') : [];
    
    // Check if any of the product's categories are in the campaign's list
    const isEligible = itemCategories.some(id => applicableCategoryIds.has(id));
    
    if (isEligible) {
      // Create an entry for each single unit of the item (e.g., quantity of 3 becomes 3 entries)
      return Array.from({ length: item.quantity as number }, () => ({
        price: item.price_data?.unit_amount as number,
        originalItem: item, // Keep a reference to the original line item
      }));
    }
    
    return []; // flatMap will discard empty arrays
  });

  // --- 3. Check if Campaign Applies and Find Items to Make Free ---
  // If not enough eligible items, return the original cart.
  if (eligibleUnits.length < buyQuantity) {
    return confirmedLineItems;
  }

 // Sort by price to find the cheapest items
  eligibleUnits.sort((a, b) => a.price - b.price);
  
  const numToMakeFree = buyQuantity - payQuantity;
  const itemsToMakeFree = eligibleUnits.slice(0, numToMakeFree);
  
  // Create a map to count how many units of each product should be free
  // e.g., { "prod_abc": 1, "prod_xyz": 2 }
  const freeCountMap = new Map<string, number>();
  for (const freebie of itemsToMakeFree) {
    const productCode = freebie.originalItem.price_data?.product_data?.metadata?.productCode as string;
    freeCountMap.set(productCode, (freeCountMap.get(productCode) || 0) + 1);
  }

  // --- 4. Rebuild the Final Line Items List with Discounts ---
  for (const item of confirmedLineItems) {
    const productCode = item.price_data?.product_data?.metadata?.productCode as string;
    const freeQuantity = freeCountMap.get(productCode) || 0;
    const paidQuantity = (item.quantity as number) - freeQuantity;
    
    // Add the part of the quantity that the customer pays for
    if (paidQuantity > 0) {
      finalLineItems.push({
        ...item,
        quantity: paidQuantity,
      });
    }

    // Add the part of the quantity that is free as a separate line item
    if (freeQuantity > 0) {
      finalLineItems.push({
        ...item,
        price_data: {
          ...item.price_data!,
          unit_amount: 0, 
          product_data: {
            ...item.price_data?.product_data,
            name: `${item.price_data?.product_data?.name} (Kampanja)`, 
          },
        },
        quantity: freeQuantity,
      });
    }
  }

  return finalLineItems;
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

    const res = await fetch(
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
