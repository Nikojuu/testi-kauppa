import { PAYMENT_METHODS } from "@/app/utils/constants";
import StripeCheckoutPage from "@/components/Checkout/StripeCheckoutPage";
import { Metadata } from "next";
import PaytrailCheckoutPage from "@/components/Checkout/PaytrailCheckoutPage";
import { getStoreConfig } from "@/lib/actions/storeConfigActions";

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

const CheckoutRoute = async () => {
  const storeConfig = await getStoreConfig();
  const campaigns = storeConfig.campaigns;

  if (PAYMENT_METHODS.includes("paytrail")) {
    return <PaytrailCheckoutPage campaigns={campaigns} />;
  } else if (PAYMENT_METHODS.includes("stripe")) {
    return <StripeCheckoutPage campaigns={campaigns} />;
  }
};

export default CheckoutRoute;
