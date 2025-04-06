
import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/auth/types/userRoles';

export enum AuthStatus {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: AuthStatus;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  roles: [],
  status: AuthStatus.LOADING,
  isLoading: true,
  error: null,
  initialized: false,
  isAuthenticated: false,
  isAdmin: false,
  
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        roles: [],
        status: AuthStatus.UNAUTHENTICATED,
        isLoading: false,
        isAuthenticated: false,
        isAdmin: false
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to sign out',
        isLoading: false
      });
    }
  }
}));

// We also need to create a hook to initialize and expose the auth state
export function useAuth() {
  return useAuthStore();
}
