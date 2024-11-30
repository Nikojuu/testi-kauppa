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
              <div className="relative h-[60vh] lg:h-[80vh]">
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
                <div className="absolute top-6 left-6 bg-black/75 text-white p-6 shadow-lg transition-all duration-300 ease-in-out hover:scale-105">
                  <h2 className="font-primary text-xl ">{item.title}</h2>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* CTA Button */}
      <div className="bg-black/60 p-4 flex flex-col justify-center items-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <h1 className="text-white text-3xl font-bold">
          Valmistan uniikkeja koruja lasihelmistä
        </h1>
        <h2 className="text-white p-4 font-semibold">
          Suunnittelen jokaisen korun alusta alkaen omilla käsilläni!
        </h2>
        <Button
          variant="gooeyLeft"
          className=" shadow-lg group w-fit text-lg"
          size="lg"
        >
          Tutustu kauppaani!
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}

export default Hero;
