import CartPage from "@/components/Cart/CartPage";
import { Metadata } from "next";
import { getCampaigns } from "@/app/utils/campaignUtils";

export const metadata: Metadata = {
  title: "Pupun Korvat | Ostoskori",
  description:
    "Tutustu Pupun Korvien käsintehtyihin koruihin ja löydä ainutlaatuinen lahja tai itsellesi sopiva koru.",
  robots: "noindex, nofollow",
};

const CartRoute = async () => {
  const campaigns = await getCampaigns();
  return <CartPage campaigns={campaigns} />;
};

export default CartRoute;
