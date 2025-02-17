export type UserRole = 'user' | 'admin' | 'super_admin';

export interface AuthUser {
  id: string;
  email: string;
  roles: UserRole[];
  profile?: {
    name?: string;
    avatar?: string;
  };
}

export interface AuthSession {
  user: AuthUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  error: string | null;
  isLoading: boolean;
} 