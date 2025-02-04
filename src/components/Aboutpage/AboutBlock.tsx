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
      className={`mx-auto mb-32 flex w-full max-w-screen-2xl flex-col px-4 sm:px-8 lg:flex-row ${
        blockInfo.reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      {/* Image Container */}
      <motion.div
        initial={{ x: blockInfo.reverse ? 100 : -100, opacity: 0 }}
        animate={{
          x: isInView ? 0 : blockInfo.reverse ? 100 : -100,
          opacity: isInView ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative aspect-square w-full lg:w-1/2 h-96 lg:h-auto lg:min-h-[600px]"
      >
        <Image
          fill
          alt={blockInfo.title}
          src={blockInfo.imgSrc}
          sizes="(min-width: 1620px) 752px, (min-width: 1060px) calc(-9.81vw + 909px), (min-width: 1020px) calc(-730vw + 8434px), (min-width: 620px) calc(91.58vw + 52px), 552px"
          className="object-cover h-auto rounded-lg shadow-2xl transform -rotate-2"
        />
      </motion.div>

      {/* Text Container */}
      <motion.div
        initial={{ x: blockInfo.reverse ? -100 : 100, opacity: 0 }}
        animate={{
          x: isInView ? 0 : blockInfo.reverse ? -100 : 100,
          opacity: isInView ? 1 : 0,
        }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className={`z-10 flex-1 bg-pink-50/95 backdrop-blur-sm p-8 text-black rounded-lg shadow-xl border border-white/20 ${
          blockInfo.reverse ? "lg:-mr-24 lg:mt-24" : "lg:-ml-24 lg:mt-24"
        }`}
      >
        <h3 className="mb-8 font-primary text-5xl">{blockInfo.title}</h3>
        <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
          {blockInfo.text}
        </p>
      </motion.div>
    </section>
  );
};

export default AboutBlock;
