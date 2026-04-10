import { useState } from 'react';
import { X, PlusCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { fromBaseUnit } from '../utils/moneyUtils';
import { numberToWords } from '../utils/numberToWords';

interface TransactionFormModalProps {
  transaction?: Transaction;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  onClose: () => void;
  isLoading?: boolean;
}

const CATEGORIES_BY_TYPE = {
  income: ['revenue (sales)', 'investment returns'],
  expense: ['salaries', 'rent', 'raw material', 'interest on loan']
};

export default function TransactionFormModal({
  transaction,
  onSubmit,
  onClose,
  isLoading = false,
}: TransactionFormModalProps) {
  const [formData, setFormData] = useState({
    amount: transaction ? fromBaseUnit(transaction.amount).toString() : '',
    type: transaction?.type || ('expense' as TransactionType),
    category: transaction ? transaction.category.toLowerCase() : 'custom',
    description: transaction?.description.toLowerCase() || '',
    date: transaction?.date ? transaction.date.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    userId: transaction?.userId || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userId) newErrors.userId = 'User ID is required';
    if (!formData.amount || parseFloat(String(formData.amount)) <= 0)
      newErrors.amount = 'Amount must be greater than 0';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        description: formData.description || (formData.type === 'income' ? 'business revenue' : 'business expense'),
        date: new Date(formData.date),
        userId: formData.userId,
      });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save transaction';
      setErrors({ submit: message });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white dark:bg-ultimate rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5 z-[60]"
      >
        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-ultimate/50">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formData.type === 'income' ? 'bg-blue-600' : 'bg-red-600'}`}>
              <PlusCircle className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">
              {transaction ? 'Edit Record' : 'Create Record'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-steel/20 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Type Radio Buttons */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1">
              Transaction Type
            </label>
            <div className="flex gap-4">
              <label className={`flex-1 relative flex items-center justify-center gap-3 h-14 rounded-2xl border cursor-pointer transition-all ${
                formData.type === 'expense' 
                  ? 'bg-red-500/10 border-red-500/50 text-red-500' 
                  : 'bg-gray-50/50 dark:bg-ultimate/50 border-gray-100 dark:border-white/10 text-gray-400'
              }`}>
                <input 
                  type="radio" 
                  name="type" 
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={() => setFormData({ ...formData, type: 'expense' })}
                  className="hidden" 
                />
                <TrendingDown size={14} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Expense</span>
              </label>
              
              <label className={`flex-1 relative flex items-center justify-center gap-3 h-14 rounded-2xl border cursor-pointer transition-all ${
                formData.type === 'income' 
                  ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' 
                  : 'bg-gray-50/50 dark:bg-ultimate/50 border-gray-100 dark:border-white/10 text-gray-400'
              }`}>
                <input 
                  type="radio" 
                  name="type" 
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={() => setFormData({ ...formData, type: 'income' })}
                  className="hidden" 
                />
                <TrendingUp size={14} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">Income</span>
              </label>
            </div>
          </div>

          {errors.submit && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-400">{errors.submit}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">
                User ID
              </label>
              <input
                type="text"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                placeholder="Enter user ID"
                disabled={isLoading}
                className="w-full h-11 px-4 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
              />
              {errors.userId && <p className="mt-1 text-[9px] font-black uppercase text-rose-500">{errors.userId}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">
                Amount (₹)
              </label>
              <div className="space-y-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  disabled={isLoading}
                  className="w-full h-11 px-4 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-xs font-black outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                />
                
                <AnimatePresence>
                  {formData.amount && parseFloat(formData.amount) > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -5 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -5 }}
                      className="px-4 py-2 border border-cyan-500/20 dark:border-cyan-400/10 bg-cyan-500/5 dark:bg-cyan-400/5 rounded-xl overflow-hidden"
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-400 leading-relaxed drop-shadow-sm italic">
                        {numberToWords(formData.amount)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.amount && <p className="mt-1 text-[9px] font-black uppercase text-rose-500">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">
                Category
              </label>
              <div className="space-y-3">
                <select
                  value={CATEGORIES_BY_TYPE[formData.type].includes(formData.category) ? formData.category : 'custom'}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'custom') {
                      setFormData({ ...formData, category: '' });
                    } else {
                      setFormData({ ...formData, category: val });
                    }
                  }}
                  className="w-full h-11 px-4 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                >
                  {CATEGORIES_BY_TYPE[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                  <option value="custom">CUSTOM...</option>
                </select>

                <AnimatePresence>
                  {!CATEGORIES_BY_TYPE[formData.type].includes(formData.category) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value.toLowerCase() })}
                        className="w-full h-10 px-4 border border-gray-100 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-widest"
                        placeholder="Enter custom category..."
                        style={{ textTransform: 'lowercase' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.category && <p className="mt-1 text-[9px] font-black uppercase text-rose-500">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">
                Note
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.toLowerCase() })}
                placeholder="Details..."
                disabled={isLoading}
                style={{ textTransform: 'lowercase' }}
                className="w-full h-11 px-4 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">
                Date (ISO)
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                disabled={isLoading}
                className="w-full h-11 px-4 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
              />
              {errors.date && <p className="mt-1 text-[9px] font-black uppercase text-rose-500">{errors.date}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-6 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-[2] h-14 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 ${
                formData.type === 'income' 
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20' 
                  : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
              }`}
            >
              {isLoading ? '...' : (transaction ? 'Update Transaction' : 'Confirm Transaction')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
