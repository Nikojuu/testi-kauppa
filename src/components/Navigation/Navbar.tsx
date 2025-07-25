import { NavbarLinks } from "./NavbarLinks";
import Cart from "../Cart/Cart";
import MobileLinks from "./MobileLinks";
import { ApiCategory } from "@/app/utils/types";
import CustomerDropdown from "./CustomerDropdown";
import { getUser } from "@/lib/actions/authActions";

const getCategoryData = async (): Promise<ApiCategory[]> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STOREFRONT_API_URL}/api/storefront/v1/categories`,
      {
        headers: {
          "x-api-key": process.env.STOREFRONT_API_KEY || "",
        },
      }
    );

    if (!res.ok) {
      let errorMessage = "Failed to fetch categories";
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonErr) {
        // Ignore JSON parse errors
      }
      console.error(errorMessage);
      return [];
    }

    const categories: ApiCategory[] = await res.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const Navbar = async () => {
  const categories = await getCategoryData();
  const { user } = await getUser();
  return (
    <>
      <div className="lg:mr-8">
        <MobileLinks categories={categories} />
      </div>
      <NavbarLinks categories={categories} />

      <div className="flex gap-4 ml-auto">
        <CustomerDropdown user={user} />
        <Cart />
      </div>
    </>
  );
};

export default Navbar;
