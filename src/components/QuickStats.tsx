import { TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../types';
import { calculateMonthOverMonthChange } from '../utils/calculations';

interface QuickStatsProps {
  transactions: Transaction[];
}

const QuickStats = ({ transactions }: QuickStatsProps) => {
  const momChange = calculateMonthOverMonthChange(transactions);
  const isPositive = momChange >= 0;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Month-over-Month Change
          </p>
          <div className="flex items-baseline space-x-2">
            <p
              className={`text-3xl font-bold ${
                isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isPositive ? '+' : ''}
              {momChange.toFixed(1)}%
            </p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {isPositive ? 'Increase' : 'Decrease'} compared to last month
          </p>
        </div>
        <div
          className={`p-3 rounded-full ${
            isPositive
              ? 'bg-emerald-100 dark:bg-emerald-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
