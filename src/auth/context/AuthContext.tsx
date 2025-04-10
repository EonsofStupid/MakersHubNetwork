
/**
 * auth/context/AuthContext.tsx
 * 
 * React context for auth state
 */

import { User } from '@supabase/supabase-js';
import { createContext } from 'react';
import { UserProfile } from '@/auth/store/auth.store';
import { AuthStatus } from '@/auth/types/auth.types';

interface AuthContextState {
  user: User | null;
  session: any | null;
  profile: UserProfile | null;
  status: AuthStatus;
}

export const AuthContext = createContext<AuthContextState>({
  user: null,
  session: null,
  profile: null,
  status: 'idle',
});
