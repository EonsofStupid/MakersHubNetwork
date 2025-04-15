
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth.store';
import { AUTH_STATUS, UserProfile, AuthStatus } from '@/shared/types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  status: AuthStatus;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  status: AUTH_STATUS.IDLE,
  error: null,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  resetPassword: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    status,
    login,
    logout,
    signup,
    resetPassword,
    initialize
  } = useAuthStore();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize auth store when the component mounts
    if (!initialized) {
      initialize().then(() => {
        setInitialized(true);
      });
    }
  }, [initialize, initialized]);

  // Provide the auth context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        status,
        error,
        login,
        logout,
        signup,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
