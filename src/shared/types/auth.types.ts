
// Define auth-specific types
import { User, UserMetadata, UserAppMetadata, UserProfile, UserRole, AuthStatus, Permission } from "./shared.types";

export type { User, UserMetadata, UserAppMetadata, UserProfile, UserRole, AuthStatus, Permission };

// Auth event types
export type AuthEventType = 
  | 'AUTH_SIGNED_IN'
  | 'AUTH_SIGNED_OUT'
  | 'AUTH_STATE_CHANGED'
  | 'AUTH_PROFILE_UPDATED'
  | 'AUTH_SESSION_REFRESHED'
  | 'AUTH_USER_UPDATED'
  | 'AUTH_LINKING_REQUIRED'
  | 'AUTH_ERROR';

export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

export type AuthEventHandler = (event: AuthEvent) => void;

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  status: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  roles: UserRole[];
  permissions: Permission[];
}
