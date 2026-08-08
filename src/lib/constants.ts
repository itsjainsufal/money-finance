export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'en-AE' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

export const DEFAULT_CURRENCY: CurrencyCode = 'INR';
export const DEFAULT_LOCALE = 'en-IN';
export const DEMO_INVITE_CODE = 'DEMO24';

export const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Healthcare',
  'Education',
  'Entertainment',
  'Housing',
  'Investments',
  'Other',
] as const;

export const GOAL_COLORS = ['emerald', 'sky', 'amber', 'violet'] as const;

export function getCurrencyConfig(code: string) {
  return CURRENCIES.find((currency) => currency.code === code) ?? CURRENCIES[0];
}

export function formatCurrency(value: number, currency = DEFAULT_CURRENCY, locale?: string) {
  const config = getCurrencyConfig(currency);
  return new Intl.NumberFormat(locale ?? config.locale, {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: config.code === 'INR' ? 0 : 2,
  }).format(value);
}

export function formatNumber(value: number, locale = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDate(value: string, locale = DEFAULT_LOCALE) {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
