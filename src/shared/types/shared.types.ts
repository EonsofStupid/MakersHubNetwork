
/**
 * Core shared types for the application
 * This file serves as the single source of truth for commonly used types
 */

// ===== Role Definitions =====
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  MODERATOR: 'moderator',
  BUILDER: 'builder',
  GUEST: 'guest'
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// Path policy definitions for RBAC
export const RBAC_POLICIES: Record<string, UserRole[]> = {
  '/admin': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/users': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/admin/roles': [ROLES.SUPER_ADMIN],
  '/admin/permissions': [ROLES.SUPER_ADMIN],
  '/admin/analytics': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/create': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/edit': [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  '/projects/delete': [ROLES.ADMIN, ROLES.SUPER_ADMIN],
};

// RBAC helper constants
export const RBAC = {
  ADMIN_ONLY: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  SUPER_ADMINS: [ROLES.SUPER_ADMIN],
  MODERATORS: [ROLES.MODERATOR, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  BUILDERS: [ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
  AUTHENTICATED: [ROLES.USER, ROLES.MODERATOR, ROLES.BUILDER, ROLES.ADMIN, ROLES.SUPER_ADMIN],
};

export type PATH_POLICIES = typeof RBAC_POLICIES;

// ===== Permission Definitions =====
export type Permission =
  | 'create_project'
  | 'edit_project'
  | 'delete_project'
  | 'submit_build'
  | 'access_admin'
  | 'manage_api_keys'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_permissions'
  | 'view_analytics';

// ===== Auth Status =====
export const AUTH_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
  ERROR: 'error',
} as const;

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];

export enum AuthEventType {
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  USER_UPDATED = 'USER_UPDATED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY'
}

// ===== User Profile =====
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  roles?: UserRole[];
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  user_metadata?: Record<string, unknown>;
}

export interface UserInfo {
  id: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

// ===== Logging System =====
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  TRACE = 'trace',
  SUCCESS = 'success',
  FATAL = 'fatal'
}

export const LOG_LEVEL = {
  DEBUG: LogLevel.DEBUG,
  INFO: LogLevel.INFO,
  WARN: LogLevel.WARN,
  ERROR: LogLevel.ERROR,
  CRITICAL: LogLevel.CRITICAL,
  TRACE: LogLevel.TRACE,
  SUCCESS: LogLevel.SUCCESS,
  FATAL: LogLevel.FATAL
};

export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.SUCCESS]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.CRITICAL]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.TRACE]: -1
};

export enum LogCategory {
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  ADMIN = 'admin',
  THEME = 'theme',
  DEBUG = 'debug'
}

export const LOG_CATEGORY = {
  AUTH: LogCategory.AUTH,
  RBAC: LogCategory.RBAC,
  API: LogCategory.API,
  UI: LogCategory.UI,
  SYSTEM: LogCategory.SYSTEM,
  ADMIN: LogCategory.ADMIN,
  THEME: LogCategory.THEME,
  DEBUG: LogCategory.DEBUG
};

export interface LogDetails {
  source?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface LogEntry {
  id: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  timestamp: number;
  details?: LogDetails;
  source?: string;
}

export interface LogEvent {
  entry: LogEntry;
}

export interface LogFilter {
  level?: LogLevel;
  category?: LogCategory;
  search?: string;
  startTime?: number;
  endTime?: number;
  source?: string;
}

// ===== Theme System =====
export enum ThemeEffectType {
  NONE = 'none',
  BLUR = 'blur',
  GRAIN = 'grain',
  NOISE = 'noise',
  GLOW = 'glow',
  GLITCH = 'glitch',
  GRADIENT = 'gradient',
  CYBER = 'cyber',
  NEON = 'neon',
  PULSE = 'pulse',
  PARTICLE = 'particle',
  MORPH = 'morph',
  SHADOW = 'shadow'
}

export interface ThemeEffect {
  type: ThemeEffectType;
  enabled: boolean;
  intensity?: number;
  color?: string;
  duration?: number;
  delay?: number;
  selector?: string;
  config?: Record<string, any>;
  id?: string;
  [key: string]: any;
}

export interface ThemeLogDetails {
  theme?: string;
  themeId?: string;
  success?: boolean;
  error?: string | Error;
  errorMessage?: string;
  details?: Record<string, unknown>;
  source?: string;
  tags?: string[];
}

export enum ThemeStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

export enum ThemeContext {
  SITE = 'site',
  ADMIN = 'admin',
  APP = 'app'
}

export interface ThemeVariables {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  
  // Effect-specific colors
  effectColor: string;
  effectSecondary: string;
  effectTertiary: string;
  
  // Transition times
  transitionFast: string;
  transitionNormal: string;
  transitionSlow: string;
  animationFast: string;
  animationNormal: string;
  animationSlow: string;
  
  // Border radii
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusFull: string;
}

export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: Record<string, any>;
  spacing?: Record<string, string>;
  borders?: Record<string, string>;
  shadows?: Record<string, string>;
  radii?: Record<string, string>;
  zIndices?: Record<string, string>;
  breakpoints?: Record<string, string>;
  transitions?: Record<string, string>;
  animations?: Record<string, any>;
  [key: string]: any;
}

export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  card: string;
  cardForeground: string;
  destructive: string;
  destructiveForeg: string;
  border: string;
  input: string;
  ring: string;
  [key: string]: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
  [key: string]: string;
}

export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

export interface ThemeComponent {
  name: string;
  tokens: Record<string, string>;
  variants?: Record<string, Record<string, string>>;
}

export interface Theme {
  id: string;
  name: string;
  label: string;
  description?: string;
  isDark: boolean;
  status: ThemeStatus;
  context: ThemeContext;
  variables: ThemeVariables;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
}

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
}

// ===== Build System =====
export enum BuildStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_REVIEW = 'in_review'
}

export interface BuildPart {
  id: string;
  part_id: string;
  build_id: string;
  quantity: number;
  notes?: string;
}

export interface BuildMod {
  id: string;
  name: string;
  description?: string;
  complexity?: number;
  build_id: string;
  status?: string;
}

// ===== Base Entity =====
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}
