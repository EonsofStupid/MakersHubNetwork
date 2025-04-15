
import { BaseEntity } from './common.types';

export const AUTH_STATUS = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  IDLE: 'IDLE',
  ERROR: 'ERROR'
} as const;

export type AuthStatus = keyof typeof AUTH_STATUS;
export type AuthEventType = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';

export interface UserProfile extends BaseEntity {
  email: string;
  name?: string;
  avatar_url?: string;
  roles?: UserRole[];
  bio?: string;
  last_sign_in_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    website?: string;
    [key: string]: any;
  };
  app_metadata?: {
    roles?: UserRole[];
    [key: string]: any;
  };
}

// RBAC types
export const ROLES = {
  super_admin: 'super_admin',
  admin: 'admin',
  moderator: 'moderator',
  builder: 'builder',
  user: 'user',
  guest: 'guest'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
export type Permission = string;
