import React from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";

import { Product } from "@/app/utils/types";
import { getPriceInfo } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { LowestPriceDisplay } from "./LowestPriceDisplay";

interface ProductCardProps {
  item: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const priceInfo = getPriceInfo(item);
  const hasVariations = (item.ProductVariation ?? []).length > 0;

  // Determine availability status
  const isAvailable = item.quantity !== 0;
  const quantityInfo =
    item.quantity === 0 ? "Tuote loppu" : "Tuotteita saatavilla";

  // Set conditional styling
  const statusClass = hasVariations
    ? " font-semibold" // Variations available
    : isAvailable
      ? "text-green-600 font-semibold" // Products available
      : "text-red-600 font-semibold"; // Products not available

  return (
    <div className="h-full flex flex-col">
      <Carousel className="w-full mx-auto border border-primary">
        <CarouselContent>
          {item.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[330px]">
                <Image
                  src={image}
                  alt={`${item.name} - Image ${index + 1}`}
                  fill
                  className="object-cover object-center w-full h-full rounded-lg hover:scale-105 transition-transform duration-300"
                />
                {hasVariations && (
                  <div className="absolute bottom-2 right-2 bg-black/40 text-primary px-2 py-1 rounded-lg">
                    Tuotteella on eri vaihtoehtoja
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>
      <Link
        href={`/product/${item.slug}`}
        className="block rounded-lg hover:shadow-sm hover:shadow-primary transition-shadow duration-300 h-full"
      >
        <div className="flex-grow flex flex-col p-3">
          <div className="flex justify-between items-start mb-2">
            <h1 className="font-semibold text-xl flex-grow truncate">
              {item.name}
            </h1>
            <LowestPriceDisplay priceInfo={priceInfo} />
          </div>
          {/* Conditional information with styling */}
          <p className={`text-sm self-end ${statusClass}`}>
            {hasVariations ? "Tuotteella on eri vaihtoehtoja" : quantityInfo}
          </p>
        </div>
        <Button variant="gooeyLeft" className="w-full">
          Näytä lisätietoja
        </Button>
      </Link>
    </div>
  );
};

export const LoadingProductCard: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <Skeleton className="w-full h-[330px]" />
      <div className="flex flex-col mt-2 gap-y-2 flex-grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-10 mt-auto" />
      </div>
    </div>
  );
};
