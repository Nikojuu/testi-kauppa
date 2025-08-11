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

export interface ShipitAgentResponse {
  status: number;
  locations: ShipitAgentLocation[];
}

export interface ShipitAgentLocation {
  id: string;
  name: string;
  address1: string;
  zipcode: string;
  city: string;
  countryCode: string;
  serviceId: string;
  carrier: string;
  price: number | null;
  merchantPrice: number | null;
  carrierLogo: string;
  openingHours: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
    exceptions: string[];
  } | null;
  openingHoursRaw: string | null;
  latitude: number;
  longitude: number;
  distanceInMeters: number;
  distanceInKilometers: number;
  metadata: unknown | null;
}

export interface ShipitResponse {
  status: string;
  number: number;
  trackingNumber: string;
  trackingUrls: string[];
  orderId: string;
  freightDoc: string[];
}
export type OrderData = {
  status: string;
  orderShipmentMethod: {
    id: string;
    name: string;
    price: number;
    vatRate: number;
    logo: string;
  };
  orderCustomerData: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
  };
 
  shipitData?: ShipitResponse;
};
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
  createdAt?: Date;

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
  shipitMethod: ShipitShippingMethod;
}

export interface ApiResponseShipmentMethods {
  // To type the API response
  shipmentMethods: ShipmentMethods[];
}

export interface ShipmentMethodsWithLocations {
  pricedLocations: ShipitAgentLocation[];
  shipmentMethods: ShipmentMethods[];
}

export interface ShipitShippingMethod {
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
  description: string;
  height: number;
  length: number;
  type: string;
  width: number;
  price: number;
  weight: number;
  pickupPoint: boolean;
  onlyParchelLocker: boolean;
}
export type OrderCustomerData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null; // Optional and nullable
  address: string;
  city: string;
  postalCode: string;
  // Orders?: Order[]; // Uncomment if you need the related Orders
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
  images: string[];
  // Optional: reference back to Order if needed
  // order?: Order;
}
export type PreOrderLineItems = {
  itemType: string;
  quantity: number;
  price: number;
  vatRate: number;
};

export type OrderShipmentMethod = {
  id: string;
  serviceId?: string;
  name: string;
  description?: string | null;
  logo?: string | null;
  price: number; // Float in Prisma, number in TypeScript
  orderId: string;
  vatRate?: number | null;
  trackingNumber?: string;
  trackingUrls?: string[];
  shipmentNumber?: string;
  freightDoc?: string[];
  // order?: Order; // Uncomment if you need the related Order
};

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
  orderCustomerData?: OrderCustomerData;
  ShipitShippingMethod?: ShipitShippingMethod;
  orderShipmentMethod?: OrderShipmentMethod;
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

export type StoreName = {
  name: string;
};

// Define the type for the StoreSettings object with the nested StoreName
export type StoreSettingsWithName = {
  id: string;
  storeId: string;
  ownerFirstName: string;
  ownerLastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  currency: string;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
  defaultVatRate: number; // Assuming defaultVatRate is a number, adjust if needed
  logoUrl: string | null;
  Store: StoreName; // Assuming Store can be null, adjust if needed
};

export type User = {
  firstName: string;
  lastName: string;
  email: string;
};

// Campaign Types
export enum CampaignType {
  FREE_SHIPPING = "FREE_SHIPPING",
  BUY_X_PAY_Y = "BUY_X_PAY_Y"
}

export interface Campaign {
  id: string;
  storeId: string;
  name: string;
  description: string | null;
  type: CampaignType;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  FreeShippingCampaign?: FreeShippingCampaign | null;
  BuyXPayYCampaign?: BuyXPayYCampaign | null;
}

export interface FreeShippingCampaign {
  id: string;
  campaignId: string;
  minimumSpend: number;
  shipmentMethods: ShipmentMethods[];
  campaign?: Campaign;
}

export interface BuyXPayYCampaign {
  id: string;
  campaignId: string;
  buyQuantity: number;
  payQuantity: number;
  applicableCategories: Category[];
  campaign?: Campaign;
}

export interface CampaignApiResponse {
  campaign: Campaign | null;
  type: CampaignType;
  found: boolean;
}
