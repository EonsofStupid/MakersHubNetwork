
// Core shared types

// Auth status enum
export enum AUTH_STATUS {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  IDLE = 'IDLE',
  ERROR = 'ERROR'
}

// User role enum
export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  BUILDER = 'BUILDER',
  MODERATOR = 'MODERATOR',
  GUEST = 'GUEST'
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
  ADMIN = 'admin',
  RBAC = 'rbac',
  APP = 'app',
  CHAT = 'chat'
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

export type AuthStatus = keyof typeof AUTH_STATUS;

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// User profile types
export interface UserData {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, any>;
  bio?: string;
  roles?: UserRole[];
}

export type UserProfile = UserData;

// Permission type
export type Permission = string;

// Theme effect types
export enum ThemeEffectType {
  NONE = 'NONE',
  CYBER = 'CYBER',
  GLITCH = 'GLITCH',
  NEON = 'NEON',
  MATRIX = 'MATRIX',
  BLUR = 'BLUR',
  MORPH = 'MORPH',
  GRAIN = 'GRAIN',
  NOISE = 'NOISE',
  GRADIENT = 'GRADIENT',
  PULSE = 'PULSE',
  PARTICLE = 'PARTICLE',
  GLOW = 'GLOW',
  SHADOW = 'SHADOW'
}

// Theme effect interface
export interface ThemeEffect {
  type: ThemeEffectType;
  intensity?: number;
  enabled: boolean;
}

// Auth event type
export enum AuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  USER_UPDATED = 'USER_UPDATED'
}

// Log event type
export interface LogEvent {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: LogDetails;
}

export interface LogEntry extends LogEvent {
  id: string;
}

// RBAC constants to use for role checks
export const RBAC = {
  ADMIN_ONLY: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  SUPER_ADMINS: [ROLES.SUPER_ADMIN],
  MODERATORS: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  BUILDERS: [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  AUTHENTICATED: [ROLES.USER, ROLES.BUILDER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN]
};
