import { useState, useEffect, useCallback } from 'react';
import { Category } from '../types';
import { indexedDbService } from '../services/indexedDb';
import { useTransactions } from './useTransactions';
import { normalizeCategory, formatCategoryDisplayName } from '../utils/categoryUtils';

export const useCategories = () => {
  const { transactions } = useTransactions();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Get predefined categories from DB
      const dbCategories = await indexedDbService.getAllCategories();
      
      // 2. Get unique categories from current transactions
      const transactionCategories = Array.from(new Set(transactions.map(t => normalizeCategory(t.category))));
      
      // 3. Merge and deduplicate
      const mergedCategories = [...dbCategories];
      
      transactionCategories.forEach(catId => {
        if (!mergedCategories.some(c => normalizeCategory(c.id) === catId)) {
          mergedCategories.push({
            id: catId,
            name: formatCategoryDisplayName(catId),
            type: 'expense', // Default to expense for unknown custom categories
            color: '#64748b', // Default slate color
            icon: 'Tag', // Default icon
          });
        }
      });

      setCategories(mergedCategories);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    isLoading,
    refreshCategories: loadCategories,
  };
};
