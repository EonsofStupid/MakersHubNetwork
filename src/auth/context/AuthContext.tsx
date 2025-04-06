
import { createContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthStatus } from '../store/auth.store';

export interface AuthContextState {
  user: User | null;
  session: Session | null;
  status: AuthStatus;
}

// Default context value
export const AuthContext = createContext<AuthContextState>({
  user: null,
  session: null,
  status: 'idle',
});
