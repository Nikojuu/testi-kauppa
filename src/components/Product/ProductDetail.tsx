"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import AddToCartButton from "@/components/Cart/AddToCartButton";
import { ImageSlider } from "../ImageSlider";
import { getPriceInfo, isSaleActive } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { PriceDisplay } from "../PriceDisplay";

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
  categories: { id: string; name: string }[];

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

  const priceInfo = getPriceInfo(product);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
      {/* Use selected variation images or default to product images */}
      <ImageSlider
        images={
          selectedVariation?.images && selectedVariation.images.length > 0
            ? selectedVariation.images
            : product.images
        }
      />

      <div className="mt-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {product.name}
        </h1>
        {product.categories.map((category) => (
          <Badge
            key={category.id}
            className="mt-2 rounded-lg bg-green-300"
            variant="outline"
          >
            {category.name}
          </Badge>
        ))}

        <div className="my-8">
          <PriceDisplay priceInfo={priceInfo} />
        </div>
        {!selectedVariation?.description && (
          <p className="text-base text-gray-700 mt-6">{product.description}</p>
        )}

        {isProductInStock !== null && (
          <div
            className={`flex items-center ${
              isProductInStock ? "text-green-600" : "text-red-600"
            } text-sm font-medium`}
          >
            {isProductInStock ? (
              <>
                <Check className="w-5 h-5 mr-2 my-2 " />
                <span>Tuotetta on varastossa</span>
              </>
            ) : (
              <>
                <X className="w-5 h-5 mr-2 my-2" />
                <span>Tuote on loppu</span>
              </>
            )}
          </div>
        )}
        {hasVariations && (
          <div className="my-4">
            <p className="text-base text-gray-700 my-6">
              {selectedVariation?.description}
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedVariation?.optionName}:
            </label>

            <Select
              onValueChange={handleVariationChange}
              defaultValue={selectedVariation?.optionValue}
            >
              <SelectTrigger>{selectedVariation?.optionValue}</SelectTrigger>
              <SelectContent>
                {product.ProductVariation.map((variation) => (
                  <SelectItem key={variation.id} value={variation.optionValue}>
                    {variation.optionValue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div
              className={`flex items-center ${
                isVariationInStock ? "text-green-600" : "text-red-600"
              } text-sm font-medium`}
            >
              {isVariationInStock !== null && (
                <div
                  className={`flex items-center ${
                    isVariationInStock ? "text-green-600" : "text-red-600"
                  } text-sm font-medium`}
                >
                  {isVariationInStock ? (
                    <>
                      <Check className="w-5 h-5 mr-2 my-2 " />
                      <span>Tuotetta on varastossa</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 mr-2 my-2" />
                      <span>Tuote on loppu</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <AddToCartButton
          product={product}
          selectedVariation={selectedVariation}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
