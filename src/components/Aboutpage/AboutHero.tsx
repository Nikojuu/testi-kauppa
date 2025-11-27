"use client";

import { motion } from "framer-motion";

export const AboutHero = () => {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-cream via-warm-white to-warm-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large decorative diamond shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute top-20 left-[10%] w-24 h-24 border border-rose-gold/10 diamond-shape hidden lg:block"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute bottom-32 right-[15%] w-16 h-16 border border-champagne/15 diamond-shape hidden lg:block"
        />

        {/* Floating small diamonds */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-[20%] w-3 h-3 bg-rose-gold/20 diamond-shape hidden md:block"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 left-[15%] w-2 h-2 bg-champagne/30 diamond-shape hidden md:block"
        />
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 left-[8%] w-1.5 h-1.5 bg-rose-gold/25 diamond-shape hidden lg:block"
        />

        {/* Gradient overlay lines */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-gold/15 to-transparent" />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pt-28 pb-12 md:pt-32 md:pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-3 text-xs tracking-[0.3em] uppercase font-secondary text-charcoal/60">
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-rose-gold/50" />
              Käsityöni tarina
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-rose-gold/50" />
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-primary font-bold text-charcoal tracking-tight mb-6"
          >
            Vähän minusta
          </motion.h1>

          {/* Decorative element */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-2 h-2 bg-rose-gold/50 diamond-shape" />
            <div className="w-20 h-[1px] bg-gradient-to-r from-rose-gold/50 to-champagne/30" />
            <div className="w-1.5 h-1.5 bg-champagne/40 diamond-shape" />
            <div className="w-20 h-[1px] bg-gradient-to-l from-rose-gold/50 to-champagne/30" />
            <div className="w-2 h-2 bg-rose-gold/50 diamond-shape" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg sm:text-xl lg:text-2xl text-charcoal/70 font-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Tutustu tarinaan, tekijään ja intohimoon käsintehtyjen korujen
            takana
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-16 flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-widest uppercase text-charcoal/40 font-secondary">
              Lue lisää
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg
                className="w-5 h-5 text-rose-gold/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Side decorative frames */}
      <div className="absolute top-24 left-8 w-12 h-12 border-l border-t border-rose-gold/20 hidden lg:block" />
      <div className="absolute top-24 right-8 w-12 h-12 border-r border-t border-rose-gold/20 hidden lg:block" />
      <div className="absolute bottom-16 left-8 w-12 h-12 border-l border-b border-rose-gold/20 hidden lg:block" />
      <div className="absolute bottom-16 right-8 w-12 h-12 border-r border-b border-rose-gold/20 hidden lg:block" />
    </section>
  );
};
