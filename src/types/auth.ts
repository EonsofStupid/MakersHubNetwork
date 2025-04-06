
// Re-export types from the unified auth types file
export type {
  UserRole,
  AdminAccess,
  UserProfile,
  AuthStatus,
  AuthState,
  AuthActions,
  AuthStore,
  WithAdminAccess
} from '@/types/auth.unified';

// Additional auth-related types can be defined here
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}
