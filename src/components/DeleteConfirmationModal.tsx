import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDangerous?: boolean;
}

export default function DeleteConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  isDangerous = false,
}: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-sm bg-white dark:bg-ultimate rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5"
        >
          <div className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertTriangle size={32} strokeWidth={2.5} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                {title}
              </h3>
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-relaxed">
                {message}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-[2] h-12 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? '...' : (isDangerous ? 'Delete Record' : 'Confirm')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
