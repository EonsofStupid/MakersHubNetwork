
import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { AuthStatus, AuthStore } from '../types/auth.types';
import { subscribeToAuthEvents } from '../bridge';

// Create the auth context with proper typing
export const AuthContext = createContext<AuthStore>(useAuthStore.getState());

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuthStore();
  
  // Initialize auth when component mounts
  useEffect(() => {
    if (!auth.initialized) {
      auth.initialize();
    }
    
    // Setup module bridge for external components that need auth events
    const unsubLogout = subscribeToAuthEvents('logout', () => {
      // Any global logout cleanup can go here
    });
    
    return () => {
      unsubLogout();
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth throughout the app
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
