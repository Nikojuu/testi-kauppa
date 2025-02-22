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
import Link from "next/link";
import { ClearCart } from "@/components/Cart/ClearCart";
import { Metadata } from "next";
import ImageKitImage from "@/components/ImageKitImage";
import { Order } from "@/app/utils/types";
import fetch from "node-fetch";
import { OrderItem } from "@/app/utils/sendOrderConfirmationEmail";

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
    const orderResponse = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order/${orderId}`,
      {
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
          "Content-Type": "application/json",
        },
      }
    );

    return await orderResponse.json();
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

  const order: Order = (await getData(orderId)) as Order;
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
  const shipmentMethod = order.orderShipmentMethod;
  const orderItems = order.OrderLineItems;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/order-items`,
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
          price: item.price,
          quantity: item.quantity,
        })),
      }),
    }
  );

  const items = (await res.json()) as OrderItem[];

  const totalPriceInCents =
    items.reduce((total, item) => {
      if (item && item.price && item.quantity) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0) + (shipmentMethod?.price ?? 0);

  const totalPrice = totalPriceInCents / 100;

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
                      <ImageKitImage
                        src={item.images || "/placeholder.png"}
                        alt={item.name || "Product image"}
                        width={64}
                        height={64}
                        className="h-full w-full rounded-md object-cover object-center "
                        transformations="w-64,h-64"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium">{item.name}</p>
                      {item.options?.map((opt, idx) => (
                        <p key={idx} className="text-sm text-gray-500">
                          {opt.name}: {opt.value}
                        </p>
                      ))}
                      <p className="text-sm">
                        {item.quantity} x {(item.price / 100).toFixed(2)} €
                      </p>
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
