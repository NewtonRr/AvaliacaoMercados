import type { StoreConfig, ReviewResponse } from '../models/review';

const STORAGE_PREFIX = 'shopseg_review_';
const CONFIG_KEY = `${STORAGE_PREFIX}config_v1`;
const RESPONSES_KEY = `${STORAGE_PREFIX}responses_v1`;

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadConfig(): StoreConfig | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(CONFIG_KEY);
  return safeParse<StoreConfig>(raw);
}

export function saveConfig(config: StoreConfig) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch {
    // ignore write errors for now; manager UI can later surface them
  }
}

export function loadResponses(): ReviewResponse[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const raw = window.localStorage.getItem(RESPONSES_KEY);
  return safeParse<ReviewResponse[]>(raw) ?? [];
}

export function saveResponses(responses: ReviewResponse[]) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
  } catch {
    // ignore write errors for now; manager UI can later surface them
  }
}

