
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAdminSync } from '@/admin/hooks/useAdminSync';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAuthState } from '@/auth/hooks/useAuthState';

// Create context
interface AdminContextValue {
  initialized: boolean;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

// Provider component
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { setPermissions } = useAdminStore();
  const { isSyncing } = useAdminSync();
  const [initialized, setInitialized] = useState(false);
  const initAttemptedRef = useRef<boolean>(false);
  const logger = useLogger('AdminContext', LogCategory.ADMIN);
  
  // Get permissions directly from auth state to avoid circular dependencies
  const { roles } = useAuthState();
  
  // Initialize admin context only once
  useEffect(() => {
    // Guard against multiple initialization attempts
    if (initAttemptedRef.current || initialized) {
      return;
    }
    
    // Mark initialization as attempted immediately to prevent multiple attempts
    initAttemptedRef.current = true;
    
    try {
      logger.info('Initializing admin context', {
        details: { userRoles: roles }
      });
      
      // Map roles to permissions (simple mapping to avoid dependency on useAdminPermissions)
      const adminPermissions = roles.includes('admin') || roles.includes('super_admin') 
        ? ['admin:access'] 
        : [];
      
      // Update permissions in store
      setPermissions(adminPermissions);
      setInitialized(true);
    } catch (error) {
      logger.error('Failed to initialize admin context', {
        details: { error }
      });
    }
  }, [logger, roles, initialized, setPermissions]);
  
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
