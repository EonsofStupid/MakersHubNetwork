
import { UserRole } from "@/shared/types/shared.types";

// Auth status enum
export enum AuthStatus {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR'
}

// User profile interface
export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  theme_preference?: string;
  role_ids: string[];
  created_at: string;
  updated_at: string;
  motion_enabled: boolean;
  verified: boolean;
}

// Auth state interface
export interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  roles: UserRole[];
  error: string | null;
  initialized: boolean;
}
