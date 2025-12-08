"use client";

import { Button } from "@/components/ui/button";
import { cn, getImageUrl } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface iAppProps {
  images: string[];
}

export function ImageSlider({ images }: iAppProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Derive loading state from loadedImages
  const isLoading = !loadedImages.has(mainImageIndex);

  // Preload all images on mount
  useEffect(() => {
    images.forEach((image, index) => {
      const img = new window.Image();
      img.src = getImageUrl(image, "medium");
      img.onload = () => {
        setLoadedImages((prev) => new Set(prev).add(index));
      };
    });
  }, [images]);

  function handleImageLoad() {
    setLoadedImages((prev) => new Set(prev).add(mainImageIndex));
  }

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
    <div className="grid gap-4 items-start">
      {/* Main Image */}
      <div className="relative overflow-hidden aspect-square w-full group bg-cream/30">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-rose-gold/30 z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12 group-hover:border-rose-gold/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-rose-gold/30 z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12 group-hover:border-rose-gold/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-rose-gold/30 z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12 group-hover:border-rose-gold/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-rose-gold/30 z-10 transition-all duration-500 group-hover:w-12 group-hover:h-12 group-hover:border-rose-gold/50" />

        <img
          src={getImageUrl(images[mainImageIndex], "small")}
          srcSet={`${getImageUrl(images[mainImageIndex], "small")} 400w, ${getImageUrl(images[mainImageIndex], "medium")} 800w`}
          sizes="400px"
          alt="Product image"
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={handleImageLoad}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Loader2 className="w-8 h-8 text-rose-gold animate-spin" />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <Button
            onClick={handlePreviousClick}
            variant="ghost"
            size="icon"
            className="bg-warm-white/80 backdrop-blur-sm hover:bg-rose-gold hover:text-warm-white transition-all duration-300 h-10 w-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            onClick={handleNextClick}
            variant="ghost"
            size="icon"
            className="bg-warm-white/80 backdrop-blur-sm hover:bg-rose-gold hover:text-warm-white transition-all duration-300 h-10 w-10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div
            className={cn(
              "relative aspect-square overflow-hidden cursor-pointer transition-all duration-300",
              index === mainImageIndex
                ? "ring-2 ring-rose-gold ring-offset-2 ring-offset-warm-white"
                : "ring-1 ring-charcoal/10 hover:ring-rose-gold/40"
            )}
            key={index}
            onClick={() => handleImageClick(index)}
          >
            <img
              src={getImageUrl(image, "thumbnail")}
              alt="Product Image"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
