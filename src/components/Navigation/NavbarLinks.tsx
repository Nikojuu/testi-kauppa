"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

const getCategoryPath = (
  category: Category,
  parentPath: string = ""
): string => {
  const path = `${parentPath}/${category.slug}`;
  return `/products${path}`;
};

const DesktopDropdown: React.FC<{
  category: Category;
  parentPath?: string;
}> = ({ category, parentPath = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const categoryPath = getCategoryPath(category, parentPath);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={categoryPath}>
        <Button variant="linkHover2" className="w-full justify-between px-4">
          {category.name}
          {hasChildren && <ChevronDown className="h-4 w-4 -rotate-90" />}
        </Button>
      </Link>

      {hasChildren && isHovered && (
        <div className="absolute left-full top-0 min-w-[200px] bg-background border rounded-md shadow-md py-2">
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

const MobileMenuItem: React.FC<{
  category: Category;
  onClose: () => void;
  parentPath?: string;
}> = ({ category, onClose, parentPath = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const categoryPath = getCategoryPath(category, parentPath);

  return (
    <div>
      <div className="flex">
        <Link href={categoryPath} className="flex-1" onClick={onClose}>
          <Button variant="ghost" className="w-full justify-start">
            {category.name}
          </Button>
        </Link>
        {hasChildren && (
          <Button
            variant="ghost"
            className="px-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        )}
      </div>
      {isOpen && hasChildren && (
        <div className="ml-4 mt-1">
          {category.children?.map((child) => (
            <MobileMenuItem
              key={child.id}
              category={child}
              onClose={onClose}
              parentPath={categoryPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function NavbarLinks({ categories }: { categories: Category[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopHovered, setIsShopHovered] = useState(false);

  return (
    <div className="flex h-24 items-center">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <div
          className="relative"
          onMouseEnter={() => setIsShopHovered(true)}
          onMouseLeave={() => setIsShopHovered(false)}
        >
          <Link href="/products">
            <Button
              variant="linkHover2"
              className="flex items-center gap-1 text-lg font-primary font-bold "
            >
              Tuotteet
              <ChevronDown className="h-4 w-4" />
            </Button>
          </Link>

          {isShopHovered && (
            <div className="absolute left-0 top-full min-w-[200px] bg-background border rounded-md shadow-md py-2">
              {categories.map((category) => (
                <DesktopDropdown key={category.id} category={category} />
              ))}
            </div>
          )}
        </div>

        <Link href="/about">
          <Button
            variant="linkHover2"
            className="text-lg font-primary font-bold"
          >
            Pupunkorvien tarina
          </Button>
        </Link>
        <Link href="/gallery">
          <Button
            variant="linkHover2"
            className="text-lg font-bold font-primary"
          >
            Galleria
          </Button>
        </Link>
        <Link href="/contact">
          <Button
            variant="linkHover2"
            className="text-lg font-bold font-primary"
          >
            Yhteydenotto
          </Button>
        </Link>
      </nav>

      {/* Mobile Navigation */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Open Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4 mt-4">
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                All Products
              </Button>
            </Link>
            {categories.map((category) => (
              <MobileMenuItem
                key={category.id}
                category={category}
                onClose={() => setIsMobileMenuOpen(false)}
              />
            ))}
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                About
              </Button>
            </Link>
            <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Gallery
              </Button>
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Yhteydenotto
              </Button>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
