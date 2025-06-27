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
import { Check, X } from "lucide-react";
import { PriceDisplay } from "../PriceDisplay";
import { Separator } from "../ui/separator";
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
    <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Breadcrumbs categories={product.categories} productName={product.name} />
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="md:w-1/2">
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

        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-secondary font-extrabold tracking-tight text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="mb-6 flex justify-between">
              <h3 className="font-semibold my-4">Hinta:</h3>
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
            <Separator />

            {!selectedVariation?.description && (
              <>
                <h3 className="font-semibold my-4">Kuvaus:</h3>
                <p className="text-base text-gray-700 mb-6">
                  {product.description}
                </p>
              </>
            )}
            {!hasVariations && (
              <div
                className={`flex items-center ${
                  isProductInStock ? "text-green-600" : "text-red-600"
                } text-sm font-medium my-6`}
              >
                {isProductInStock ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    <span>Tuotetta on varastossa</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 mr-2" />
                    <span>Tuote on loppu</span>
                  </>
                )}
              </div>
            )}

            {selectedVariation && (
              <div
                className={`flex items-center ${
                  isVariationInStock ? "text-green-600" : "text-red-600"
                } text-sm font-medium my-6`}
              >
                {isVariationInStock ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    <span>Tuotetta on varastossa</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 mr-2" />
                    <span>Tuote on loppu</span>
                  </>
                )}
              </div>
            )}

            {hasVariations && (
              <div className="mb-6">
                {selectedVariation?.description && (
                  <>
                    <h3 className="font-semibold my-4">Kuvaus:</h3>
                    <p className="text-base text-gray-700 mb-4">
                      {selectedVariation.description}
                    </p>
                  </>
                )}

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedVariation?.options[0]?.optionType.name}:
                </label>

                <Select
                  onValueChange={handleVariationChange}
                  value={selectedVariation?.id}
                >
                  <SelectTrigger className="w-full">
                    {selectedVariation?.options
                      .map((opt) => opt.value)
                      .join(" / ")}
                  </SelectTrigger>
                  <SelectContent>
                    {product.variations.map((variation) => (
                      <SelectItem key={variation.id} value={variation.id}>
                        {variation.options.map((opt) => opt.value).join(" / ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>{" "}
          <div className="space-y-4">
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
