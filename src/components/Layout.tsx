import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  const isExpanded = isDesktop && (sidebarHovered || sidebarOpen);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      "bg-gray-50 dark:bg-ultimate overflow-x-hidden"
    )}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar} 
        onHoverChange={setSidebarHovered}
      />

      <Header onMenuClick={toggleSidebar} isSidebarExpanded={isExpanded} />

      <motion.div 
        initial={false}
        animate={{ 
          paddingLeft: isDesktop ? (isExpanded ? '240px' : '80px') : '0px'
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen relative flex flex-col w-full"
      >
        <main className="flex-1 p-2 lg:p-3 mt-14 h-[calc(100vh-3.5rem)] overflow-hidden">
          {/* Main Area Card - The "Single Sheet" UI */}
          <div className="h-full w-full bg-white/60 dark:bg-steel/10 backdrop-blur-2xl border border-white/30 dark:border-white/5 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden flex flex-col">
            <div className="flex-1 h-full min-h-0 overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default Layout;
