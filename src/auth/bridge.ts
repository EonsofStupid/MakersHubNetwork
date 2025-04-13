
import { UserProfile } from '@/shared/types/SharedTypes';
import { AuthBridgeImpl } from './lib/AuthBridgeImpl';
import { useAuthStore } from './store/auth.store';

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
  
  // Password management
  resetPassword: (email: string) => Promise<void>;
  
  // User profile
  getUserProfile: (userId?: string) => Promise<UserProfile | null>;
}

// Create a singleton instance of the auth bridge
const authBridgeInstance = new AuthBridgeImpl();

/**
 * Export the auth bridge as a singleton
 * This provides a consistent interface for components to interact with auth functionality
 */
export const authBridge: AuthBridge = {
  ...authBridgeInstance,
  
  // Additional methods with store integration
  getCurrentSession: () => authBridgeInstance.getCurrentSession(),
  getUserProfile: (userId?: string) => authBridgeInstance.getUserProfile(userId || useAuthStore.getState().user?.id || '')
};
