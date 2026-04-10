import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Trash2, CreditCard as Edit2 } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';
import { formatCategoryDisplayName } from '../utils/categoryUtils';

type SortField = 'date' | 'amount' | 'description' | 'category';
type SortDirection = 'asc' | 'desc';

interface TransactionsTableProps {
  transactions: Transaction[];
  currency: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onSelectChange: (selectedIds: string[]) => void;
  selectedIds: string[];
}

export default function TransactionsTable({
  transactions,
  currency,
  onEdit,
  onDelete,
  onSelectChange,
  selectedIds,
}: TransactionsTableProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      let aVal: unknown = a[sortField];
      let bVal: unknown = b[sortField];

      if (sortField === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        aVal = a.amount;
        bVal = b.amount;
      } else if (sortField === 'description') {
        aVal = a.description.toLowerCase();
        bVal = b.description.toLowerCase();
      } else if (sortField === 'category') {
        aVal = a.category.toLowerCase();
        bVal = b.category.toLowerCase();
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      return 0;
    });

    return sorted;
  }, [transactions, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectChange(sortedTransactions.map((t) => t.id));
    } else {
      onSelectChange([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      onSelectChange([...selectedIds, id]);
    } else {
      onSelectChange(selectedIds.filter((sid) => sid !== id));
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="overflow-x-auto bg-white/40 dark:bg-steel/5 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-xl dark:shadow-black/50 custom-scrollbar">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-ultimate/50">
            <th className="px-6 py-5 text-left w-12">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length > 0 && selectedIds.length === sortedTransactions.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded-lg border-gray-300 dark:border-white/10 bg-white dark:bg-steel/20 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                />
              </div>
            </th>
            <th className="px-6 py-5 text-left">
              <button
                onClick={() => handleSort('date')}
                className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                Date
                <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <SortIcon field="date" />
                </div>
              </button>
            </th>
            <th className="px-6 py-5 text-left">
              <button
                onClick={() => handleSort('description')}
                className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                Description
                <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <SortIcon field="description" />
                </div>
              </button>
            </th>
            <th className="px-6 py-5 text-left">
              <button
                onClick={() => handleSort('category')}
                className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                Category
                <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <SortIcon field="category" />
                </div>
              </button>
            </th>
            <th className="px-6 py-5 text-left">
              <button
                onClick={() => handleSort('amount')}
                className="flex items-center gap-2 text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest hover:text-gray-900 dark:hover:text-white transition-colors group"
              >
                Amount
                <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <SortIcon field="amount" />
                </div>
              </button>
            </th>
            <th className="px-6 py-5 text-left text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Type
            </th>
            <th className="px-6 py-5 text-right text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
          {sortedTransactions.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-steel/10 flex items-center justify-center text-gray-300 dark:text-gray-600">
                    <Edit2 size={32} strokeWidth={1} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 italic uppercase tracking-widest">No transaction records found</p>
                </div>
              </td>
            </tr>
          ) : (
            sortedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="group hover:bg-gray-50/50 dark:hover:bg-steel/10 transition-all duration-200"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(transaction.id)}
                      onChange={(e) => handleSelectOne(transaction.id, e.target.checked)}
                      className="w-4 h-4 rounded-lg border-gray-300 dark:border-white/10 bg-white dark:bg-steel/20 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-black tracking-tight text-gray-900 dark:text-white">
                    {new Date(transaction.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                    {transaction.description}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-gray-100 dark:bg-steel/20 text-gray-600 dark:text-gray-400 border border-transparent dark:border-white/5">
                    {formatCategoryDisplayName(transaction.category)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[11px] font-black tracking-tighter ${
                      transaction.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, currency)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      transaction.type === 'income' ? 'bg-emerald-500 ring-4 ring-emerald-500/10' : 'bg-rose-500 ring-4 ring-rose-500/10'
                    }`} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                      {transaction.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
