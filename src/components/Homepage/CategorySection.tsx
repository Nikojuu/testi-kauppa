"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const categories = [
  {
    title: "Upeita kaulakoruja",
    description: "Selaa kaulakoruvalikoimani ja hanki itsellesi upea kaulakoru",
    image:
      "https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4iNszCiLll2B7obGOFk8e3TUw1f0dm4Lj6pgZD",
    link: "/products/kaulakorut",
  },
  {
    title: "Upeat korvakorut",
    description:
      "Katso mitä ihania korvakoruja minulla on sinulle tai lahjaksi",
    image:
      "https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4iQMzvV03iZuaqKV5cjLJxYH94e6DM8sFUXNog",
    link: "/products/korvakorut",
  },
  {
    title: "Upeat Rannekorut",
    description: "Katso mitä ihania rannekkoruja minulla on sinulle",
    image:
      "https://dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4is8RVYIdma5coNw4jlW36PiGI9zVhDQk1f7ge",
    link: "/products/rannekorut",
  },
];

const CategorySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3, once: true });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="container mx-auto my-24 grid grid-cols-1 gap-4 sm:px-4 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {categories.map((category, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Link href={category.link}>
            <div className="category-item relative overflow-hidden bg-indigo-900 cursor-pointer group">
              <Image
                className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-70"
                width={500}
                height={500}
                src={category.image || "/placeholder.svg"}
                alt={category.title}
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8">
                <h2 className="text-4xl font-primary mb-4 transform transition-transform duration-300 group-hover:translate-y-0 translate-y-8">
                  {category.title}
                </h2>
                <p className="font-primary text-2xl text-center opacity-0 transform transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 max-w-[80%] mx-auto leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CategorySection;
