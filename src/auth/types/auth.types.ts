
import { Session, User } from "@supabase/supabase-js";

export type UserRole = 'super_admin' | 'admin' | 'maker' | 'builder';

export interface UserProfile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
  roles?: UserRole[];
}

export interface AuthUser extends User {
  profile?: UserProfile;
  roles?: UserRole[];
}

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  profile: UserProfile | null;
  roles: UserRole[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  status: AuthStatus;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshSession: () => Promise<void>;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  username?: string;
  full_name?: string;
}
