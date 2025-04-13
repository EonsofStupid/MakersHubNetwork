
import { UserProfile, UserRole } from '@/shared/types/SharedTypes';
import { AuthBridgeImpl } from './lib/AuthBridgeImpl';

// Export the bridge interface type
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
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
}

// Create a singleton instance of the auth bridge
export const authBridge = new AuthBridgeImpl();
