export type ScaleType = 'faces' | 'stars';

export interface ReviewTabConfig {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  questionText: string;
  scaleType: ScaleType;
  maxScore: number;
  color?: string;
  order: number;
  isActive: boolean;
}

export interface ReviewResponse {
  id?: string;
  tabId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface StoreConfig {
  storeId: string;
  storeName: string;
  tabs: ReviewTabConfig[];
}

