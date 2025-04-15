import { create } from 'zustand';
import { UserProfile, AuthStatus, AUTH_STATUS, UserRole } from '@/shared/types/core/auth.types';
import { mapUserToProfile } from '@/auth/utils/userMapper';
import { supabase } from '@/integrations/supabase/client';

// RBAC State
export interface AuthState {
  user: UserProfile | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: Error | null;
  roles: UserRole[];
  initialized: boolean;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setError: (error: Error | null) => void;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initialize: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

// Initial state
const initialState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  status: AUTH_STATUS.IDLE,
  error: null,
  roles: [],
  initialized: false
};

// RBAC Store
export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

  setUser: (user) => set({ 
    user: user as UserProfile, 
    profile: user as UserProfile,
    isAuthenticated: !!user,
    status: user ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED
  }),
  
  setAuthStatus: (status) => set({ status }),
  
  setError: (error) => set({ error }),
  
  login: async (email, password) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userProfile = mapUserToProfile(data.user);
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during login'),
        status: AUTH_STATUS.ERROR  
      });
      throw error;
    }
  },
  
  signup: async (email, password) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const userProfile = mapUserToProfile(data.user);
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during signup'),
        status: AUTH_STATUS.ERROR  
      });
      throw error;
    }
  },
  
  resetPassword: async (email) => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      set({ status: AUTH_STATUS.IDLE });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during password reset'),
        status: AUTH_STATUS.ERROR  
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ 
        user: null, 
        profile: null,
        isAuthenticated: false,
        status: AUTH_STATUS.UNAUTHENTICATED,
        roles: []
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during logout'),
        status: AUTH_STATUS.ERROR  
      });
      throw error;
    }
  },
  
  initialize: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      // Get session from supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (data.session?.user) {
        const userProfile = mapUserToProfile(data.session.user);
        
        // Get user roles if available
        const roles = userProfile.roles || [];
        
        set({ 
          user: userProfile,
          profile: userProfile,
          isAuthenticated: true,
          status: AUTH_STATUS.AUTHENTICATED,
          roles,
          initialized: true
        });
      } else {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          status: AUTH_STATUS.UNAUTHENTICATED,
          initialized: true
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error : new Error('Unknown error during initialization'),
        status: AUTH_STATUS.ERROR,
        initialized: true
      });
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const { user } = get();
      
      if (!user) {
        throw new Error('No user logged in');
      }
      
      const { error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          ...profileData.user_metadata
        }
      });
      
      if (error) throw error;
      
      // Update local state
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
