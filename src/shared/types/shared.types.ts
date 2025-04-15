
/**
 * Core type definitions for the entire application
 * This is the single source of truth for common types
 */

// Role definitions as const enum
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

// User Profile
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
  bio?: string;
}

// Auth status
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
  ERROR: AuthStatus.ERROR
} as const;

// Auth event types
export enum AuthEventType {
  SIGNED_IN = 'SIGNED_IN',
  SIGNED_OUT = 'SIGNED_OUT',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  USER_UPDATED = 'USER_UPDATED',
  PASSWORD_RECOVERY = 'PASSWORD_RECOVERY',
  LINKED_ACCOUNT = 'LINKED_ACCOUNT'
}

// Log categories
export enum LogCategory {
  AUTH = 'auth',
  RBAC = 'rbac',
  API = 'api',
  UI = 'ui',
  SYSTEM = 'system',
  APP = 'app',
  ADMIN = 'admin',
  CHAT = 'chat',
  THEME = 'theme',
  DEBUG = 'debug'
}

// Log levels  
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  SUCCESS = 'success',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
  FATAL = 'fatal',
  TRACE = 'trace',
  SILENT = 'silent'
}

// Add log level values for easy comparison
export const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  [LogLevel.TRACE]: -1,
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.SUCCESS]: 2,
  [LogLevel.WARN]: 3,
  [LogLevel.ERROR]: 4,
  [LogLevel.CRITICAL]: 5,
  [LogLevel.FATAL]: 6,
  [LogLevel.SILENT]: 100
};

// Permission type from RBAC permissions
export type Permission = string;

// RBAC role groupings for easier checks
export const RBAC = {
  ADMIN_ONLY: [UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  SUPER_ADMINS: [UserRole.SUPER_ADMIN] as UserRole[],
  MODERATORS: [UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  BUILDERS: [UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[],
  AUTHENTICATED: [UserRole.USER, UserRole.MODERATOR, UserRole.BUILDER, UserRole.ADMIN, UserRole.SUPER_ADMIN] as UserRole[]
};

// Logging interfaces
export interface LogDetails {
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
  category?: LogCategory | LogCategory[];
  from?: number | Date;
  to?: number | Date;
  search?: string;
  limit?: number;
  source?: string;
}

export interface LogTransport {
  log: (entry: LogEntry) => void;
  clear?: () => void;
  setMinLevel: (level: LogLevel) => void;
}

// Theme related types
export enum ThemeEffectType {
  NONE = 'none',
  BLUR = 'blur',
  GRAIN = 'grain',
  GLITCH = 'glitch',
  NOISE = 'noise',
  GRADIENT = 'gradient',
  CYBER = 'cyber',
  NEON = 'neon',
  PULSE = 'pulse',
  PARTICLE = 'particle',
  MORPH = 'morph',
  GLOW = 'glow',
  SHADOW = 'shadow'
}

export interface ThemeEffect {
  id?: string;
  type: ThemeEffectType;
  enabled: boolean;
  intensity?: number;
  color?: string;
  duration?: number;
  delay?: number;
  selector?: string;
  config?: Record<string, unknown>;
}

export interface Theme {
  id: string;
  name: string;
  label?: string;
  description?: string;
  isDark?: boolean;
  status: 'active' | 'draft' | 'archived';
  context: 'site' | 'admin' | 'app' | 'chat';
  variables: {
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
    effectColor?: string;
    effectSecondary?: string;
    effectTertiary?: string;
    transitionFast?: string;
    transitionNormal?: string;
    transitionSlow?: string;
    animationFast?: string;
    animationNormal?: string;
    animationSlow?: string;
    radiusSm?: string;
    radiusMd?: string;
    radiusLg?: string;
    radiusFull?: string;
    [key: string]: string | undefined;
  };
  designTokens: DesignTokens;
  componentTokens?: ComponentTokens;
  tokens?: Array<ThemeToken | TokenWithKeyframes>;
  components?: Array<ThemeComponent>;
  isDefault?: boolean;
  isSystem?: boolean;
  version?: number;
}

export interface ThemeToken {
  name?: string;
  token_name: string;
  value?: string;
  token_value: string;
  type?: string;
  category: string;
  fallback_value?: string;
  description?: string;
}

export interface TokenWithKeyframes extends ThemeToken {
  type: 'animation';
  keyframes: string;
}

export interface ThemeComponent {
  id?: string;
  name?: string;
  component_name: string;
  styles?: Record<string, any>;
  tokens?: Record<string, any>;
  context?: string;
  description?: string;
  theme_id?: string;
}

export interface DesignTokens {
  colors: Record<string, string>;
  typography?: Record<string, any>;
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  shadows?: Record<string, string>;
  [key: string]: Record<string, any> | undefined;
}

export interface ComponentTokens {
  button?: Record<string, any>;
  card?: Record<string, any>;
  input?: Record<string, any>;
  modal?: Record<string, any>;
  [key: string]: Record<string, any> | undefined;
}

export interface ThemeLogDetails extends LogDetails {
  success?: boolean;
  error?: boolean;
  theme?: string;
  errorMessage?: string;
  details?: Record<string, unknown>;
}

// Theme store state
export interface ThemeStoreState {
  themes: Theme[];
  activeThemeId: string;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
  variables?: Record<string, string>;
  theme?: Theme;
  componentStyles?: Record<string, Record<string, string>>;
  animations?: Record<string, string>;
  isLoaded?: boolean;
}
