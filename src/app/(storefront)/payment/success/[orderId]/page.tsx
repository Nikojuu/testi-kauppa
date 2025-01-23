import { CheckCircle, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/app/utils/db";
import Link from "next/link";
import { ClearCart } from "@/components/Cart/ClearCart";
import Image from "next/image";
import { Metadata } from "next";
import { ItemType, OrderCustomerData } from "@prisma/client";

export const metadata: Metadata = {
  title: "Pupun Korvat | Kiitos tilauksestasi!",
  description: "Kiitos tilauksestasi! Tässä yhteenveto ostoksestasi.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Pupun Korvat | Kiitos tilauksestasi!",
    type: "website",
  },
};

const getData = async (orderId: string) => {
  try {
    const data = await prisma.order.findUnique({
      where: {
        storeId: process.env.TENANT_ID,
        id: orderId,
      },
      include: {
        OrderLineItems: true,
        orderCustomerData: true,
        OrderShipmentMethod: true,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw new Error("Failed to fetch order data.");
  }
};

export default async function PaymentSuccessPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;

  const order = await getData(orderId);
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 my-32">
        <h1 className="text-red-500 text-xl">
          Tilausta ei löytynyt tai tapahtui virhe.
        </h1>
      </div>
    );
  }

  const customerData = order.orderCustomerData;
  const shipmentMethod = order.OrderShipmentMethod;
  const orderItems = order.OrderLineItems;

  let items: Array<{
    optionName: string | null;
    optionValue: string | null;
    name: string | null;
    images: string[];
    quantity: number;
    unitPrice: number;
  } | null>;
  try {
    items = await Promise.all(
      orderItems.map(
        async (item: {
          id: string;
          totalAmount: number;
          orderId: string;
          itemType: ItemType | null;
          quantity: number;
          price: number;
          productCode: string;
        }) => {
          const type = item.itemType;
          let product = null;

          if (type === "VARIATION") {
            product = await prisma.productVariation.findUnique({
              where: { id: item.productCode, storeId: process.env.TENANT_ID },
              select: {
                optionName: true,
                optionValue: true,
                Product: {
                  // Nested Product object in the case of variation
                  select: {
                    name: true,
                    images: true, // Access the images from the Product object
                  },
                },
              },
            });
          } else if (type === "PRODUCT") {
            product = await prisma.product.findUnique({
              where: { id: item.productCode, storeId: process.env.TENANT_ID },
              select: {
                name: true,
                images: true, // Directly access images for regular products
              },
            });
          } else if (type === "SHIPPING") {
            return null;
          }

          // Now check if product has Product property (for variations)
          const images =
            type === "VARIATION"
              ? (product as { Product: { images: string[] } })?.Product
                  ?.images || []
              : (product as { images: string[] })?.images || [];

          return {
            optionName:
              type === "VARIATION"
                ? (product as { optionName: string | null })?.optionName
                : null,
            optionValue:
              type === "VARIATION"
                ? (product as { optionValue: string | null })?.optionValue
                : null,
            name:
              type === "VARIATION"
                ? (product as { Product: { name: string } })?.Product?.name
                : (product as { name: string })?.name, // Handle name from Product if variation
            images, // Use the correct image property
            quantity: item.quantity,
            unitPrice: item.price / 100,
          };
        }
      )
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    items = [];
  }

  const totalPrice =
    items.reduce((total, item) => {
      if (item && item.unitPrice && item.quantity) {
        return total + item.unitPrice * item.quantity;
      }
      return total;
    }, 0) +
    (shipmentMethod?.price ?? 0) / 100;
  return (
    <div className="container mx-auto px-4 py-8 my-32">
      <ClearCart />
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <CardTitle>Kiitos tilauksestasi!</CardTitle>
          </div>
          <CardDescription>
            Tilauksesi on vastaanotettu. Tässä yhteenveto ostoksestasi:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Tilauksen tiedot</h3>
            <p>Tilausnumero: {order.orderNumber}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Tuotteet</h3>
            <div className="space-y-4">
              {items.map((item, index) => {
                if (!item) return null;
                return (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 relative">
                      <Image
                        src={
                          (item.images && item.images[0]) || "/placeholder.png"
                        }
                        alt={item.name || "Product image"}
                        fill
                        className="rounded-md object-cover object-center"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{item.name}</p>
                      {item.optionName && (
                        <p className="text-sm text-gray-500">
                          {item.optionName}: {item.optionValue}
                        </p>
                      )}
                      <p className="text-sm">
                        {item.quantity} x {item.unitPrice.toFixed(2)} €
                      </p>
                    </div>
                    <div className="flex-shrink-0 font-medium">
                      {(item.unitPrice * item.quantity).toFixed(2)} €
                    </div>
                  </div>
                );
              })}

              <div>
                <h3 className="font-semibold mb-2">Toimitus</h3>
                <p>{shipmentMethod?.name}</p>
                <div className="flex justify-between items-center mb-4">
                  <p>{shipmentMethod?.description}</p>
                  <p>{((shipmentMethod?.price ?? 0) / 100).toFixed(2)} €</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="mt-4 flex justify-between items-center font-semibold">
              <span>Yhteensä:</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Asiakastiedot</h3>
            <p>
              {customerData?.firstName} {customerData?.lastName}
            </p>
            <p>{customerData?.address}</p>
            <p>
              {customerData?.postalCode} {customerData?.city}
            </p>
            <p>{customerData?.phone}</p>
            <p>{customerData?.email}</p>
          </div>
          <Separator />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span>
              Lähetämme tilauksesi mahdollisimman pian. Saat sähköpostiisi
              tilausvahvistuksen
            </span>
          </div>
          <Link href="/products">
            <Button className="w-full bg-tertiary">Jatka ostoksia</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
