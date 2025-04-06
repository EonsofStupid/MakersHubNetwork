
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  AuthStore, AuthStatus, UserProfile, UserRole 
} from '@/types/auth.unified';

// Create the auth context
export const AuthContext = createContext<AuthStore | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.INITIAL);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [session, setSession] = useState(null);
  
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // In a real implementation, you would check for an existing session here
        // For now, just set as unauthenticated
        setStatus(AuthStatus.UNAUTHENTICATED);
        setUser(null);
        setRoles([]);
        setInitialized(true);
      } catch (err) {
        setStatus(AuthStatus.ERROR);
        setError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  // Helper functions
  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  const isAdmin = (): boolean => {
    return roles.includes('admin' as UserRole) || roles.includes('super_admin' as UserRole);
  };
  
  const initialize = async (): Promise<void> => {
    try {
      setStatus(AuthStatus.LOADING);
      setIsLoading(true);
      
      // Mock initialization
      setStatus(AuthStatus.UNAUTHENTICATED);
      setUser(null);
      setRoles([]);
      setInitialized(true);
      
      return Promise.resolve();
    } catch (err) {
      setStatus(AuthStatus.ERROR);
      setError(err instanceof Error ? err : new Error('Initialization failed'));
      return Promise.reject(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setStatus(AuthStatus.LOADING);
      setIsLoading(true);
      
      // Simulate login - would be replaced with actual auth service
      const mockUser: UserProfile = {
        id: '123',
        email,
        username: email.split('@')[0],
        display_name: email.split('@')[0],
        roles: ['user'],
        user_metadata: {
          full_name: 'Test User',
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
          display_name: email.split('@')[0],
          bio: '',
          theme_preference: 'dark',
          motion_enabled: true
        }
      };
      
      setUser(mockUser);
      setRoles(mockUser.roles || []);
      setStatus(AuthStatus.AUTHENTICATED);
      
      return Promise.resolve();
    } catch (err) {
      setStatus(AuthStatus.ERROR);
      setError(err instanceof Error ? err : new Error('Login failed'));
      return Promise.reject(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setStatus(AuthStatus.LOADING);
      setIsLoading(true);
      
      // Simulate logout
      setUser(null);
      setRoles([]);
      setStatus(AuthStatus.UNAUTHENTICATED);
      
      return Promise.resolve();
    } catch (err) {
      setStatus(AuthStatus.ERROR);
      setError(err instanceof Error ? err : new Error('Logout failed'));
      return Promise.reject(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (email: string, password: string, username?: string): Promise<void> => {
    try {
      setStatus(AuthStatus.LOADING);
      setIsLoading(true);
      
      // Simulate registration - would be replaced with actual auth service
      const mockUser: UserProfile = {
        id: '123',
        email,
        username: username || email.split('@')[0],
        display_name: username || email.split('@')[0],
        roles: ['user'],
        user_metadata: {
          full_name: username || email.split('@')[0],
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
          display_name: username || email.split('@')[0],
          bio: '',
          theme_preference: 'dark',
          motion_enabled: true
        }
      };
      
      setUser(mockUser);
      setRoles(mockUser.roles || []);
      setStatus(AuthStatus.AUTHENTICATED);
      
      return Promise.resolve();
    } catch (err) {
      setStatus(AuthStatus.ERROR);
      setError(err instanceof Error ? err : new Error('Registration failed'));
      return Promise.reject(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setStatus(AuthStatus.LOADING);
      setIsLoading(true);
      
      // Simulate password reset - would be replaced with actual auth service
      console.log(`Password reset email sent to ${email}`);
      
      return Promise.resolve();
    } catch (err) {
      setStatus(AuthStatus.ERROR);
      setError(err instanceof Error ? err : new Error('Password reset failed'));
      return Promise.reject(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auth context value
  const value: AuthStore = {
    status,
    user,
    error,
    roles,
    isLoading,
    isAuthenticated: status === AuthStatus.AUTHENTICATED,
    session,
    initialized,
    login,
    logout,
    register,
    resetPassword,
    setUser: (user: UserProfile | null) => setUser(user),
    setSession: (session: any) => setSession(session),
    setRoles: (roles: UserRole[]) => setRoles(roles),
    setStatus: (status: AuthStatus) => setStatus(status),
    setError: (error: Error | string | null) => {
      if (typeof error === 'string') {
        setError(new Error(error));
      } else {
        setError(error);
      }
    },
    setLoading: (loading: boolean) => setIsLoading(loading),
    setInitialized: (init: boolean) => setInitialized(init),
    initialize,
    hasRole,
    isAdmin
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Auth hook
export function useAuth(): AuthStore {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
