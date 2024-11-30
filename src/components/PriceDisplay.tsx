import { PriceInfo } from "@/app/utils/types";
import React from "react";

interface PriceDisplayProps {
  priceInfo: PriceInfo;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceInfo }) => {
  const discountPercentage = priceInfo.salePercent
    ? ((1 - parseFloat(priceInfo.salePercent)) * 100).toFixed(0)
    : null;
  return (
    <div className="flex flex-col items-end gap-1 ">
      <div className="flex items-center gap-2">
        {priceInfo.isOnSale && priceInfo.salePercent ? (
          <span className="bg-red-100 text-red-500 text-xs font-medium px-2 py-0.5 rounded">
            -{discountPercentage}%
          </span>
        ) : (
          <span className="invisible"></span>
        )}
        <span
          className={`text-gray-400 text-sm ${
            priceInfo.isOnSale ? "line-through" : "invisible"
          }`}
        >
          €{priceInfo.currentPrice.toFixed(2)}
        </span>
      </div>
      <span className="text-lg font-bold">
        €
        {priceInfo.isOnSale
          ? priceInfo.salePrice!.toFixed(2)
          : priceInfo.currentPrice.toFixed(2)}
      </span>
    </div>
  );
};
