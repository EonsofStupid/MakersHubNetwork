
import { createContext } from 'react';
import { User, UserProfile } from '@/shared/types/user';
import { AuthStatus, UserRole } from '@/shared/types/shared.types';

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  status: AuthStatus;
  error: string | null;
  roles: UserRole[];
  signIn: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  status: 'loading',
  error: null,
  roles: [],
  signIn: async () => null,
  signOut: async () => {},
  isAdmin: false,
  isSuperAdmin: false,
});
