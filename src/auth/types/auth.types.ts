
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/shared';
import { UserProfile } from '@/auth/store/auth.store';

// Auth status types
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

// Auth context interface
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  status: AuthStatus;
}

// Auth state interface
export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}
