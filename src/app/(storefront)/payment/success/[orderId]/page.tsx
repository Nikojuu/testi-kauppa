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
import Image from "next/image";
import { ClearCart } from "@/components/Cart/ClearCart";
import { Metadata } from "next";
import ImageKitImage from "@/components/ImageKitImage";
import { Order } from "@/app/utils/types";
import fetch from "node-fetch";

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
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

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

  const formatPrice = (price: number) => {
    if (price === 0) {
      return <span className="text-green-600 font-semibold">Ilmainen</span>;
    }
    return `${(price / 100).toFixed(2)} €`;
  };

  return (
    <div className="container mx-auto px-4 py-8 my-8">
      <ClearCart />

      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Kiitos tilauksestasi!
        </h1>
        <p className="text-green-600">
          Tilausnumero:{" "}
          <span className="font-semibold">#{order.orderNumber}</span>
        </p>
        <p className="text-green-600">
          Tilauksen tila:{" "}
          <span className=" capitalize">
            {order.status === "PAID" ? "Maksettu" : order.status}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Order Line Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Tilatut tuotteet
            </CardTitle>
            <CardDescription>Yhteenveto ostoksestasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.OrderLineItems.map((item, index) => (
              <div key={item.id} className="border-b pb-4 last:border-b-0">
                <div className="flex gap-4">
                  {item.images.length > 0 && (
                    <div className="w-16 h-16 flex-shrink-0">
                      <ImageKitImage
                        src={item.images[0]}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Määrä: {item.quantity} kpl</p>
                      <p>Yksikköhinta: {formatPrice(item.price)}</p>
                      <p>ALV: {item.vatRate}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="">{formatPrice(item.totalAmount)}</p>
                  </div>
                </div>
              </div>
            ))}

            <Separator />

            <div className="flex justify-between items-center text-lg font-bold">
              <span>Yhteensä:</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Shipment Method & Customer Info */}
        <div className="space-y-6">
          {/* Shipment Method */}
          {order.orderShipmentMethod && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  Toimitusmenetelmä
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {order.orderShipmentMethod.logo && (
                      <Image
                        src={order.orderShipmentMethod.logo}
                        alt={order.orderShipmentMethod.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {order.orderShipmentMethod.name}
                      </h3>
                      {order.orderShipmentMethod.description && (
                        <p className="text-sm text-gray-600">
                          {order.orderShipmentMethod.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Toimituskulu:</span>
                    <span className="font-semibold">
                      {formatPrice(order.orderShipmentMethod.price)}
                    </span>
                  </div>

                  {order.orderShipmentMethod.vatRate && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">ALV:</span>
                      <span>{order.orderShipmentMethod.vatRate}%</span>
                    </div>
                  )}

                  {order.orderShipmentMethod.trackingNumber && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600 mb-1">
                        Seurantanumero:
                      </p>
                      <p className="font-mono font-semibold">
                        {order.orderShipmentMethod.trackingNumber}
                      </p>
                    </div>
                  )}

                  {order.orderShipmentMethod.trackingUrls &&
                    order.orderShipmentMethod.trackingUrls.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Seuranta:</p>
                        {order.orderShipmentMethod.trackingUrls.map(
                          (url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                              Seuraa lähetystä #{index + 1}
                            </a>
                          )
                        )}
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Customer Information */}
          {order.orderCustomerData && (
            <Card>
              <CardHeader>
                <CardTitle>Toimitusosoite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-gray-600">
                  <p className="font-semibold text-gray-900">
                    {order.orderCustomerData.firstName}{" "}
                    {order.orderCustomerData.lastName}
                  </p>
                  <p>{order.orderCustomerData.address}</p>
                  <p>
                    {order.orderCustomerData.postalCode}{" "}
                    {order.orderCustomerData.city}
                  </p>
                  <p>{order.orderCustomerData.email}</p>
                  {order.orderCustomerData.phone && (
                    <p>{order.orderCustomerData.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <Card className="mt-8 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Mitä tapahtuu seuraavaksi?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <p>
                Saat tilausvahvistuksen sähköpostiisi muutaman minuutin sisällä.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <p>
                Käsittelemme tilauksesi ja lähetämme sen valitsemallasi
                toimitustavalla.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <p>Saat seurantakoodin, kun lähetys on matkalla sinulle.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/" className="w-full">
            <Button className="w-full">Palaa etusivulle</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
