
import React, { createContext, ReactNode, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthStatus } from '../types/auth.types';
import { useAuthStore, selectUser, selectSession, selectStatus } from '../store/auth.store';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  status: AuthStatus;
}

// Create context with default values
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  status: 'idle'
});

// Create provider component that uses our Zustand store
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // Use selectors for efficient updates
  const user = useAuthStore(selectUser);
  const session = useAuthStore(selectSession);
  const status = useAuthStore(selectStatus);
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    session,
    status
  }), [user, session, status]);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
