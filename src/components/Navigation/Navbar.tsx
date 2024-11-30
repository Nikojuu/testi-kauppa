import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import Cart from "../Cart/Cart";
import prisma from "@/app/utils/db";

const getData = async () => {
  const categories = await prisma.category.findMany({
    where: { parentId: null, storeId: process.env.TENANT_ID },
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

const Navbar = async ({ className = "" }: { className?: string }) => {
  const categories = await getData();

  return (
    <nav
      className={`w-full max-w-[3500px] mx-auto px-4 sm:px-6 lg:px-40 py-5 flex items-center h-28 justify-between bg-white ${className}`}
    >
      <div className="flex items-center">
        <Link href="/" className="mr-20">
          <h2 className="text-cyan-600 font-bold text-xl lg:text-3xl">
            Pupun<span className="text-primary">Korvat</span>
          </h2>
        </Link>
        <NavbarLinks categories={categories} />
      </div>

      <div className="flex gap-4">
        <Cart />
      </div>
    </nav>
  );
};

export default Navbar;
