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
import { Metadata } from "next";
import { getImageUrl } from "@/lib/utils";
import { Order } from "@/app/utils/types";

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
      <section className="pt-8 md:pt-16 pb-16 bg-warm-white min-h-screen">
        <div className="container mx-auto px-4 max-w-screen-xl">
          <div className="relative bg-cream/30 border border-rose-gold/10 p-8 md:p-12 text-center max-w-2xl mx-auto mt-16">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/30" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/30" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/30" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/30" />

            <h1 className="font-primary text-2xl md:text-3xl font-semibold text-burnt-orange">
              Tilausta ei löytynyt tai tapahtui virhe.
            </h1>
          </div>
        </div>
      </section>
    );
  }

  const formatPrice = (price: number) => {
    if (price === 0) {
      return <span className="text-green-600 font-semibold">Ilmainen</span>;
    }
    return `${(price / 100).toFixed(2)} €`;
  };

  return (
    <section className="pt-8 md:pt-16 pb-16 bg-warm-white min-h-screen">
      <div className="container mx-auto px-4 max-w-screen-xl">
        {/* Success Header */}
        <div className="text-center mb-12 md:mb-16">
          {/* Decorative top element */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose-gold/40" />
            <div className="w-2 h-2 bg-rose-gold/30 diamond-shape" />
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose-gold/40" />
          </div>

          <CheckCircle className="h-16 w-16 md:h-20 md:w-20 text-sage-green mx-auto mb-6" />

          <h1 className="font-primary text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            Kiitos tilauksestasi!
          </h1>

          <div className="font-secondary text-charcoal/70 space-y-2">
            <p className="text-base md:text-lg">
              Tilausnumero:{" "}
              <span className="font-semibold text-charcoal">#{order.orderNumber}</span>
            </p>
            <p className="text-base md:text-lg">
              Tilauksen tila:{" "}
              <span className="font-semibold text-sage-green capitalize">
                {order.status === "PAID" ? "Maksettu" : order.status}
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Line Items */}
          <div className="relative bg-cream/30 border border-rose-gold/10 p-6 md:p-8">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/30" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/30" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/30" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/30" />

            <div className="mb-6">
              <h2 className="font-primary text-xl md:text-2xl font-semibold text-charcoal flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-sage-green" />
                Tilatut tuotteet
              </h2>
              <p className="font-secondary text-sm text-charcoal/60">Yhteenveto ostoksestasi</p>
            </div>

            <div className="space-y-4">
              {order.OrderLineItems.map((item, index) => (
                <div key={item.id} className="border-b border-rose-gold/10 pb-4 last:border-b-0">
                  <div className="flex gap-4">
                    {item.images.length > 0 && (
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={getImageUrl(item.images[0], "thumbnail")}
                          alt={item.name}
                          className="rounded-md object-cover w-full h-full border border-rose-gold/10"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-primary font-semibold text-charcoal mb-1">{item.name}</h3>
                      <div className="font-secondary text-sm text-charcoal/60 space-y-0.5">
                        <p>Määrä: {item.quantity} kpl</p>
                        <p>Yksikköhinta: {formatPrice(item.price)}</p>
                        <p>ALV: {item.vatRate}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-secondary font-semibold text-charcoal">{formatPrice(item.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Decorative separator */}
              <div className="h-[1px] bg-gradient-to-r from-transparent via-rose-gold/20 to-transparent my-4" />

              <div className="flex justify-between items-center font-primary text-lg md:text-xl font-bold text-charcoal">
                <span>Yhteensä:</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipment Method & Customer Info */}
          <div className="space-y-6 lg:space-y-8">
            {/* Shipment Method */}
            {order.orderShipmentMethod && (
              <div className="relative bg-cream/30 border border-rose-gold/10 p-6 md:p-8">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/30" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/30" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/30" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/30" />

                <h2 className="font-primary text-xl md:text-2xl font-semibold text-charcoal flex items-center gap-2 mb-6">
                  <Truck className="h-5 w-5 text-burnt-orange" />
                  Toimitusmenetelmä
                </h2>
                <div className="space-y-4">
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
                      <h3 className="font-primary font-semibold text-charcoal">
                        {order.orderShipmentMethod.name}
                      </h3>
                      {order.orderShipmentMethod.description && (
                        <p className="font-secondary text-sm text-charcoal/60">
                          {order.orderShipmentMethod.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="h-[1px] bg-gradient-to-r from-transparent via-rose-gold/20 to-transparent" />

                  <div className="flex justify-between items-center font-secondary">
                    <span className="text-charcoal/60">Toimituskulu:</span>
                    <span className="font-semibold text-charcoal">
                      {formatPrice(order.orderShipmentMethod.price)}
                    </span>
                  </div>

                  {order.orderShipmentMethod.vatRate && (
                    <div className="flex justify-between items-center font-secondary">
                      <span className="text-charcoal/60">ALV:</span>
                      <span className="text-charcoal">{order.orderShipmentMethod.vatRate}%</span>
                    </div>
                  )}

                  {order.orderShipmentMethod.trackingNumber && (
                    <>
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-rose-gold/20 to-transparent" />
                      <div>
                        <p className="font-secondary text-sm text-charcoal/60 mb-1">
                          Seurantanumero:
                        </p>
                        <p className="font-mono font-semibold text-charcoal">
                          {order.orderShipmentMethod.trackingNumber}
                        </p>
                      </div>
                    </>
                  )}

                  {order.orderShipmentMethod.trackingUrls &&
                    order.orderShipmentMethod.trackingUrls.length > 0 && (
                      <div className="space-y-2">
                        <p className="font-secondary text-sm text-charcoal/60">Seuranta:</p>
                        <div className="flex flex-col gap-2">
                          {order.orderShipmentMethod.trackingUrls.map(
                            (url, index) => (
                              <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-secondary text-sm text-burnt-orange hover:text-rose-gold underline transition-colors duration-300"
                              >
                                Seuraa lähetystä #{index + 1}
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Customer Information */}
            {order.orderCustomerData && (
              <div className="relative bg-cream/30 border border-rose-gold/10 p-6 md:p-8">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/30" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/30" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/30" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/30" />

                <h2 className="font-primary text-xl md:text-2xl font-semibold text-charcoal mb-6">
                  Toimitusosoite
                </h2>

                <div className="font-secondary space-y-1 text-charcoal/70">
                  <p className="font-semibold text-charcoal">
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
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="relative mt-12 md:mt-16 max-w-3xl mx-auto bg-cream/30 border border-rose-gold/10 p-6 md:p-8">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/30" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/30" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/30" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/30" />

          <h2 className="font-primary text-xl md:text-2xl font-semibold text-charcoal mb-6">
            Mitä tapahtuu seuraavaksi?
          </h2>

          <div className="space-y-4 font-secondary text-charcoal/70 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-sage-green/20 text-sage-green flex items-center justify-center text-sm font-bold flex-shrink-0 border border-sage-green/30">
                1
              </div>
              <p className="pt-1">
                Saat tilausvahvistuksen sähköpostiisi muutaman minuutin sisällä.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-sage-green/20 text-sage-green flex items-center justify-center text-sm font-bold flex-shrink-0 border border-sage-green/30">
                2
              </div>
              <p className="pt-1">
                Käsittelemme tilauksesi ja lähetämme sen valitsemallasi
                toimitustavalla.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-sage-green/20 text-sage-green flex items-center justify-center text-sm font-bold flex-shrink-0 border border-sage-green/30">
                3
              </div>
              <p className="pt-1">Saat seurantakoodin, kun lähetys on matkalla sinulle.</p>
            </div>
          </div>

          {/* Decorative separator */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-rose-gold/20 to-transparent mb-6" />

          <Link href="/" className="block">
            <Button className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-warm-white font-secondary tracking-wide transition-all duration-300 py-6 text-base">
              Palaa etusivulle
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
