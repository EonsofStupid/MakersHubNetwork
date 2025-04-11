
import { User, UserRole } from '@/shared/types/auth.types';

export type AuthEventType = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'PASSWORD_RECOVERY';

export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

export interface AuthBridgeImplementation {
  user: User | null;
  status: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  signIn: (email: string, password: string) => Promise<null>;
  signInWithGoogle: () => Promise<null>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  signOut: () => Promise<void>;
  linkSocialAccount: (provider: string) => Promise<void>;
}

export const AuthBridge: AuthBridgeImplementation = {
  user: null,
  status: {
    isAuthenticated: false,
    isLoading: true,
  },
  signIn: async () => null,
  signInWithGoogle: async () => null,
  logout: async () => {},
  hasRole: () => false,
  isAdmin: () => false,
  isSuperAdmin: () => false,
  signOut: async () => {},
  linkSocialAccount: async () => {},
};

// Export for use in application
export const authBridge = AuthBridge;
