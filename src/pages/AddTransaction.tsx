import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth, useTransactions } from '../hooks';
import { TransactionType } from '../types';
import { numberToWords } from '../utils/numberToWords';

const CATEGORIES_BY_TYPE = {
  income: ['revenue (sales)', 'investment returns'],
  expense: ['salaries', 'rent', 'raw material', 'interest on loan']
};

export default function AddTransaction() {
  const { currentUser } = useAuth();
  const { addTransaction } = useTransactions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as TransactionType,
    category: 'custom',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }
    if (!formData.category) {
      setMessage({ type: 'error', text: 'Please enter a category' });
      return;
    }

    setIsSubmitting(true);
    try {
      await addTransaction({
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        description: formData.description || (formData.type === 'income' ? 'business revenue' : 'business expense'),
        date: new Date(formData.date), // This is the ISO date they wanted
        userId: currentUser.id,
      });
      setMessage({ type: 'success', text: `${formData.type === 'income' ? 'Income' : 'Expense'} recorded successfully!` });
      setFormData({
        ...formData,
        amount: '',
        category: 'custom',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to record transaction' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl w-full mx-auto space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            Add Transaction
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Record financial activity
          </p>
        </div>
        <a
          href="#dashboard"
          className="h-8 px-3 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-600 transition-colors bg-gray-100 dark:bg-navy-800 rounded-xl"
        >
          <ArrowLeft size={12} />
          Back
        </a>
      </div>

      {message && (
        <div className={`p-3 rounded-2xl border flex items-center gap-2 font-bold text-xs ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400'
        }`}>
          <PlusCircle size={14} />
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2rem] shadow-xl overflow-hidden shadow-gray-200/40 dark:shadow-black/50">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Amount (Moved to top as requested) */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1">
              Amount
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-base">₹</span>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 h-14 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-xl font-black outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="0.00"
              />
              
              <AnimatePresence>
                {formData.amount && parseFloat(formData.amount) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -5 }}
                    className="mt-3 px-4 py-3 border border-cyan-500/20 dark:border-cyan-400/10 bg-cyan-500/5 dark:bg-cyan-400/5 rounded-2xl overflow-hidden"
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-400 leading-relaxed drop-shadow-sm italic">
                      {numberToWords(formData.amount)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <TrendingDown size={16} strokeWidth={3} />
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
                  <TrendingUp size={16} strokeWidth={3} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Income</span>
                </label>
              </div>
            </div>

            {/* Hybrid Category Selection */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1">
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
                  className="w-full px-4 h-14 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-xs font-black outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                >
                  {CATEGORIES_BY_TYPE[formData.type].map(cat => (
                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                  ))}
                  <option value="custom">CUSTOM...</option>
                </select>

                <AnimatePresence>
                  {!CATEGORIES_BY_TYPE[formData.type].includes(formData.category) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value.toLowerCase() })}
                        className="w-full px-4 h-11 border border-gray-100 dark:border-white/10 rounded-xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-[10px] font-black outline-none focus:ring-2 focus:ring-blue-500/20 transition-all uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal"
                        placeholder="Enter custom category..."
                        style={{ textTransform: 'lowercase' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Date Picker (ISO) */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1">
                Date (ISO)
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 h-14 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-xs font-black outline-none"
              />
            </div>

            {/* Note (Lowercase) */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-1">
                Note
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value.toLowerCase() })}
                className="w-full px-4 h-14 border border-gray-100 dark:border-white/10 rounded-2xl bg-gray-50/50 dark:bg-ultimate/50 text-gray-900 dark:text-white text-xs font-black outline-none transition-all"
                placeholder="Record details..."
                style={{ textTransform: 'lowercase' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-16 rounded-[1.5rem] text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 ${
              formData.type === 'income' 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/40' 
                : 'bg-red-600 hover:bg-red-700 shadow-red-500/40'
            }`}
          >
            <PlusCircle size={18} strokeWidth={3} />
            {isSubmitting ? 'Processing...' : `Confirm Transaction`}
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}
