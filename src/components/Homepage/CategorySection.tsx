"use client";
import Image from "next/image";
import Link from "next/link";

const CategorySection = () => {
  return (
    <>
      <div className="container mx-auto my-24 grid grid-cols-1  gap-4 px-4 md:grid-cols-3">
        <figure className="effect-layla ">
          <Image
            className="w-full object-cover"
            width={500}
            height={500}
            src="https://utfs.io/f/PRCJ5a0N1o4iqmWK4Uec2UhuNQST9VCxAPfv0Eb5skpmMGzI"
            // src="https://utfs.io/f/PRCJ5a0N1o4iTc81BHzgnxtOo7qma02ZAzHvhDS4UGCyeWTN"
            alt="kaulakorut"
          />
          <figcaption>
            <h2>Upeita kaulakoruja</h2>
            <p>Selaa korvakoruvalikoimani ja hanki itsellesi upea kaulakoru</p>
            <Link href="#">korvakorut</Link>
          </figcaption>
        </figure>
        <figure className="effect-layla ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image
            className="w-full object-cover"
            width={500}
            height={500}
            src="https://utfs.io/f/PRCJ5a0N1o4iMsAtBopoV09EAlRMPxKfiG8ymBTp1j7qgYWr"
            alt="korvakorut"
          />
          <figcaption>
            <h2>Upeat Korvakorut</h2>
            <p>Katso mitä ihania korvakoruja minulla on sinulle tai lahjaksi</p>
            <Link href="#">kaulakorut</Link>
          </figcaption>
        </figure>
        <figure className="effect-layla ">
          <Image
            className="w-full object-cover"
            width={500}
            height={500}
            src="https://utfs.io/f/PRCJ5a0N1o4iTc81BHzgnxtOo7qma02ZAzHvhDS4UGCyeWTN"
            alt="rannekorut"
          />
          <figcaption>
            <h2>Upeat Rannekorut</h2>
            <p>Katso mitä ihania rannekkoruja minulla on sinulle</p>
            <Link href="#">kaulakorut</Link>
          </figcaption>
        </figure>
      </div>
    </>
  );
};

export default CategorySection;
