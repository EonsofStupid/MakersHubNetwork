
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAdminStore } from '../store/admin.store';
import { useAuthStore } from '@/stores/auth/store';
import { AdminPermission } from '../types/admin.types';
import { useAdminSync } from '../hooks/useAdminSync';

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
  
  const [initialized, setInitialized] = useState(false);
  
  const hasAdminAccess = roles?.includes("admin") || roles?.includes("super_admin");
  const isSuperAdmin = roles?.includes("super_admin");
  
  // Initialize admin data sync (database <-> localStorage)
  useAdminSync();
  
  const checkPermission = useCallback((permission: AdminPermission): boolean => {
    // Super admins have all permissions
    if (isSuperAdmin) {
      return true;
    }
    
    // Basic admin access check
    if (permission === 'admin:access') {
      return hasAdminAccess;
    }
    
    return hasPermission(permission);
  }, [isSuperAdmin, hasAdminAccess, hasPermission]);
  
  const initializeAdmin = useCallback(() => {
    if (user?.id && hasAdminAccess && !initialized) {
      loadPermissions();
      setInitialized(true);
    }
  }, [user?.id, hasAdminAccess, initialized, loadPermissions]);
  
  // Initialize permissions once when authenticated
  useEffect(() => {
    if (status === "authenticated" && hasAdminAccess && !initialized) {
      initializeAdmin();
    }
  }, [status, hasAdminAccess, initialized, initializeAdmin]);
  
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
