import { createStore } from 'zustand/vanilla';
import { UserProfile } from '@/shared/types/auth-mapped.types';

export interface AdminState {
  user: UserProfile | null;
  isReady: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  setAdminUser: (user: UserProfile | null) => void;
}

const adminStore = createStore<AdminState>()(
  (set) => ({
    user: null,
    isReady: false,
    isAuthenticated: false,
    error: null,
    
    setAdminUser: (user: UserProfile | null) => {
      set({ 
        user,
        isAuthenticated: !!user,
      });
    },
  })
);

export const useAdminStore = adminStore;
