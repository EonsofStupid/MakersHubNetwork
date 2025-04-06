
// Define the user roles
export type UserRole = 'admin' | 'super_admin' | 'maker' | 'builder' | 'moderator' | 'editor' | 'user';

export interface UserRoles {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export enum AuthStatus {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

export interface User {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  roles?: UserRole[];
}

export interface Session {
  id: string;
  user_id: string;
  expires_at: number;
  created_at: string;
}

// Define AuthEvent interface with string index signature
export interface AuthEvent extends Record<string, unknown> {
  type: string;
  payload?: Record<string, unknown>;
}
