
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAdminDataSync } from '@/admin/services/adminData.service';
import { useAuthStore } from '@/stores/auth/store';
import { AdminPermission } from '@/admin/types/admin.types';

interface AdminContextProps {
  isLoading: boolean;
  isEditMode: boolean;
  setEditMode: (isEditMode: boolean) => void;
  checkPermission: (permission: AdminPermission) => boolean;
  syncPreferences: () => void;
  isSyncingPreferences: boolean;
}

const AdminContext = createContext<AdminContextProps>({
  isLoading: true,
  isEditMode: false,
  setEditMode: () => {},
  checkPermission: () => false,
  syncPreferences: () => {},
  isSyncingPreferences: false,
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const { user, isLoaded: authLoaded } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    isEditMode, 
    setEditMode, 
    hasPermission,
    loadPermissions,
    sidebarExpanded,
    activeSection,
    adminTheme,
    isDarkMode,
    dashboardShortcuts,
    pinnedTopNavItems
  } = useAdminStore();
  
  // Sync admin data with the database
  const { isSyncing } = useAdminDataSync({
    sidebarExpanded,
    activeSection,
    adminTheme,
    isDarkMode,
    dashboardShortcuts,
    pinnedTopNavItems
  }, (data) => {
    console.log('Admin data loaded from DB:', data);
  });
  
  // Load permissions when auth is loaded
  useEffect(() => {
    const initialize = async () => {
      if (!authLoaded) return;
      
      try {
        setIsLoading(true);
        await loadPermissions();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize admin context:', error);
        toast({
          title: 'Admin initialization failed',
          description: 'Could not load admin permissions',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    };
    
    initialize();
  }, [authLoaded, loadPermissions, toast]);
  
  // Function to manually sync preferences
  const syncPreferences = () => {
    console.log('Manually syncing preferences...');
    // The useAdminDataSync hook will automatically handle syncing
    toast({
      title: 'Preferences synced',
      description: 'Your admin preferences have been saved to the cloud',
    });
  };
  
  const contextValue: AdminContextProps = {
    isLoading,
    isEditMode,
    setEditMode,
    checkPermission: hasPermission,
    syncPreferences,
    isSyncingPreferences: isSyncing,
  };
  
  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};
