
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useLogger } from '@/logging/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { useAuthStore } from '@/auth/store/auth.store';
import { hasAdminPermission } from '../utils/permissions';

// Define admin permissions
const ADMIN_PERMISSIONS = {
  VIEW_ADMIN_PANEL: 'view_admin_panel',
  EDIT_ADMIN_SETTINGS: 'edit_admin_settings'
};

interface AdminContextValue {
  isInitialized: boolean;
  hasPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const logger = useLogger('AdminContext', LogCategory.ADMIN);
  const { user, roles } = useAuthStore();

  // Initialize admin context
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        // Check if user has admin permissions
        const isAdmin = hasAdminPermission(roles, ADMIN_PERMISSIONS.VIEW_ADMIN_PANEL);
        
        logger.info('Admin context initialized', {
          details: {
            isAdmin
          }
        });
        
        if (!isAdmin) {
          logger.warn('User attempted to access admin without permissions', {
            details: {
              error: 'Insufficient permissions'
            }
          });
          
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to access the admin area.',
            variant: 'destructive',
          });
          
          navigate('/');
          return;
        }
        
        setIsInitialized(true);
      } catch (error) {
        logger.error('Failed to initialize admin context', {
          details: {
            error: error instanceof Error ? error.message : String(error)
          }
        });
      }
    };

    initializeAdmin();
  }, [user, roles, navigate, toast, logger]);

  const hasPermission = (permission: string) => {
    return hasAdminPermission(roles, permission);
  };

  const value = {
    isInitialized,
    hasPermission,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export const useAdmin = (): AdminContextValue => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
