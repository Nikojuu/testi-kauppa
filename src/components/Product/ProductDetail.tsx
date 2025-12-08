"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AddToCartButton from "@/components/Cart/AddToCartButton";
import { getDisplayPriceSelectedProduct, isSaleActive } from "@/lib/utils";
import { PriceDisplay } from "../PriceDisplay";
import Breadcrumbs from "./Breadcrumbs";
import { ImageSliderWithZoom } from "../imageSliderWithZoom";
import { ImageSlider } from "../ImageSlider";
import {
  ProductFromApi,
  ProductVariation,
  ProductVariationFromApi,
} from "@/app/utils/types";
import WishlistButton from "./WishlistButton";

const ProductDetail = ({ product }: { product: ProductFromApi }) => {
  const hasVariations = product.variations?.length > 0;
  const [selectedVariation, setSelectedVariation] = useState<
    ProductVariationFromApi | undefined
  >(hasVariations ? product.variations[0] : undefined);

  const handleVariationChange = (variationId: string) => {
    const variation = product.variations.find((v) => v.id === variationId);
    setSelectedVariation(variation);
  };

  const isProductInStock = product.quantity === null || product.quantity > 0;
  const isVariationInStock = selectedVariation
    ? selectedVariation.quantity === null || selectedVariation.quantity > 0
    : null;

  const displayPrice = getDisplayPriceSelectedProduct(
    product,
    selectedVariation
  );
  const isCurrentlyOnSale = selectedVariation
    ? isSaleActive(
        selectedVariation.saleStartDate,
        selectedVariation.saleEndDate
      )
    : isSaleActive(product.saleStartDate, product.saleEndDate);

  const isOnSale = (
    productOrVariation: ProductFromApi | ProductVariation
  ): boolean => {
    const { salePrice, price, saleStartDate, saleEndDate } = productOrVariation;
    if (salePrice == null || salePrice >= (price ?? 0)) return false;
    return isSaleActive(saleStartDate, saleEndDate);
  };

  return (
    <div className="max-w-screen-xl mx-auto py-8 md:py-12">
      <Breadcrumbs categories={product.categories} productName={product.name} />

      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        {/* Image Section */}
        <div className="md:w-1/2 relative z-10">
          <div className="hidden md:block">
            <ImageSliderWithZoom
              images={
                (selectedVariation?.images?.length ?? 0) > 0
                  ? selectedVariation!.images
                  : product.images
              }
            />
          </div>
          <div className="md:hidden">
            <ImageSlider
              images={
                (selectedVariation?.images?.length ?? 0) > 0
                  ? selectedVariation!.images
                  : product.images
              }
            />
          </div>
        </div>

        {/* Product Info Section */}
        <div className="md:w-1/2 flex flex-col">
          {/* Product Name */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-primary font-bold text-charcoal leading-tight mb-6">
            {product.name}
          </h1>

          {/* Decorative line */}
          <div className="h-[1px] w-16 bg-gradient-to-r from-rose-gold/60 to-transparent mb-6" />

          {/* Price Section */}
          <div className="mb-8">
            <span className="text-xs tracking-[0.2em] uppercase font-secondary text-charcoal/50 block mb-2">
              Hinta
            </span>
            <PriceDisplay
              displayPrice={displayPrice!}
              originalPrice={
                isCurrentlyOnSale
                  ? (selectedVariation?.price ?? product.price) / 100
                  : undefined
              }
              isOnSale={isOnSale(selectedVariation || product)}
              salePercent={
                selectedVariation?.salePercent || product.salePercent
              }
            />
          </div>

          {/* Separator */}
          <div className="h-[1px] bg-gradient-to-r from-rose-gold/20 via-rose-gold/10 to-transparent mb-8" />

          {/* Description */}
          {!selectedVariation?.description && product.description && (
            <div className="mb-8">
              <span className="text-xs tracking-[0.2em] uppercase font-secondary text-charcoal/50 block mb-3">
                Kuvaus
              </span>
              <p className="text-sm md:text-base font-secondary text-charcoal/70 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Stock Status - No Variations */}
          {!hasVariations && (
            <div
              className={`flex items-center gap-2 text-sm font-secondary mb-8 ${
                isProductInStock ? "text-emerald-600" : "text-deep-burgundy"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isProductInStock ? "bg-emerald-500" : "bg-deep-burgundy"
                }`}
              />
              <span>
                {isProductInStock ? "Tuotetta on varastossa" : "Tuote on loppu"}
              </span>
            </div>
          )}

          {/* Variation Section */}
          {hasVariations && (
            <div className="mb-8">
              {/* Variation Description */}
              {selectedVariation?.description && (
                <div className="mb-6">
                  <span className="text-xs tracking-[0.2em] uppercase font-secondary text-charcoal/50 block mb-3">
                    Kuvaus
                  </span>
                  <p className="text-sm md:text-base font-secondary text-charcoal/70 leading-relaxed">
                    {selectedVariation.description}
                  </p>
                </div>
              )}

              {/* Variation Selector */}
              <label className="text-xs tracking-[0.2em] uppercase font-secondary text-charcoal/50 block mb-3">
                {selectedVariation?.options[0]?.optionType.name}
              </label>

              <Select
                onValueChange={handleVariationChange}
                value={selectedVariation?.id}
              >
                <SelectTrigger className="w-full h-12 border-charcoal/20 bg-warm-white font-secondary text-charcoal hover:border-rose-gold/40 transition-colors duration-300">
                  {selectedVariation?.options
                    .map((opt) => opt.value)
                    .join(" / ")}
                </SelectTrigger>
                <SelectContent className="bg-warm-white border-charcoal/20">
                  {product.variations.map((variation) => (
                    <SelectItem
                      key={variation.id}
                      value={variation.id}
                      className="font-secondary text-charcoal hover:bg-rose-gold/10 focus:bg-rose-gold/10 cursor-pointer"
                    >
                      {variation.options.map((opt) => opt.value).join(" / ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Variation Stock Status */}
              {selectedVariation && (
                <div
                  className={`flex items-center gap-2 text-sm font-secondary mt-4 ${
                    isVariationInStock ? "text-emerald-600" : "text-deep-burgundy"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isVariationInStock ? "bg-emerald-500" : "bg-deep-burgundy"
                    }`}
                  />
                  <span>
                    {isVariationInStock
                      ? "Tuotetta on varastossa"
                      : "Tuote on loppu"}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Wishlist & Add to Cart Buttons */}
          <div className="mt-auto pt-6 space-y-3">
            <WishlistButton
              product={product}
              selectedVariation={selectedVariation}
            />
            <AddToCartButton
              product={product}
              selectedVariation={selectedVariation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
