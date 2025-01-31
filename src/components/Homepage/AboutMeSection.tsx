"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const AboutMeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="mx-auto mb-32 mt-32 flex w-full container max-w-screen-2xl flex-col px-4 sm:px-8 lg:flex-row"
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: isInView ? 0 : -100, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative aspect-square w-full lg:w-1/2 h-96 lg:h-auto lg:min-h-[600px]"
      >
        <Image
          fill
          alt="Korukoru design process"
          sizes="(min-width: 1620px) 752px, (min-width: 1060px) calc(-9.81vw + 909px), (min-width: 1020px) calc(-730vw + 8434px), (min-width: 620px) calc(91.58vw + 52px), 552px"
          src="/korvakorutesti.jpg"
          className="object-cover h-auto rounded-lg shadow-2xl transform -rotate-2 "
          priority
        />
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="z-10 flex-1 bg-pink-50/95 backdrop-blur-sm p-8 text-black lg:-ml-24 lg:mt-24 rounded-lg shadow-xl border border-white/20"
      >
        <h3 className="mb-8 font-primary text-5xl">Huolellinen suunnittelu</h3>
        <p className="text-lg leading-relaxed text-gray-800 mb-8">
          Jokainen tuotteeni lähtee liikkeelle huolellisesta
          suunnitteluprosessista. Luon korkealaatuisia ja ainutlaatuisia
          tuotteita, jotka erottuvat joukosta. Suunnittelutyössäni yhdistyvät
          käsityötaidot, luovuus ja huolellinen harkinta. Haluan varmistaa, että
          jokainen yksityiskohta on harkittu ja että koruni täyttävät
          korkeimmatkin odotukset niin ulkonäön kuin käytettävyyden suhteen.
        </p>

        <Link href="/about">
          <Button variant="gooeyLeft">
            Lue lisää minusta
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default AboutMeSection;
