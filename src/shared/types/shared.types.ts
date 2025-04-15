
// Auth types
export const AUTH_STATUS = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  IDLE: 'IDLE',
  ERROR: 'ERROR'
} as const;

export type AuthStatus = keyof typeof AUTH_STATUS;
export type AuthEventType = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED';

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
  bio?: string;
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
}

// Theme types
export const ThemeEffectType = {
  NONE: 'NONE',
  CYBER: 'CYBER',
  NEON: 'NEON',
  ELECTRIC: 'ELECTRIC',
  GLITCH: 'GLITCH',
  SYNTHWAVE: 'SYNTHWAVE',
  HOLOGRAM: 'HOLOGRAM',
  BLUR: 'BLUR',
  MORPH: 'MORPH',
  NOISE: 'NOISE',
  GRADIENT: 'GRADIENT',
  PULSE: 'PULSE',
  PARTICLE: 'PARTICLE',
  GRAIN: 'GRAIN'
} as const;

export type ThemeEffectTypeValue = typeof ThemeEffectType[keyof typeof ThemeEffectType];

// Logging types
export const LogCategory = {
  APP: 'APP',
  ADMIN: 'ADMIN',
  AUTH: 'AUTH',
  API: 'API',
  UI: 'UI',
  PERFORMANCE: 'PERFORMANCE',
  ERROR: 'ERROR',
  SECURITY: 'SECURITY',
  THEME: 'THEME',
  RBAC: 'RBAC',
  SYSTEM: 'SYSTEM'
} as const;

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4
}

export interface ThemeLogDetails {
  theme?: string;
  error?: string;
  cssVarsCount?: number;
}

export type Permission = 'create' | 'read' | 'update' | 'delete' | 'admin';

// Theme types
export interface Theme {
  id: string;
  name: string;
  label?: string;
  description?: string;
  tokens?: ThemeToken[];
  components?: ThemeComponent[];
  isDark?: boolean;
  context?: string;
}

export interface ThemeToken {
  name?: string;
  token_name?: string;
  value?: string;
  token_value?: string;
  type?: string;
  keyframes?: string;
}

export interface ThemeComponent {
  name?: string;
  component_name?: string;
  styles?: Record<string, string>;
  tokens?: Record<string, string>;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
