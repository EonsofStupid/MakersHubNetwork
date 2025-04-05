
import { createContext } from 'react';
import { AuthUser } from '../types/auth.types';
import { Session } from '@supabase/supabase-js';

export interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
}

// Create the context with default values
export const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null
});

