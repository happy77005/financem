import { useEffect, useState } from 'react';
import { initializeDatabase } from './utils/seedData';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { TransactionsProvider } from './contexts/TransactionsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth, useTransactions, useDashboard } from './hooks';
import Layout from './components/Layout';
import BalanceTrendChart from './components/BalanceTrendChart';
import CapitalUtilizationChart from './components/CapitalUtilizationChart';
import RecentTransactions from './components/RecentTransactions';
import DateRangePicker from './components/DateRangePicker';
import { DashboardSkeleton } from './components/LoadingSkeleton';
import { calculateTotalExpenses, calculateBalance } from './utils/calculations';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import DataManagement from './pages/DataManagement';
import Analysis from './pages/Analysis';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const { transactions, loadTransactions } = useTransactions();
  const { startDate, endDate, setDateRange } = useDashboard();
  const [contentLoading, setContentLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      setCurrentPage(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      if (!authLoading && currentUser) {
        try {
          await loadTransactions(currentUser.id);
        } catch (err) {
          console.error('Error loading transactions:', err);
        } finally {
          setContentLoading(false);
        }
      }
    };

    loadContent();
  }, [authLoading, currentUser, loadTransactions]);

  if (authLoading || contentLoading || !currentUser) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  const filteredTransactions = transactions.filter(
    (t) => t.date >= startDate && t.date <= endDate
  );

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="w-full"
        >
          {(() => {
            if (currentPage === 'dashboard') {
              return (
                <div className="h-full flex flex-col space-y-3 p-4 lg:p-5 overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
                    <div>
                      <h1 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-0.5 underline decoration-blue-500/30 decoration-4 underline-offset-[-1px]">
                        Dashboard
                      </h1>
                    </div>
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      onDateRangeChange={setDateRange}
                    />
                  </div>
                  
                  <div className="flex-grow min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2 h-full">
                       <BalanceTrendChart transactions={filteredTransactions} currency={currentUser?.currency || 'INR'} />
                    </div>
                    <div className="lg:col-span-1 h-full">
                      <CapitalUtilizationChart 
                        utilized={calculateTotalExpenses(filteredTransactions)} 
                        available={calculateBalance(filteredTransactions)} 
                        currency={currentUser?.currency || 'INR'}
                      />
                    </div>
                  </div>

                  <div className="shrink-0">
                    <RecentTransactions 
                      transactions={filteredTransactions.slice(0, 3)} 
                      currency={currentUser?.currency || 'INR'} 
                    />
                  </div>
                </div>
              );
            }

            if (currentPage === 'analysis') {
              return <Analysis />;
            }

            if (currentPage === 'transactions') {
              return <Transactions />;
            }

            if (currentPage === 'add-transaction') {
              return <AddTransaction />;
            }

            if (currentPage === 'data-management') {
              return <DataManagement />;
            }

            return (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500 font-bold italic">Page under construction: {currentPage}</p>
              </div>
            );
          })()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

function AppWrapper() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        setDbReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      }
    };

    setupDatabase();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-ultimate flex items-center justify-center p-4">
        <div className="bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-gray-100 dark:border-white/5 p-8 rounded-[3rem] shadow-2xl shadow-gray-200/40 dark:shadow-black/50 max-w-md text-center">
          <p className="text-rose-600 font-black uppercase tracking-widest text-sm mb-2">Error initializing database</p>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-white dark:bg-ultimate flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Initializing Database</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <DashboardProvider>
        <TransactionsProvider>
          <AppContent />
        </TransactionsProvider>
      </DashboardProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppWrapper />
    </ThemeProvider>
  );
}

export default App;
