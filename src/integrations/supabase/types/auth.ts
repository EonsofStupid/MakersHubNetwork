import type { Session } from '@supabase/supabase-js';

export type UserRole = 'subscriber' | 'maker' | 'admin' | 'super_admin';

export interface AuthUser {
  id: string;
  email?: string | null;
  role?: UserRole;
  username?: string;
  displayName?: string;
}

export interface AuthSession {
  user: AuthUser;
  expires_at?: number;
}

export interface AuthState {
  isLoading: boolean;
  hasAccess: boolean;
  error: Error | { message: string } | null;
}

export interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: UserRole | UserRole[];
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
  onError?: (error: Error | { message: string }) => void;
}

export interface RoleHierarchy {
  [key: string]: number;
}

export interface PinLoginResponse {
  success: boolean;
  message: string;
  locked_until?: string;
  attempts_remaining?: number;
}

export interface PinSetupResponse {
  success: boolean;
  message: string;
}

export interface Profile {
  id: string;
  username?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  role?: UserRole;
}