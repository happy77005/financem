import { Calendar } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { formatDate } from '../utils/date';
import { motion, AnimatePresence } from 'framer-motion';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
}

type QuickRange = 'week' | 'month' | 'quarter' | 'year' | 'all';

const DateRangePicker = ({
  startDate,
  endDate,
  onDateRangeChange,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickRange = (range: QuickRange) => {
    const end = new Date();
    let start = new Date();

    switch (range) {
      case 'week':
        start.setDate(end.getDate() - 7);
        break;
      case 'month':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(end.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      case 'all':
        start = new Date(2020, 0, 1);
        break;
    }

    onDateRangeChange(start, end);
    setIsOpen(false);
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    if (newStart <= endDate) {
      onDateRangeChange(newStart, endDate);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    if (newEnd >= startDate) {
      onDateRangeChange(startDate, newEnd);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 h-9 bg-white dark:bg-steel/20 border border-gray-200 dark:border-white/5 rounded-2xl hover:bg-gray-50 dark:hover:bg-steel/30 transition-all shadow-sm group"
      >
        <Calendar className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-white dark:bg-ultimate rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="mb-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 pl-1">
                  Quick Select
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '7 Days', value: 'week' as QuickRange },
                    { label: '30 Days', value: 'month' as QuickRange },
                    { label: '90 Days', value: 'quarter' as QuickRange },
                    { label: '1 Year', value: 'year' as QuickRange },
                    { label: 'All Time', value: 'all' as QuickRange, span: true },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleQuickRange(range.value)}
                      className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-steel/10 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-500/30 transition-all ${
                        range.span ? 'col-span-2' : ''
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-white/5 pt-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">
                  Custom Precision
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest pl-1">
                        Start
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(startDate)}
                        onChange={handleStartDateChange}
                        max={formatDateForInput(endDate)}
                        className="w-full px-3 h-10 text-[10px] font-bold bg-gray-50 dark:bg-steel/10 border border-gray-100 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest pl-1">
                        End
                      </label>
                      <input
                        type="date"
                        value={formatDateForInput(endDate)}
                        onChange={handleEndDateChange}
                        min={formatDateForInput(startDate)}
                        max={formatDateForInput(new Date())}
                        className="w-full px-3 h-10 text-[10px] font-bold bg-gray-50 dark:bg-steel/10 border border-gray-100 dark:border-white/5 rounded-xl focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-ultimate/50 px-6 py-4 border-t border-gray-100 dark:border-white/5">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                Apply Range
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DateRangePicker;
