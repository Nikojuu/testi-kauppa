import { NavbarLinks } from "./NavbarLinks";
import Cart from "../Cart/Cart";
import MobileLinks from "./MobileLinks";
import { ApiCategory, Campaign } from "@/app/utils/types";
import CustomerDropdown from "./CustomerDropdown";
import { getUser } from "@/lib/actions/authActions";

const getNavbarData = async (): Promise<{
  categories: ApiCategory[];
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

    return { categories };
  } catch (error) {
    console.error("Error fetching navbar data:", error);
    return { categories: [] };
  }
};

const Navbar = async ({ campaigns }: { campaigns: Campaign[] }) => {
  const { categories } = await getNavbarData();
  const { user } = await getUser();
  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:mr-4">
        <MobileLinks categories={categories} />
      </div>

      {/* Desktop navigation links */}
      <NavbarLinks categories={categories} />

      {/* User dropdown and Cart - positioned on the right */}
      <div className="flex items-center gap-4 ml-auto">
        <CustomerDropdown user={user} />
        <Cart campaigns={campaigns} />
      </div>
    </>
  );
};

export default Navbar;
