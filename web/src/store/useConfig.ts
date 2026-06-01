import { createContext, useContext } from 'react';
import type { ReviewTabConfig, ReviewResponse } from '../models/review';

export interface ConfigContextValue {
  tabs: ReviewTabConfig[];
  upsertTab: (tab: ReviewTabConfig) => Promise<void>;
  removeTab: (id: string) => Promise<void>;
  responses: ReviewResponse[];
  addResponse: (response: ReviewResponse) => Promise<void>;
  loading: boolean;
}

export const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return ctx;
}
