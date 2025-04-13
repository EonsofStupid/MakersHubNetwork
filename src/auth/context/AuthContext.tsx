
import { createContext } from 'react';
import { UserProfile } from '@/shared/types/shared.types';
import { AuthStatus } from '@/shared/types/shared.types';

interface AuthContextState {
  user: UserProfile | null;
  session: any | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextState>({
  user: null,
  session: null,
  status: AuthStatus.IDLE,
  isAuthenticated: false,
  error: null
});
