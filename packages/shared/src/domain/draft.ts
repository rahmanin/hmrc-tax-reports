import type { Money } from './money';

export type DraftId = string;
export type PeriodKey = string;

export type LineItem = Readonly<{
  id: string;
  description?: string;
  amount: Money;
}>;

export type DraftBase = Readonly<{
  id: DraftId;
  periodKey: PeriodKey;
  items: readonly LineItem[];
}>;

export type DraftStatus =
  | { kind: 'DRAFT' }
  | { kind: 'VALID'; validatedAt: string } // ISO date
  | { kind: 'INVALID'; errors: readonly string[] };

export type DraftReport = DraftBase & Readonly<{ status: DraftStatus }>;
