
import { UserProfile } from '@/shared/types/shared.types';

/**
 * AuthBridge interface
 * Provides a clean abstraction layer for authentication functionality
 */
export interface AuthBridge {
  // Session management
  getCurrentSession: () => Promise<{ user: UserProfile } | null>;
  refreshSession: () => Promise<{ user_id: string } | null>;
  
  // Authentication methods
  signInWithEmail: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signOut: () => Promise<void>;
  signInWithOAuth: (provider: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  
  // Account linking
  linkAccount: (provider: string) => Promise<boolean>;
  onAuthEvent: (callback: (event: any) => void) => { unsubscribe: () => void };
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  
  // User profile
  getUserProfile: (userId?: string) => Promise<UserProfile | null>;
}
