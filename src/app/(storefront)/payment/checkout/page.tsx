import PaytrailCheckoutPage from "@/components/Checkout/PaytrailCheckoutPage";
import CheckoutPage from "@/components/Checkout/PaytrailCheckoutPage";
import PaytrailCheckout from "@/components/Checkout/PaytrailPayments";
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
  return notFound();
  // return <PaytrailCheckoutPage />;
};

export default CheckoutRoute;
