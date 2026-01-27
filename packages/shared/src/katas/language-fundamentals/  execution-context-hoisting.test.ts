import { describe, it, expect } from 'vitest';

type DraftReport = {
  id: string;
  taxpayerId?: string;
  totals: { income: number; expenses: number };
};

describe('kata: execution context / hoisting / scope (draft validation)', () => {
  it('function declaration works even if called before it is declared (hoisting)', () => {
    const draft: DraftReport = {
      id: 'd1',
      taxpayerId: 'TAX-123',
      totals: { income: 1000, expenses: 100 },
    };

    const result = validateDraft_decl(draft);

    expect(result.ok).toBe(true);

    function validateDraft_decl(d: DraftReport): {
      ok: boolean;
      issues: string[];
    } {
      const issues: string[] = [];
      if (!d.taxpayerId) issues.push('MISSING_TAXPAYER_ID');
      if (d.totals.income < 0) issues.push('NEGATIVE_INCOME');
      return { ok: issues.length === 0, issues };
    }
  });

  it('function expression fails if called before initialization (temporal dead zone-ish behavior)', () => {
    const draft: DraftReport = {
      id: 'd2',
      totals: { income: 1000, expenses: 100 },
    };

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const callBeforeInit = () => validateDraft_expr(draft);

    expect(callBeforeInit).toThrow();

    const validateDraft_expr = (
      d: DraftReport,
    ): { ok: boolean; issues: string[] } => {
      const issues: string[] = [];
      if (!d.taxpayerId) issues.push('MISSING_TAXPAYER_ID');
      return { ok: issues.length === 0, issues };
    };

    expect(validateDraft_expr(draft).ok).toBe(false);
  });

  it('scope: inner variable shadows outer and can cause wrong validation (realistic bug)', () => {
    const draft: DraftReport = {
      id: 'd3',
      taxpayerId: 'TAX-999',
      totals: { income: 1000, expenses: 100 },
    };

    const result = validateWithShadowingBug(draft);
    expect(result.issues).toContain('MISSING_TAXPAYER_ID');

    function validateWithShadowingBug(d: DraftReport) {
      const issues: string[] = [];
      const { taxpayerId } = d; // 'TAX-999'

      {
        const taxpayerId = undefined;
        if (!taxpayerId) issues.push('MISSING_TAXPAYER_ID');
      }

      return { ok: issues.length === 0, issues };
    }
  });
});
