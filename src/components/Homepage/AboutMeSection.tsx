"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, Gem } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Heart,
    title: "Laadukas palvelu",
    description: "Asiakastyytyväisyys on meille tärkeintä",
  },
  {
    icon: Gem,
    title: "Laadukkaat tuotteet",
    description: "Valikoituja tuotteita jokaiseen tarpeeseen",
  },
  {
    icon: Sparkles,
    title: "Ainutlaatuinen valikoima",
    description: "Tuotteita, joita et löydä muualta",
  },
];

const AboutMeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-warm-white via-cream/20 to-warm-white"
    >
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-rose-gold/10 rotate-45 opacity-50" />
      <div className="absolute bottom-20 right-10 w-24 h-24 border border-champagne/20 rotate-12 opacity-50" />
      <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-rose-gold/30 diamond-shape" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-champagne/20 diamond-shape" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image column */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Main image container */}
            <div className="relative">
              {/* Decorative frame behind */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-rose-gold/20" />

              {/* Main image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-cream/30">
                <Image
                  fill
                  alt="Putiikkipalvelu verkkokauppa"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src="/ostoksille.jpg"
                  className="object-cover"
                  priority
                />

                {/* Corner accents on image */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-warm-white/60" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-warm-white/60" />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent" />
              </div>

              {/* Floating accent card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-8 -right-4 lg:-right-8 bg-warm-white p-6 shadow-xl border border-rose-gold/10 max-w-[200px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-rose-gold/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-rose-gold" />
                  </div>
                  <span className="text-2xl font-primary font-bold text-charcoal">
                    100%
                  </span>
                </div>
                <p className="text-xs text-charcoal/60 font-secondary">
                  Asiakastyytyväisyys
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Content column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:pl-8"
          >
            {/* Section label */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-[1px] bg-rose-gold/60" />
              <span className="text-xs tracking-[0.3em] uppercase text-rose-gold font-secondary">
                Tarina
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h2
              variants={itemVariants}
              className="text-3xl lg:text-4xl font-primary font-bold text-charcoal mb-6 leading-tight"
            >
              Intohimona laatu
              <br />
              <span className="text-gradient-gold">ja asiakaspalvelu</span>
            </motion.h2>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-sm lg:text-base text-charcoal/70 font-secondary mb-6 leading-relaxed"
            >
              Putiikkipalvelu tarjoaa mahdollisuuden myydä ja ostaa laadukkaita
              tuotteita helposti ja turvallisesti. Uskomme, että verkkokauppa
              voi olla enemmän kuin vain ostospaikka - se voi olla yhteisö ja
              kohtaamispaikka.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-sm text-charcoal/60 font-secondary mb-8 leading-relaxed"
            >
              Tarjoamme modernin ja helppokäyttöisen alustan, jossa voit myydä
              omia tuotteitasi tai löytää ainutlaatuisia ostoksia. Meille
              tärkeintä on asiakkaiden tyytyväisyys ja laadukkaat tuotteet.
            </motion.p>

            {/* Features grid */}
            <motion.div
              variants={itemVariants}
              className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10"
            >
              {features.map((feature, index) => (
                <div key={index} className="group">
                  <div className="flex flex-col">
                    <div className="w-10 h-10 bg-soft-blush/50 flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-rose-gold/20">
                      <feature.icon className="w-5 h-5 text-rose-gold" />
                    </div>
                    <h4 className="font-primary font-semibold text-base lg:text-lg text-charcoal mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-charcoal/50 font-secondary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <Link href="/about" className="group inline-flex">
                <span className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold">
                  Lue lisää meistä
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutMeSection;
