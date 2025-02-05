import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import { Product } from "@/app/utils/types";
import { getPriceInfo } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { LowestPriceDisplay } from "./LowestPriceDisplay";
import ImageKitImage from "./ImageKitImage";

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
    ? " " // Variations available
    : isAvailable
      ? "text-green-600 " // Products available
      : "text-red-600"; // Products not available

  return (
    <div className="h-full flex flex-col  ">
      <Link
        href={`/product/${item.slug}`}
        className="block rounded-lg hover:shadow-sm hover:shadow-primary transition-shadow duration-300 h-full"
      >
        <div className="w-full mx-auto border border-primary">
          <div className="relative h-[430px] overflow-hidden">
            <ImageKitImage
              src={item.images[0]} // Use only the first image
              alt={`${item.name}`}
              fill
              quality={90}
              sizes="(min-width: 1040px) 504px, (min-width: 960px) calc(50vw - 128px), (min-width: 780px) calc(24.38vw + 250px), (min-width: 480px) calc(100vw - 34px), calc(15vw + 457px)"
              className="object-cover object-center w-full h-full rounded-lg md:hover:scale-105 md:transition-transform md:duration-300"
              transformations="tr=w-500,h-500" // Add appropriate transformations
              placeholder="blur"
              blurDataURL={`https://ik.imagekit.io/putiikkipalvelu/${encodeURIComponent(item.images[0])}?tr=w-10,h-10,bl-6,q-20`}
            />
          </div>
        </div>
        <div className="flex-grow flex flex-col p-3">
          <div className="flex justify-between items-start mb-2 flex-col md:flex-row">
            <h1 className="font-secondary font-bold text-sm md:text-xl flex-grow truncate">
              {item.name}
            </h1>
            <LowestPriceDisplay priceInfo={priceInfo} />
          </div>
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
