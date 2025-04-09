
import React, { createContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthStatus } from '../store/auth.store';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  status: AuthStatus;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  status: 'idle'
});

// No provider implementation here - the provider is implemented in AuthProvider.tsx
