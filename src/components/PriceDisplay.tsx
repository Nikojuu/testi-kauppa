import { PriceInfo } from "@/app/utils/types";
import React from "react";

interface PriceDisplayProps {
  priceInfo: PriceInfo;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ priceInfo }) => {
  if (!priceInfo.isOnSale) {
    return (
      <span className="text-lg font-bold text-primary">
        €{priceInfo.currentPrice.toFixed(2)}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {priceInfo.salePercent && (
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
            -{parseFloat(priceInfo.salePercent) * 100}%
          </span>
        )}
        <span className="text-gray-400 line-through text-sm">
          €{priceInfo.currentPrice.toFixed(2)}
        </span>
      </div>
      <span className="text-lg font-bold text-primary">
        €{priceInfo.salePrice!.toFixed(2)}
      </span>
    </div>
  );
};
