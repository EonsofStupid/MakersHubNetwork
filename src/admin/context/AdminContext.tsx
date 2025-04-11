
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLogger } from '@/shared/hooks/use-logger';
import { authBridge } from '@/bridges/AuthBridge';
import { LogCategory } from '@/logging/types';
import { usePermissions } from '@/admin/hooks/useAdminPermissions';
import { UserRole } from '@/shared/types/auth.types';

interface AdminContextProps {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  validateAccess: (role: UserRole | UserRole[]) => boolean;
}

const AdminContext = createContext<AdminContextProps>({
  isAdmin: false,
  isSuperAdmin: false,
  isLoading: true,
  error: null,
  validateAccess: () => false,
});

export const useAdminContext = () => useContext(AdminContext);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { hasPermission } = usePermissions();
  const logger = useLogger('AdminProvider', LogCategory.ADMIN);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if user is authenticated and has admin role
        const hasAdminRole = authBridge.hasRole(['admin', 'super_admin'] as UserRole[]);
        const hasSuperAdminRole = authBridge.hasRole('super_admin' as UserRole);
        
        setIsAdmin(hasAdminRole);
        setIsSuperAdmin(hasSuperAdminRole);
        
        logger.info('Admin status checked', { isAdmin: hasAdminRole, isSuperAdmin: hasSuperAdminRole });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to validate admin status';
        logger.error('Error checking admin status', { error: errorMessage });
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [logger]);

  const validateAccess = (role: UserRole | UserRole[]) => {
    if (isLoading || error) return false;
    
    // Super admins have access to everything
    if (isSuperAdmin) return true;
    
    // For regular admins, check specific permissions if needed
    if (isAdmin) {
      return hasPermission(role);
    }
    
    return false;
  };

  return (
    <AdminContext.Provider value={{ isAdmin, isSuperAdmin, isLoading, error, validateAccess }}>
      {children}
    </AdminContext.Provider>
  );
};
