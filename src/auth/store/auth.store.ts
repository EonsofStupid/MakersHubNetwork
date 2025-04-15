
import { create } from 'zustand';
import { UserProfile, AuthStatus, AUTH_STATUS } from '@/shared/types/shared.types';

export interface AuthState {
  user: UserProfile | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: Error | null;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setError: (error: Error | null) => void;
  logout: () => void;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  status: AUTH_STATUS.IDLE,
  error: null,
  
  setUser: (user) => set({ 
    user, 
    profile: user,
    isAuthenticated: !!user,
    status: user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED
  }),
  
  setAuthStatus: (status) => set({ status }),
  
  setError: (error) => set({ error }),
  
  logout: () => set({ 
    user: null,
    profile: null,
    isAuthenticated: false,
    status: AUTH_STATUS.UNAUTHENTICATED
  }),
  
  updateProfile: async (profileData) => {
    try {
      // This is a stub - in a real app this would update the profile in Supabase
      set(state => ({
        user: state.user ? { ...state.user, ...profileData } : null,
        profile: state.profile ? { ...state.profile, ...profileData } : null
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Unknown error updating profile') });
      throw error;
    }
  }
}));
