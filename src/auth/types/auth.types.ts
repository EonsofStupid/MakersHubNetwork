
/**
 * Auth module specific types
 */

import { User, UserRole } from '@/shared/types';

export interface AuthContextType {
  user: User | null;
  status: string;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}
