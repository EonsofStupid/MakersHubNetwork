
import { AuthUser, Session } from "@supabase/supabase-js";

// User roles in the system
export type UserRole = 'user' | 'admin' | 'super_admin' | 'moderator' | 'editor';

// Authentication status
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

// Authentication state
export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  roles: UserRole[];
  status: AuthStatus;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
}

// User profile data
export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  roles?: UserRole[];
  email?: string;
  created_at?: string;
  updated_at?: string;
}

// Permission type
export type Permission = string;

// Role with associated permissions
export interface RoleWithPermissions {
  role: UserRole;
  permissions: Permission[];
}
