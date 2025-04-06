
import { create } from 'zustand';
import { 
  AuthStore, AuthStatus, UserRole, UserProfile 
} from '@/types/auth.unified';

// Create auth store with Zustand
export const useAuthStore = create<AuthStore>((set) => ({
  status: AuthStatus.INITIAL,
  user: null,
  error: null,
  roles: [],
  isLoading: true,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    try {
      set({ status: AuthStatus.LOADING, isLoading: true });
      
      // Simulate login - would be replaced with actual auth service
      const mockUser: UserProfile = {
        id: '123',
        email,
        username: email.split('@')[0],
        roles: ['user']
      };
      
      set({
        user: mockUser,
        roles: mockUser.roles as UserRole[] || [],
        status: AuthStatus.AUTHENTICATED,
        isAuthenticated: true,
        error: null,
        isLoading: false
      });
      
      return Promise.resolve();
    } catch (err) {
      set({
        status: AuthStatus.ERROR,
        error: err instanceof Error ? err : new Error('Login failed'),
        isLoading: false
      });
      return Promise.reject(err);
    }
  },
  
  logout: async () => {
    try {
      set({ status: AuthStatus.LOADING, isLoading: true });
      
      // Simulate logout - would be replaced with actual auth service
      set({
        user: null,
        roles: [],
        status: AuthStatus.UNAUTHENTICATED,
        isAuthenticated: false,
        error: null,
        isLoading: false
      });
      
      return Promise.resolve();
    } catch (err) {
      set({
        status: AuthStatus.ERROR,
        error: err instanceof Error ? err : new Error('Logout failed'),
        isLoading: false
      });
      return Promise.reject(err);
    }
  },
  
  register: async (email: string, password: string, username?: string) => {
    try {
      set({ status: AuthStatus.LOADING, isLoading: true });
      
      // Simulate registration - would be replaced with actual auth service
      const mockUser: UserProfile = {
        id: '123',
        email,
        username: username || email.split('@')[0],
        roles: ['user']
      };
      
      set({
        user: mockUser,
        roles: mockUser.roles as UserRole[] || [],
        status: AuthStatus.AUTHENTICATED,
        isAuthenticated: true,
        error: null,
        isLoading: false
      });
      
      return Promise.resolve();
    } catch (err) {
      set({
        status: AuthStatus.ERROR,
        error: err instanceof Error ? err : new Error('Registration failed'),
        isLoading: false
      });
      return Promise.reject(err);
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      set({ status: AuthStatus.LOADING, isLoading: true });
      
      // Simulate password reset - would be replaced with actual auth service
      console.log(`Password reset email sent to ${email}`);
      
      set({ status: AuthStatus.UNAUTHENTICATED, isLoading: false });
      
      return Promise.resolve();
    } catch (err) {
      set({
        status: AuthStatus.ERROR,
        error: err instanceof Error ? err : new Error('Password reset failed'),
        isLoading: false
      });
      return Promise.reject(err);
    }
  }
}));
