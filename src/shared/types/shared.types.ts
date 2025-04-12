
import { LogLevel, LOG_LEVEL_VALUES } from "@/logging/constants/log-level";
import { LogCategory } from "@/logging/constants/log-category";

// User related types
export enum UserRole {
  USER = 'user',
  BUILDER = 'builder',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  app_metadata?: {
    roles?: UserRole[];
    [key: string]: any;
  };
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  preferences?: Record<string, any>;
}

// Auth related types
export enum AuthStatus {
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  ERROR = 'ERROR'
}

export enum AuthEventType {
  AUTH_STATE_CHANGE = 'AUTH_STATE_CHANGE',
  USER_UPDATED = 'USER_UPDATED',
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  USER_DELETED = 'USER_DELETED'
}

export interface AuthEvent {
  type: AuthEventType;
  session?: any;
  user?: User | null;
}

// Theme related types
export interface Theme {
  name: string;
  label: string;
  colors: Record<string, string>;
  variables: Record<string, string>;
}

export interface ComponentTokens {
  [component: string]: Record<string, string>;
}

// Re-export logging types
export { LogLevel, LogCategory, LOG_LEVEL_VALUES };

// Add any other shared types here
