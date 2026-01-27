import { describe, it, expect } from 'vitest';
import { dedupeObligationsByPeriodKey } from './obligations';
import { indexDraftsByPeriodKey } from './drafts';
import { normalizeDraftCached } from './cache';

describe('collections: Set/Map/WeakMap (domain-driven)', () => {
  it('Set: dedupe obligations by periodKey (keeps first)', () => {
    const obligations = [
      { periodKey: '2024-Q1', dueDate: '2024-04-01' },
      { periodKey: '2024-Q1', dueDate: '2024-04-15' }, // duplicate period
      { periodKey: '2024-Q2', dueDate: '2024-07-01' },
    ];

    const result = dedupeObligationsByPeriodKey(obligations);

    expect(result).toHaveLength(2);
    expect(result.map((o) => o.periodKey)).toEqual(['2024-Q1', '2024-Q2']);
    expect(result[0].dueDate).toBe('2024-04-01'); // first wins
  });

  it('Map: index drafts by periodKey (last wins on duplicates)', () => {
    const drafts = [
      {
        id: 'd1',
        periodKey: '2024-Q1',
        totals: { income: 1000, expenses: 100 },
      },
      {
        id: 'd2',
        periodKey: '2024-Q2',
        totals: { income: 2000, expenses: 500 },
      },
      {
        id: 'd3',
        periodKey: '2024-Q1',
        totals: { income: 1111, expenses: 111 },
      }, // duplicate period
    ];

    const index = indexDraftsByPeriodKey(drafts);

    expect(index.get('2024-Q2')?.id).toBe('d2');
    expect(index.get('2024-Q1')?.id).toBe('d3'); // last wins
    expect(index.size).toBe(2);
  });

  it('WeakMap: caches normalization per draft object identity', () => {
    const draft = {
      id: 'd1',
      periodKey: '2024-Q1',
      totals: { income: 1000, expenses: 100 },
    };

    const a = normalizeDraftCached(draft);
    const b = normalizeDraftCached(draft);

    expect(a).toBe(b); // same object returned from cache
    expect(a.netIncome).toBe(900);

    const sameDataDifferentObject = {
      id: 'd1',
      periodKey: '2024-Q1',
      totals: { income: 1000, expenses: 100 },
    };

    const c = normalizeDraftCached(sameDataDifferentObject);
    expect(c).not.toBe(a); // different object => different cache entry
  });
});
