import OrderConfirmationEmail from "@/components/Email/OrderConfirmation";

import { Resend } from "resend";
import { OrderLineItems, StoreSettingsWithName } from "./types";

const resend = new Resend(process.env.RESEND_API_KEY);
export interface CustomerData {
  first_name: string;
  last_name: string;

  email: string;
  address: string;
  postal_code: string;
  city: string;
  phone: string;
}

export interface Product {
  id: string;
  name: string;

  productCode: string;

  quantity: number;
  images: string | null;

  price: number;
}
export interface shipmentMethod {
  id: string;
  name: string;
  price: number;
  logo: string;
}

class EmailError extends Error {
  constructor(message: string) {
    super(message); // Pass the message to the parent Error constructor
    this.name = "EmailError"; // Set the error name
  }
}

export async function sendOrderConfirmationEmail(
  customerData: CustomerData,
  orderItems: OrderLineItems[],
  shipmentMethod: shipmentMethod,
  orderNumber: number
) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/email-order-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
        },
        body: JSON.stringify({
          orderItems: orderItems.map((item) => ({
            productCode: item.productCode,
            itemType: item.itemType,
          })),
        }),
      }
    );
    const items = await res.json();

    const infoResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/store-settings`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
        },
      }
    );
    const shopInfo = (await infoResponse.json()) as StoreSettingsWithName;

    const { data, error } = await resend.emails.send({
      from: `${shopInfo.Store.name} <info@putiikkipalvelu.fi>`,
      to: [customerData.email],
      subject: "Tilausvahvistus",
      replyTo: shopInfo.email,
      react: (
        <OrderConfirmationEmail
          customerData={customerData}
          orderItems={items}
          shopInfo={shopInfo}
          shipmentMethod={shipmentMethod}
          orderNumber={orderNumber}
        />
      ),
    });

    if (error) {
      console.error("Error sending email:", error);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
