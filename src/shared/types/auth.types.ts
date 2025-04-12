
import { UserRole, AuthStatus } from './shared.types';
import { UserProfile } from './shared.types';

export interface UserSession {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user: UserProfile;
}

export interface AuthState {
  user: UserProfile | null;
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
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  initialize: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
}
