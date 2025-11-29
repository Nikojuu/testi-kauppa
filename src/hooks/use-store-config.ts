import { Campaign } from "@/app/utils/types";
import { useStoreConfig } from "@/components/StoreConfigProvider";

/**
 * Helper hooks for accessing store config data.
 * All hooks must be used within StoreConfigProvider.
 */

export const useCampaigns = (): Campaign[] => {
  return useStoreConfig((state) => state.config.campaigns || []);
};

export const useStoreName = () => {
  return useStoreConfig((state) => state.config.store.name || "");
};

export const useStoreCurrency = () => {
  return useStoreConfig((state) => state.config.store.currency || "EUR");
};

export const usePaymentMethods = () => {
  return useStoreConfig((state) => state.config.payments.methods || []);
};

export const useStoreInfo = () => {
  return useStoreConfig((state) => state.config.store);
};

export const useStoreFeatures = () => {
  return useStoreConfig((state) => state.config.features);
};

export const useDefaultVatRate = () => {
  return useStoreConfig((state) => state.config.payments.defaultVatRate);
};
