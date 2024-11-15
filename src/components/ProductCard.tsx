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

import { PriceDisplay } from "./PriceDisplay";
import { Product } from "@/app/utils/types";
import { getPriceInfo } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface ProductCardProps {
  item: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const priceInfo = getPriceInfo(item);

  return (
    <div className="rounded-lg">
      <Carousel className="w-full mx-auto">
        <CarouselContent>
          {item.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[330px]">
                <Image
                  src={image}
                  alt={`${item.name} - Image ${index + 1}`}
                  fill
                  className="object-cover object-center w-full h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-16" />
        <CarouselNext className="mr-16" />
      </Carousel>

      <div className="flex justify-between items-start mt-2">
        <h1 className="font-semibold text-xl">{item.name}</h1>
        <PriceDisplay priceInfo={priceInfo} />
      </div>

      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
        {item.description}
      </p>

      <Button asChild className="w-full mt-5">
        <Link href={`/product/${item.id}`}>Lue lisää!</Link>
      </Button>
    </div>
  );
};

export const LoadingProductCard: React.FC = () => {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-[330px]" />
      <div className="flex flex-col mt-2 gap-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="w-full h-6" />
      </div>
      <Skeleton className="w-full h-10 mt-5" />
    </div>
  );
};
