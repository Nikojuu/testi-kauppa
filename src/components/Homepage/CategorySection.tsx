"use client";

import Image from "next/image";
import Link from "next/link";

interface CategoryItem {
  title: string;
  description: string;
  image: string;
  link: string;
}

const categories = [
  {
    title: "Upeita kaulakoruja",
    description: "Selaa kaulakoruvalikoimani ja hanki itsellesi upea kaulakoru",
    image: "/kaulakorutesti.jpg",
    link: "/products/kaulakorut",
  },
  {
    title: "Upeat korvakorut",
    description:
      "Katso mitä ihania korvakoruja minulla on sinulle tai lahjaksi",
    image: "/korvakorutesti.jpg",
    link: "/products/korvakorut",
  },
  {
    title: "Upeat Rannekorut",
    description: "Katso mitä ihania rannekkoruja minulla on sinulle",
    image: "/rannekorutesti.jpg",
    link: "/products/rannekorut",
  },
];

const CategorySection = () => {
  return (
    <div className="container mx-auto my-24 grid grid-cols-1 gap-4 sm:px-4 lg:grid-cols-3">
      {categories.map((category, index) => (
        <Link key={index} href={category.link}>
          <div className="category-item relative overflow-hidden bg-indigo-900 cursor-pointer group">
            <Image
              className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-70"
              width={500}
              height={500}
              src={category.image}
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
      ))}
    </div>
  );
};

export default CategorySection;
