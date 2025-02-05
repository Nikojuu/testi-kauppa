"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ImageKitImage from "./ImageKitImage";

interface iAppProps {
  images: string[];
}

export function ImageSlider({ images }: iAppProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  function handlePreviousClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }

  function handleNextClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }

  function handleImageClick(index: number) {
    setMainImageIndex(index);
  }

  return (
    <div className="grid gap-6 md:gap-3 items-start">
      <div className="relative overflow-hidden rounded-lg">
        <ImageKitImage
          src={images[mainImageIndex]}
          alt="Product image"
          width={600}
          height={600}
          sizes="(max-width: 768px) 100vw, 700px"
          className="object-cover w-[600px] h-[600px]"
          transformations="tr=w-600,h-600"
          quality={90}
          placeholder="blur"
          blurDataURL={`https://ik.imagekit.io/putiikkipalvelu/${encodeURIComponent(images[mainImageIndex])}?tr=w-10,h-10,bl-6,q-20`}
        />

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button onClick={handlePreviousClick} variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button onClick={handleNextClick} variant="ghost" size="icon">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            className={cn(
              index === mainImageIndex
                ? "border-2 border-primary"
                : "border border-gray-200",
              "relative overflow-hidden rounded-lg cursor-pointer"
            )}
            key={index}
            onClick={() => handleImageClick(index)}
          >
            <ImageKitImage
              src={image}
              alt="Product Image"
              width={200}
              height={200}
              sizes="200px"
              className="object-cover"
              transformations="tr=w-200,h-200,f-auto,q-80"
              placeholder="blur"
              blurDataURL={`https://ik.imagekit.io/putiikkipalvelu/${encodeURIComponent(image)}?tr=w-10,h-10,bl-6,q-20`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
