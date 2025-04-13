import { create } from 'zustand';
import { AuthStatus, UserProfile, UserRole } from '@/shared/types/shared.types';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/shared/types/shared.types';

export interface AdminState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  isReady: boolean;
  error: string | null;
  permissions: string[];
  roles: UserRole[];
  
  setAdminUser: (user: UserProfile | null) => void;
  logout: () => void;
  hasRole: (roleOrRoles: UserRole | UserRole[]) => boolean;
}

// Create the store
const useAdminStore = create<AdminState>((set, get) => {
  const logger = useLogger('AdminStore', LogCategory.ADMIN);

  return {
    user: null,
    isReady: false,
    isAuthenticated: false,
    status: AuthStatus.UNAUTHENTICATED,
    error: null,
    permissions: [],
    roles: [],
    
    setAdminUser: (user: UserProfile | null) => {
      logger.debug('Setting admin user', { details: { userId: user?.id } });
      set({ 
        user,
        isAuthenticated: !!user,
        status: user ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED,
        roles: user?.roles || []
      });
    },

    logout: () => {
      set({
        user: null,
        isAuthenticated: false,
        status: AuthStatus.UNAUTHENTICATED,
      });
    },

    hasRole: (roleOrRoles: UserRole | UserRole[]) => {
      const { user } = get();
      const userRoles = user?.roles || [];
      if (userRoles.length === 0) return false;
      
      const roles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
      return roles.some(role => userRoles.includes(role as UserRole));
    }
  };
});

export { useAdminStore };
