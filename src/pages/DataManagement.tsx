import { useState, useRef } from 'react';
import { Download, Upload, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth, useTransactions } from '../hooks';
import { generateCSV, parseCSV } from '../utils/csv';
import { downloadSampleCSV } from '../utils/csvTemplates';

export default function DataManagement() {
  const { currentUser } = useAuth();
  const { transactions, addTransaction } = useTransactions();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string; errors?: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const csv = generateCSV(transactions);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `finance_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: 'Data exported successfully!' });
    } catch (err) {
      console.error('Export error:', err);
      setMessage({ type: 'error', text: 'Export failed. Please try again.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setIsImporting(true);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const { data, errors } = parseCSV(content, currentUser.id);

      if (errors.length > 0) {
        setMessage({ type: 'error', text: 'Import failed with errors:', errors });
        setIsImporting(false);
        return;
      }

      if (data.length === 0) {
        setMessage({ type: 'error', text: 'No valid records found in the CSV.' });
        setIsImporting(false);
        return;
      }

      try {
        let importedCount = 0;
        for (const record of data) {
          await addTransaction(record);
          importedCount++;
        }
        setMessage({ type: 'success', text: `Successfully imported ${importedCount} transactions!` });
      } catch (err) {
        setMessage({ type: 'error', text: 'Import failed during database write.' });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Failed to read the file.' });
      setIsImporting(false);
    };

    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl w-full mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Data Management</h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Export, import, or reset records</p>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <Database className="w-6 h-6 text-blue-500" />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-3xl border flex flex-col gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm">
              {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{message.text}</span>
            </div>
            {message.errors && message.errors.length > 0 && (
              <ul className="text-[10px] font-bold list-disc pl-5 mt-2 max-h-32 overflow-y-auto">
                {message.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] space-y-4 shadow-xl shadow-gray-200/40 dark:shadow-black/50">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Export Data</h2>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Download all your records as a CSV file.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExport}
                disabled={isExporting || transactions.length === 0}
                className="h-11 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <Download size={14} strokeWidth={3} />
                {isExporting ? '...' : 'Export'}
              </button>
              <button
                onClick={downloadSampleCSV}
                className="h-11 border-2 border-gray-200 dark:border-navy-700 text-gray-600 dark:text-gray-300 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-50 dark:hover:bg-navy-800 transition-all flex items-center justify-center gap-2"
              >
                <Download size={14} />
                Sample
              </button>
            </div>
          </div>

          <div className="bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-gray-100 dark:border-white/5 p-6 rounded-[2rem] space-y-4 shadow-xl shadow-gray-200/40 dark:shadow-black/50">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Import Data</h2>
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Upload a CSV or download our sample template.</p>
            </div>
            <label className="h-11 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]">
              <Upload size={14} strokeWidth={3} />
              {isImporting ? 'Importing...' : 'Upload CSV'}
              <input type="file" accept=".csv" className="hidden" onChange={handleImport} ref={fileInputRef} disabled={isImporting} />
            </label>
          </div>
        </div>

        <div className="bg-blue-500/5 p-6 rounded-[2.5rem] border border-blue-500/10">
          <h3 className="text-[10px] font-black text-blue-600 dark:text-blue-300 uppercase tracking-widest mb-4 text-center">CSV Format Guide</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[10px] font-bold text-left">
              <thead>
                <tr className="border-b border-blue-500/10 text-gray-400">
                  <th className="py-2 px-4 uppercase tracking-widest">Date</th>
                  <th className="py-2 px-4 uppercase tracking-widest">Amount</th>
                  <th className="py-2 px-4 uppercase tracking-widest">Category</th>
                  <th className="py-2 px-4 uppercase tracking-widest">Type</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-300">
                <tr className="border-b border-blue-500/5">
                  <td className="py-2 px-4 font-mono">2026-04-01</td>
                  <td className="py-2 px-4">50000</td>
                  <td className="py-2 px-4">Salary</td>
                  <td className="py-2 px-4 italic lowercase">income</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 font-mono">2026-04-02</td>
                  <td className="py-2 px-4">1200</td>
                  <td className="py-2 px-4">Food</td>
                  <td className="py-2 px-4 italic lowercase">expense</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
