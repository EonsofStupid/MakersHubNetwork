
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  AuthStore, AuthStatus, UserProfile, UserRole 
} from '@/types/auth.unified';

// Create the auth context
const AuthContext = createContext<AuthStore | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.INITIAL);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [roles, setRoles] = useState<UserRole[]>([]);
  
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // In a real implementation, you would check for an existing session here
        // For now, just set as unauthenticated
        setStatus(AuthStatus.UNAUTHENTICATED);
        setUser(null);
        setRoles([]);
      } catch (err) {
        setStatus(AuthStatus.ERROR);
        setError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);
  
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
        roles: ['user']
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
        roles: ['user']
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
    login,
    logout,
    register,
    resetPassword
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
