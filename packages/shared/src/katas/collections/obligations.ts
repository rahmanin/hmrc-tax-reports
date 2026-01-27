export type PeriodKey = string;

export type Obligation = {
  periodKey: PeriodKey;
  dueDate: string;
};

/**
 * Dedupe obligations by periodKey, keeping the FIRST occurrence.
 */
export function dedupeObligationsByPeriodKey(
  obligations: Obligation[],
): Obligation[] {
  const seen = new Set<PeriodKey>();
  const out: Obligation[] = [];

  for (const o of obligations) {
    if (seen.has(o.periodKey)) continue;
    seen.add(o.periodKey);
    out.push(o);
  }

  return out;
}
