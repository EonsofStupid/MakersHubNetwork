import { User, UserProfile, UserRole, AuthEvent, AuthEventType } from '@/shared/types/SharedTypes';

// Session type
export interface AuthSession {
  id: string;
  user_id: string;
  created_at: string;
  expires_at?: string;
  last_active_at?: string;
}

// Auth state type
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  roles: UserRole[];
  error: string | null;
}

// Auth Bridge Interface
export interface AuthBridge {
  // Session management
  getCurrentSession: () => Promise<AuthSession | null>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
  refreshSession: () => Promise<AuthSession | null>;
  
  // Authentication methods
  signInWithEmail: (email: string, password: string) => Promise<{ 
    user: User | null; 
    session: AuthSession | null; 
    error: Error | null 
  }>;
  signInWithOAuth: (provider: 'google' | 'github' | 'facebook') => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ 
    user: User | null; 
    session: AuthSession | null; 
    error: Error | null 
  }>;
  signOut: () => Promise<void>;
  
  // User management
  updateUserProfile: (profile: Partial<UserProfile> & { id: string }) => Promise<UserProfile | null>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
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