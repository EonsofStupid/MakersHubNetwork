
import { User, Session } from '@supabase/supabase-js';

// Define the user role type
export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'maker'
  | 'builder'
  | 'user'
  | 'moderator'
  | 'editor'
  | 'service'; // Special role for SSR

// Define the authentication state
export interface AuthState {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

// Define the authentication context
export interface AuthContext {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}
