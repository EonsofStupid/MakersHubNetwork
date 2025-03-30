
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth/store';
import { useToast } from '@/hooks/use-toast';

interface AdminContextProps {
  hasAdminAccess: boolean;
  isLoading: boolean;
  initializeAdmin: () => void;
}

const AdminContext = createContext<AdminContextProps>({
  hasAdminAccess: false,
  isLoading: false,
  initializeAdmin: () => {}
});

export const useAdmin = () => useContext(AdminContext);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { roles, status } = useAuthStore();
  const { toast } = useToast();
  
  // Check if user has admin access
  const hasAdminAccess = roles?.includes('admin') || roles?.includes('super_admin');
  
  // Initialize admin functionality
  const initializeAdmin = () => {
    try {
      // Additional initialization logic would go here
      // For now, just setting loading to false
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing admin:', error);
      toast({
        title: 'Admin Initialization Error',
        description: 'There was a problem loading the admin panel.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  // Auto-initialize on mount if authenticated
  React.useEffect(() => {
    if (status === 'authenticated') {
      setIsLoading(false);
    }
  }, [status]);
  
  const value = {
    hasAdminAccess,
    isLoading,
    initializeAdmin
  };
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
