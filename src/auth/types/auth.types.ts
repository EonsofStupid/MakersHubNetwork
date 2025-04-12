
import { User, UserRole, UserProfile, AuthStatus, AuthEvent, AuthEventType } from "@/shared/types/shared.types";

export interface AuthState {
  status: AuthStatus;
  user: User | null;
  session: any | null;
  profile: UserProfile | null;
  roles: UserRole[];
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

export interface AuthBridge {
  subscribeToAuthEvents(callback: (event: AuthEvent) => void): () => void;
  getCurrentSession(): Promise<any | null>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  signInWithEmail(email: string, password: string): Promise<{ user: User | null; session: any | null; error: Error | null }>;
  signUp(email: string, password: string): Promise<{ user: User | null; session: any | null; error: Error | null }>;
  signOut(): Promise<void>;
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null>;
  hasRole(role: UserRole | UserRole[]): boolean;
}

// Re-export for compatibility
export { AuthStatus, AuthEvent, AuthEventType, User, UserProfile, UserRole };
