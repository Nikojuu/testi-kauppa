"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Menu, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";

import clsx from "clsx";
import Image from "next/image";

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
const getIndentClass = (depth: number) => {
  const indentSizes = ["ml-0", "ml-4", "ml-8", "ml-12", "ml-16", "ml-20"];
  return indentSizes[Math.min(depth, indentSizes.length - 1)];
};

const MobileCategory: React.FC<{
  category: Category;
  parentPath?: string;
  depth: number;
  onLinkClick: () => void;
}> = ({ category, parentPath = "", depth, onLinkClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const categoryPath = getCategoryPath(category, parentPath);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={clsx(getIndentClass(depth), " border-gray-200")}>
      <div className="flex items-center border-b border-gray-200">
        <Link href={categoryPath} onClick={onLinkClick} className="flex-grow">
          <Button
            variant="ghost"
            className="w-full justify-start text-base capitalize font-secondary"
          >
            {category.name}
          </Button>
        </Link>
        {hasChildren && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0"
          >
            {isExpanded ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div ref={contentRef} className="mt-2">
              {category.children?.map((child) => (
                <MobileCategory
                  key={child.id}
                  category={child}
                  parentPath={categoryPath}
                  depth={depth + 1}
                  onLinkClick={onLinkClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileLinks = ({ categories }: { categories: Category[] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" aria-label="Open Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4 mt-4">
            <Link href="/" className="mx-auto">
              <Image src="logo-dark.svg" alt="logo" width={100} height={20} />
            </Link>
            <div className="border-b border-gray-200">
              <Link href="/products" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl "
                >
                  Tuotteet
                </Button>
              </Link>
            </div>
            {categories.map((category) => (
              <MobileCategory
                key={category.id}
                category={category}
                depth={0}
                onLinkClick={handleLinkClick}
              />
            ))}
            <div className="border-b border-gray-200">
              <Link href="/about" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl "
                >
                  Pupunkorvien tarina
                </Button>
              </Link>
            </div>
            <div className="border-b border-gray-200">
              <Link href="/gallery" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl "
                >
                  Galleria
                </Button>
              </Link>
            </div>
            <div className="border-b border-gray-200">
              <Link href="/contact" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl "
                >
                  Yhteydenotto
                </Button>
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileLinks;
