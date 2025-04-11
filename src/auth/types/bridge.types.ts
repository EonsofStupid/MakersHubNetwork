
import { User } from '@/shared/types/user';
import { UserRole } from '@/shared/types/shared.types';

export type AuthEventType = 
  | 'SIGNED_IN' 
  | 'SIGNED_OUT' 
  | 'USER_UPDATED' 
  | 'PASSWORD_RECOVERY'
  | 'PROFILE_FETCHED';

export interface AuthEvent {
  type: AuthEventType;
  payload?: any;
}

export interface AuthBridgeImplementation {
  user: User | null;
  status: {
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  signIn(email: string, password: string): Promise<User | null>;
  signInWithGoogle(): Promise<User | null>;
  logout(): Promise<boolean>;
  getUser(): User | null;
  hasRole(role: UserRole | UserRole[]): boolean;
  isAdmin(): boolean;
  isSuperAdmin(): boolean;
}

export interface AuthBridge {
  authBridge: AuthBridgeImplementation;
}
