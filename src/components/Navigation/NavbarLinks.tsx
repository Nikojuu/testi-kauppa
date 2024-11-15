"use client";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ChevronDown } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface NavbarLinksProps {
  categories: Category[];
}

const SubcategoryList = ({ categories }: { categories: Category[] }) => {
  return (
    <div className="grid gap-2">
      {categories.map((category) => (
        <div key={category.id}>
          <Link
            href={`/products/${category.slug}`}
            className="text-sm font-medium hover:text-primary transition-colors block"
          >
            {category.name}
          </Link>
          {category.children && (
            <div className="ml-4 mt-1 grid gap-1">
              {category.children?.map((child) => (
                <Link
                  key={child.id}
                  href={`/products/${child.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const RootCategory = ({ category }: { category: Category }) => {
  // If no children, render a simple link
  if (!category.children?.length) {
    return (
      <Link
        href={`/products/${category.slug}`}
        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
      >
        {category.name}
      </Link>
    );
  }

  // If has children, render HoverCard
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <Link
          href={`/products/${category.slug}`}
          className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <span>{category.name}</span>
          <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
        </Link>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-64">
        <SubcategoryList categories={category.children} />
      </HoverCardContent>
    </HoverCard>
  );
};

export function NavbarLinks({ categories }: NavbarLinksProps) {
  return (
    <div className="hidden md:flex items-center space-x-6 ml-8">
      {categories.map((category) => (
        <RootCategory key={category.id} category={category} />
      ))}
    </div>
  );
}
