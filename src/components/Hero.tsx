"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassySquareButton } from "./ui/cta-button";

interface CarouselDataProps {
  title: string;
  imageString: string;
}

export function Hero({ carouselData }: { carouselData: CarouselDataProps[] }) {
  return (
    <div className="relative w-full h-[90vh]">
      <Image
        alt="Banner Image"
        src={carouselData[1].imageString}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[20%] sm:pb-[15%] px-4 text-center">
        <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
          Pupun korvat
        </h1>
        <h2 className="text-white font-primary text-xl md:text-4xl lg:text-6xl font-medium mb-8 max-w-3xl">
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

// const autoplayOptions = Autoplay({
//   delay: 6000,
// });

// <Carousel
//   opts={{
//     loop: true,
//     align: "start",
//   }}
//   plugins={[autoplayOptions]}
// >
//   <CarouselContent>
//     {carouselData.map((item, index) => (
//       <CarouselItem key={index}>
//         <div className="relative h-[60vh] lg:h-[90vh]">
//           {/* Image */}
//           <Image
//             alt="Banner Image"
//             src={item.imageString}
//             fill
//             className="object-cover w-full h-full"
//             priority={index === 0}
//           />

//           {/* Overlay */}
//           <div className="absolute inset-0 bg-black/20 " />

//           {/* Title */}
//         </div>
//       </CarouselItem>
//     ))}
//   </CarouselContent>
// </Carousel>;
