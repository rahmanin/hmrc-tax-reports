import { describe, it, expect } from 'vitest';

type DraftReport = {
  id: string;
  totals: { income: number; expenses: number };
};

describe('kata: this binding (method extraction, callback, bind)', () => {
  it('breaks when a method is passed as callback (lost this)', () => {
    const service = {
      name: 'DraftTotalsService',
      multiplier: 2,
      computeNet(this: { multiplier: number }, draft: DraftReport) {
        return (draft.totals.income - draft.totals.expenses) * this.multiplier;
      },
    };

    const draft: DraftReport = {
      id: 'd1',
      totals: { income: 1000, expenses: 100 },
    };

    expect(service.computeNet(draft)).toBe(1800);

    const fn = service.computeNet as unknown as (draft: DraftReport) => number;

    expect(() => fn(draft)).toThrow();
  });

  it('fix: bind preserves this (recommended for callbacks)', () => {
    const service = {
      multiplier: 3,
      computeNet(this: { multiplier: number }, draft: DraftReport) {
        return (draft.totals.income - draft.totals.expenses) * this.multiplier;
      },
    };

    const draft: DraftReport = {
      id: 'd2',
      totals: { income: 1000, expenses: 100 },
    };

    const safe = service.computeNet.bind(service);
    expect(safe(draft)).toBe(2700);
  });

  it('call/apply: use it once without permanent binding', () => {
    const serviceA = {
      multiplier: 2,
      computeNet(this: { multiplier: number }, draft: DraftReport) {
        return (draft.totals.income - draft.totals.expenses) * this.multiplier;
      },
    };

    const serviceB = { multiplier: 10 };
    const draft: DraftReport = {
      id: 'd3',
      totals: { income: 1000, expenses: 100 },
    };

    expect(serviceA.computeNet.call(serviceB, draft)).toBe(9000);
    expect(serviceA.computeNet.apply(serviceB, [draft])).toBe(9000);
  });

  it('practical pattern: passing method as array callback breaks unless wrapped', () => {
    const service = {
      multiplier: 2,
      computeNet(this: { multiplier: number }, draft: DraftReport) {
        return (draft.totals.income - draft.totals.expenses) * this.multiplier;
      },
    };

    const drafts: DraftReport[] = [
      { id: 'a', totals: { income: 1000, expenses: 100 } },
      { id: 'b', totals: { income: 200, expenses: 50 } },
    ];

    const extracted = service.computeNet;
    expect(() => drafts.map(extracted)).toThrow();

    const ok1 = drafts.map((d) => service.computeNet(d));
    expect(ok1).toEqual([1800, 300]);

    const ok2 = drafts.map(service.computeNet.bind(service));
    expect(ok2).toEqual([1800, 300]);
  });
});
