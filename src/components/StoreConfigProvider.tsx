"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
  type StoreConfigState,
  createStoreConfigStore,
} from "@/stores/store-config-store";
import { StoreConfig } from "@/app/utils/types";

export type StoreConfigStoreApi = ReturnType<typeof createStoreConfigStore>;

export const StoreConfigContext = createContext<
  StoreConfigStoreApi | undefined
>(undefined);

export interface StoreConfigProviderProps {
  children: ReactNode;
  config: StoreConfig;
}

/**
 * Provides store config to the component tree using Zustand's recommended
 * per-request pattern for Next.js App Router.
 *
 * This creates a new store instance per request/session, preventing data
 * leaks between concurrent server requests.
 */
export const StoreConfigProvider = ({
  children,
  config,
}: StoreConfigProviderProps) => {
  const storeRef = useRef<StoreConfigStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createStoreConfigStore(config);
  }

  return (
    <StoreConfigContext.Provider value={storeRef.current}>
      {children}
    </StoreConfigContext.Provider>
  );
};

export const useStoreConfigContext = () => {
  const storeContext = useContext(StoreConfigContext);

  if (!storeContext) {
    throw new Error(
      `useStoreConfigContext must be used within StoreConfigProvider`
    );
  }

  return storeContext;
};

export const useStoreConfig = <T,>(
  selector: (store: StoreConfigState) => T
): T => {
  const storeContext = useStoreConfigContext();
  return useStore(storeContext, selector);
};
