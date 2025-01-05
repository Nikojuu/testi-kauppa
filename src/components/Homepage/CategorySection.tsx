// "use client";
// import Image from "next/image";
// import Link from "next/link";

// const CategorySection = () => {
//   return (
//     <>
//       <div className="container mx-auto my-24 grid grid-cols-1  gap-4 sm:px-4 lg:grid-cols-3">
//         <figure className="effect-layla ">
//           <Image
//             className="w-full object-cover max-w-full"
//             width={500}
//             height={500}
//             src="https://utfs.io/f/PRCJ5a0N1o4iqmWK4Uec2UhuNQST9VCxAPfv0Eb5skpmMGzI"
//             alt="kaulakorut"
//           />
//           <figcaption>
//             <h2 className="text-5xl font-primary  pb-4">Upeita kaulakoruja</h2>
//             <p>Selaa kaulakoruvalikoimani ja hanki itsellesi upea kaulakoru</p>
//             <Link href="/products/kaulakorut"></Link>
//           </figcaption>
//         </figure>
//         <figure className="effect-layla ">
//           <Image
//             className="w-full object-cover"
//             width={500}
//             height={500}
//             src="https://utfs.io/f/PRCJ5a0N1o4iMsAtBopoV09EAlRMPxKfiG8ymBTp1j7qgYWr"
//             alt="korvakorut"
//           />
//           <figcaption>
//             <h2 className="text-5xl font-primary  pb-4">Upeat korvakorut</h2>
//             <p>Katso mitä ihania korvakoruja minulla on sinulle tai lahjaksi</p>
//             <Link href="/products/korvakorut"></Link>
//           </figcaption>
//         </figure>
//         <figure className="effect-layla ">
//           <Image
//             className="w-full object-cover"
//             width={500}
//             height={500}
//             src="https://utfs.io/f/PRCJ5a0N1o4iTc81BHzgnxtOo7qma02ZAzHvhDS4UGCyeWTN"
//             alt="rannekorut"
//           />
//           <figcaption>
//             <h2 className="text-5xl font-primary  pb-4">Upeat Rannekorut</h2>
//             <p>Katso mitä ihania rannekkoruja minulla on sinulle</p>
//             <Link href="/products/rannekorut"></Link>
//           </figcaption>
//         </figure>
//       </div>
//     </>
//   );
// };

// export default CategorySection;
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
    image: "https://utfs.io/f/PRCJ5a0N1o4iqmWK4Uec2UhuNQST9VCxAPfv0Eb5skpmMGzI",
    link: "/products/kaulakorut",
  },
  {
    title: "Upeat korvakorut",
    description:
      "Katso mitä ihania korvakoruja minulla on sinulle tai lahjaksi",
    image: "https://utfs.io/f/PRCJ5a0N1o4iMsAtBopoV09EAlRMPxKfiG8ymBTp1j7qgYWr",
    link: "/products/korvakorut",
  },
  {
    title: "Upeat Rannekorut",
    description: "Katso mitä ihania rannekkoruja minulla on sinulle",
    image: "https://utfs.io/f/PRCJ5a0N1o4iTc81BHzgnxtOo7qma02ZAzHvhDS4UGCyeWTN",
    link: "/products/rannekorut",
  },
];

const CategorySection = () => {
  return (
    <div className="container mx-auto my-24 grid grid-cols-1 gap-4 sm:px-4 lg:grid-cols-3">
      {categories.map((category, index) => (
        <div
          key={index}
          className="category-item relative overflow-hidden bg-indigo-900 cursor-pointer group"
        >
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
            <Link href={category.link} className="absolute inset-0">
              <span className="sr-only">View {category.title}</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategorySection;
