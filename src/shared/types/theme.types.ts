
import { LogDetails } from "./shared.types";

/**
 * Theme status enum
 */
export enum ThemeStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  ACTIVE = 'active',
}

/**
 * Theme context enum
 */
export enum ThemeContext {
  SITE = 'site',
  ADMIN = 'admin',
  CHAT = 'chat',
}

/**
 * Theme effect enum
 */
export enum ThemeEffect {
  NONE = 'none',
  BLUR = 'blur',
  GRAIN = 'grain',
  NOISE = 'noise',
  GLOW = 'glow',
  GLITCH = 'glitch',
  GRADIENT = 'gradient',
  CYBER = 'cyber',
  PULSE = 'pulse',
  PARTICLE = 'particle',
}

/**
 * Theme log details interface that extends LogDetails
 */
export interface ThemeLogDetails extends LogDetails {
  themeName?: string;
  cssVarsCount?: number;
  error?: string;
  [key: string]: any;
}

/**
 * Design token types
 */
export interface ColorToken {
  value: string;
  description?: string;
}

export interface SpacingToken {
  value: string;
  description?: string;
}

export interface TypographyToken {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  description?: string;
}

export interface EffectToken {
  value: string;
  description?: string;
}

export interface BorderToken {
  width?: string;
  style?: string;
  radius?: string;
  color?: string;
  description?: string;
}

/**
 * Design tokens interface
 */
export interface DesignTokens {
  colors: Record<string, ColorToken>;
  spacing: Record<string, SpacingToken>;
  typography: Record<string, TypographyToken>;
  effects: Record<string, EffectToken>;
  borders: Record<string, BorderToken>;
  [key: string]: any;
}

/**
 * Component tokens interface
 */
export interface ComponentTokens {
  styles: Record<string, any>;
  [key: string]: any;
}

/**
 * Theme interface
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: ThemeStatus;
  context: ThemeContext;
  tokens?: DesignTokens;
  componentTokens?: ComponentTokens;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  parentThemeId?: string;
  metadata?: Record<string, any>;
  isDefault?: boolean;
}

/**
 * Theme state interface for the store
 */
export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
}

/**
 * Theme effect props interface
 */
export interface ThemeEffectProps {
  effect: ThemeEffect;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Theme effect provider props
 */
export interface ThemeEffectProviderProps {
  children: React.ReactNode;
  className?: string;
}
