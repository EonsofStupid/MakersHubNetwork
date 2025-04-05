
import React, { createContext, useContext, useEffect } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAdminSync } from '@/admin/hooks/useAdminSync';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

// Create context
interface AdminContextValue {
  initialized: boolean;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

// Provider component
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { setPermissions } = useAdminStore();
  const { permissions, isLoading } = useAdminPermissions();
  const { isSyncing } = useAdminSync();
  const [initialized, setInitialized] = React.useState(false);
  const logger = useLogger('AdminContext', LogCategory.ADMIN);
  
  // Initialize admin context
  useEffect(() => {
    if (!isLoading && !isSyncing && !initialized) {
      logger.info('Initializing admin context', {
        details: { permissions }
      });
      
      // Update permissions in store
      setPermissions(permissions);
      setInitialized(true);
    }
  }, [isLoading, isSyncing, initialized, setPermissions, permissions, logger]);
  
  const value = { initialized };
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

// Hook to use admin context
export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}
