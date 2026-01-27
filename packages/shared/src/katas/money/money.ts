export type Minor = bigint; // pence

export type Currency = 'GBP';

/**
 * Parse user/remote money input into minor units (pence).
 * Accepts: "12", "12.3", "12.30", "£12.30", " 12,30 " (comma), - values.
 * Rejects: "", "12.345", "abc", "12..3"
 */
export function parseToMinor(input: string, currency: Currency = 'GBP'): Minor {
  const raw = input
    .trim()
    .replaceAll('£', '')
    .replaceAll(',', '.')
    .replaceAll(/\s+/g, '');

  if (raw.length === 0) throw new Error('MONEY_PARSE_EMPTY');
  if (!/^[-+]?\d+(\.\d+)?$/.test(raw)) throw new Error('MONEY_PARSE_INVALID');

  const sign = raw.startsWith('-') ? -1n : 1n;
  const unsigned = raw.replace(/^[+-]/, '');

  const [intPart, fracPart = ''] = unsigned.split('.');
  if (fracPart.length > 2) throw new Error('MONEY_PARSE_TOO_MANY_DECIMALS');

  const pennies = fracPart.padEnd(2, '0'); // "3" -> "30", "" -> "00"
  const minor = BigInt(intPart) * 100n + BigInt(pennies);

  return sign * minor;
}

/**
 * Normalize minor units by rounding to nearest penny from a decimal string.
 * Useful if you receive "12.345" and want deterministic rounding.
 */
export function roundDecimalToMinor(
  input: string,
  currency: Currency = 'GBP',
): Minor {
  const raw = input
    .trim()
    .replaceAll('£', '')
    .replaceAll(',', '.')
    .replaceAll(/\s+/g, '');
  if (raw.length === 0) throw new Error('MONEY_PARSE_EMPTY');
  if (!/^[-+]?\d+(\.\d+)?$/.test(raw)) throw new Error('MONEY_PARSE_INVALID');

  const sign = raw.startsWith('-') ? -1n : 1n;
  const unsigned = raw.replace(/^[+-]/, '');

  const [intPart, frac = ''] = unsigned.split('.');
  const d0 = frac[0] ?? '0';
  const d1 = frac[1] ?? '0';
  const d2 = frac[2] ?? '0'; // rounding digit

  const base = BigInt(intPart) * 100n + BigInt(`${d0}${d1}`);
  const shouldRoundUp = d2 >= '5';

  return sign * (shouldRoundUp ? base + 1n : base);
}

/**
 * Format minor units to currency string.
 * Default: "£12.30"
 */
export function formatMinor(minor: Minor, currency: Currency = 'GBP'): string {
  const sign = minor < 0n ? '-' : '';
  const abs = minor < 0n ? -minor : minor;

  const pounds = abs / 100n;
  const pennies = abs % 100n;

  const penniesStr = pennies.toString().padStart(2, '0');

  if (currency === 'GBP') return `${sign}£${pounds.toString()}.${penniesStr}`;
  // future-proof
  return `${sign}${pounds.toString()}.${penniesStr} ${currency}`;
}

/**
 * Safe add/subtract on minor units (no floats).
 */
export function addMinor(a: Minor, b: Minor): Minor {
  return a + b;
}
export function subMinor(a: Minor, b: Minor): Minor {
  return a - b;
}
