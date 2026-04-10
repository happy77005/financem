import { createContext, ReactNode, useState, useCallback } from 'react';
import { Transaction } from '../types';
import { indexedDbService } from '../services/indexedDb';
import { toBaseUnit } from '../utils/moneyUtils';
import { normalizeCategory } from '../utils/categoryUtils';

interface TransactionsContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteMultipleTransactions: (ids: string[]) => Promise<void>;
  loadTransactions: (userId: string) => Promise<void>;
  refreshTransactions: (userId: string) => Promise<void>;
  getTransactionById: (id: string) => Transaction | undefined;
}

export const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

interface TransactionsProviderProps {
  children: ReactNode;
}

export const TransactionsProvider = ({ children }: TransactionsProviderProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const userTransactions = await indexedDbService.getTransactionsByUser(userId);
      setTransactions(userTransactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
      setError(errorMessage);
      console.error('Error loading transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshTransactions = useCallback(async (userId: string) => {
    try {
      const userTransactions = await indexedDbService.getTransactionsByUser(userId);
      setTransactions(userTransactions);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh transactions';
      setError(errorMessage);
      console.error('Error refreshing transactions:', err);
    }
  }, []);

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
      try {
        const newTransaction: Transaction = {
          ...transaction,
          amount: toBaseUnit(transaction.amount),
          category: normalizeCategory(transaction.category),
          id: `transaction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
        };
        await indexedDbService.addTransaction(newTransaction);
        setTransactions((prev) => [...prev, newTransaction]);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add transaction';
        setError(errorMessage);
        console.error('Error adding transaction:', err);
        throw err;
      }
    },
    []
  );

  const updateTransaction = useCallback(async (transaction: Transaction) => {
    try {
      const updatedTransaction = {
        ...transaction,
        amount: toBaseUnit(transaction.amount),
        category: normalizeCategory(transaction.category),
      };
      await indexedDbService.updateTransaction(updatedTransaction);
      setTransactions((prev) =>
        prev.map((t) => (t.id === transaction.id ? updatedTransaction : t))
      );
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update transaction';
      setError(errorMessage);
      console.error('Error updating transaction:', err);
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await indexedDbService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transaction';
      setError(errorMessage);
      console.error('Error deleting transaction:', err);
      throw err;
    }
  }, []);

  const deleteMultipleTransactions = useCallback(async (ids: string[]) => {
    try {
      await indexedDbService.deleteTransactionsByIds(ids);
      setTransactions((prev) => prev.filter((t) => !ids.includes(t.id)));
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete transactions';
      setError(errorMessage);
      console.error('Error deleting transactions:', err);
      throw err;
    }
  }, []);

  const getTransactionById = useCallback(
    (id: string) => transactions.find((t) => t.id === id),
    [transactions]
  );

  const value: TransactionsContextType = {
    transactions,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteMultipleTransactions,
    loadTransactions,
    refreshTransactions,
    getTransactionById,
  };

  return (
    <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
  );
};
