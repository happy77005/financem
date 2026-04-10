import { Menu, Moon, Sun, ChevronDown, User, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth, useTheme } from '../hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarExpanded?: boolean;
}

const Header = ({ onMenuClick, isSidebarExpanded = false }: HeaderProps) => {
  const { currentRole, switchRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = (role: 'admin' | 'viewer') => {
    switchRole(role);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white/80 dark:bg-ultimate/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 shadow-sm shadow-gray-100/20 dark:shadow-black/50 transition-all flex items-center px-4">
      <div className="w-full flex items-center justify-between">
        <div className={cn(
          "flex items-center space-x-4 transition-all duration-300",
          isSidebarExpanded ? "pl-0" : "pl-0" // Just ensuring it's stable
        )}>
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-steel/30 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Logo Section */}
          <div className="flex items-center overflow-hidden">
            <div className="w-8 h-8 min-w-[32px] bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <div className="hidden sm:block ml-3">
              <h1 className="text-xs font-black tracking-widest uppercase text-gray-900 dark:text-white">
                FinanceM
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Role Switcher */}
          <div className="relative" ref={roleDropdownRef}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 h-9 px-3 rounded-full bg-gray-50/50 dark:bg-steel/20 hover:bg-gray-100 dark:hover:bg-steel/30 transition-all active:scale-[0.98]"
            >
              <Shield className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] font-black uppercase text-gray-700 dark:text-gray-300">
                {currentRole}
              </span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            <AnimatePresence>
              {roleDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-40 bg-white/95 dark:bg-ultimate/95 backdrop-blur-xl border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-[60]"
                >
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className="w-full px-4 py-2 text-[10px] font-black uppercase text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-100 transition-colors"
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('viewer')}
                    className="w-full px-4 py-2 text-[10px] font-black uppercase text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-100 transition-colors"
                  >
                    Viewer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50/50 dark:bg-steel/20 hover:bg-gray-100 dark:hover:bg-steel/30 transition-all active:scale-95"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-blue-600" />
            )}
          </button>

          <div className="flex items-center space-x-2 pl-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
