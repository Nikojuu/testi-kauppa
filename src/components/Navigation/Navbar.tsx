import { NavbarLinks } from "./NavbarLinks";
import Cart from "../Cart/Cart";
import MobileLinks from "./MobileLinks";
import { ApiCategory, Campaign } from "@/app/utils/types";
import CustomerDropdown from "./CustomerDropdown";
import { getUser } from "@/lib/actions/authActions";

const getNavbarData = async (): Promise<{
  categories: ApiCategory[];
  campaigns: Campaign[];
}> => {
  try {
    // Fetch categories
    const categoriesRes = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/categories`,
      {
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
        },
      }
    );

    // Fetch campaigns
    const campaignsRes = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/campaigns`,
      {
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
        },
      }
    );

    // Handle categories response
    let categories: ApiCategory[] = [];
    if (categoriesRes.ok) {
      categories = await categoriesRes.json();
    } else {
      let errorMessage = "Failed to fetch categories";
      try {
        const errorData = await categoriesRes.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      console.error(errorMessage);
    }

    // Handle campaigns response
    let campaigns: Campaign[] = [];
    if (campaignsRes.ok) {
      const campaignData = await campaignsRes.json();
      campaigns = campaignData.campaigns || [];
    } else {
      let errorMessage = "Failed to fetch campaigns";
      try {
        const errorData = await campaignsRes.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      console.error(errorMessage);
    }

    return { categories, campaigns };
  } catch (error) {
    console.error("Error fetching navbar data:", error);
    return { categories: [], campaigns: [] };
  }
};

const Navbar = async () => {
  const { categories, campaigns } = await getNavbarData();
  const { user } = await getUser();
  return (
    <>
      <div className="lg:mr-8">
        <MobileLinks categories={categories} />
      </div>
      <NavbarLinks categories={categories} />

      <div className="flex gap-4 ml-auto">
        <CustomerDropdown user={user} />
        <Cart campaigns={campaigns} />
      </div>
    </>
  );
};

export default Navbar;
