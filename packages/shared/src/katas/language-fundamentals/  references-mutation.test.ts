import { describe, it, expect } from 'vitest';

type LineItem = { id: string; amount: number };
type DraftReport = { id: string; lineItems: LineItem[] };

describe('kata: references vs primitives (mutation corrupts draft data)', () => {
  it('BUG: helper mutates original draft lineItems (shared reference)', () => {
    const draft: DraftReport = {
      id: 'd1',
      lineItems: [{ id: 'l1', amount: 100 }],
    };

    const updated = addLineItem_MUTATING(draft, { id: 'l2', amount: 50 });

    expect(draft.lineItems).toHaveLength(2); // corruption
    expect(updated.lineItems).toHaveLength(2);

    function addLineItem_MUTATING(d: DraftReport, item: LineItem): DraftReport {
      d.lineItems.push(item);
      return d;
    }
  });

  it('FIX: return a new draft with new array (immutability pattern)', () => {
    const draft: DraftReport = {
      id: 'd2',
      lineItems: [{ id: 'l1', amount: 100 }],
    };

    const updated = addLineItem_IMMUTABLE(draft, { id: 'l2', amount: 50 });

    expect(draft.lineItems).toHaveLength(1);

    expect(updated.lineItems).toHaveLength(2);

    function addLineItem_IMMUTABLE(
      d: DraftReport,
      item: LineItem,
    ): DraftReport {
      return {
        ...d,
        lineItems: [...d.lineItems, item],
      };
    }
  });

  it('BUG: two drafts accidentally share the same lineItems array (reference aliasing)', () => {
    const sharedItems: LineItem[] = [{ id: 'l1', amount: 100 }];

    const draftA: DraftReport = { id: 'A', lineItems: sharedItems };
    const draftB: DraftReport = { id: 'B', lineItems: sharedItems };

    draftA.lineItems.push({ id: 'l2', amount: 50 });

    expect(draftB.lineItems).toHaveLength(2);

    const draftC: DraftReport = { id: 'C', lineItems: [...sharedItems] };
    draftC.lineItems.push({ id: 'l3', amount: 25 });

    expect(sharedItems).toHaveLength(2);
    expect(draftC.lineItems).toHaveLength(3);
  });

  it('primitives are copied by value (counter-example)', () => {
    let income = 1000;
    const copy = income;
    income += 100;

    expect(copy).toBe(1000);
    expect(income).toBe(1100);
  });
});
