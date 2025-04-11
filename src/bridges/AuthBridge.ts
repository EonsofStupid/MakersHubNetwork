
import { User, UserRole } from '@/shared/types/user';

export type AuthEventType = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'PASSWORD_RECOVERY' | 'PROFILE_FETCHED';

export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  social_links?: Record<string, string>;
  preferences?: Record<string, any>;
  roles?: UserRole[];
  created_at?: string;
  updated_at?: string;
}

export interface AuthBridgeImplementation {
  user: User | null;
  profile: UserProfile | null;
  status: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  signIn: (email: string, password: string) => Promise<null>;
  signInWithGoogle: () => Promise<null>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[] | undefined) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  signOut: () => Promise<void>;
  linkSocialAccount: (provider: string) => Promise<void>;
  // Add missing methods
  getUser: () => User | null;
  getStatus: () => { isAuthenticated: boolean; isLoading: boolean };
  subscribeToAuthEvents: (callback: (user: User | null) => void) => () => void;
  publishAuthEvent: (event: AuthEvent) => void;
}

export const AuthBridge: AuthBridgeImplementation = {
  user: null,
  profile: null,
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
  // Implement missing methods
  getUser: () => null,
  getStatus: () => ({ isAuthenticated: false, isLoading: false }),
  subscribeToAuthEvents: () => () => {},
  publishAuthEvent: () => {}
};

// Export for use in application
export const authBridge = AuthBridge;
