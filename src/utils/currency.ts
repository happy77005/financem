import { fromBaseUnit } from './moneyUtils';

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const decimalAmount = fromBaseUnit(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(decimalAmount);
};

export const formatCurrencyCompact = (amount: number, currency: string = 'INR'): string => {
  const decimalAmount = fromBaseUnit(amount);
  const absAmount = Math.abs(decimalAmount);

  if (absAmount >= 1_000_000) {
    return (decimalAmount / 1_000_000).toFixed(1) + 'M';
  }
  if (absAmount >= 1_000) {
    return (decimalAmount / 1_000).toFixed(1) + 'K';
  }

  return formatCurrency(amount, currency);
};

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
};
