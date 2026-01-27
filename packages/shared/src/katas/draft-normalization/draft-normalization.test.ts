import { describe, it, expect } from 'vitest';
import { normalizeDraft } from './draft-normalization';

describe('kata: draft normalization (domain mapping)', () => {
  it('normalizes a valid raw draft', () => {
    const raw = {
      id: 'd1',
      period: { from: '2024-01-01', to: '2024-03-31' },
      items: [{ id: 'i1', amount: '100.50' }],
    };

    const result = normalizeDraft(raw);

    expect(result.id).toBe('d1');
    expect(result.period.from).toBeInstanceOf(Date);
    expect(result.items[0].amount).toBe(100.5);
  });

  it('fills defaults defensively', () => {
    const raw = {
      id: 'd2',
      period: { from: '2024-01-01', to: '2024-03-31' },
      items: [{}],
    };

    const result = normalizeDraft(raw);

    expect(result.items[0].id).toBe('item-0');
    expect(result.items[0].amount).toBe(0);
  });

  it('throws on missing critical fields', () => {
    expect(() => normalizeDraft({})).toThrow('DRAFT_ID_MISSING');
  });

  it('throws on invalid dates', () => {
    const raw = {
      id: 'd3',
      period: { from: 'not-a-date', to: '2024-03-31' },
    };

    expect(() => normalizeDraft(raw)).toThrow('INVALID_DATE');
  });
});
