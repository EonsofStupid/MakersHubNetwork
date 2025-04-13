
import { UserProfile } from '@/shared/types/shared.types';
import { authBridge as authBridgeInstance } from './lib/AuthBridgeImpl';

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

/**
 * Export the auth bridge as a singleton
 * This provides a consistent interface for components to interact with auth functionality
 */
export const authBridge: AuthBridge = authBridgeInstance;
