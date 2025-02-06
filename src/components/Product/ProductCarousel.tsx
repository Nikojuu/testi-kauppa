"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Product } from "@prisma/client";
import { ProductCard } from "../ProductCard";

// types/product.ts
export type ProductCardType = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  salePrice: number | null;
  salePercent: string | null;
  saleEndDate: Date | null;
  saleStartDate: Date | null;
  slug: string;
  quantity: number | null;
  ProductVariation: {
    id: string;
    price: number | null;
    saleEndDate: Date | null;
    saleStartDate: Date | null;
    salePrice: number | null;
    salePercent: string | null;
  }[];
};
interface ProductCarouselProps {
  products: ProductCardType[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  return (
    <Carousel
      className="sm:hidden p-4"
      opts={{
        align: "start",
        loop: true,
        skipSnaps: true,
      }}
    >
      <CarouselContent className="-ml-5">
        {products.map((item) => (
          <CarouselItem key={item.id} className="pl-5 basis-[85%]">
            <ProductCard item={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
