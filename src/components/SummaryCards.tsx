import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { useAuth, useTransactions } from '../hooks';
import { calculateTotalIncome, calculateTotalExpenses, calculateBalance, calculateCapitalUtilization } from '../utils/calculations';

const SummaryCards = () => {
  const { currentUser } = useAuth();
  const { transactions } = useTransactions();
  
  const totalIncome = calculateTotalIncome(transactions);
  const totalExpenses = calculateTotalExpenses(transactions);
  const balance = calculateBalance(transactions);
  const { percentage: capitalUtilization } = calculateCapitalUtilization(transactions);

  const currency = currentUser?.currency || 'INR';

  const cards = [
    {
      title: 'Current Balance',
      value: formatCurrency(balance, currency),
      icon: Wallet,
      color: 'blue',
      description: 'Total liquid capital available',
    },
    {
      title: 'Capital Added',
      value: formatCurrency(totalIncome, currency),
      icon: TrendingUp,
      color: 'emerald',
      description: 'Total money entered',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(totalExpenses, currency),
      icon: TrendingDown,
      color: 'rose',
      description: 'Spending across all categories',
    },
    {
      title: 'Utilization',
      value: `${capitalUtilization.toFixed(1)}%`,
      icon: PieChart,
      color: 'amber',
      description: 'Ratio of spending to capital',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const colorClass = 
          card.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
          card.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
          card.color === 'rose' ? 'bg-rose-500/10 text-rose-500' :
          'bg-amber-500/10 text-amber-500';

        return (
          <div
            key={card.title}
            className="p-5 bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-black/50 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-xl scale-90 ${colorClass}`}>
                <Icon size={14} strokeWidth={3} />
              </div>
              <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest whitespace-nowrap">
                {card.title}
              </p>
            </div>
            
            <div>
              <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-1">
                {card.value}
              </p>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
