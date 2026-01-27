import { describe, it, expect } from 'vitest';
import {
  parseToMinor,
  roundDecimalToMinor,
  formatMinor,
  addMinor,
  subMinor,
} from './money';

describe('kata: money normalization (no float bugs)', () => {
  it('parses common inputs to minor units', () => {
    expect(parseToMinor('12')).toBe(1200n);
    expect(parseToMinor('12.3')).toBe(1230n);
    expect(parseToMinor('12.30')).toBe(1230n);
    expect(parseToMinor('£12.30')).toBe(1230n);
    expect(parseToMinor(' 12,30 ')).toBe(1230n);
    expect(parseToMinor('-0.01')).toBe(-1n);
  });

  it('rejects invalid inputs and too many decimals', () => {
    expect(() => parseToMinor('')).toThrow('MONEY_PARSE_EMPTY');
    expect(() => parseToMinor('abc')).toThrow('MONEY_PARSE_INVALID');
    expect(() => parseToMinor('12.345')).toThrow(
      'MONEY_PARSE_TOO_MANY_DECIMALS',
    );
    expect(() => parseToMinor('12..3')).toThrow('MONEY_PARSE_INVALID');
  });

  it('rounds decimal strings deterministically to nearest penny', () => {
    expect(roundDecimalToMinor('12.344')).toBe(1234n);
    expect(roundDecimalToMinor('12.345')).toBe(1235n);
    expect(roundDecimalToMinor('12.349')).toBe(1235n);
    expect(roundDecimalToMinor('-1.005')).toBe(-101n); // away from 0 at the third digit
  });

  it('formats minor units as GBP safely', () => {
    expect(formatMinor(0n)).toBe('£0.00');
    expect(formatMinor(1n)).toBe('£0.01');
    expect(formatMinor(10n)).toBe('£0.10');
    expect(formatMinor(1230n)).toBe('£12.30');
    expect(formatMinor(-1230n)).toBe('-£12.30');
  });

  it('does arithmetic in minor units without float bugs', () => {
    // classic float trap: 0.1 + 0.2 !== 0.3
    const a = parseToMinor('0.10'); // 10
    const b = parseToMinor('0.20'); // 20
    const c = addMinor(a, b); // 30

    expect(c).toBe(30n);
    expect(formatMinor(c)).toBe('£0.30');

    expect(subMinor(parseToMinor('1.00'), parseToMinor('0.33'))).toBe(67n);
  });
});
