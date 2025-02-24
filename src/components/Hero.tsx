"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button"; // Assuming shadcn Button component

const Hero = () => {
  // Animation variants for the text and button
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Content */}
      <motion.div
        className="relative z-20 text-center max-w-4xl px-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} className="mb-6">
          <Image
            src="/logo.svg"
            alt="Putiikkipalvelu Logo"
            width={200}
            height={100}
            className="mx-auto w-40 md:w-52"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-gray-900"
        >
          Tervetuloa Putiikkipalvelun Testi-Kauppaan!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-700"
        >
          Löydä laadukkaat tuotteet ja nauti modernista ostokokemuksesta.
        </motion.p>

        {/* Call to Action */}
        <motion.div variants={fadeInUp}>
          <Button
            asChild
            className="bg-violet-600 text-white hover:bg-violet-700 px-8 py-3 rounded-xl  font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <a href="/products">Tutustu Nyt</a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Fancy Animated Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-violet-500/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-violet-500/20 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </section>
  );
};

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
