
import { UserProfile } from '@/shared/types/shared.types';
import { AuthBridge } from '@/bridges/AuthBridge';

/**
 * Re-export the AuthBridge from the bridges folder
 */
export { AuthBridge };

/**
 * AuthBridge interface
 * Provides a clean abstraction layer for authentication functionality
 */
export interface IAuthBridge {
  // Session management
  getCurrentSession: () => Promise<{ user: UserProfile } | null>;
  refreshSession: () => Promise<{ user_id: string } | null>;
  
  // Authentication methods
  signInWithEmail: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signOut: () => Promise<void>;
  
  // Account linking
  onAuthEvent: (callback: (event: any) => void) => { unsubscribe: () => void };
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  
  // User profile
  getUser: () => UserProfile | null;
  getProfile: () => UserProfile | null;
}
