import { PriceInfo } from "@/app/utils/types";
import React from "react";

interface PriceDisplayProps {
  priceInfo: PriceInfo;
}

export const LowestPriceDisplay: React.FC<PriceDisplayProps> = ({
  priceInfo,
}) => {
  const discountPercentage = priceInfo.salePercent
    ? ((1 - parseFloat(priceInfo.salePercent)) * 100).toFixed(0)
    : null;

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {priceInfo.isOnSale && priceInfo.salePercent ? (
          <span className="bg-red-600 text-white text-xs font-medium px-2 py-0.5 ">
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
      <span
        className={`text-lg font-bold ${priceInfo.isOnSale ? "text-red-600" : ""}`}
      >
        €
        {priceInfo.isOnSale
          ? priceInfo.salePrice!.toFixed(2)
          : priceInfo.currentPrice.toFixed(2)}
      </span>
    </div>
  );
};
