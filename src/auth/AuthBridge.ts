import { AuthBridgeImpl } from './lib/AuthBridgeImpl';
import { UserProfile, UserRole } from '@/shared/types/SharedTypes';

// Create a singleton instance of the auth bridge
export const authBridge = new AuthBridgeImpl();

// Export the bridge interface type
export interface AuthBridge {
  signInWithEmail: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ user: UserProfile | null; error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshSession: () => Promise<{ user_id: string } | null>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
} 