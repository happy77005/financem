import { Transaction, CategorySpending, MonthlyComparison } from '../types';
import { getYearMonth } from './date';

/**
 * Calculates total income in base units (paise).
 * Integer math ensures 100% precision.
 */
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calculates total expenses in base units (paise).
 */
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calculates current balance in base units (paise).
 */
export const calculateBalance = (transactions: Transaction[]): number => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

export const calculateCategorySpending = (transactions: Transaction[]): CategorySpending[] => {
  const categoryMap = new Map<string, { amount: number; count: number }>();

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const existing = categoryMap.get(t.category) || { amount: 0, count: 0 };
      categoryMap.set(t.category, {
        amount: existing.amount + t.amount,
        count: existing.count + 1,
      });
    });

  const totalExpenses = calculateTotalExpenses(transactions);
  const entries = Array.from(categoryMap.entries());

  return entries
    .map(([category, { amount, count }]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      transactionCount: count,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const calculateMonthlySummary = (
  transactions: Transaction[]
): MonthlyComparison[] => {
  const monthlyMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((t) => {
    const monthKey = getYearMonth(t.date);
    const existing = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };

    if (t.type === 'income') {
      existing.income += t.amount;
    } else {
      existing.expenses += t.amount;
    }

    monthlyMap.set(monthKey, existing);
  });

  return Array.from(monthlyMap.entries())
    .map(([month, { income, expenses }]) => ({
      month,
      income,
      expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

/**
 * Calculates month-over-month change percentage.
 */
export const calculateMonthOverMonthChange = (transactions: Transaction[]): number => {
  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const currentMonthBalance = transactions
    .filter(
      (t) =>
        t.date >= currentMonth &&
        t.date < new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

  const previousMonthBalance = transactions
    .filter(
      (t) =>
        t.date >= previousMonth &&
        t.date < new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 1)
    )
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);

  if (previousMonthBalance === 0) return 0;
  return ((currentMonthBalance - previousMonthBalance) / Math.abs(previousMonthBalance)) * 100;
};

export const calculateCapitalUtilization = (
  transactions: Transaction[]
): { utilized: number; percentage: number } => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);

  if (totalIncome === 0) {
    return { utilized: 0, percentage: 0 };
  }

  const percentage = (totalExpenses / totalIncome) * 100;
  return {
    utilized: totalExpenses,
    percentage: percentage,
  };
};

export const getHighestSpendingCategory = (transactions: Transaction[]): CategorySpending | null => {
  const categories = calculateCategorySpending(transactions);
  return categories.length > 0 ? categories[0] : null;
};

/**
 * Calculates average expenses. Result is a float (paise).
 */
export const calculateAverageExpense = (transactions: Transaction[]): number => {
  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return 0;
  const totalExpenses = calculateTotalExpenses(transactions);
  return totalExpenses / expenses.length;
};

export const calculateSavingsRate = (transactions: Transaction[]): number => {
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);

  if (totalIncome === 0) return 0;

  const savings = totalIncome - totalExpenses;
  return (savings / totalIncome) * 100;
};
