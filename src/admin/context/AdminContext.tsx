
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAdminStore } from '../store/admin.store';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { canAccessAdmin } from '@/auth/rbac/enforce';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { subscribeToAuthEvents } from '@/auth/bridge';

interface AdminContextValue {
  isInitialized: boolean;
  hasAdminAccess: boolean;
  isEditMode: boolean;
  toggleEditMode: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { roles, isAuthenticated } = useAuthState();
  const { isEditMode, setEditMode, initializeStore } = useAdminStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const logger = useLogger('AdminContext', LogCategory.ADMIN);
  
  // Check if user has admin access
  const hasAdminAccess = canAccessAdmin(roles);
  
  // Initialize admin module
  useEffect(() => {
    if (isAuthenticated) {
      logger.info('Initializing admin context');
      
      // Initialize the admin store
      initializeStore().then(() => {
        setIsInitialized(true);
        logger.info('Admin context initialized');
      }).catch(error => {
        logger.error('Failed to initialize admin context', { details: error });
      });
    }
  }, [isAuthenticated, initializeStore, logger]);
  
  // Subscribe to auth events
  useEffect(() => {
    const unsubscribe = subscribeToAuthEvents((event) => {
      logger.info(`Admin context received auth event: ${event.type}`);
      
      // Handle specific auth events as needed
    });
    
    return () => unsubscribe();
  }, [logger]);
  
  // Method to toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!isEditMode);
    logger.info(`Admin edit mode ${!isEditMode ? 'enabled' : 'disabled'}`);
  };
  
  const value = {
    isInitialized,
    hasAdminAccess,
    isEditMode,
    toggleEditMode
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
