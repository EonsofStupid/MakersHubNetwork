
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, AuthActions, AuthStatus, UserRole, UserProfile, AuthStore } from '@/types/auth.unified';

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  roles: [],
  isLoading: false,
  error: null,
  status: AuthStatus.IDLE,
  initialized: false,
  isAuthenticated: false
};

// Create store with persist middleware
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // State setters
      setUser: (user) => {
        set({ 
          user,
          isAuthenticated: !!user
        });
      },
      
      setSession: (session) => {
        set({ 
          session,
          isAuthenticated: !!session
        });
      },
      
      setRoles: (roles) => {
        set({ roles });
      },
      
      setError: (error) => {
        set({ 
          error: typeof error === 'string' ? new Error(error) : error 
        });
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      setInitialized: (initialized) => {
        set({ initialized });
      },
      
      setStatus: (status) => {
        set({ status });
      },
      
      // Helper methods
      hasRole: (role) => {
        return get().roles.includes(role);
      },
      
      isAdmin: () => {
        return get().roles.includes('admin' as UserRole) || 
               get().roles.includes('super_admin' as UserRole);
      },
      
      // Initialize auth state
      initialize: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // For now, just mock initialization
          set({ 
            user: null,
            session: null,
            roles: [],
            status: AuthStatus.UNAUTHENTICATED,
            isLoading: false,
            initialized: true,
            isAuthenticated: false
          });
          
          return Promise.resolve();
        } catch (error: unknown) {
          const errorObj = error instanceof Error ? error : new Error('Unknown authentication error');
          set({ 
            error: errorObj,
            status: AuthStatus.UNAUTHENTICATED,
            isLoading: false,
            initialized: true,
            isAuthenticated: false
          });
          return Promise.reject(error);
        }
      },
      
      // Login function
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Mock login
          const mockUser: UserProfile = {
            id: '123',
            email,
            username: email.split('@')[0],
            roles: ['user'],
            user_metadata: {
              full_name: email.split('@')[0],
              avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
            }
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
          const errorObj = err instanceof Error ? err : new Error('Login failed');
          set({
            status: AuthStatus.ERROR,
            error: errorObj,
            isLoading: false
          });
          return Promise.reject(err);
        }
      },
      
      // Logout function
      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Reset state
          set({ 
            ...initialState,
            initialized: true,
            status: AuthStatus.UNAUTHENTICATED,
            isLoading: false
          });
          
          return Promise.resolve();
        } catch (err) {
          const errorObj = err instanceof Error ? err : new Error('Logout failed');
          set({ 
            error: errorObj,
            isLoading: false
          });
          return Promise.reject(err);
        }
      },
      
      // Register function
      register: async (email: string, password: string, username?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Mock registration
          const mockUser: UserProfile = {
            id: '123',
            email,
            username: username || email.split('@')[0],
            roles: ['user'],
            user_metadata: {
              full_name: username || email.split('@')[0],
              avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
            }
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
          const errorObj = err instanceof Error ? err : new Error('Registration failed');
          set({
            status: AuthStatus.ERROR,
            error: errorObj,
            isLoading: false
          });
          return Promise.reject(err);
        }
      },
      
      // Reset password function
      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Mock password reset
          console.log(`Password reset email sent to ${email}`);
          
          set({ isLoading: false });
          
          return Promise.resolve();
        } catch (err) {
          const errorObj = err instanceof Error ? err : new Error('Password reset failed');
          set({
            error: errorObj,
            isLoading: false
          });
          return Promise.reject(err);
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Export types for components
export { AuthStatus };
