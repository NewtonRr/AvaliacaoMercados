import type { ReviewResponse, ReviewTabConfig } from '../models/review';

export interface TabStats {
  tabId: string;
  title: string;
  total: number;
  average: number | null;
  distribution: Record<number, number>;
}

export function computeTabStats(
  tabs: ReviewTabConfig[],
  responses: ReviewResponse[],
): TabStats[] {
  const byTab: Record<string, ReviewResponse[]> = {};

  responses.forEach((response) => {
    if (!byTab[response.tabId]) {
      byTab[response.tabId] = [];
    }
    byTab[response.tabId].push(response);
  });

  return tabs.map((tab) => {
    const tabResponses = byTab[tab.id] ?? [];
    const total = tabResponses.length;
    let sum = 0;
    const distribution: Record<number, number> = {};

    tabResponses.forEach((response) => {
      sum += response.score;
      distribution[response.score] = (distribution[response.score] ?? 0) + 1;
    });

    const average = total > 0 ? sum / total : null;

    return {
      tabId: tab.id,
      title: tab.title,
      total,
      average,
      distribution,
    };
  });
}

