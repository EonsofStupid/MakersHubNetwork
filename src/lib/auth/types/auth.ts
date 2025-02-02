export interface SessionConfig {
  refreshInterval: number;
  sessionTimeout: number;
  storageKey: string;
  onSessionExpired?: () => void;
  onRefreshError?: (error: Error) => void;
}

export interface SessionState {
  isAuthenticated: boolean;
  lastActivity: Date;
  token?: string;
}

export type SessionEventType = 'mousedown' | 'keydown' | 'touchstart' | 'scroll';

export interface AuthState {
  isLoading: boolean;
  hasAccess: boolean;
  error: Error | { message: string } | null;
  isTransitioning?: boolean;
}

export interface AuthUser {
  id: string;
  email?: string | null;
  role?: string;
  username?: string;
  displayName?: string;
  user_metadata?: {
    avatar_url?: string;
    [key: string]: any;
  };
}

export interface AuthSession {
  user: AuthUser;
  expires_at?: number;
}

export interface AuthStore {
  session: AuthSession | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  isOffline: boolean;
  setSession: (session: AuthSession | null) => void;
  setUser: (user: AuthUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: Error | null) => void;
  setOffline: (isOffline: boolean) => void;
  signOut: () => Promise<void>;
  reset: () => void;
}