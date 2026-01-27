import type { DraftReport } from './drafts';

export type NormalizedDraft = DraftReport & {
  normalized: true;
  netIncome: number;
};

const normalizationCache = new WeakMap<DraftReport, NormalizedDraft>();

/**
 * Cache normalization by object identity without retaining memory.
 * WeakMap key must be an object => perfect for caching per draft object.
 */
export function normalizeDraftCached(draft: DraftReport): NormalizedDraft {
  const cached = normalizationCache.get(draft);
  if (cached) return cached;

  const normalized: NormalizedDraft = {
    ...draft,
    normalized: true,
    netIncome: draft.totals.income - draft.totals.expenses,
  };

  normalizationCache.set(draft, normalized);
  return normalized;
}
