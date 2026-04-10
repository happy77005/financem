import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeftRight, Settings, X, PlusSquare, Database, ChevronRight, BarChart3 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  href: string;
}

const Sidebar = ({ isOpen, onClose, onHoverChange }: SidebarProps) => {
  const [localHover, setLocalHover] = useState(false);
  const currentHash = typeof window !== 'undefined' ? window.location.hash || '#dashboard' : '#dashboard';

  const navigationItems: NavItem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: Home, href: '#dashboard' },
    { id: 'analysis', name: 'Analysis', icon: BarChart3, href: '#analysis' },
    { id: 'add-transaction', name: 'Add Transaction', icon: PlusSquare, href: '#add-transaction' },
    { id: 'transactions', name: 'Transactions', icon: ArrowLeftRight, href: '#transactions' },
    { id: 'data-management', name: 'Data Management', icon: Database, href: '#data-management' },
    { id: 'settings', name: 'Settings', icon: Settings, href: '#settings' },
  ];

  const handleNavClick = (href: string) => {
    window.location.hash = href;
    onClose();
  };

  const handleHover = (hovered: boolean) => {
    setLocalHover(hovered);
    onHoverChange?.(hovered);
  };

  const isExpanded = localHover || isOpen;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        onHoverStart={() => handleHover(true)}
        onHoverEnd={() => handleHover(false)}
        initial={false}
        animate={{ 
          width: isExpanded ? 240 : 80,
          x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -240 : 0)
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-14 left-0 z-[60] h-[calc(100vh-3.5rem)]",
          "bg-white/80 dark:bg-ultimate/80 backdrop-blur-xl",
          "border-r border-gray-100 dark:border-white/5",
          "hidden lg:flex flex-col"
        )}
      >
        <div className="flex flex-col h-full py-8 text-shadow-sm">
          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentHash === item.href;
              
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                  className="relative flex items-center h-11 rounded-xl transition-colors group"
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-blue-600 shadow-md shadow-blue-600/20 rounded-xl"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  
                  <div className={cn(
                    "relative z-10 w-14 min-w-[56px] flex items-center justify-center transition-colors",
                    isActive ? "text-white" : "text-gray-400 dark:text-gray-500 group-hover:text-blue-500"
                  )}>
                    <Icon size={18} strokeWidth={2.5} />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className={cn(
                          "relative z-10 whitespace-nowrap text-[10px] font-black uppercase tracking-widest",
                          isActive ? "text-white" : "text-gray-900 dark:text-gray-100"
                        )}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              );
            })}
          </nav>

          {/* Expand Hint */}
          <div className="flex justify-center mt-auto pb-4">
            <motion.div 
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50/50 dark:bg-steel/20 text-gray-400"
            >
              <ChevronRight size={14} />
            </motion.div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        className="fixed top-0 left-0 z-[100] h-screen w-[280px] bg-white dark:bg-ultimate border-r border-gray-100 dark:border-white/5 lg:hidden flex flex-col"
      >
        <div className="flex items-center justify-between h-14 px-6 border-b border-gray-100 dark:border-white/5">
          <span className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">FinanceM</span>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-900">
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300"
            >
              <item.icon size={20} />
              <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
            </a>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default Sidebar;
