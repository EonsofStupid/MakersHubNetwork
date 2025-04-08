
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAdminStore } from '@/admin/store/admin.store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { PERMISSIONS } from '@/auth/permissions';
import { AdminPermissionValue } from '@/admin/types/permissions';
import { mapRolesToPermissions } from '@/auth/rbac/roles';

// Create context
interface AdminContextValue {
  initialized: boolean;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

// Provider component wrapped with React.memo to prevent unnecessary renders
export const AdminProvider = React.memo(({ children }: { children: React.ReactNode }) => {
  const { setPermissions } = useAdminStore();
  const [initialized, setInitialized] = useState(false);
  const initAttemptedRef = useRef<boolean>(false);
  const logger = useLogger('AdminContext', LogCategory.ADMIN);
  
  // Get permissions directly from auth state to avoid circular dependencies
  const { roles, status } = useAuthState();
  
  // Initialize admin context only once
  useEffect(() => {
    // Guard against multiple initialization attempts and wait until auth is ready
    if (initAttemptedRef.current || status === 'loading') {
      return;
    }
    
    // Mark initialization as attempted immediately to prevent multiple attempts
    initAttemptedRef.current = true;
    
    // Introduce small delay to avoid circular updates
    const timeoutId = setTimeout(() => {
      try {
        logger.info('Initializing admin context', {
          details: { userRoles: roles, authStatus: status }
        });
        
        // Use the proper role mapping function to get typed permissions
        const adminPermissions: AdminPermissionValue[] = 
          mapRolesToPermissions(roles);
        
        // Update permissions in store
        setPermissions(adminPermissions);
        setInitialized(true);
        
        logger.info('Admin context initialized successfully', {
          details: { permissionsCount: adminPermissions.length }
        });
      } catch (error) {
        logger.error('Failed to initialize admin context', {
          details: { error }
        });
      }
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [logger, roles, setPermissions, status]);
  
  const value = { initialized };
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
});

// Set display name for debugging
AdminProvider.displayName = 'AdminProvider';

// Hook to use admin context
export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}
