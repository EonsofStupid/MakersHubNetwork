
import { Session, User } from "@supabase/supabase-js";
import { UserRole as BaseUserRole } from "./roles";

// Use the base role type from roles.ts
export type UserRole = BaseUserRole;

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}

export type AuthUser = User;

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  roles: UserRole[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  status: AuthStatus;
  initialized?: boolean;
}

export interface AdminAccess {
  isAdmin: boolean;
  hasAdminAccess: boolean;
}

export interface WithAdminAccess {
  hasAdminAccess: boolean;
}
