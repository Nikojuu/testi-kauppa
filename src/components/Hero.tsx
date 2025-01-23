"use client";

import Image from "next/image";
import Link from "next/link";

import { GlassySquareButton } from "./ui/cta-button";

// export function Hero() {
//   return (
//     <div className="relative w-full h-[90vh] min-h-[30rem] max-h-screen">
//       <Image
//         alt="Hero Image"
//         src="/tausta.jpg"
//         fill
//         className="object-cover"
//         priority
//       />
//       {/* Left-to-right gradient overlay */}
//       <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />
//       <div className="absolute inset-0 flex flex-col items-center justify-start pt-60 text-center">
//         <h1 className="text-white text-5xl sm:text-7xl font-bold mb-4 tracking-tight">
//           Pupun korvat
//         </h1>
//         <h2 className="text-white font-primary text-4xl md:text-6xl font-medium mb-8">
//           Upeita käsintehtyjä koruja juhlaan ja arkeen
//         </h2>
//         <Link href="/products">
//           <GlassySquareButton>Tutustu kauppaani!</GlassySquareButton>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default Hero;

export function Hero() {
  return (
    <div className="relative w-full h-[80vh] lg:h-[90] min-h-[30rem] max-h-screen">
      <Image
        alt="Hero Image"
        src="/tausta.jpg"
        fill
        sizes="(max-width: 640px) 200vw, 100vw"
        className="object-cover "
        priority
      />
      {/* Left-to-right gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-32 md:pt-52 text-center">
        <h1 className="text-black text-5xl sm:text-9xl  mb-4 tracking-tight ">
          Pupun korvat
        </h1>
        <h2 className="text-black font-primary text-4xl md:text-6xl  mb-8 ">
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
