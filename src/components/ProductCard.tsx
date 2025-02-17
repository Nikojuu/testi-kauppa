import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { getPriceInfo } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

import ImageKitImage from "./ImageKitImage";
import { Product } from "@/app/utils/types";

interface ProductCardProps {
  item: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const priceInfo = getPriceInfo(item);
  const hasVariations = (item.variations ?? []).length > 0;

  // Determine availability status
  const isAvailable = item.quantity !== 0;
  const quantityInfo =
    item.quantity === 0 ? "Tuote loppu" : "Tuotteita saatavilla";

  // Set conditional styling
  const statusClass = hasVariations
    ? " " // Variations available
    : isAvailable
      ? "text-green-600 " // Products available
      : "text-red-600"; // Products not available
  const discountPercentage = priceInfo.salePercent
    ? ((1 - parseFloat(priceInfo.salePercent)) * 100).toFixed(0)
    : null;

  return (
    <div className="h-full flex flex-col  ">
      <Link
        href={`/product/${item.slug}`}
        className="block rounded-lg hover:shadow-sm hover:shadow-primary transition-shadow duration-300 h-full"
      >
        <div className="w-full mx-auto border border-primary ">
          <div className="relative  overflow-hidden aspect-square ">
            <ImageKitImage
              src={item.images[0]} // Use only the first image
              alt={`${item.name}`}
              fill
              quality={90}
              sizes="(min-width: 1040px) 504px, (min-width: 960px) calc(50vw - 128px), (min-width: 780px) calc(24.38vw + 250px), (min-width: 480px) calc(100vw - 34px), calc(15vw + 457px)"
              className="object-cover object-center w-full h-full rounded-lg md:hover:scale-105 md:transition-transform md:duration-300 "
              transformations="w-500,h-500" // Add appropriate transformations
            />
            <div className="absolute left-1 bottom-2  ">
              {priceInfo.isOnSale && priceInfo.salePercent && (
                <span className="bg-red-600 text-white text-sm md:text-lg font-semibold rounded-md px-2 py-2 ">
                  -{discountPercentage}%
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex-grow flex flex-col md:py-3">
          <div className="flex justify-between items-start mb-2 sm:flex-row flex-col">
            <h1 className="font-secondary font-semibold text-xs md:text-base flex-grow line-clamp-1  ">
              {item.name}
            </h1>
            <div className="flex gap-1 items-center">
              {priceInfo.isOnSale && (
                <span className="text-gray-400 text-xs line-through">
                  €{priceInfo.currentPrice.toFixed(2)}
                </span>
              )}

              <span
                className={`text-xs md:text-base font-bold ${priceInfo.isOnSale ? "text-red-600" : ""}`}
              >
                €
                {priceInfo.isOnSale
                  ? priceInfo.salePrice!.toFixed(2)
                  : priceInfo.currentPrice.toFixed(2)}
              </span>
            </div>
          </div>
          <p className={`text-xs self-end ${statusClass}`}>
            {hasVariations ? "Useita vaihtoehtoja" : quantityInfo}
          </p>
        </div>
        <Button variant="gooeyLeft" className="w-full text-xs">
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
