"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ImageKitImage from "./ImageKitImage";

export function ImageSliderWithZoom({ images }: { images: string[] }) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  function handleMouseEnter() {
    setZoomActive(true);
  }

  function handleMouseLeave() {
    setZoomActive(false);
  }

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  }

  return (
    <div className="grid gap-6 md:gap-3 items-start cursor-zoom-in">
      <div
        className="relative  rounded-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <ImageKitImage
          src={images[mainImageIndex]}
          alt="Product image"
          width={600}
          height={600}
          sizes="(max-width: 768px) 150vw, 1000px"
          className="object-cover w-[600px] h-[600px]"
          transformations="w-600,h-600"
          quality={90}
          placeholder="blur"
          blurDataURL={`https://ik.imagekit.io/putiikkipalvelu/${encodeURIComponent(images[mainImageIndex])}?tr=w-10,h-10,bl-6,q-20`}
        />

        {zoomActive && (
          <div
            className="absolute w-72 h-72 border-2 border-primary bg-white  overflow-hidden"
            style={{
              top: mousePosition.y - 96,
              left: mousePosition.x + 36,
              transform: "translate(0, -50%)",
            }}
          >
            <div
              className="absolute "
              style={{
                top: -mousePosition.y * 2 + 96,
                left: -mousePosition.x * 2 + 96,
                width: 1200,
                height: 1200,
              }}
            >
              <ImageKitImage
                src={images[mainImageIndex]}
                alt="Zoomed image"
                fill
                sizes="1500px"
                className="object-cover"
                transformations="tr=w-1200,h-1200"
                quality={90}
              />
            </div>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button onClick={handlePreviousClick} variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button onClick={handleNextClick} variant="ghost" size="icon">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
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
              width={100}
              height={100}
              sizes="130px"
              className="object-cover w-[100px] h-[100px]"
              transformations="tr=w-100,h-100,f-auto,q-80"
              placeholder="blur"
              blurDataURL={`https://ik.imagekit.io/putiikkipalvelu/${encodeURIComponent(image)}?tr=w-10,h-10,bl-6,q-20`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
