"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

export const AboutCTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-charcoal overflow-hidden"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-gold/40 to-transparent" />

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-rose-gold/20 hidden md:block" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-rose-gold/20 hidden md:block" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-rose-gold/20 hidden md:block" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-rose-gold/20 hidden md:block" />

      {/* Floating diamonds */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-[15%] w-3 h-3 bg-rose-gold/15 diamond-shape hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, 12, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/3 right-[12%] w-2 h-2 bg-champagne/20 diamond-shape hidden lg:block"
      />
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 right-[25%] w-1.5 h-1.5 bg-rose-gold/10 diamond-shape hidden md:block"
      />

      {/* Content */}
      <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
        {/* Decorative header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-2 h-2 bg-rose-gold/40 diamond-shape" />
          <div className="w-12 h-[1px] bg-gradient-to-r from-rose-gold/40 to-champagne/20" />
          <div className="w-1.5 h-1.5 bg-champagne/30 diamond-shape" />
          <div className="w-12 h-[1px] bg-gradient-to-l from-rose-gold/40 to-champagne/20" />
          <div className="w-2 h-2 bg-rose-gold/40 diamond-shape" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-2xl md:text-3xl lg:text-4xl font-primary font-bold text-warm-white mb-6"
        >
          Kiinnostuitko koruista?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm md:text-base text-warm-white/60 font-secondary mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Tutustu koruvalikoimaan ja löydä sinulle tai rakkaallesi täydellinen
          koru. Jokainen koru on uniikki taidonnäyte, valmistettu käsin
          Suomessa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-rose-gold text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-champagne"
          >
            <span>Selaa koruja</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>

          <Link
            href="mailto:pupunkorvat.kauppa@gmail.com"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-warm-white/30 text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold"
          >
            <span>Ota yhteyttä</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-12 pt-8 border-t border-warm-white/10"
        >
          <p className="text-xs tracking-widest uppercase text-warm-white/40 font-secondary mb-4">
            Seuraa minua
          </p>
          <div className="flex items-center justify-center">
            <a
              href="https://www.instagram.com/pupun_korvat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-warm-white/50 hover:text-rose-gold transition-colors duration-300"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent" />
    </section>
  );
};
