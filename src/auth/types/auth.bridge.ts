
import { User, UserProfile, UserRole, AuthEvent, AuthEventType } from '@/shared/types/shared.types';

export interface AuthBridge {
  // Session management
  getCurrentSession: () => Promise<any | null>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
  
  // Authentication methods
  signInWithEmail: (email: string, password: string) => Promise<{ 
    user: User | null; 
    session: any | null; 
    error: Error | null 
  }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ 
    user: User | null; 
    session: any | null; 
    error: Error | null 
  }>;
  signOut: () => Promise<void>;
  
  // User management
  updateUserProfile: (profile: Partial<UserProfile> & { id: string }) => Promise<UserProfile | null>;
  updatePassword: (password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  
  // Auth state
  subscribeToAuthEvents: (callback: (event: AuthEvent) => void) => () => void;
  
  // Role checking
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  
  // Account linking
  linkAccount: (provider: string) => Promise<void>;
  unlinkAccount: (provider: string) => Promise<void>;
  getLinkedAccounts: () => Promise<string[]>;
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: UserRole[];
  error: string | null;
};
