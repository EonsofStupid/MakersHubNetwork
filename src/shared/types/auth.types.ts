
import { UserRole } from "@/shared/types/shared.types";

// Authentication status type
export enum AuthStatus {
  AUTHENTICATED = 'AUTHENTICATED',
  LOADING = 'LOADING',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR',
  IDLE = 'IDLE'
}
export type AuthStatusType = keyof typeof AuthStatus;

// Basic user profile type
export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  roles: UserRole[];
  location?: string;
  website?: string;
  bio?: string;
  theme_preference?: string;
  is_active?: boolean;
  last_login?: string;
  user_metadata?: Record<string, any>;
  social_links?: Record<string, string>;
  preferences?: Record<string, any>;
}

// User from auth provider
export interface User {
  id: string;
  email: string;
  user_metadata: Record<string, any>;
  app_metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  confirmed_at?: string | null;
}

// Auth state interface
export interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;
  roles: UserRole[];
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasAdminAccess: boolean;
  
  // Auth actions
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
  initialUser?: UserProfile | null;
}
