"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface SubtitleProps {
  subtitle: string;
  description?: string;
  dark?: boolean;
  alignment?: "center" | "left";
}

const Subtitle = ({
  subtitle,
  description,
  dark,
  alignment = "center",
}: SubtitleProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className={`py-16 md:py-24 ${
        alignment === "center" ? "text-center" : "text-left"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`${alignment === "center" ? "mx-auto" : ""} max-w-4xl px-4`}
      >
        {/* Decorative element above title */}
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`flex items-center gap-4 mb-6 ${
            alignment === "center" ? "justify-center" : "justify-start"
          }`}
        >
          <div className="w-2 h-2 bg-rose-gold/60 diamond-shape" />
          <div className="w-16 h-[1px] bg-gradient-to-r from-rose-gold/60 to-champagne/40" />
          <div className="w-1.5 h-1.5 bg-champagne/50 diamond-shape" />
          <div className="w-16 h-[1px] bg-gradient-to-l from-rose-gold/60 to-champagne/40" />
          <div className="w-2 h-2 bg-rose-gold/60 diamond-shape" />
        </motion.div>

        {/* Main title */}
        <h2
          className={`text-2xl md:text-3xl lg:text-4xl font-primary font-bold tracking-tight ${
            dark ? "text-warm-white" : "text-charcoal"
          }`}
        >
          {subtitle}
        </h2>

        {/* Optional description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`mt-4 text-sm md:text-base font-secondary max-w-2xl ${
              alignment === "center" ? "mx-auto" : ""
            } ${dark ? "text-warm-white/70" : "text-charcoal/60"}`}
          >
            {description}
          </motion.p>
        )}

        {/* Decorative line below */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`mt-6 h-[1px] bg-gradient-to-r from-transparent via-rose-gold/30 to-transparent max-w-xs ${
            alignment === "center" ? "mx-auto" : ""
          }`}
        />
      </motion.div>
    </div>
  );
};

export default Subtitle;
