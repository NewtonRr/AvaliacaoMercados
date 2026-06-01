import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ReviewTabConfig, ReviewResponse } from '../models/review';
import { fetchTabs, upsertTabApi, removeTabApi, fetchResponses, addResponseApi } from '../services/reviewStorage';
import { useParams } from 'react-router-dom';
import { ConfigContext, type ConfigContextValue } from './useConfig';

interface ConfigProviderProps {
  children: ReactNode;
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const { idLoja } = useParams<{ idLoja: string }>();
  const [tabs, setTabs] = useState<ReviewTabConfig[]>([]);
  const [responses, setResponses] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!idLoja) return;
    Promise.all([fetchTabs(idLoja), fetchResponses(idLoja)])
      .then(([tabsData, responsesData]) => {
        setTabs(tabsData);
        setResponses(responsesData);
      })
      .finally(() => setLoading(false));
  }, [idLoja]);

  const value = useMemo<ConfigContextValue>(
    () => ({
      tabs,
      loading,
      responses,
      upsertTab: async (tab) => {
        if (!idLoja) {
          throw new Error('idLoja não encontrado. Verifique a URL.');
        }
        const saved = await upsertTabApi(idLoja, tab);
        setTabs((current) => {
          const idx = current.findIndex((t) => t.id === saved.id);
          if (idx === -1) return [...current, saved];
          const next = [...current];
          next[idx] = saved;
          return next;
        });
      },
      removeTab: async (id) => {
        await removeTabApi(idLoja!, id);
        setTabs((current) => current.filter((t) => t.id !== id));
      },
      addResponse: async (response) => {
        const saved = await addResponseApi(idLoja!, response);
        setResponses((current) => [...current, saved]);
      },
    }),
    [tabs, responses, loading, idLoja],
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}
