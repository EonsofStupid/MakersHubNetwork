
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/auth/hooks/useAuth';
import { useAdminPermissions } from '@/admin/hooks/useAdminPermissions'; 
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';

interface AdminContextType {
  isAdmin: boolean;
  isAdminLoading: boolean;
  hasPermission: ReturnType<typeof useAdminPermissions>['hasPermission'];
  permissions: ReturnType<typeof useAdminPermissions>['permissions'];
  isLoading: ReturnType<typeof useAdminPermissions>['isLoading'];
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading, roles } = useAuth();
  const { hasPermission, permissions, isLoading: permissionsLoading } = useAdminPermissions();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const logger = useLogger('AdminContext', { category: LogCategory.ADMIN });

  useEffect(() => {
    if (!authLoading) {
      const adminRole = roles.includes('admin') || roles.includes('super_admin');
      setIsAdmin(adminRole);
      setIsAdminLoading(false);
      
      if (adminRole) {
        logger.debug('Admin user authenticated', { 
          details: { roles }
        });
      }
    }
  }, [authLoading, isAuthenticated, roles, logger]);

  return (
    <AdminContext.Provider 
      value={{ 
        isAdmin, 
        isAdminLoading, 
        hasPermission,
        permissions,
        isLoading: permissionsLoading
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
};
