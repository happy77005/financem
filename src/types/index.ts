export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  currency?: string;
  createdAt: Date;
}

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number; // Stored as an integer in the smallest currency unit (e.g., paise for INR)
  type: TransactionType;
  category: string; // Internal: normalized lowercase string
  date: Date;
  description: string;
  createdAt: Date;
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  capitalUtilized: number;
  capitalUtilizationPercentage: number;
  monthOverMonthChange: number;
}

export interface ChartDataPoint {
  date: Date;
  balance: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlyComparison {
  month: string;
  income: number;
  expenses: number;
}

export interface FilterOptions {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}
