import { describe, it, expect } from 'vitest';
import { pipe } from './pipe';
import { compose } from './compose';
import { normalize, validate, enrich } from './immutability';

describe('kata: functional patterns (submission pipeline)', () => {
  it('pipe: runs left-to-right, pure and immutable', () => {
    const input = { id: '1', income: -100, valid: true };

    const pipeline = pipe(normalize, validate, enrich);
    const result = pipeline(input);

    expect(result).toEqual({
      id: 'draft-1',
      income: 0,
      valid: false,
    });

    expect(input).toEqual({ id: '1', income: -100, valid: true });
  });

  it('compose: runs right-to-left', () => {
    const input = { id: '2', income: 50, valid: true };

    const pipeline = compose(enrich, validate, normalize);
    const result = pipeline(input);

    expect(result).toEqual({
      id: 'draft-2',
      income: 50,
      valid: true,
    });
  });
});
