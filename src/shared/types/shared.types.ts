
// Auth types
export const AUTH_STATUS = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  IDLE: 'IDLE',
  ERROR: 'ERROR'
} as const;

export type AuthStatus = keyof typeof AUTH_STATUS;

// RBAC types
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  BUILDER: 'BUILDER',
  USER: 'USER',
  GUEST: 'GUEST'
} as const;

export type UserRole = keyof typeof ROLES;

// User profile type
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  roles: UserRole[];
}

// Theme types
export enum ThemeEffectType {
  NONE = 'none',
  CYBER = 'cyber',
  NEON = 'neon',
  ELECTRIC = 'electric',
  GLITCH = 'glitch',
  SYNTHWAVE = 'synthwave',
  HOLOGRAM = 'hologram'
}

// Logging types
export enum LogCategory {
  APP = 'app',
  ADMIN = 'admin',
  AUTH = 'auth',
  API = 'api',
  UI = 'ui',
  PERFORMANCE = 'performance',
  ERROR = 'error',
  SECURITY = 'security'
}

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}
