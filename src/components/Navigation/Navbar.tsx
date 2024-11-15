import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import { DarkModeToggle } from "../DarkModeToggle";
import Cart from "../Cart/Cart";
import prisma from "@/app/utils/db";

const getData = async () => {
  const categories = await prisma.category.findMany({
    where: { parentId: null }, // Fetch root categories
    include: {
      children: {
        include: {
          children: true,
        },
      },
    },
  });
  return categories;
};

const Navbar = async () => {
  const categories = await getData();

  return (
    <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-cyan-600 font-bold text-xl lg:text-3xl">
            Test<span className="text-primary">Shop</span>
          </h1>
        </Link>
        <NavbarLinks categories={categories} />
      </div>

      <div className="flex gap-4">
        <Cart />
        <DarkModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
