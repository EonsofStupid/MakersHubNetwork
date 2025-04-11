
import { User, UserProfile, UserRole } from './user';

// Auth related types for interfaces across the application
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Re-export User, UserProfile, UserRole for convenience
export { User, UserProfile, UserRole };

// Auth event type
export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

// Auth event types
export type AuthEventType = 
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'USER_UPDATED'
  | 'PASSWORD_RECOVERY'
  | 'PROFILE_FETCHED';

// User metadata
export interface UserMetadata {
  name?: string;
  full_name?: string;
  avatar_url?: string;
  [key: string]: any;
}

// User app metadata
export interface UserAppMetadata {
  roles?: string[];
  [key: string]: any;
}
