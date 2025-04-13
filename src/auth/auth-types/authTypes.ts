import { UserRoleType, UserRoleEnum, AuthStatus } from '@/shared/types/SharedTypes';
import { AuthPermissionValue } from '@/auth/constants/permissions';

// Auth Event Types
export interface AuthEvent {
  type: string;
  timestamp: string;
  userId?: string;
  details?: Record<string, unknown>;
}

// Auth State Types
export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  error: string | null;
  isLoading: boolean;
}

// Auth User Types
export interface AuthUser {
  id: string;
  email: string;
  roles: UserRoleType[];
  permissions: AuthPermissionValue[];
  metadata: Record<string, unknown>;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Session Types
export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
  refreshToken?: string;
}

// Auth Provider Types
export interface AuthProvider {
  id: string;
  name: string;
  type: 'oauth' | 'credentials' | 'magic-link';
  config: Record<string, unknown>;
}

// Auth Error Types
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Auth Hook Types
export interface UseAuthReturn {
  user: AuthUser | null;
  status: AuthStatus;
  error: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

// Auth Form Types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

// Auth Config Types
export interface AuthConfig {
  providers: AuthProvider[];
  session: {
    maxAge: number;
    updateAge: number;
  };
  pages: {
    login: string;
    register: string;
    error: string;
    verifyRequest: string;
  };
  callbacks: {
    signIn?: (user: AuthUser) => Promise<boolean>;
    session?: (session: AuthSession) => Promise<AuthSession>;
    jwt?: (token: string) => Promise<string>;
  };
} 