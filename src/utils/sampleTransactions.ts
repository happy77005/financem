import { Transaction } from '../types';
import { indexedDbService } from '../services/indexedDb';

const categories = [
  'Salary',
  'Freelance',
  'Investment',
  'Bonus',
  'Other Income',
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Rent/Mortgage',
  'Insurance',
  'Other Expense',
];

const descriptions = {
  income: [
    'Monthly Salary',
    'Freelance Project Payment',
    'Stock Dividend',
    'Performance Bonus',
    'Side Project Income',
    'Consulting Fee',
    'Rental Income',
  ],
  expense: [
    'Grocery Shopping',
    'Restaurant Dinner',
    'Gas Station',
    'Uber Ride',
    'Online Shopping',
    'Movie Tickets',
    'Electricity Bill',
    'Internet Bill',
    'Doctor Visit',
    'Gym Membership',
    'Coffee Shop',
    'Book Purchase',
  ],
};

const getRandomAmount = (type: 'income' | 'expense'): number => {
  if (type === 'income') {
    return Math.floor(Math.random() * 4000) + 1000;
  }
  return Math.floor(Math.random() * 500) + 20;
};

const getRandomDate = (daysBack: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};

const getRandomCategory = (type: 'income' | 'expense'): string => {
  const incomeCategories = categories.slice(0, 5);
  const expenseCategories = categories.slice(5);
  const pool = type === 'income' ? incomeCategories : expenseCategories;
  return pool[Math.floor(Math.random() * pool.length)];
};

const getRandomDescription = (type: 'income' | 'expense'): string => {
  const pool = descriptions[type];
  return pool[Math.floor(Math.random() * pool.length)];
};

export const seedSampleTransactions = async (userId: string, count: number = 30): Promise<void> => {
  const existingTransactions = await indexedDbService.getTransactionsByUser(userId);

  if (existingTransactions.length > 0) {
    return;
  }

  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    const type: 'income' | 'expense' = Math.random() > 0.3 ? 'expense' : 'income';
    const transaction: Transaction = {
      id: `sample-transaction-${userId}-${i + 1}-${Date.now()}`,
      userId,
      amount: getRandomAmount(type),
      type,
      category: getRandomCategory(type),
      date: getRandomDate(90),
      description: getRandomDescription(type),
      createdAt: new Date(),
    };
    transactions.push(transaction);
  }

  for (const transaction of transactions) {
    try {
      await indexedDbService.addTransaction(transaction);
    } catch (err) {
      console.warn('Failed to add sample transaction:', err);
    }
  }
};
