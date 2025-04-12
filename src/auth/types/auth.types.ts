import { UserProfile } from '@/shared/types/auth-mapped.types';
import { AuthStatus, UserRole } from '@/shared/types/shared.types';

export interface AuthState {
  user: UserProfile | null;
  status: AuthStatus;
  error: Error | null;
  redirectTo: string | null;
}

export interface AuthEvent {
  type: 'SIGN_IN' | 'SIGN_OUT' | 'USER_UPDATED' | 'SESSION_EXPIRED' | 'ERROR';
  payload?: any;
  error?: Error;
}

export interface AuthBridgeImpl {
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  subscribeToAuthEvents: (callback: (event: AuthEvent) => void) => void;
  linkAccount: (provider: string) => Promise<void>;
  onAuthEvent: (callback: (event: AuthEvent) => void) => () => void;
}

export interface AuthBridgeOptions {
  onAuthStateChange?: (user: UserProfile | null) => void;
  storageKeyPrefix?: string;
}
