import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  formatCurrency as intlFormatCurrency,
  formatNumber,
  getCurrencyConfig,
} from '@/lib/constants';

interface CurrencyContextValue {
  currency: string;
  locale: string;
  setCurrency: (currency: string) => void;
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
}

const STORAGE_KEY = 'kutumb-currency';
const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_CURRENCY;
    return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_CURRENCY;
  });

  const config = getCurrencyConfig(currency);

  const value = useMemo(
    () => ({
      currency,
      locale: config.locale ?? DEFAULT_LOCALE,
      setCurrency: (nextCurrency: string) => {
        setCurrencyState(nextCurrency);
        window.localStorage.setItem(STORAGE_KEY, nextCurrency);
      },
      formatCurrency: (value: number) => intlFormatCurrency(value, config.code, config.locale),
      formatNumber: (value: number) => formatNumber(value, config.locale),
    }),
    [config.locale, currency],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrencyContext() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrencyContext must be used within CurrencyProvider');
  }
  return context;
}
