
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useThemeStore } from '@/stores/theme/store';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { UserRole } from '@/types/auth.unified';

// Create logger instance
const logger = getLogger('AdminContext', LogCategory.SYSTEM);

// Types
interface AdminState {
  title: string;
  adminMode: boolean;
  theme: string;
  showSidebar: boolean;
  permissions: string[];
  roles: UserRole[];
  initialized: boolean;
}

interface AdminContextType extends AdminState {
  setTitle: (title: string) => void;
  toggleAdminMode: () => void;
  setTheme: (theme: string) => void;
  toggleSidebar: () => void;
  hasPermission: (permission: string) => boolean;
}

// Create the context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Provider component
export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { currentTheme } = useThemeStore();
  const { toast } = useToast();
  const { roles } = useAuth();
  
  // State
  const [state, setState] = useState<AdminState>({
    title: 'Administration',
    adminMode: false,
    theme: 'cyberpunk',
    showSidebar: true,
    permissions: [],
    roles: (roles || []) as UserRole[],
    initialized: false
  });
  
  // Load permissions based on roles
  useEffect(() => {
    // Simple mapping of roles to permissions - in a real app this might come from an API
    const rolePermissions: Record<string, string[]> = {
      admin: ['admin:read', 'admin:write', 'admin:delete', 'admin:manage-users'],
      super_admin: ['admin:read', 'admin:write', 'admin:delete', 'admin:manage-users', 'admin:system-settings'],
      editor: ['admin:read', 'admin:write'],
      moderator: ['admin:read', 'admin:moderate-content']
    };
    
    // Collect all permissions based on user roles
    const userPermissions: string[] = [];
    
    roles.forEach(role => {
      const perms = rolePermissions[role as string] || [];
      userPermissions.push(...perms);
    });
    
    // Remove duplicates
    const uniquePermissions = [...new Set(userPermissions)];
    
    setState(prev => ({
      ...prev,
      permissions: uniquePermissions,
      roles: roles as UserRole[],
      initialized: true
    }));
    
    logger.info('User permissions loaded', {
      details: { 
        permissionCount: uniquePermissions.length,
        roleCount: roles.length
      }
    });
  }, [roles]);
  
  // Set page title
  const setTitle = (title: string) => {
    setState(prev => ({ ...prev, title }));
  };
  
  // Toggle admin mode
  const toggleAdminMode = () => {
    setState(prev => {
      const newMode = !prev.adminMode;
      
      // Notify user of mode change
      toast({
        title: newMode ? 'Admin Mode Enabled' : 'Admin Mode Disabled',
        description: newMode 
          ? 'You now have access to advanced admin features' 
          : 'Returned to standard admin view',
      });
      
      return { ...prev, adminMode: newMode };
    });
  };
  
  // Set admin theme
  const setTheme = (theme: string) => {
    setState(prev => ({ ...prev, theme }));
  };
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setState(prev => ({ ...prev, showSidebar: !prev.showSidebar }));
  };
  
  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    return state.permissions.includes(permission);
  };
  
  const contextValue: AdminContextType = {
    ...state,
    setTitle,
    toggleAdminMode,
    setTheme,
    toggleSidebar,
    hasPermission
  };
  
  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

// Custom hook to use the admin context
export function useAdmin() {
  const context = useContext(AdminContext);
  
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  
  return context;
}
