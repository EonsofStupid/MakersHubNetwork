
// Re-export types from the unified auth types file
export {
  UserRole,
  AdminAccess,
  UserProfile,
  AuthStatus,
  AuthState,
  AuthActions,
  AuthStore,
  WithAdminAccess
} from '@/types/auth.unified';

// Auth provider props
export interface AuthProviderProps {
  children: React.ReactNode;
}
