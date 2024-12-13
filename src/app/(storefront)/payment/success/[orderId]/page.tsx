/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";

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
export const metadata: Metadata = {
  title: "Ostoskori | Pupun Korvat",
  description: "Hallinnoi ostoskoria ja tee tilaus",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Ostoskori | Pupun Korvat",
    type: "website",
  },
};

const getData = async (orderId: string) => {
  try {
    const data = await prisma.order.findUnique({
      where: { id: orderId },
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
  let order;
  try {
    order = await getData(orderId);
    if (!order) {
      notFound();
    }
  } catch (error) {
    console.error("Error processing payment success page:", error);
    return (
      <div className="container mx-auto px-4 py-8 my-32">
        <h1 className="text-red-500 text-xl">
          Tilausta ei löytynyt tai tapahtui virhe.
        </h1>
      </div>
    );
  }

  const customerData = JSON.parse(order.customerData as string);
  const shipmentMethod = JSON.parse(order.shipmentMethod as string);
  const orderItems = JSON.parse(order.items as string);

  let items;
  try {
    items = await Promise.all(
      orderItems.map(
        async (item: {
          stamp: string;
          productCode: string;
          units: number;
          unitPrice: number;
        }) => {
          const [type] = item.stamp.split("-");
          let product = null;

          if (type === "variation") {
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
          } else if (type === "product") {
            product = await prisma.product.findUnique({
              where: { id: item.productCode, storeId: process.env.TENANT_ID },
              select: {
                name: true,
                images: true, // Directly access images for regular products
              },
            });
          } else if (type === "shipping") {
            return null;
          }

          // Now check if product has Product property (for variations)
          const images =
            type === "variation"
              ? (product as any)?.Product?.images || []
              : (product as any)?.images || [];

          return {
            name:
              type === "variation"
                ? (product as { Product: { name: string } })?.Product?.name
                : (product as { name: string })?.name, // Handle name from Product if variation
            images, // Use the correct image property
            quantity: item.units,
            unitPrice: item.unitPrice,
          };
        }
      )
    );
  } catch (error) {
    console.error("Error fetching product data:", error);
    items = [];
  }

  const totalPrice = items.reduce((total, item) => {
    if (item && item.unitPrice && item.quantity) {
      return total + item.unitPrice * item.quantity;
    }
    return total;
  }, 0);
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
            Tilauksesi on käsitelty onnistuneesti. Tässä yhteenveto
            ostoksestasi:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Tilauksen tiedot</h3>
            <p>Tilausnumero: {order.id}</p>

            <p>Tila: {order.status === "PAID" ? "Maksettu" : order.status}</p>
          </div>

          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Toimitus</h3>
            <p>{shipmentMethod.name}</p>
            <p>{shipmentMethod.description}</p>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-4">Tuotteet</h3>
            <div className="space-y-4">
              {items.filter(Boolean).map((item, index) => (
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
                      {item.quantity} x {(item.unitPrice / 100).toFixed(2)} €
                    </p>
                  </div>
                  <div className="flex-shrink-0 font-medium">
                    {((item.unitPrice * item.quantity) / 100).toFixed(2)} €
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center font-semibold">
              <span>Yhteensä:</span>
              <span>{(totalPrice / 100).toFixed(2)} €</span>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-semibold mb-2">Asiakastiedot</h3>
            <p>
              {customerData.first_name} {customerData.last_name}
            </p>
            <p>{customerData.address}</p>
            <p>
              {customerData.postal_code} {customerData.city}
            </p>
            <p>{customerData.phone}</p>
            <p>{customerData.email}</p>
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
