
// Re-export unified auth types to maintain compatibility
import {
  UserRole,
  AuthStatus,
  AuthState,
  AuthActions,
  AuthStore,
  AdminAccess,
  WithAdminAccess
} from '@/types/auth.unified';

export type {
  UserRole,
  AuthStatus,
  AuthState,
  AuthActions,
  AuthStore,
  AdminAccess,
  WithAdminAccess
};

// Additional auth types specific to auth module
import { Database } from "@/integrations/supabase/types";

// Auth user interface for app-specific user data
export interface AuthUser {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  primary_role_id: string | null;
  user_roles: Array<{
    id: string;
    role: UserRole;
  }>;
}

// Re-export for backward compatibility
export type { UserRole as AuthUserRole };
