import { PAYMENT_METHODS } from "@/app/utils/constants";
// import PaytrailCheckoutPage from "@/components/Checkout/PaytrailCheckoutPage";
import StripeCheckoutPage from "@/components/Checkout/StripeCheckoutPage";

import { Metadata } from "next";

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
  if (PAYMENT_METHODS.includes("paytrail")) {
    // return <PaytrailCheckoutPage />;
  } else if (PAYMENT_METHODS.includes("stripe")) {
    return <StripeCheckoutPage />;
  }
};

export default CheckoutRoute;
