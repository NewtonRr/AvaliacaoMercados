import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ReviewTabConfig, ReviewResponse, StoreConfig } from '../models/review';
import { loadConfig, saveConfig, loadResponses, saveResponses } from '../services/reviewStorage';

interface ConfigContextValue {
  storeConfig: StoreConfig;
  setStoreConfig: (config: StoreConfig) => void;
  tabs: ReviewTabConfig[];
  upsertTab: (tab: ReviewTabConfig) => void;
  removeTab: (id: string) => void;
  responses: ReviewResponse[];
  addResponse: (response: ReviewResponse) => void;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

const defaultTabs: ReviewTabConfig[] = [
  {
    id: 'cleanliness',
    title: 'Limpeza',
    description: 'Como você avalia a limpeza da loja?',
    questionText: 'Avalie a limpeza da loja',
    scaleType: 'faces',
    maxScore: 3,
    color: '#4caf50',
    order: 0,
    isActive: true,
  },
  {
    id: 'service',
    title: 'Atendimento',
    description: 'Como você avalia o atendimento da equipe?',
    questionText: 'Avalie o atendimento da equipe',
    scaleType: 'faces',
    maxScore: 3,
    color: '#ff9800',
    order: 1,
    isActive: true,
  },
];

const defaultStoreConfig: StoreConfig = {
  storeId: 'default',
  storeName: 'Minha Loja',
  tabs: defaultTabs,
};

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const stored = loadConfig();
    return stored ?? defaultStoreConfig;
  });
  const [responses, setResponses] = useState<ReviewResponse[]>(() => loadResponses());

  useEffect(() => {
    saveConfig(storeConfig);
  }, [storeConfig]);

  useEffect(() => {
    saveResponses(responses);
  }, [responses]);

  const value = useMemo<ConfigContextValue>(
    () => ({
      storeConfig,
      setStoreConfig,
      tabs: storeConfig.tabs,
      upsertTab: (tab: ReviewTabConfig) => {
        setStoreConfig((current) => {
          const existingIndex = current.tabs.findIndex((t) => t.id === tab.id);
          if (existingIndex === -1) {
            return { ...current, tabs: [...current.tabs, tab] };
          }
          const nextTabs = current.tabs.slice();
          nextTabs[existingIndex] = tab;
          return { ...current, tabs: nextTabs };
        });
      },
      removeTab: (id: string) => {
        setStoreConfig((current) => ({
          ...current,
          tabs: current.tabs.filter((t) => t.id !== id),
        }));
      },
      responses,
      addResponse: (response: ReviewResponse) => {
        setResponses((current) => [...current, response]);
      },
    }),
    [storeConfig, responses],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return ctx;
}

