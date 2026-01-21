import { describe, it, expect } from 'vitest';
import { getHealth } from './health';

describe('health contract', () => {
  it('returns status ok', () => {
    const res = getHealth();
    expect(res).toEqual({ status: 'ok' });
  });
});
