import { BarChart3, TrendingUp, Wallet } from 'lucide-react';
import SummaryCards from '../components/SummaryCards';

export default function Analysis() {

  return (
    <div className="h-full flex flex-col space-y-4 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between shrink-0">
        <div className="space-y-0.5">
          <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white underline decoration-blue-500/30 decoration-4 underline-offset-[-1px]">
            Analysis
          </h1>
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Your financial aggregates & health metrics
          </p>
        </div>
        <div className="p-2.5 bg-blue-500/10 rounded-2xl">
          <BarChart3 size={20} className="text-blue-600 shadow-lg shadow-blue-500/20" />
        </div>
      </div>

      <div className="flex-1 bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-gray-100 dark:border-white/5 p-6 rounded-[2.5rem] shadow-2xl shadow-gray-200/40 dark:shadow-black/50 overflow-hidden flex flex-col">
        <div className="mb-6 shrink-0">
            <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest mb-0.5">
                Executive Summary
            </h2>
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                Overall capital & spending distribution
            </p>
        </div>
        
        <div className="shrink-0 mb-8">
          <SummaryCards />
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0 overflow-auto custom-scrollbar">
            <div className="p-5 bg-blue-500/5 dark:bg-steel/10 rounded-[2rem] border border-blue-500/10 dark:border-white/5 h-fit">
                <div className="flex items-center space-x-3 mb-3">
                    <Wallet size={16} className="text-blue-500" />
                    <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Liquidity Note</h3>
                </div>
                <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                    Your current balance represents total liquid assets across all accounts. Ensure a healthy margin for emergencies.
                </p>
            </div>
            
            <div className="p-5 bg-emerald-500/5 dark:bg-steel/10 rounded-[2rem] border border-emerald-500/10 dark:border-white/5 h-fit">
                <div className="flex items-center space-x-3 mb-3">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <h3 className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">Savings Insight</h3>
                </div>
                <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                    Total capital added includes all income streams. Tracking this helps identify periods of high growth.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
