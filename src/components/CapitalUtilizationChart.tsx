import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '../hooks';
import { formatCurrency } from '../utils/currency';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CapitalUtilizationChartProps {
  utilized: number;
  available: number;
  currency?: string;
}

const CapitalUtilizationChart = ({
  utilized,
  available,
  currency = 'INR',
}: CapitalUtilizationChartProps) => {
  const { isDark } = useTheme();

  const total = utilized + available;
  const percentage = total > 0 ? (utilized / total) * 100 : 0;

  const getColor = (percent: number) => {
    if (percent > 80) return { primary: '#ef4444', secondary: '#fca5a5' };
    if (percent > 50) return { primary: '#f59e0b', secondary: '#fcd34d' };
    return { primary: '#10b981', secondary: '#6ee7b7' };
  };

  const colors = getColor(percentage);

  const data = {
    labels: ['Utilized', 'Available'],
    datasets: [
      {
        data: [utilized, Math.max(0, available)],
        backgroundColor: [colors.primary, colors.secondary],
        borderColor: isDark ? '#1f2937' : '#ffffff',
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: isDark ? '#d1d5db' : '#374151',
          padding: 16,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#f3f4f6' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = formatCurrency(context.parsed, currency);
            const percent = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0.0';
            return `${label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-full bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-gray-100 dark:border-white/5 p-3 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-black/50 flex flex-col">
      <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-2 pl-2">
        Utilization
      </h3>
      <div className="flex-1 flex items-center justify-center min-h-0">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-2 text-center">
        <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0.5">Utilization Rate</p>
        <p className={`text-lg font-black ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{percentage.toFixed(1)}%</p>
      </div>
    </div>
  );
}

export default CapitalUtilizationChart;
