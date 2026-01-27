import type { PeriodKey } from './obligations';

export type DraftReport = {
  id: string;
  periodKey: PeriodKey;
  totals: { income: number; expenses: number };
};

/**
 * Index drafts by periodKey.
 * If duplicates exist, the LAST one wins (Map.set overwrites).
 */
export function indexDraftsByPeriodKey(
  drafts: DraftReport[],
): Map<PeriodKey, DraftReport> {
  const map = new Map<PeriodKey, DraftReport>();
  for (const d of drafts) map.set(d.periodKey, d);
  return map;
}
