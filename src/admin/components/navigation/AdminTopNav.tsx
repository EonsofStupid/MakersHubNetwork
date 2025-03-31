
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Moon, Settings, Sun, User } from 'lucide-react';
import { useAdminStore } from '@/admin/store/admin.store';
import { EditModeToggle } from '../ui/EditModeToggle';

export function AdminTopNav() {
  const { isDarkMode, toggleDarkMode } = useAdminStore();
  
  // Animate the notification badge
  const notificationVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };
  
  return (
    <div className="flex items-center gap-3">
      {/* Theme toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleDarkMode}
        className="p-2 rounded-full text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] hover:bg-[var(--impulse-bg-hover)] transition-colors"
      >
        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </motion.button>
      
      {/* Notifications */}
      <motion.div className="relative">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] hover:bg-[var(--impulse-bg-hover)] transition-colors"
        >
          <Bell className="w-4 h-4" />
        </motion.button>
        
        <motion.div
          variants={notificationVariants}
          initial="initial"
          animate="animate"
          className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"
        />
      </motion.div>
      
      {/* Settings */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 rounded-full text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-primary)] hover:bg-[var(--impulse-bg-hover)] transition-colors"
      >
        <Settings className="w-4 h-4" />
      </motion.button>
      
      {/* Edit mode toggle */}
      <EditModeToggle />
      
      {/* User menu */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="ml-2 flex items-center gap-2 px-2 py-1 rounded-full bg-[var(--impulse-bg-card)] hover:bg-[var(--impulse-bg-hover)] transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-[var(--impulse-primary)]/20 flex items-center justify-center">
          <User className="w-3 h-3 text-[var(--impulse-primary)]" />
        </div>
        <span className="text-sm font-medium">Admin</span>
      </motion.button>
    </div>
  );
}
