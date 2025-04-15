
/**
 * Core shared types for the application
 * This file serves as the single source of truth for commonly used types
 */

// ===== Role Definitions =====
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  MODERATOR = 'moderator',
  BUILDER = 'builder',
  GUEST = 'guest'
}

// For backwards compatibility
export const ROLES = {
  USER: UserRole.USER,
  ADMIN: UserRole.ADMIN,
  SUPER_ADMIN: UserRole.SUPER_ADMIN,
  MODERATOR: UserRole.MODERATOR,
  BUILDER: UserRole.BUILDER,
  GUEST: UserRole.GUEST
} as const;

// Path policy definitions for RBAC
export const RBAC_POLICIES = {
  '/admin': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/admin/users': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/admin/roles': [UserRole.SUPER_ADMIN],
  '/admin/permissions': [UserRole.SUPER_ADMIN],
  '/admin/analytics': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/create': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/edit': [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  '/projects/delete': [UserRole.ADMIN, UserRole.SUPER_ADMIN],
} as const;

export type PATH_POLICIES = typeof RBAC_POLICIES;

// RBAC helper constants
export const RBAC = {
  ADMIN_ONLY: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  SUPER_ADMINS: [UserRole.SUPER_ADMIN],
  MODERATORS: [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  BUILDERS: [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  AUTHENTICATED: [UserRole.USER, UserRole.MODERATOR, UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN],
};

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
  | 'view_analytics'
  | 'admin:view'
  | 'admin:edit'
  | 'admin:delete'
  | 'user:view'
  | 'user:edit'
  | 'user:delete'
  | 'content:view'
  | 'content:edit'
  | 'content:delete'
  | 'settings:view'
  | 'settings:edit';

// ===== Auth Status =====
export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
  ERROR = 'error'
}

// For backwards compatibility
export const AUTH_STATUS = {
  IDLE: AuthStatus.IDLE,
  LOADING: AuthStatus.LOADING,
  AUTHENTICATED: AuthStatus.AUTHENTICATED,
  UNAUTHENTICATED: AuthStatus.UNAUTHENTICATED,
  ERROR: AuthStatus.ERROR,
} as const;

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
  bio?: string;
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
  FATAL = 'fatal',
  SILENT = 'silent'
}

export enum LogCategory {
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  ADMIN = 'admin',
  THEME = 'theme',
  DEBUG = 'debug',
  APP = 'app',
  CHAT = 'chat'
}

// For backwards compatibility
export const LOG_LEVEL = {
  DEBUG: LogLevel.DEBUG,
  INFO: LogLevel.INFO,
  WARN: LogLevel.WARN,
  ERROR: LogLevel.ERROR,
  CRITICAL: LogLevel.CRITICAL,
  TRACE: LogLevel.TRACE,
  SUCCESS: LogLevel.SUCCESS,
  FATAL: LogLevel.FATAL,
  SILENT: LogLevel.SILENT
};

export const LOG_CATEGORY = {
  AUTH: LogCategory.AUTH,
  RBAC: LogCategory.RBAC,
  API: LogCategory.API,
  UI: LogCategory.UI,
  SYSTEM: LogCategory.SYSTEM,
  ADMIN: LogCategory.ADMIN,
  THEME: LogCategory.THEME,
  DEBUG: LogCategory.DEBUG,
  APP: LogCategory.APP,
  CHAT: LogCategory.CHAT
};

export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.SUCCESS]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.CRITICAL]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.TRACE]: -1,
  [LogLevel.SILENT]: 100
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
  from?: Date | number;
  to?: Date | number;
}

export interface LogTransport {
  log: (entry: LogEntry) => void;
  setMinLevel: (level: LogLevel) => void;
  name?: string;
  clear?: () => void;
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

export interface ThemeLogDetails extends LogDetails {
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
  destructiveForeground: string;
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
  id?: string;
  name: string;
  component_name?: string;
  tokens: Record<string, string>;
  styles?: Record<string, string>;
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
  tokens?: ThemeToken[];
  components?: ThemeComponent[];
}

export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  theme?: Theme | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor?: string;
  borderColor?: string;
  fontFamily?: string;
  cornerRadius?: number;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  componentStyles?: Record<string, any>;
  animations?: Record<string, any>;
  variables?: ThemeVariables | Record<string, string>;
  isLoaded?: boolean;
}

export interface ThemeStoreActions {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  loadTheme?: (themeId: string) => Promise<void>;
}

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  name?: string;
  value?: string;
  type?: string;
  category: string;
  description?: string;
  keyframes?: string;
  fallback_value?: string;
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
