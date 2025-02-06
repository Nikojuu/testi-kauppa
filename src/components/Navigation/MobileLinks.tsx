"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { Menu, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
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

const MobileCategory = memo(
  ({
    category,
    parentPath = "",
    depth,
    onLinkClick,
  }: {
    category: Category;
    parentPath?: string;
    depth: number;
    onLinkClick: () => void;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = category.children && category.children.length > 0;
    const categoryPath = getCategoryPath(category, parentPath);

    const toggleExpanded = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    const handleCategoryClick = useCallback(() => {
      onLinkClick();
      setIsExpanded(false);
    }, [onLinkClick]);

    return (
      <div className={`${getIndentClass(depth)} border-gray-200`}>
        <div className="flex items-center border-b border-gray-200">
          <Link
            href={categoryPath}
            onClick={handleCategoryClick}
            className="flex-grow"
          >
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
              onClick={toggleExpanded}
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
              <div className="mt-2">
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
  }
);

MobileCategory.displayName = "MobileCategory";

const MobileLinks = memo(({ categories }: { categories: Category[] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  const handleLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleCategoriesExpanded = useCallback(() => {
    setIsCategoriesExpanded((prev) => !prev);
  }, []);

  return (
    <div className="md:hidden">
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild className="md:hidden m-2 rounded-lg bg-white">
          <Button variant="ghost" size="icon" aria-label="Open Menu">
            <Menu className="h-5 w-5 " />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4 mt-4">
            <Link href="/" className="mx-auto" onClick={handleLinkClick}>
              <Image
                src="https://ik.imagekit.io/putiikkipalvelu/tr:w-80,h-80/https:/dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4iZ21jgtkpBdQ56DKGgHuI8cM2XEZmqPvzU1fn"
                alt="logo"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20"
              />
            </Link>
            <div className="border-b border-gray-200 flex items-center">
              <Link
                href="/products"
                className="flex-grow"
                onClick={handleLinkClick}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl"
                >
                  Tuotteet
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCategoriesExpanded}
                className="flex-shrink-0"
                aria-label={
                  isCategoriesExpanded
                    ? "Collapse categories"
                    : "Expand categories"
                }
              >
                {isCategoriesExpanded ? (
                  <Minus className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
            <AnimatePresence initial={false}>
              {isCategoriesExpanded && (
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
                  {categories.map((category) => (
                    <MobileCategory
                      key={category.id}
                      category={category}
                      depth={0}
                      onLinkClick={handleLinkClick}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="border-b border-gray-200">
              <Link href="/about" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl"
                >
                  Pupunkorvien tarina
                </Button>
              </Link>
            </div>
            <div className="border-b border-gray-200">
              <Link href="/gallery" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl"
                >
                  Galleria
                </Button>
              </Link>
            </div>
            <div className="border-b border-gray-200">
              <Link href="/contact" onClick={handleLinkClick}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-xl"
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
});

MobileLinks.displayName = "MobileLinks";

export default MobileLinks;
