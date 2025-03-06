
import React, { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { motion } from 'framer-motion';

// Create a context for the admin theme
interface AdminThemeContextType {
  loadTheme: () => void;
  isLoading: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType>({
  loadTheme: () => {},
  isLoading: false,
});

// Provider component
export const AdminThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loadAdminComponents, isLoading } = useThemeStore();

  // Load admin components on mount
  useEffect(() => {
    loadAdminComponents();
  }, [loadAdminComponents]);

  return (
    <AdminThemeContext.Provider value={{ loadTheme: loadAdminComponents, isLoading }}>
      <div className="admin-theme">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-background to-background/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
          
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-secondary/5 blur-[100px] rounded-full" />
        </div>

        {/* Content */}
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
};

// Hook to use admin theme
export const useAdminTheme = () => useContext(AdminThemeContext);
