"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  const containerRef = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Check if screen is large (lg breakpoint = 1024px)
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsLargeScreen(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-warm-white"
    >
      {/* Decorative corner elements - desktop only, top corners account for navbar height */}
      <div className="absolute top-28 left-8 w-24 h-24 border-l-2 border-t-2 border-rose-gold/30 z-20 hidden lg:block" />
      <div className="absolute top-28 right-8 w-24 h-24 border-r-2 border-t-2 border-rose-gold/30 z-20 hidden lg:block" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-rose-gold/30 z-20 hidden lg:block" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-rose-gold/30 z-20 hidden lg:block" />

      {/* Background Image with Parallax */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          alt="Putiikkipalvelu verkkokauppa"
          src="/logo.svg"
          fill
          sizes="100vw"
          className="object-cover opacity-10"
          priority
        />
        {/* Elegant overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-warm-white/40 via-transparent to-warm-white/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-warm-white/60 via-transparent to-warm-white/60" />
      </motion.div>

      {/* Floating decorative diamonds - desktop only with animations */}
      {isLargeScreen && (
        <>
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 8, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-[15%] w-4 h-4 bg-champagne/80 diamond-shape"
          />
          <motion.div
            animate={{ y: [0, 25, 0], x: [0, -10, 0], rotate: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[40%] right-[18%] w-5 h-5 bg-rose-gold/70 diamond-shape"
          />
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[35%] left-[22%] w-3 h-3 bg-rose-gold/60 diamond-shape"
          />
          <motion.div
            animate={{ y: [0, 18, 0], x: [0, -6, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[30%] left-[8%] w-2 h-2 bg-champagne/70 diamond-shape"
          />
          <motion.div
            animate={{ y: [0, -12, 0], x: [0, 8, 0], rotate: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[25%] right-[12%] w-3 h-3 bg-soft-blush/80 diamond-shape"
          />
        </>
      )}

      {/* Main Content */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20"
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Small decorative text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-rose-gold/60" />
            <span className="text-sm tracking-[0.3em] uppercase text-charcoal/70 font-secondary">
              Moderni verkkokauppa
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-rose-gold/60" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-primary font-bold tracking-tight mb-6"
          >
            <span className="text-gradient-gold">Putiikki</span>
            <br />
            <span className="text-charcoal">Palvelu</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl sm:text-2xl lg:text-3xl font-secondary text-charcoal/80 mb-6 max-w-3xl mx-auto leading-tight"
          >
            Laadukkaat tuotteet ja moderni ostoskokemus
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/products" className="group">
              <span className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold hover:text-white">
                Tutustu tuotteisiin
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
            <Link href="/about" className="group">
              <span className="inline-flex items-center gap-3 px-8 py-4 border border-charcoal/30 text-charcoal font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:border-rose-gold hover:text-rose-gold">
                <Sparkles className="w-4 h-4" />
                Lue lisää
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator - simple static line */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-[1px] h-12 bg-gradient-to-b from-rose-gold/50 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}

export default Hero;
