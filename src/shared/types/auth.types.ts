
import { UserRole } from './shared.types';
import { AuthStatus } from './shared.types';
import { Session, User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  display_name?: string;
  bio?: string;
  roles?: UserRole[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;
  session: Session | null;
  error: string | null;
  isReady: boolean;
}

export interface UseAuthResult {
  user: UserProfile | null;
  status: AuthStatus;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface HasRoleOptions {
  requireAll?: boolean;
}

export interface UseHasRoleResult {
  hasRole: (role: UserRole | UserRole[], options?: HasRoleOptions) => boolean;
  hasPermission: (permission: string | string[], options?: HasRoleOptions) => boolean;
  isAdmin: boolean;
  isModerator: boolean;
  isSuperAdmin: boolean;
}

export interface UseAdminAuthResult {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
