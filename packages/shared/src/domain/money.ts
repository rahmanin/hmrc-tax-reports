export type Currency = 'GBP';

declare const __minorBrand: unique symbol;
export type MoneyMinor = bigint & { readonly [__minorBrand]: 'MoneyMinor' };

export type Money = Readonly<{
  currency: Currency;
  minor: MoneyMinor;
}>;

export const moneyFromMinor = (minor: bigint, currency: Currency = 'GBP'): Money => {
  return { currency, minor: minor as MoneyMinor };
};

export const moneyAdd = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) throw new Error('MONEY_CURRENCY_MISMATCH');
  return moneyFromMinor(a.minor + b.minor, a.currency);
};

export const moneySub = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) throw new Error('MONEY_CURRENCY_MISMATCH');
  return moneyFromMinor(a.minor - b.minor, a.currency);
};
