"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AddToCartButton from "@/components/Cart/AddToCartButton";
import { ImageSlider } from "../ImageSlider";
import {
  getDisplayPriceSelectedProduct,
  getPriceInfo,
  isSaleActive,
} from "@/lib/utils";
import { Check, X } from "lucide-react";
import { PriceDisplay } from "../PriceDisplay";
import { Separator } from "../ui/separator";
import Breadcrumbs from "./Breadcrumbs";

export interface SelectedPriceOption {
  price: number | null;
  salePrice: number | null;
  salePercent: string | null;
  saleStartDate: Date | null;
  saleEndDate: Date | null;
}

export interface SelectedProductVariation extends SelectedPriceOption {
  id: string;
  images: string[];
  description: string | null;
  quantity: number | null;
  optionName: string;
  optionValue: string;
}

export interface SelectedProduct extends SelectedPriceOption {
  id: string;
  name: string;
  images: string[];
  price: number;

  quantity: number | null;
  description: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  }[];
  ProductVariation: SelectedProductVariation[];
}

const ProductDetail = ({ product }: { product: SelectedProduct }) => {
  const hasVariations =
    product.ProductVariation && product.ProductVariation.length > 0;
  const [selectedVariation, setSelectedVariation] = useState<
    SelectedProductVariation | undefined
  >(hasVariations ? product.ProductVariation[0] : undefined);

  const handleVariationChange = (optionValue: string) => {
    if (hasVariations) {
      const variation = product.ProductVariation.find(
        (v) => v.optionValue === optionValue
      );
      setSelectedVariation(variation || product.ProductVariation[0]);
    }
  };
  const isProductInStock = (product.quantity ?? 0) > 0 ? true : null;
  const isVariationInStock = selectedVariation
    ? (selectedVariation.quantity ?? 0) > 0
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
    productOrVariation: SelectedProduct | SelectedProductVariation
  ): boolean => {
    const { salePrice, price, saleStartDate, saleEndDate } = productOrVariation;

    if (salePrice === null || salePrice >= (price ?? 0)) {
      return false;
    }

    return isSaleActive(saleStartDate, saleEndDate);
  };

  return (
    <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Breadcrumbs categories={product.categories} productName={product.name} />
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="md:w-1/2">
          <ImageSlider
            images={
              selectedVariation?.images && selectedVariation.images.length > 0
                ? selectedVariation.images
                : product.images
            }
          />
        </div>

        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="mb-6 flex justify-between">
              <h3 className="font-semibold my-4">Hinta:</h3>
              <PriceDisplay
                displayPrice={displayPrice!}
                originalPrice={
                  isCurrentlyOnSale
                    ? selectedVariation?.price || product.price
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

            {isProductInStock !== null && (
              <div
                className={`flex items-center ${
                  isProductInStock ? "text-green-600" : "text-red-600"
                } text-sm font-medium mb-6`}
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

            {hasVariations && (
              <div className="mb-6">
                <h3 className="font-semibold my-4">Kuvaus:</h3>
                <p className="text-base text-gray-700 mb-4">
                  {selectedVariation?.description}
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedVariation?.optionName}:
                </label>

                <Select
                  onValueChange={handleVariationChange}
                  defaultValue={selectedVariation?.optionValue}
                >
                  <SelectTrigger className="w-full">
                    {selectedVariation?.optionValue}
                  </SelectTrigger>
                  <SelectContent>
                    {product.ProductVariation.map((variation) => (
                      <SelectItem
                        key={variation.id}
                        value={variation.optionValue}
                      >
                        {variation.optionValue}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isVariationInStock !== null && (
                  <div
                    className={`flex items-center ${
                      isVariationInStock ? "text-green-600" : "text-red-600"
                    } text-sm font-medium mt-2`}
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
              </div>
            )}
          </div>

          <div className="mt-6">
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
