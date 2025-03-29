
import React, { createContext, useContext, useEffect } from 'react';
import { useAdminStore } from '../store/admin.store';
import { useAuthStore } from '@/stores/auth/store';
import { AdminPermission } from '../types/admin.types';

interface AdminContextValue {
  hasAdminAccess: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  checkPermission: (permission: AdminPermission) => boolean;
  initializeAdmin: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { roles, user, status } = useAuthStore();
  const { 
    loadPermissions, 
    hasPermission, 
    isLoadingPermissions 
  } = useAdminStore();
  
  const hasAdminAccess = roles?.includes("admin") || roles?.includes("super_admin");
  const isSuperAdmin = roles?.includes("super_admin");
  
  const checkPermission = (permission: AdminPermission): boolean => {
    // Super admins have all permissions
    if (isSuperAdmin) {
      return true;
    }
    
    // Basic admin access check
    if (permission === 'admin:access') {
      return hasAdminAccess;
    }
    
    return hasPermission(permission);
  };
  
  const initializeAdmin = () => {
    if (user?.id && hasAdminAccess) {
      loadPermissions();
    }
  };
  
  // Initialize permissions once on mount
  useEffect(() => {
    if (status === "authenticated" && hasAdminAccess) {
      initializeAdmin();
    }
  }, [status, hasAdminAccess]);
  
  const value = {
    hasAdminAccess,
    isSuperAdmin,
    isLoading: status === "loading" || isLoadingPermissions,
    checkPermission,
    initializeAdmin
  };
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
