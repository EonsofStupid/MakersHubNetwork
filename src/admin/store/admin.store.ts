
import { create } from 'zustand';
import { AuthStatus, UserProfile, UserRole } from '@/shared/types/shared.types';

export interface AdminState {
  user: UserProfile | null;
  isReady: boolean;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
  permissions: string[];
  
  setAdminUser: (user: UserProfile | null) => void;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

// Create the store
const useAdminStore = create<AdminState>((set, get) => ({
  user: null,
  isReady: false,
  isAuthenticated: false,
  status: AuthStatus.UNAUTHENTICATED,
  error: null,
  permissions: [],
  
  setAdminUser: (user: UserProfile | null) => {
    set({ 
      user,
      isAuthenticated: !!user,
      status: user ? AuthStatus.AUTHENTICATED : AuthStatus.UNAUTHENTICATED,
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
    
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    
    if (Array.isArray(roleOrRoles)) {
      return roleOrRoles.some(role => user.roles.includes(role));
    }
    
    return user.roles.includes(roleOrRoles);
  }
}));

export { useAdminStore };
