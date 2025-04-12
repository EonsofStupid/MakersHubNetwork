
import { UserRole, AuthStatus } from './shared.types';

export interface UserSession {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user: User;
}

export interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  app_metadata?: {
    roles?: string[];
    [key: string]: any;
  };
}

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  error: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: UserRole[];
  isReady: boolean;
  initialized: boolean;
  
  // Methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, metadata?: any) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
}
