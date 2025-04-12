
import { AuthEvent, AuthStatus, User, UserProfile, UserRole } from '@/shared/types/shared.types';

// Auth Bridge Interface
export interface AuthBridgeImpl {
  getSession(): Promise<any>;
  getUser(): User | null;
  getStatus(): AuthStatus;
  isAuthenticated(): boolean;
  signInWithEmail(email: string, password: string): Promise<void>;
  signInWithGoogle(): Promise<void>;
  linkSocialAccount(provider: string): Promise<void>;
  logout(): Promise<void>;
  hasRole(role: UserRole | UserRole[]): boolean;
  isAdmin(): boolean;
  isSuperAdmin(): boolean;
  updateUserProfile(profile: Partial<UserProfile>): Promise<void>;
  subscribeToEvent(subscriber: (event: AuthEvent) => void): () => void;
  onAuthEvent(event: AuthEvent): void;
}

// Auth Store Interface
export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  status: AuthStatus;
  roles: UserRole[];
  error: Error | null;
  isAuthenticated: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
}
