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
      className="mx-auto mb-32 mt-32 flex w-full container max-w-screen-2xl flex-col px-4 sm:px-8 lg:flex-row "
    >
      {/* Mobile-only static image */}
      <div className="relative aspect-square w-full h-96 lg:hidden">
        <Image
          fill
          alt="Korukoru design process"
          sizes="100vw"
          src="/ostoksille.jpg"
          className="object-cover rounded-lg shadow-2xl -rotate-2"
          priority
        />
      </div>

      {/* Desktop animated image */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: isInView ? 0 : -100, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative hidden lg:block lg:w-1/2 lg:min-h-[600px]"
      >
        <Image
          fill
          alt="Korukoru design process"
          sizes="50vw"
          src="/ostoksille.jpg"
          className="object-cover rounded-lg shadow-2xl -rotate-2"
        />
      </motion.div>

      {/* Content wrapper */}
      <div className="z-10 flex-1 bg-purple-100/95 backdrop-blur-sm p-8 text-black lg:-ml-24 lg:mt-24 rounded-lg shadow-xl border border-white/20">
        {/* Mobile-only static content */}
        <div className="lg:hidden">
          <h3 className="mb-8 font-primary text-5xl">Putiikkipalvelu</h3>
          <p className="text-sm leading-relaxed text-gray-800 mb-8">
            Putiikkipalvelu tarjoaa mahdollisuuden myydä mitä vain. Esimerkiksi
            käsintehtyjä koruja, vaatteita ja paljon muuta. Meidän kauttamme
            voit myös myydä omia tuotteitasi ja saada näkyvyyttä. Liity mukaan
            ja löydä oma tyylisi!
          </p>
        </div>

        {/* Desktop animated content */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: isInView ? 0 : 100, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <h3 className="mb-8 font-primary text-5xl">Putiikkipalvelu</h3>
          <p className="text-lg leading-relaxed text-gray-800 mb-8">
            Putiikkipalvelu tarjoaa mahdollisuuden myydä mitä vain. Esimerkiksi
            käsintehtyjä koruja, vaatteita ja paljon muuta. Meidän kauttamme
            voit myös myydä omia tuotteitasi ja saada näkyvyyttä. Liity mukaan
            ja löydä oma tyylisi!
          </p>
        </motion.div>

        <Link href="/about">
          <Button variant="gooeyLeft">
            Lue lisää meistä
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default AboutMeSection;
