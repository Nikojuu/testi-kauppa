export interface confirmedItems {
  unitPrice: number;
  units: number;
  vatPercentage: number;
  productCode: string;
  description: string;
  stamp: string;
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
  images: string[];
  description?: string | null;
  quantity: number | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;

  quantity: number | null;
  salePrice?: number | null;
  salePercent?: string | null;
  saleEndDate?: Date | null;
  saleStartDate?: Date | null;
  variations: ProductVariation[];
}
export interface ProductFromApi {
  id: string;
  name: string;
  slug?: string;
  images: string[];
  price: number;
  quantity: number | null;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  salePercent: string | null;
  salePrice: number | null;
  saleStartDate: Date | null;
  saleEndDate: Date | null;
  vatPercentage: number | null;
  categories: {
    id: string;
    name: string;
    slug: string;
    parentId: string | null;
  }[];
  variations: {
    id: string;
    images: string[];
    price: number;
    description: string | null;
    quantity: number | null;
    salePercent: string | null;
    salePrice: number | null;
    saleStartDate: Date | null;
    saleEndDate: Date | null;
    options: {
      value: string;
      optionType: {
        name: string;
      };
    }[];
  }[];
}

// We can also define a type alias for the variation for easier use
export type ProductVariationFromApi = ProductFromApi["variations"][0];

export interface PriceInfo {
  currentPrice: number;
  salePrice: number | null;
  salePercent: string | null;
  isOnSale: boolean;
}

export type ApiResponseProductCardType = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  salePrice: number | null;
  salePercent: string | null;
  saleEndDate: Date | null;
  saleStartDate: Date | null;
  slug: string;
  quantity: number | null;
  variations: {
    id: string;
    price: number | null;
    saleEndDate: Date | null;
    saleStartDate: Date | null;
    salePrice: number | null;
    salePercent: string | null;
  }[];
};
export type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  storeId: string;
  parentId: string | null;
  createdAt: string;
  children: ApiCategory[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  storeId: string;
  parentId: string | null;
  createdAt: Date;
  children: Category[];
};

export interface ShipmentMethods {
  id: string;
  name: string;
  description: string | null; // description is nullable in your schema
  storeId: string | null;
  max_estimate_delivery_days: number | null; // nullable
  min_estimate_delivery_days: number | null; // nullable
  active: boolean;
  price: number;
}

export interface ApiResponseShipmentMethods {
  // To type the API response
  shipmentMethods: ShipmentMethods[];
}

type ShipitShippingMethod = {
  id: string;
  serviceId: string;
  name: string;
  carrier: string;
  logo: string;
  pickUpIncluded: boolean;
  homeDelivery: boolean;
  worldwideDelivery: boolean;
  fragile: boolean;
  domesticDeliveries: boolean;
  information?: string | null;
  createdAt: Date;
  updatedAt: Date;
  storeId?: string | null;
  description: string;
  height: number;
  length: number;

  width: number;
  price: number;
  weight: number;
  pickupPoint: boolean;
  onlyParchelLocker: boolean;
};

export interface OrderLineItems {
  id: string;
  orderId: string;
  itemType: ItemType;
  quantity: number;
  price: number;
  totalAmount: number;
  productCode: string;
  name: string;
  vatRate: number;
  // Optional: reference back to Order if needed
  // order?: Order;
}

export interface Order {
  id: string;
  storeId?: string;
  createdAt: Date;
  totalAmount: number;
  status: OrderStatus;
  paytrailTransactionId?: string;
  shipitShippingMethodId?: string;
  shipitOrderId?: string;
  trackingNumber?: string;
  trackingUrls: string[];
  freightDoc: string[];
  orderNumber: number;
  customerDataId?: string;

  ShipitShippingMethod?: ShipitShippingMethod;

  OrderLineItems: OrderLineItems[];
}
export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  SHIPPED = "SHIPPED",
  // add other statuses as needed
}

export enum ItemType {
  SHIPPING = "SHIPPING",
  VARIATION = "VARIATION",
  PRODUCT = "PRODUCT",
  // add other item types as needed
}
