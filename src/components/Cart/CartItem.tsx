// import { useCart } from "@/hooks/use-cart";
// import { X } from "lucide-react";
// import Image from "next/image";
// import { getDisplayPriceSelectedProduct, isSaleActive } from "@/lib/utils"; // Ensure this is imported
// import { SelectedProduct } from "../Product/ProductDetail";

// type CartItemProps = {
//   product: SelectedProduct;
//   variation?: {
//     id: string;
//     price: number | null;
//     salePrice: number | null;
//     saleStartDate: Date | null;
//     saleEndDate: Date | null;
//     optionName: string;
//     optionValue: string;
//     images?: string[];
//   };
// };

// const CartItem = ({ product, variation }: CartItemProps) => {
//   const removeItem = useCart((state) => state.removeItem);
//   const incrementQuantity = useCart((state) => state.incrementQuantity);
//   const decrementQuantity = useCart((state) => state.decrementQuantity);

//   // Extract prices and sale data from either the variation or product
//   const displayPrice = getDisplayPriceSelectedProduct(product, variation);

//   return (
//     <div className="space-y-3 py-2">
//       <div className="flex items-start justify-between gap-4">
//         <div className="flex items-center space-x-4">
//           <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
//             <Image
//               src={variation?.images?.[0] ?? product.images[0]}
//               alt={product.name}
//               fill
//               className="absolute object-cover"
//             />
//           </div>
//           <div className="flex flex-col self-start">
//             <span className="line-clamp-1 text-sm font-medium mb-1">
//               {product.name}
//             </span>
//             {variation && (
//               <span className="line-clamp-1 text-xs text-muted-foreground">
//                 {variation.optionName}: {variation.optionValue}
//               </span>
//             )}

//             <div className="mt-4 text-xs text-muted-foreground">
//               <button
//                 onClick={() => removeItem(product.id)}
//                 className="flex items-center gap-0.5"
//               >
//                 <X className="w-3 h-4" />
//                 Remove
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col space-y-1 font-medium text-right">
//           <span className="ml-auto line-clamp-1 text-sm">
//             €{displayPrice?.toFixed(2)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartItem;

"use client";

import { useCart } from "@/hooks/use-cart";
import { X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { getDisplayPriceSelectedProduct } from "@/lib/utils";
import { SelectedProduct } from "../Product/ProductDetail";
import { Button } from "@/components/ui/button";

type CartItemProps = {
  product: SelectedProduct;
  variation?: {
    id: string;
    price: number | null;
    salePrice: number | null;
    saleStartDate: Date | null;
    saleEndDate: Date | null;
    optionName: string;
    optionValue: string;
    images?: string[];
  };
};

export default function CartItem({ product, variation }: CartItemProps) {
  const removeItem = useCart((state) => state.removeItem);
  const incrementQuantity = useCart((state) => state.incrementQuantity);
  const decrementQuantity = useCart((state) => state.decrementQuantity);
  const cartItem = useCart((state) =>
    state.items.find((item) => item.product.id === product.id)
  );

  // Extract prices and sale data from either the variation or product
  const displayPrice = getDisplayPriceSelectedProduct(product, variation);

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            <Image
              src={variation?.images?.[0] ?? product.images[0]}
              alt={product.name}
              fill
              className="absolute object-cover"
            />
          </div>
          <div className="flex flex-col self-start">
            <span className="line-clamp-1 text-sm font-medium mb-1">
              {product.name}
            </span>
            {variation && (
              <span className="line-clamp-1 text-xs text-muted-foreground">
                {variation.optionName}: {variation.optionValue}
              </span>
            )}
            <div className="mt-2 flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => decrementQuantity(product.id)}
                disabled={cartItem?.cartQuantity === 1}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <span className="w-8 text-center">
                {cartItem?.cartQuantity || 0}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => incrementQuantity(product.id)}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              <button
                onClick={() => removeItem(product.id)}
                className="flex items-center gap-0.5"
              >
                <X className="w-3 h-4" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium text-right">
          <span className="ml-auto line-clamp-1 text-sm">
            €{displayPrice?.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
