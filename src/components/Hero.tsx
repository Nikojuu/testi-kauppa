"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassySquareButton } from "./ui/cta-button";

export function Hero() {
  return (
    <div className="relative w-full h-[80vh] lg:h-[90vh] min-h-[30rem] max-h-screen overflow-hidden">
      <div>
        <Image
          alt="Hero Image"
          src="/kansikuva.jpg"
          fill
          sizes="(max-width: 640px) 200vw, 100vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 flex flex-col items-center md:items-start justify-center md:justify-start pt-32 md:pt-64 text-center md:text-left px-4 md:pl-44">
        {/* Responsive alignment and padding */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative max-w-4xl"
        >
          <div className="flex flex-col items-center md:items-start justify-center space-y-4 p-4 backdrop:blur-[2px] rounded-full ">
            {/* Responsive item alignment */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white text-5xl sm:text-9xl tracking-tight"
            >
              Pupun korvat
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white font-primary text-4xl md:text-6xl"
            >
              Upeita käsintehtyjä koruja juhlaan ja arkeen
            </motion.h2>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8"
        >
          <Link href="/products">
            <GlassySquareButton>Tutustu kauppaani!</GlassySquareButton>
          </Link>
        </motion.div>
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
