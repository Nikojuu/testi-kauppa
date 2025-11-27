"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

type AboutBlockType = {
  imgSrc: string;
  title: string;
  text: string;
  reverse?: boolean;
};

const AboutBlock = ({ blockInfo }: { blockInfo: AboutBlockType }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className={`mx-auto mb-20 md:mb-32 flex w-full max-w-screen-xl flex-col px-4 sm:px-8 lg:flex-row lg:items-center gap-8 lg:gap-0 ${
        blockInfo.reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Image Container */}
      <motion.div
        initial={{
          x: blockInfo.reverse ? 60 : -60,
          opacity: 0
        }}
        animate={{
          x: isInView ? 0 : blockInfo.reverse ? 60 : -60,
          opacity: isInView ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full lg:w-1/2 group"
      >
        {/* Decorative frame behind image */}
        <div
          className={`absolute -inset-3 border border-rose-gold/20 ${
            blockInfo.reverse ? "translate-x-3" : "-translate-x-3"
          } translate-y-3 transition-all duration-500 group-hover:border-rose-gold/40`}
        />

        {/* Corner accents */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-rose-gold/50 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-rose-gold/70" />
        <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-rose-gold/50 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-rose-gold/70" />
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-rose-gold/50 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-rose-gold/70" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-rose-gold/50 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-rose-gold/70" />

        {/* Image wrapper */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <Image
            fill
            alt={blockInfo.title}
            src={blockInfo.imgSrc}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-warm-white/10 pointer-events-none" />
        </div>
      </motion.div>

      {/* Content Container */}
      <motion.div
        initial={{
          x: blockInfo.reverse ? -60 : 60,
          opacity: 0
        }}
        animate={{
          x: isInView ? 0 : blockInfo.reverse ? -60 : 60,
          opacity: isInView ? 1 : 0,
        }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`relative flex-1 ${
          blockInfo.reverse ? "lg:pr-16 lg:-mr-8" : "lg:pl-16 lg:-ml-8"
        } lg:py-12 z-10`}
      >
        {/* Content card */}
        <div className="relative bg-warm-white/95 backdrop-blur-sm p-8 md:p-10 lg:p-12 border border-rose-gold/10 shadow-lg">
          {/* Small decorative diamond */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
            <div className="w-12 h-[1px] bg-gradient-to-r from-rose-gold/50 to-transparent" />
          </div>

          {/* Title */}
          <h3 className="font-primary text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-6 tracking-tight">
            {blockInfo.title}
          </h3>

          {/* Text content with paragraph handling */}
          <div className="space-y-4">
            {blockInfo.text.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="text-sm md:text-base leading-relaxed text-charcoal/70 font-secondary"
              >
                {paragraph.trim()}
              </p>
            ))}
          </div>

          {/* Bottom decorative line */}
          <div className="mt-8 h-[1px] bg-gradient-to-r from-rose-gold/40 via-champagne/30 to-transparent max-w-32" />
        </div>
      </motion.div>
    </section>
  );
};

export default AboutBlock;
