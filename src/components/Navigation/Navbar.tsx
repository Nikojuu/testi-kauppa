import Link from "next/link";
import { NavbarLinks } from "./NavbarLinks";
import Cart from "../Cart/Cart";
import prisma from "@/app/utils/db";
import MobileLinks from "./MobileLinks";
import Image from "next/image";

const getData = async () => {
  const categories = await prisma.category.findMany({
    where: { parentId: null, storeId: process.env.TENANT_ID },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: {
                include: {
                  children: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return categories;
};

const Navbar = async () => {
  const categories = await getData();
  return (
    <>
    

      <div className="lg:mr-8">
        <MobileLinks categories={categories} />
      </div>
      <NavbarLinks categories={categories} />

      <div className="flex gap-4 ml-auto">
        <Cart />
      </div>
    </>
  );
};

export default Navbar;
