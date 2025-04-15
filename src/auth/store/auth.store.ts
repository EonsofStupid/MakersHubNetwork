
import { create } from 'zustand';
import { AUTH_STATUS } from '@/shared/types/shared.types';

interface UserData {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthState {
  status: typeof AUTH_STATUS[keyof typeof AUTH_STATUS];
  user: UserData | null;
  isAuthenticated: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  updateUser: (user: Partial<UserData>) => Promise<void>;
}

// Create the auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  status: AUTH_STATUS.LOADING,
  user: null,
  isAuthenticated: false,
  error: null,
  
  // Initialize auth
  initialize: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING });
      
      // For now, we'll just simulate a logged out state after a delay
      setTimeout(() => {
        set({
          status: AUTH_STATUS.UNAUTHENTICATED,
          user: null,
          isAuthenticated: false
        });
      }, 500);
      
    } catch (error) {
      set({
        status: AUTH_STATUS.UNAUTHENTICATED,
        user: null,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Failed to initialize auth'
      });
    }
  },
  
  // Login
  login: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING, error: null });
      
      // For now, we'll just simulate a logged in state after a delay
      setTimeout(() => {
        set({
          status: AUTH_STATUS.AUTHENTICATED,
          user: {
            id: '1',
            email,
            name: 'Test User',
            avatar_url: 'https://ui-avatars.com/api/?name=Test+User'
          },
          isAuthenticated: true
        });
      }, 500);
      
    } catch (error) {
      set({
        status: AUTH_STATUS.UNAUTHENTICATED,
        user: null,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Failed to login'
      });
    }
  },
  
  // Logout
  logout: async () => {
    try {
      set({ status: AUTH_STATUS.LOADING, error: null });
      
      // For now, we'll just simulate a logged out state after a delay
      setTimeout(() => {
        set({
          status: AUTH_STATUS.UNAUTHENTICATED,
          user: null,
          isAuthenticated: false
        });
      }, 500);
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to logout'
      });
    }
  },
  
  // Signup
  signup: async (email: string, password: string) => {
    try {
      set({ status: AUTH_STATUS.LOADING, error: null });
      
      // For now, we'll just simulate a signed up and logged in state after a delay
      setTimeout(() => {
        set({
          status: AUTH_STATUS.AUTHENTICATED,
          user: {
            id: '1',
            email,
            name: 'New User',
            avatar_url: 'https://ui-avatars.com/api/?name=New+User'
          },
          isAuthenticated: true
        });
      }, 500);
      
    } catch (error) {
      set({
        status: AUTH_STATUS.UNAUTHENTICATED,
        user: null,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Failed to signup'
      });
    }
  },
  
  // Update user
  updateUser: async (userData: Partial<UserData>) => {
    try {
      const currentUser = get().user;
      if (!currentUser) throw new Error('No user logged in');
      
      // Update user
      set({
        user: {
          ...currentUser,
          ...userData
        }
      });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update user'
      });
    }
  }
}));
