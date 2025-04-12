
import { create } from 'zustand';
import { AuthStatus, UserProfile } from '@/shared/types/shared.types';

export interface AdminState {
  user: UserProfile | null;
  isReady: boolean;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
  
  setAdminUser: (user: UserProfile | null) => void;
  logout: () => void;
}

// Create the store
const useAdminStore = create<AdminState>((set) => ({
  user: null,
  isReady: false,
  isAuthenticated: false,
  status: AuthStatus.UNAUTHENTICATED,
  error: null,
  
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
  }
}));

export { useAdminStore };
