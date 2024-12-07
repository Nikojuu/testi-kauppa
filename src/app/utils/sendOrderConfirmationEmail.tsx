import OrderConfirmationEmail from "@/components/Email/OrderConfirmation";

import { Resend } from "resend";
import prisma from "./db";

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
  stamp: string;
  quantity: number;
  images: string | null;

  units: number;
  unitPrice: number;

  vatPercentage: number;
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

export async function sendOrderConfirmationEmail(
  customerData: CustomerData,
  orderItems: Product[],
  shipmentMethod: shipmentMethod
) {
  try {
    const items = await Promise.all(
      orderItems.map(async (item) => {
        const [type] = item.stamp.split("-");

        if (type === "variation") {
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
            throw new Error(`Product variation not found: ${item.id}`);
          }

          return {
            ...item,
            name: productVariation.Product.name,

            images: productVariation.Product.images[0], // Include product images
          };
        } else if (type === "product") {
          const product = await prisma.product.findUnique({
            where: { id: item.productCode, storeId: process.env.TENANT_ID },
            select: {
              name: true,

              images: true, // Fetch product's images
            },
          });

          if (!product) {
            throw new Error(`Product not found: ${item.id}`);
          }

          return {
            ...item,
            name: product.name,

            // Use product price
            images: product.images[0], // Include product images
          };
        } else if (type === "shipping") {
          const shipitShiptment = await prisma.shipitShippingMethod.findUnique({
            where: { id: item.productCode, storeId: process.env.TENANT_ID },
            select: {
              name: true,

              logo: true,
            },
          });
          if (!shipitShiptment) {
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
        throw new Error(`Unknown item type: ${type}`);
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
      throw new Error("Shop information not found");
    }

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
