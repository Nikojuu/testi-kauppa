import { PAYMENT_METHODS } from "@/app/utils/constants";
import PaytrailCheckoutPage from "@/components/Checkout/PaytrailCheckoutPage";

import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pupun Korvat | Tilaus",
  description: "Tilaa käsintehtyjä koruja Pupun Korvista.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Pupun Korvat |  Tilaus",
    type: "website",
  },
};

const CheckoutRoute = () => {
  if (!PAYMENT_METHODS.includes("paytrail")) {
    return notFound();
  }
  return <PaytrailCheckoutPage />;
};

export default CheckoutRoute;
