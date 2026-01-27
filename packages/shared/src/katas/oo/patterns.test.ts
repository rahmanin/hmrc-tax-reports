import { describe, it, expect } from 'vitest';
import { createDraftReport } from './factory';
import { withAuditInfo, withValidation } from './mixins';

describe('kata: OO-in-JS patterns (factories & mixins)', () => {
  it('factory creates object with cohesive behavior', () => {
    const draft = createDraftReport('d1', 1000, 200);

    expect(draft.net()).toBe(800);
  });

  it('mixins extend behavior without inheritance', () => {
    const base = createDraftReport('d2', 100, 200);

    const audited = withAuditInfo(base);
    const validated = withValidation(audited);

    expect(validated.net()).toBe(-100);
    expect(validated.isValid()).toBe(false);
    expect(validated.auditedAt).toBeInstanceOf(Date);
  });

  it('composition order is explicit and readable', () => {
    const draft = withValidation(
      withAuditInfo(createDraftReport('d3', 500, 100)),
    );

    expect(draft.isValid()).toBe(true);
  });
});
