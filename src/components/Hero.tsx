"use client";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { GlassySquareButton } from "./ui/cta-button";

const autoplayOptions = Autoplay({
  delay: 6000,
});

interface CarouselDataProps {
  title: string;
  imageString: string;
}

export function Hero({ carouselData }: { carouselData: CarouselDataProps[] }) {
  return (
    <div className="relative ">
      <Carousel
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[autoplayOptions]}
      >
        <CarouselContent>
          {carouselData.map((item, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[60vh] lg:h-[90vh]">
                {/* Image */}
                <Image
                  alt="Banner Image"
                  src={item.imageString}
                  fill
                  className="object-cover w-full h-full"
                  priority={index === 0}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 " />

                {/* Title */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* CTA Button */}
      <div className=" p-8 flex flex-col justify-center  gap-6 absolute left-[30%] top-[45%] tracking-wide  -translate-x-1/2 -translate-y-1/2 z-10 ">
        <h1 className="text-white text-9xl font-bold">Pupun korvat</h1>
        <h2 className="text-white p-4 font-primary text-5xl font-semibold">
          Upeita käsintehtyjä koruja juhlaan ja arkeen
        </h2>
        <Link href="/products">
          <GlassySquareButton>Tutustu kauppaani!</GlassySquareButton>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
