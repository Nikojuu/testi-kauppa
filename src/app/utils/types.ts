import { CartItem } from "@/hooks/use-cart";
import { ShipitShippingMethod, ShipmentMethods } from "@prisma/client";

export interface confirmedItems {
  unitPrice: number;
  units: number;
  vatPercentage: number;
  productCode: string;
  description: string;
}

export type ShipmentMethodUnion =
  | ShipmentMethods
  | ShipitShippingMethod
  | DropInLocation;

export interface DropInLocation {
  id: string;
  name: string;
  serviceId: string;
  address1: string;
  price: number;
  city: string;
  zipcode: string;
  merchantPrice?: number;
  carrier: string;
  carrierLogo: string;
  distanceInKilometers: number;
}

export interface ShipitResponse {
  status: string;
  number: number;
  trackingNumber: string;
  trackingUrls: string[];
  orderId: string;
  freightDoc: string[];
}
// types.ts
export interface ProductVariation {
  id: string;
  price?: number | null;
  saleEndDate?: Date | null;
  saleStartDate?: Date | null;
  salePrice?: number | null;
  salePercent?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  quantity: number | null;
  salePrice?: number | null;
  salePercent?: string | null;
  saleEndDate?: Date | null;
  saleStartDate?: Date | null;
  ProductVariation?: ProductVariation[];
}

export interface PriceInfo {
  currentPrice: number;
  salePrice: number | null;
  salePercent: string | null;
  isOnSale: boolean;
}
