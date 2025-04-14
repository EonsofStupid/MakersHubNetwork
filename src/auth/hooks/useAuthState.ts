
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { UserProfile, AuthStatus } from '@/shared/types/shared.types';

/**
 * Hook to access auth state with auto-initialization
 * Provides a simplified interface for components
 */
export const useAuthState = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  
  const {
    user,
    isAuthenticated,
    status,
    error,
    initialized,
    initialize,
    login,
    logout,
    signup
  } = useAuthStore();

  useEffect(() => {
    // Initialize auth if not already initialized
    if (!initialized) {
      initialize().finally(() => {
        setIsInitializing(false);
      });
    } else {
      setIsInitializing(false);
    }
  }, [initialize, initialized]);

  return {
    user,
    isAuthenticated,
    isAuthReady: initialized && !isInitializing,
    isLoading: status === AuthStatus.LOADING || isInitializing,
    error,
    login,
    logout,
    signup,
    status: status as AuthStatus
  };
};

export type AuthHookState = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isLoading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  status: AuthStatus;
};

export default useAuthState;
