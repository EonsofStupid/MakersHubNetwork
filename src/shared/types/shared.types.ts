
/**
 * Shared type definitions for the entire application
 */

/**
 * Role definitions
 */
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superadmin',
  MODERATOR: 'moderator',
  BUILDER: 'builder',
  GUEST: 'guest',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

/**
 * Permission definitions
 */
export const PERMISSIONS = {
  // Access permissions
  ADMIN_ACCESS: 'admin:access',
  
  // Content management
  VIEW_CONTENT: 'content:view',
  CREATE_CONTENT: 'content:create',
  EDIT_CONTENT: 'content:edit',
  DELETE_CONTENT: 'content:delete',
  
  // User management
  VIEW_USERS: 'users:view',
  EDIT_USERS: 'users:edit',
  DELETE_USERS: 'users:delete',
  
  // System management
  SYSTEM_VIEW: 'system:view',
  SYSTEM_EDIT: 'system:edit',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // Super admin permission
  SUPER_ADMIN: 'super:admin',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * RBAC route policies
 */
export const RBAC_POLICIES: Record<string, UserRole[]> = {
  '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/users': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/roles': [ROLES.SUPER_ADMIN],
  '/admin/permissions': [ROLES.SUPER_ADMIN],
  '/admin/keys': [ROLES.SUPER_ADMIN],
  '/admin/analytics': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/create': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/edit': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/delete': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
};

/**
 * Auth status types
 */
export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error',
}

/**
 * User profile type
 */
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, unknown>;
}

/**
 * Log categories
 */
export enum LogCategory {
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  ADMIN = 'admin',
}

/**
 * Log levels
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Log entry type
 */
export interface LogEntry {
  level: LogLevel;
  category: LogCategory;
  message: string;
  timestamp: Date;
  source?: string;
  details?: Record<string, any>;
}

/**
 * Log event type
 */
export interface LogEvent {
  entry: LogEntry;
}

/**
 * Log filter type
 */
export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
}

/**
 * Log level values for comparison
 */
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.FATAL]: 5,
};

/**
 * Auth event types
 */
export enum AuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  USER_UPDATED = 'USER_UPDATED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
}

/**
 * Theme-related types
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  created_at?: string;
  updated_at?: string;
}

export interface DesignTokens {
  colors: ColorTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  effects: EffectTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
}

export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  'muted-foreground': string;
  popover: string;
  'popover-foreground': string;
  card: string;
  'card-foreground': string;
  border: string;
  input: string;
  ring: string;
}

export interface SpacingTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export interface TypographyTokens {
  fontFamily: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
}

export interface EffectTokens {
  blur: Record<string, string>;
  glow: Record<string, string>;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ComponentTokens {
  button: Record<string, string>;
  card: Record<string, string>;
  input: Record<string, string>;
  badge: Record<string, string>;
  alert: Record<string, string>;
}

export interface ThemeState {
  themes: Theme[];
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  activeThemeId: string;
  error: Error | null;
  isLoading: boolean;
}

export enum ThemeEffect {
  NONE = 'none',
  GRADIENT = 'gradient',
  GLOW = 'glow',
  BLUR = 'blur',
  NOISE = 'noise',
  GRID = 'grid',
  DOTS = 'dots',
  WAVES = 'waves',
}

export interface ThemeLogDetails {
  themeId: string;
  action: string;
  timestamp: string;
}

export type ThemeToken = {
  name: string;
  value: string;
  type: string;
  description?: string;
};

/**
 * Layout types
 */
export interface LayoutComponentProps {
  children: React.ReactNode;
}
