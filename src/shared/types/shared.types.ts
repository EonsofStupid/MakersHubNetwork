
// Core shared types

// Auth status enum
export enum AUTH_STATUS {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED'
}

// User role enum
export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  BUILDER = 'BUILDER',
  MODERATOR = 'MODERATOR'
}

export type UserRole = keyof typeof ROLES;

// Log level and category
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  DEBUG = 'debug'
}

export enum LogCategory {
  AUTH = 'auth',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  THEME = 'theme',
  ADMIN = 'admin'
}

// Log details interface
export interface ThemeLogDetails {
  theme?: string;
  cssVarsCount?: number;
  error?: string;
  [key: string]: any;
}

export interface LogDetails {
  [key: string]: any;
}

// Build status for 3D printer builds
export enum BuildStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED', 
  REJECTED = 'REJECTED',
  IN_REVIEW = 'IN_REVIEW'
}

export interface AuthStatus {
  LOADING: 'LOADING';
  AUTHENTICATED: 'AUTHENTICATED';
  UNAUTHENTICATED: 'UNAUTHENTICATED';
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Re-export from shared.types.ts for backward compatibility
export type { UserRole as UserRoleType };
