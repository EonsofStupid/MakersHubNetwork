
import { AuthStatus, UserRole } from './shared.types';

export interface User {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
  app_metadata?: UserAppMetadata;
}

export interface UserMetadata {
  name?: string;
  full_name?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface UserAppMetadata {
  roles?: UserRole[];
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  roles?: UserRole[];
  created_at?: string;
  updated_at?: string;
}

// Auth related types
export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  status: AuthStatus;
  error: string | null;
}
