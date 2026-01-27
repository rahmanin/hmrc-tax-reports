type RawDraft = {
  id?: string;
  period?: { from?: string; to?: string };
  items?: Array<{
    id?: string;
    amount?: string | number;
  }>;
};

type NormalizedDraft = {
  id: string;
  period: { from: Date; to: Date };
  items: Array<{ id: string; amount: number }>;
};

const parseDate = (value?: string): Date => {
  const d = value ? new Date(value) : new Date('Invalid');
  if (Number.isNaN(d.getTime())) {
    throw new Error('INVALID_DATE');
  }
  return d;
};

const parseAmount = (value?: string | number): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return 0; // defensive default
};

export function normalizeDraft(raw: RawDraft): NormalizedDraft {
  if (!raw.id) throw new Error('DRAFT_ID_MISSING');

  return {
    id: raw.id,
    period: {
      from: parseDate(raw.period?.from),
      to: parseDate(raw.period?.to),
    },
    items: (raw.items ?? []).map((item, index) => ({
      id: item.id ?? `item-${index}`,
      amount: parseAmount(item.amount),
    })),
  };
}
