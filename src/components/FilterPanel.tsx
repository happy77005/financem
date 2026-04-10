import { X, Filter, Search } from 'lucide-react';
import { FilterOptions } from '../types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toBaseUnit, fromBaseUnit } from '../utils/moneyUtils';

interface FilterPanelProps {
  isOpen: boolean;
  onFilter: (filters: FilterOptions) => void;
  onClose: () => void;
  initialFilters?: FilterOptions;
}

export default function FilterPanel({ isOpen, onFilter, onClose, initialFilters = {} }: FilterPanelProps) {
  const [tempFilters, setTempFilters] = useState<FilterOptions>(initialFilters);

  const handleApply = () => {
    onFilter(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const reset = {};
    setTempFilters(reset);
    onFilter(reset);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-white dark:bg-ultimate shadow-2xl z-[60] flex flex-col border-l border-gray-100 dark:border-white/5"
          >
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Filter Records</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-steel/20 rounded-xl transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Date Range */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pl-1">From</label>
                    <input
                      type="date"
                      value={tempFilters.startDate ? tempFilters.startDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setTempFilters({ ...tempFilters, startDate: e.target.value ? new Date(e.target.value) : undefined })}
                      className="w-full h-10 px-3 bg-gray-50 dark:bg-steel/10 border border-gray-100 dark:border-white/5 rounded-xl text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest pl-1">To</label>
                    <input
                      type="date"
                      value={tempFilters.endDate ? tempFilters.endDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setTempFilters({ ...tempFilters, endDate: e.target.value ? new Date(e.target.value) : undefined })}
                      className="w-full h-10 px-3 bg-gray-50 dark:bg-steel/10 border border-gray-100 dark:border-white/5 rounded-xl text-xs font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </section>

              {/* Type */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction Type</h3>
                <div className="flex p-1 bg-gray-50 dark:bg-steel/10 rounded-xl">
                  <button
                    onClick={() => setTempFilters({ ...tempFilters, type: undefined })}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      !tempFilters.type ? 'bg-white dark:bg-ultimate shadow-sm text-blue-600' : 'text-gray-400'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setTempFilters({ ...tempFilters, type: 'income' })}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      tempFilters.type === 'income' ? 'bg-white dark:bg-ultimate shadow-sm text-emerald-600' : 'text-gray-400'
                    }`}
                  >
                    Income
                  </button>
                  <button
                    onClick={() => setTempFilters({ ...tempFilters, type: 'expense' })}
                    className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      tempFilters.type === 'expense' ? 'bg-white dark:bg-ultimate shadow-sm text-rose-600' : 'text-gray-400'
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </section>

              {/* Amount Range */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount Range</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={tempFilters.minAmount ? fromBaseUnit(tempFilters.minAmount) : ''}
                      onChange={(e) => setTempFilters({ ...tempFilters, minAmount: e.target.value ? toBaseUnit(e.target.value) : undefined })}
                      className="w-full h-10 pl-7 pr-3 bg-gray-50 dark:bg-steel/10 border border-gray-100 dark:border-white/5 rounded-xl text-xs font-bold dark:text-white outline-none"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={tempFilters.maxAmount ? fromBaseUnit(tempFilters.maxAmount) : ''}
                      onChange={(e) => setTempFilters({ ...tempFilters, maxAmount: e.target.value ? toBaseUnit(e.target.value) : undefined })}
                      className="w-full h-10 pl-7 pr-3 bg-gray-50 dark:bg-steel/10 border border-gray-100 dark:border-white/5 rounded-xl text-xs font-bold dark:text-white outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Search */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Search Keywords</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                  <input
                    type="text"
                    placeholder="Description or category..."
                    value={tempFilters.searchTerm || ''}
                    onChange={(e) => setTempFilters({ ...tempFilters, searchTerm: e.target.value })}
                    className="w-full h-10 pl-9 pr-3 bg-gray-50 dark:bg-steel/10 border border-gray-100 dark:border-white/5 rounded-xl text-xs font-bold dark:text-white outline-none"
                  />
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-white/5 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 h-11 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-[2] h-11 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
