"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiCategory, Campaign } from "@/app/utils/types";

const getCategoryPath = (
  category: ApiCategory,
  parentPath: string = ""
): string => {
  const path = `${parentPath}/${category.slug}`;
  return `/products${path}`;
};

const DesktopDropdown: React.FC<{
  category: ApiCategory;
  parentPath?: string;
}> = ({ category, parentPath = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const categoryPath = getCategoryPath(category, parentPath);

  return (
    <div
      className="relative "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={categoryPath}>
        <Button
          variant="linkHover2"
          className="w-full justify-between px-4 py-6 text-base capitalize font-secondary"
        >
          {category.name}
          {hasChildren && <ChevronDown className="h-4 w-4 -rotate-90" />}
        </Button>
      </Link>

      {hasChildren && isHovered && (
        <div className="absolute left-full top-0 min-w-[200px] bg-background border rounded-md shadow-md py-2 z-[60] ">
          {category.children?.map((child) => (
            <DesktopDropdown
              key={child.id}
              category={child}
              parentPath={categoryPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function NavbarLinks({ categories }: { categories: ApiCategory[] }) {
  const [isShopHovered, setIsShopHovered] = useState(false);

  return (
    <div className="flex h-24 items-center ">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center  ">
        <div
          className="relative "
          onMouseEnter={() => setIsShopHovered(true)}
          onMouseLeave={() => setIsShopHovered(false)}
        >
          <Link href="/products">
            <Button
              variant="linkHover2"
              className="flex items-center gap-1  font-primary text-lg "
            >
              Tuotteet
              <ChevronDown className="h-4 w-4" />
            </Button>
          </Link>

          {isShopHovered && (
            <div className="absolute left-0 top-full min-w-[200px] bg-background text-black  border rounded-md shadow-md py-2 z-[60]">
              {categories.map((category) => (
                <DesktopDropdown key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>

        <Link href="/about">
          <Button variant="linkHover2" className=" font-primary text-lg">
            <span className="lg:hidden">Meistä</span>
            <span className="hidden lg:block">Meistä</span>
          </Button>
        </Link>
        <Link href="/gallery">
          <Button variant="linkHover2" className=" text-lg font-primary">
            Galleria
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="linkHover2" className=" text-lg font-primary">
            Yhteydenotto
          </Button>
        </Link>
      </nav>
    </div>
  );
}
