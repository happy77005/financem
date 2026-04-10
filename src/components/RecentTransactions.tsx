import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { Transaction } from '../types';
import { formatCategoryDisplayName } from '../utils/categoryUtils';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency?: string;
  maxItems?: number;
}

const RecentTransactions = ({
  transactions,
  currency = 'INR',
  maxItems = 5,
}: RecentTransactionsProps) => {
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, maxItems);

  if (recentTransactions.length === 0) {
    return (
      <div className="p-12 text-center bg-white/40 dark:bg-navy-900/40 backdrop-blur-xl border border-gray-100 dark:border-navy-800 rounded-[2.5rem]">
        <div className="w-16 h-16 bg-gray-100 dark:bg-navy-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-bold">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-gray-100 dark:border-white/5 p-3 rounded-[2.5rem] shadow-xl shadow-gray-200/40 dark:shadow-black/50">
      <div className="flex items-center justify-between mb-2 px-2">
        <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
          Last 3 Transactions
        </h3>
        <a href="#transactions" className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline">View All</a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recentTransactions.map((t) => (
          <div 
            key={t.id} 
            className="group p-3 bg-gray-50/50 dark:bg-steel/20 border border-gray-100 dark:border-white/5 rounded-3xl hover:bg-white dark:hover:bg-steel/30 transition-all flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                t.type === 'income' 
                  ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600' 
                  : 'bg-rose-100 dark:bg-rose-500/10 text-rose-600'
              }`}>
                {t.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              </div>
              
              <div className="min-w-0">
                <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase truncate group-hover:text-blue-500 transition-colors leading-tight">
                  {t.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest truncate">
                    {formatCategoryDisplayName(t.category)}
                  </span>
                  <span className="text-[8px] font-mono font-medium text-gray-300 uppercase">
                    • {t.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <p className={`text-xs font-black tracking-tighter ${
                t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, currency)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentTransactions;
