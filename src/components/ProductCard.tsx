"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";

import { getPriceInfo } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import ImageKitImage from "./ImageKitImage";
import { ApiResponseProductCardType } from "@/app/utils/types";

interface ProductCardProps {
  item: ApiResponseProductCardType;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const priceInfo = getPriceInfo(item);
  const hasVariations = (item.variations ?? []).length > 0;

  const isAvailable = item.quantity !== 0;
  const quantityInfo = item.quantity === 0 ? "Tuote loppu" : "Saatavilla";

  const discountPercentage = priceInfo.salePercent
    ? ((1 - parseFloat(priceInfo.salePercent)) * 100).toFixed(0)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group h-full"
    >
      <Link href={`/product/${item.slug}`} className="block h-full">
        <div className="relative h-full bg-warm-white overflow-hidden">
          {/* Card frame */}
          <div className="absolute inset-0 border border-rose-gold/10 z-10 pointer-events-none transition-colors duration-500 group-hover:border-rose-gold/30" />

          {/* Animated corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-rose-gold/30 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-rose-gold/50" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r border-t border-rose-gold/30 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-rose-gold/50" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l border-b border-rose-gold/30 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-rose-gold/50" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-rose-gold/30 z-10 transition-all duration-500 group-hover:w-10 group-hover:h-10 group-hover:border-rose-gold/50" />

          {/* Image section */}
          <div className="relative aspect-square overflow-hidden bg-cream/30">
            <ImageKitImage
              src={item.images[0]}
              alt={item.name}
              fill
              quality={90}
              sizes="(min-width: 1040px) 400px, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              transformations="w-500,h-500"
            />

            {/* Elegant overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Sale badge */}
            {priceInfo.isOnSale && priceInfo.salePercent && (
              <div className="absolute top-4 left-4 z-20">
                <div className="relative">
                  <div className="bg-deep-burgundy text-warm-white text-xs font-secondary tracking-wider px-3 py-1.5">
                    -{discountPercentage}%
                  </div>
                  <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-deep-burgundy/60 to-transparent" />
                </div>
              </div>
            )}

            {/* Share button - appears on hover */}
            <div className="absolute top-4 right-4 z-20 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
              <button
                className="p-2.5 bg-warm-white/90 backdrop-blur-sm text-charcoal hover:bg-rose-gold hover:text-warm-white transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  const url = `${window.location.origin}/product/${item.slug}`;
                  if (navigator.share) {
                    navigator.share({ title: item.name, url });
                  } else {
                    navigator.clipboard.writeText(url);
                  }
                }}
                aria-label="Jaa tuote"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* View product indicator at bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <div className="bg-charcoal/90 backdrop-blur-sm text-warm-white text-center py-3">
                <span className="text-xs tracking-[0.2em] uppercase font-secondary">
                  Näytä tuote
                </span>
              </div>
            </div>
          </div>

          {/* Content section */}
          <div className="p-4 space-y-3">
            {/* Product name */}
            <h3 className="font-primary font-semibold text-base text-charcoal line-clamp-2 group-hover:text-rose-gold transition-colors duration-300 leading-tight">
              {item.name}
            </h3>

            {/* Price and availability row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Price */}
              <div className="flex items-baseline font-bold gap-2">
                {priceInfo.isOnSale && (
                  <span className="text-xs text-charcoal/40 line-through font-secondary">
                    {priceInfo.currentPrice.toFixed(2)}€
                  </span>
                )}
                <span
                  className={`text-lg font-primary font-bold ${priceInfo.isOnSale ? "text-deep-burgundy" : "text-charcoal"}`}
                >
                  {priceInfo.isOnSale
                    ? priceInfo.salePrice!.toFixed(2)
                    : priceInfo.currentPrice.toFixed(2)}
                  €
                </span>
              </div>

              {/* Availability indicator */}
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full ${
                    hasVariations
                      ? "bg-champagne"
                      : isAvailable
                        ? "bg-emerald-500"
                        : "bg-deep-burgundy"
                  }`}
                />
                <span className="text-sm text-charcoal/60 font-secondary">
                  {hasVariations ? "Vaihtoehtoja" : quantityInfo}
                </span>
              </div>
            </div>

            {/* Decorative line */}
            <div className="h-[1px] w-12 bg-gradient-to-r from-rose-gold/40 to-transparent group-hover:w-full transition-all duration-500" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const LoadingProductCard: React.FC = () => {
  return (
    <div className="relative bg-warm-white overflow-hidden h-full">
      {/* Card frame */}
      <div className="absolute inset-0 border border-rose-gold/10 z-10 pointer-events-none" />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-rose-gold/20 z-10" />
      <div className="absolute top-0 right-0 w-6 h-6 border-r border-t border-rose-gold/20 z-10" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-l border-b border-rose-gold/20 z-10" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-rose-gold/20 z-10" />

      {/* Image skeleton with shimmer */}
      <div className="relative aspect-square w-full bg-cream/30 overflow-hidden">
        <div className="absolute inset-0 shimmer-gold" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 bg-cream/50" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16 bg-cream/50" />
          <Skeleton className="h-4 w-14 bg-cream/50" />
        </div>
        <Skeleton className="h-[1px] w-12 bg-rose-gold/20" />
      </div>
    </div>
  );
};
