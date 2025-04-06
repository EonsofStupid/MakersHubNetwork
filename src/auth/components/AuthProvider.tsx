
import React, { useEffect } from 'react';
import { useAuthStore } from '@/auth/store/auth.store';
import { AuthContext } from '@/auth/context/AuthContext';
import { getLogger } from '@/logging';
import { LogCategory } from '@/logging';
import { UserRole } from '@/types/auth.unified';

const logger = getLogger('AuthProvider', LogCategory.AUTH);

interface AuthProviderProps {
  children: React.ReactNode;
  onAuthStateChange?: (authenticated: boolean) => void;
  redirectOnSignOut?: string;
}

export function AuthProvider({ children, onAuthStateChange }: AuthProviderProps) {
  const auth = useAuthStore();
  
  // Initialize auth when component mounts
  useEffect(() => {
    if (!auth.initialized && auth.initialize) {
      auth.initialize();
    }
  }, [auth]);
  
  // Listen for auth state changes
  useEffect(() => {
    logger.info('Auth provider mounted');
    
    // Mock auth state changes - this would be replaced with actual listener in real implementation
    
    // Call onAuthStateChange if provided
    if (onAuthStateChange) {
      onAuthStateChange(auth.isAuthenticated);
    }
    
    // No real cleanup needed for this mock implementation
    return () => {
      logger.info('Auth provider unmounted');
    };
  }, [onAuthStateChange, auth.isAuthenticated]);
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
