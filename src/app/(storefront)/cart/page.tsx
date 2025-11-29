import CartPage from "@/components/Cart/CartPage";
import { Metadata } from "next";
import { getStoreConfig } from "@/lib/actions/storeConfigActions";

export const metadata: Metadata = {
  title: "Pupun Korvat | Ostoskori",
  description:
    "Tutustu Pupun Korvien käsintehtyihin koruihin ja löydä ainutlaatuinen lahja tai itsellesi sopiva koru.",
  robots: "noindex, nofollow",
};

const CartRoute = async () => {
  const storeConfig = await getStoreConfig();
  const campaigns = storeConfig.campaigns;

  return <CartPage campaigns={campaigns} />;
};

export default CartRoute;
