
import { UserProfile, AuthStatus } from '@/shared/types/shared.types';
import { authBridge as impl } from '@/auth/lib/AuthBridgeImpl';

/**
 * AuthBridge provides a clean abstraction over authentication functionality 
 * without exposing direct access to the underlying store or provider
 */
export const AuthBridge = impl;

// Export the authBridge as well for compatibility
export { impl as authBridge };

export interface IAuthBridge {
  // Status
  isAuthenticated: boolean;
  
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
  
  // Additional methods for compatibility with atoms
  getStatus?: () => AuthStatus;
  getError?: () => Error | null;
  isLoading?: boolean;
  isInitialized?: boolean;
}
