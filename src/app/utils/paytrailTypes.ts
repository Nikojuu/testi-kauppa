export type PaytrailResponse = {
  transactionId: string;
  href: string;
  reference: string;
  terms: string;
  groups: Array<{
    id: string;
    name: string;
    icon: string;
    svg: string;
  }>;
  providers: PaytrailProvider[];
  customProviders: Record<string, unknown>;
};
export type PaytrailProvider = {
  url: string;
  icon: string;
  svg: string;
  name: string;
  group: string;
  id: string;
  parameters: { name: string; value: string }[];
};
export type PaytrailCheckoutErrorCode =
  | "PRODUCT_NOT_FOUND"
  | "VARIATION_NOT_FOUND"
  | "INSUFFICIENT_INVENTORY"
  | "STORE_SETTINGS_NOT_FOUND";

export type PaytrailCheckoutErrorResponse = {
  error: string;
  code?: PaytrailCheckoutErrorCode;
  details?: {
    productId?: string;
    variationId?: string;
    availableQuantity?: number;
    requestedQuantity?: number;
    // Allow backend to add more without breaking the client
    [key: string]: unknown;
  };
};
