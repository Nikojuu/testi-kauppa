"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { Menu, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ApiCategory } from "@/app/utils/types";

const buildCategoryPath = (
  category: ApiCategory,
  parentPath: string = ""
): string => {
  return parentPath ? `${parentPath}/${category.slug}` : category.slug;
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
    category: ApiCategory;
    parentPath?: string;
    depth: number;
    onLinkClick: () => void;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = category.children && category.children.length > 0;
    const slugPath = buildCategoryPath(category, parentPath);
    const categoryPath = `/products/${slugPath}`;

    const toggleExpanded = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    const handleCategoryClick = useCallback(() => {
      onLinkClick();
      setIsExpanded(false);
    }, [onLinkClick]);

    return (
      <div className={`${getIndentClass(depth)}`}>
        <div className="flex items-center border-b border-rose-gold/10">
          <Link
            href={categoryPath}
            onClick={handleCategoryClick}
            className="flex-grow py-3 px-2 text-charcoal/80 font-secondary text-sm tracking-wide capitalize transition-colors duration-300 hover:text-rose-gold"
          >
            {category.name}
          </Link>
          {hasChildren && (
            <button
              onClick={toggleExpanded}
              className="flex-shrink-0 p-2 text-charcoal/50 hover:text-rose-gold transition-colors duration-300"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? (
                <Minus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
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
              className="overflow-hidden"
            >
              <div className="py-1 bg-soft-blush/20">
                {category.children?.map((child) => (
                  <MobileCategory
                    key={child.id}
                    category={child}
                    parentPath={slugPath}
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

const MobileLinks = memo(({ categories }: { categories: ApiCategory[] }) => {
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
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open Menu"
            className="m-2 bg-warm-white/80 backdrop-blur-sm hover:bg-soft-blush/50 transition-colors duration-300"
          >
            <Menu className="h-5 w-5 text-charcoal" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[300px] sm:w-[350px] bg-warm-white border-r border-rose-gold/10 p-0"
        >
          <SheetHeader className="relative px-6 pt-6 pb-4 border-b border-rose-gold/10">
            {/* Decorative corner accents */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l border-t border-rose-gold/20" />

            <SheetTitle className="sr-only">Navigaatio</SheetTitle>
            <SheetDescription className="sr-only">
              Siirry eri sivuille tai selaa tuotekategorioita
            </SheetDescription>

            <Link
              href="/"
              className="group inline-block"
              onClick={handleLinkClick}
            >
              <Image
                src="https://ik.imagekit.io/putiikkipalvelu/tr:w-80,h-80/https:/dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4iZ21jgtkpBdQ56DKGgHuI8cM2XEZmqPvzU1fn"
                alt="Pupun Korvat logo"
                width={64}
                height={64}
                className="w-14 h-14 transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Decorative line */}
            <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent" />
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex flex-col px-6 py-6">
            {/* Products with categories */}
            <div className="border-b border-rose-gold/10">
              <div className="flex items-center">
                <Link
                  href="/products"
                  className="flex-grow py-4 text-charcoal font-secondary text-base tracking-[0.05em] uppercase transition-colors duration-300 hover:text-rose-gold"
                  onClick={handleLinkClick}
                >
                  Tuotteet
                </Link>
                <button
                  onClick={toggleCategoriesExpanded}
                  className="flex-shrink-0 p-2 text-charcoal/50 hover:text-rose-gold transition-colors duration-300"
                  aria-label={
                    isCategoriesExpanded
                      ? "Collapse categories"
                      : "Expand categories"
                  }
                >
                  <motion.div
                    animate={{ rotate: isCategoriesExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCategoriesExpanded ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </motion.div>
                </button>
              </div>
            </div>

            {/* Categories dropdown */}
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
                  className="overflow-hidden"
                >
                  <div className="py-2 pl-4 bg-cream/30 border-b border-rose-gold/10">
                    {categories.map((category) => (
                      <MobileCategory
                        key={category.id}
                        category={category}
                        depth={0}
                        onLinkClick={handleLinkClick}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Other navigation links */}
            <Link
              href="/about"
              onClick={handleLinkClick}
              className="py-4 text-charcoal font-secondary text-base tracking-[0.05em] uppercase border-b border-rose-gold/10 transition-colors duration-300 hover:text-rose-gold"
            >
              Meistä
            </Link>

            <Link
              href="/gallery"
              onClick={handleLinkClick}
              className="py-4 text-charcoal font-secondary text-base tracking-[0.05em] uppercase border-b border-rose-gold/10 transition-colors duration-300 hover:text-rose-gold"
            >
              Galleria
            </Link>

            <Link
              href="/contact"
              onClick={handleLinkClick}
              className="py-4 text-charcoal font-secondary text-base tracking-[0.05em] uppercase border-b border-rose-gold/10 transition-colors duration-300 hover:text-rose-gold"
            >
              Yhteydenotto
            </Link>

            {/* Decorative footer element */}
            <div className="mt-auto pt-8">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose-gold/30" />
                <div className="w-1.5 h-1.5 bg-rose-gold/40 diamond-shape" />
                <div className="w-2 h-2 bg-champagne/30 diamond-shape" />
                <div className="w-1.5 h-1.5 bg-rose-gold/40 diamond-shape" />
                <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose-gold/30" />
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
});

MobileLinks.displayName = "MobileLinks";

export default MobileLinks;
