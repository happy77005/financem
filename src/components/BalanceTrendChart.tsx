import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '../hooks';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/currency';
import { formatDate } from '../utils/date';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BalanceTrendChartProps {
  transactions: Transaction[];
  currency?: string;
}

const BalanceTrendChart = ({ transactions, currency = 'INR' }: BalanceTrendChartProps) => {
  const { isDark } = useTheme();

  const sortedTransactions = [...transactions].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const dataPoints = sortedTransactions.reduce(
    (acc, transaction) => {
      const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
      const change = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      acc.push({
        date: transaction.date,
        balance: lastBalance + change,
      });
      return acc;
    },
    [] as { date: Date; balance: number }[]
  );

  if (dataPoints.length === 0) {
    dataPoints.push({ date: new Date(), balance: 0 });
  }

  const labels = dataPoints.map((point) => formatDate(point.date));
  const balances = dataPoints.map((point) => point.balance);

  const data = {
    labels,
    datasets: [
      {
        label: 'Balance',
        data: balances,
        borderColor: isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)',
        backgroundColor: isDark
          ? 'rgba(59, 130, 246, 0.1)'
          : 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: isDark ? 'rgb(59, 130, 246)' : 'rgb(37, 99, 235)',
        pointBorderColor: isDark ? '#111111' : '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#111111' : '#ffffff',
        titleColor: isDark ? '#f3f4f6' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#374151',
        borderColor: isDark ? '#464c4c' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => formatCurrency(context.parsed.y, currency),
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#6b7280' : '#6b7280',
          maxRotation: 45,
          minRotation: 0,
        },
        border: {
          color: isDark ? '#464c4c' : '#e5e7eb',
        },
      },
      y: {
        grid: {
          color: isDark ? '#464c4c' : '#f3f4f6',
        },
        ticks: {
          color: isDark ? '#6b7280' : '#6b7280',
          callback: (value: any) => formatCurrency(value, currency),
        },
        border: {
          color: isDark ? '#464c4c' : '#e5e7eb',
        },
      },
    },
  };

  return (
    <div className="h-full flex flex-col bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-gray-100 dark:border-white/5 p-3 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-black/50 overflow-hidden">
      <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2 pl-2">
        Balance Trend
      </h3>
      <div className="flex-1 min-h-0">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default BalanceTrendChart;
