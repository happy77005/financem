/**
 * Converts a decimal amount (e.g., 10.50) to an integer based on the currency's smallest unit (e.g., 1050 paise).
 * Uses Math.round to ensure absolute precision during conversion.
 */
export const toBaseUnit = (amount: number | string): number => {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return 0;
  // Use Number.EPSILON to offset tiny floating-point errors before rounding
  return Math.round((numeric + Number.EPSILON) * 100);
};

/**
 * Converts an integer amount in base units (e.g., 1050) back to a human-readable decimal (e.g., 10.50).
 */
export const fromBaseUnit = (amount: number): number => {
  if (!amount) return 0;
  return amount / 100;
};

/**
 * Formats a base unit amount into a currency string for display.
 */
export const formatBaseUnit = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(fromBaseUnit(amount));
};
