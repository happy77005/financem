import { useState, useMemo } from 'react';
import { Filter, Trash2 } from 'lucide-react';
import TransactionsTable from '../components/TransactionsTable';
import Pagination from '../components/Pagination';
import FilterPanel from '../components/FilterPanel';
import TransactionFormModal from '../components/TransactionFormModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useAuth, useTransactions } from '../hooks';
import { Transaction, FilterOptions } from '../types';

export default function Transactions() {
  const { currentUser } = useAuth();
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteMultipleTransactions,
  } = useTransactions();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.startDate) {
      result = result.filter((t) => new Date(t.date) >= filters.startDate!);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter((t) => new Date(t.date) <= endDate);
    }

    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.category) {
      result = result.filter((t) =>
        t.category.toLowerCase().includes(filters.category!.toLowerCase())
      );
    }

    if (filters.minAmount !== undefined) {
      result = result.filter((t) => t.amount >= filters.minAmount!);
    }

    if (filters.maxAmount !== undefined) {
      result = result.filter((t) => t.amount <= filters.maxAmount!);
    }

    if (filters.searchTerm) {
      result = result.filter((t) =>
        t.description.toLowerCase().includes(filters.searchTerm!.toLowerCase())
      );
    }

    return result;
  }, [transactions, filters]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTransactions.slice(startIndex, startIndex + pageSize);
  }, [filteredTransactions, currentPage, pageSize]);

  const handleAddTransaction = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      await addTransaction(data);
      setShowFormModal(false);
      setCurrentPage(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowFormModal(true);
  };

  const handleUpdateTransaction = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!editingTransaction) return;

    setIsSubmitting(true);
    try {
      await updateTransaction({
        ...editingTransaction,
        ...data,
      });
      setShowFormModal(false);
      setEditingTransaction(undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    setIsDeleting(true);
    try {
      await deleteTransaction(deleteTargetId);
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setDeleteTargetId('bulk');
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMultipleTransactions(selectedIds);
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
      setSelectedIds([]);
      setCurrentPage(1);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = editingTransaction ? handleUpdateTransaction : handleAddTransaction;
  const handleConfirmDelete =
    deleteTargetId === 'bulk' ? confirmBulkDelete : confirmDelete;

  return (
    <div className="h-full flex flex-col space-y-4 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
            Transactions
          </h1>
          <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            {filteredTransactions.length} records found
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 rounded-2xl shadow-lg shadow-red-500/20 transition-all flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setShowFilterPanel(true)}
            className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-steel/20 hover:bg-gray-200 dark:hover:bg-steel/30 rounded-2xl transition-all flex items-center gap-2"
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-white/30 dark:bg-steel/5 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10">
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 italic">No transactions match your criteria</p>
          <button
            onClick={() => {
              window.location.hash = '#add-transaction';
            }}
            className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
          >
            Create First Record
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 bg-white/40 dark:bg-steel/10 backdrop-blur-xl border border-gray-100 dark:border-white/5 rounded-[2rem] shadow-xl dark:shadow-black/50 overflow-hidden">
          <div className="flex-1 overflow-auto custom-scrollbar">
            <TransactionsTable
              transactions={paginatedTransactions}
              currency={currentUser?.currency || 'INR'}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              onSelectChange={setSelectedIds}
              selectedIds={selectedIds}
            />
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-ultimate/50">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={filteredTransactions.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      )}

      <FilterPanel
        isOpen={showFilterPanel}
        onFilter={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
          setShowFilterPanel(false);
        }}
        onClose={() => setShowFilterPanel(false)}
        initialFilters={filters}
      />

      {showFormModal && (
        <TransactionFormModal
          transaction={editingTransaction}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowFormModal(false);
            setEditingTransaction(undefined);
          }}
          isLoading={isSubmitting}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmationModal
          title={
            deleteTargetId === 'bulk'
              ? `Delete ${selectedIds.length} transactions?`
              : 'Delete transaction?'
          }
          message={
            deleteTargetId === 'bulk'
              ? 'This action cannot be undone.'
              : 'This action cannot be undone.'
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeleteTargetId(null);
          }}
          isLoading={isDeleting}
          isDangerous
        />
      )}
    </div>
  );
}
