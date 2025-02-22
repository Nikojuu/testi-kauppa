import prisma from "@/app/utils/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pupun Korvat | Tilaus peruutettu",
  description: "Tilaus peruutettu",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Pupun Korvat | Pupun Korvat",
    type: "website",
  },
};

const restoreProducts = async (orderId: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        storeId: process.env.TENANT_ID,
        id: orderId,
      },
      include: {
        OrderLineItems: true,
      },
    });

    if (!order) {
      return console.log("Order not found");
    }
    if (order.status === "PENDING") {
      // restoreItemQuantitys(orderId, "CANCELLED");
    }
  } catch (error) {
    console.error("Error fetching order data:", error);
    throw new Error("Failed to fetch order data.");
  }
};

export default async function CancelPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { orderId } = params;
  await restoreProducts(orderId);
  return (
    <section className="w-full min-h-[80vh] flex items-center justify-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <XCircle className="w-12 h-12 rounded-full bg-red-500/30 text-red-500 p-2" />
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">Tilaus peruutettu</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Jotain meni pieleen tilauksen käsittelyssä. Jos sinulla on
              kysyttävää, ota yhteyttä asiakaspalveluumme. Tilausta ei ole
              veloitettu.
            </p>

            <Button asChild className="w-full mt-5 sm:mt-6">
              <Link href="/">Kotisivulle</Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
