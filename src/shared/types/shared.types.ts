/**
 * Shared type definitions for the entire application
 */

/**
 * Role definitions
 */
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
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

export type Permission = keyof typeof PERMISSIONS | string;

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

// Additional RBAC policies for simpler usage
export const RBAC = {
  POLICIES: RBAC_POLICIES,
  ADMIN_ONLY: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  SUPER_ADMINS: [ROLES.SUPER_ADMIN],
  MODERATORS: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  BUILDERS: [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  AUTHENTICATED: [ROLES.USER, ROLES.BUILDER, ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
};

export const PATH_POLICIES = RBAC_POLICIES;

/**
 * Auth status enum
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
  bio?: string;
  roles?: UserRole[];
}

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
 * Log categories
 */
export enum LogCategory {
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  ADMIN = 'admin',
  DEBUG = 'debug',
  APP = 'app',
  CHAT = 'chat',
}

/**
 * Log levels
 */
export enum LogLevel {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
  CRITICAL = 'critical',
  SILENT = 'silent',
}

/**
 * Log entry type
 */
export interface LogEntry {
  id?: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  timestamp: Date;
  source?: string;
  details?: Record<string, any>;
  tags?: string[];
}

/**
 * Log event type
 */
export interface LogEvent {
  entry: LogEntry;
}

/**
 * Log details
 */
export interface LogDetails {
  source?: string;
  tags?: string[];
  [key: string]: any;
}

/**
 * Log filter type
 */
export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  source?: string;
  search?: string;
  from?: Date;
  to?: Date;
}

/**
 * Log level values for comparison
 */
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: 0,
  [LogLevel.DEBUG]: 1,
  [LogLevel.INFO]: 2,
  [LogLevel.SUCCESS]: 3,
  [LogLevel.WARN]: 4,
  [LogLevel.ERROR]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.CRITICAL]: 7,
  [LogLevel.SILENT]: 8,
};

// Re-export for backward compatibility
export const LOG_LEVEL = LogLevel;
export const LOG_CATEGORY = LogCategory;
export const AUTH_STATUS = AuthStatus;

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
  version: number;
  tokens?: ThemeToken[];
  components?: ThemeComponent[];
  variables?: Record<string, string>;
  created_by?: string | null;
  published_at?: string | null;
  parent_theme_id?: string | null;
}

export interface ThemeToken {
  name: string;
  token_name?: string;
  token_value?: string;
  value: string;
  type: string;
  description?: string;
  keyframes?: string;
}

export interface ThemeComponent {
  id: string;
  component_name: string;
  styles: Record<string, any>;
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
  activeThemeId: string;
  designTokens?: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  theme?: Theme;
  variables?: Record<string, string>;
  componentStyles?: Record<string, any>;
  isLoaded?: boolean;
  tokens?: ThemeToken[];
}

/**
 * Theme effect
 */
export enum ThemeEffectType {
  NONE = 'none',
  GRADIENT = 'gradient',
  GLOW = 'glow',
  BLUR = 'blur',
  NOISE = 'noise',
  GRID = 'grid',
  DOTS = 'dots',
  WAVES = 'waves',
  NEON = 'neon',
  SHADOW = 'shadow',
  PULSE = 'pulse',
  PARTICLE = 'particle',
}

/**
 * Theme log details
 */
export interface ThemeLogDetails {
  themeId: string;
  action: string;
  timestamp: string;
  theme?: string;
  cssVarsCount?: number;
  error?: string;
  userId?: string;
  previousValue?: any;
  newValue?: any;
  component?: string;
}

/**
 * Layout types
 */
export interface LayoutComponentProps {
  children: React.ReactNode;
}

/**
 * User type
 */
export interface User {
  id: string;
  email: string;
  app_metadata?: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
  role?: UserRole;
  roles?: UserRole[];
}

/**
 * Build related types
 */
export enum BuildStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface BuildPart {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  inventory: number;
  category: string;
}

export interface BuildMod {
  id: string;
  name: string;
  description: string;
  compatibility: string[];
  price: number;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Re-export for backward compatibility
export const AUTH_STATUS = AuthStatus;
export const RBAC = {
  POLICIES: RBAC_POLICIES
};
