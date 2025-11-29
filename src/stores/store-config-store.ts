import { createStore } from "zustand/vanilla";
import { StoreConfig } from "@/app/utils/types";

export type StoreConfigState = {
  config: StoreConfig;
};

export const createStoreConfigStore = (initState: StoreConfig) => {
  return createStore<StoreConfigState>()(() => ({
    config: initState,
  }));
};
