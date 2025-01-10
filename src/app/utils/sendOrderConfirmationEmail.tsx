import OrderConfirmationEmail from "@/components/Email/OrderConfirmation";

import { Resend } from "resend";
import prisma from "./db";
import { OrderLineItems } from "@prisma/client";

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
export interface ShopInfo {
  phone: string;
  email: string;
  Store: {
    name: string;
  };
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
    const items = await Promise.all(
      orderItems.map(async (item) => {
        const type = item.itemType;

        if (type === "VARIATION") {
          const productVariation = await prisma.productVariation.findUnique({
            where: { id: item.productCode, storeId: process.env.TENANT_ID },
            include: {
              Product: {
                select: {
                  name: true,

                  images: true, // Fetch the product's images
                },
              },
            },
          });

          if (!productVariation) {
            throw new EmailError("Product variation not found");
          }

          return {
            ...item,
            name: productVariation.Product.name,

            images: productVariation.Product.images[0], // Include product images
          };
        } else if (type === "PRODUCT") {
          const product = await prisma.product.findUnique({
            where: { id: item.productCode, storeId: process.env.TENANT_ID },
            select: {
              name: true,

              images: true, // Fetch product's images
            },
          });

          if (!product) {
            throw new EmailError("Product not found");
          }

          return {
            ...item,
            name: product.name,

            // Use product price
            images: product.images[0], // Include product images
          };
        } else if (type === "SHIPPING") {
          const shipitShiptment = await prisma.shipitShippingMethod.findUnique({
            where: { id: item.productCode, storeId: process.env.TENANT_ID },
            select: {
              name: true,

              logo: true,
            },
          });
          const shipmentMethod = await prisma.shipmentMethods.findUnique({
            where: { id: item.productCode, storeId: process.env.TENANT_ID },
            select: {
              name: true,
            },
          });
          if (!shipitShiptment) {
            if (shipmentMethod) {
              return {
                ...item,
                name: shipmentMethod.name,
                images: " https://via.placeholder.com/80x80?text=Toimitus",
              };
            }
            return {
              ...item,
              name: "Toimitus",
              images: " https://via.placeholder.com/80x80?text=Toimitus",
            };
          }
          return {
            ...item,
            name: shipitShiptment.name,
            images: shipitShiptment.logo,
          };
        }

        // Handle unknown types or return item as is
        throw new EmailError("Unknown item type");
      })
    );

    const shopInfo = await prisma.storeSettings.findFirst({
      where: { storeId: process.env.TENANT_ID },
      select: {
        phone: true,
        email: true,
        Store: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!shopInfo) {
      throw new EmailError("Shop info not found");
    }

    const { data, error } = await resend.emails.send({
      from: `${shopInfo.email} <info@putiikkipalvelu.fi>`,
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
    } else {
      console.log("Email sent successfully:", data);
    }
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
