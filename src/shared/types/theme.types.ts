
import { ThemeEffect } from './theme/effects';

/**
 * Theme token type
 */
export type TokenType = 'color' | 'spacing' | 'typography' | 'shadow' | 'border' | 'gradient' | 'animation';

/**
 * Theme token definition
 */
export interface ThemeToken {
  value: string;
  type: TokenType;
  description?: string;
  keyframes?: string;
  category?: string;
}

/**
 * Theme tokens by category
 */
export interface DesignTokens {
  colors: Record<string, ThemeToken>;
  spacing?: Record<string, ThemeToken>;
  typography?: Record<string, ThemeToken>;
  effects?: Record<string, ThemeToken>;
  borders?: Record<string, ThemeToken>;
  [key: string]: Record<string, ThemeToken> | undefined;
}

/**
 * Component token definition
 */
export interface ComponentToken {
  styles: Record<string, string>;
  variants?: Record<string, Record<string, string>>;
  states?: Record<string, Record<string, string>>;
}

/**
 * Component tokens
 */
export interface ComponentTokens {
  styles: Record<string, ComponentToken>;
}

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
 * Theme definition
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: ThemeStatus;
  context: ThemeContext;
  tokens: Record<string, ThemeToken>;
  components?: Record<string, ComponentToken>;
  designTokens?: DesignTokens;
  componentTokens?: ComponentTokens;
}

/**
 * Theme state
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
 * Theme log details for logger service
 */
export interface ThemeLogDetails {
  themeName?: string;
  cssVarsCount?: number;
  error?: string;
  [key: string]: any;
}

/**
 * Re-export ThemeEffect for consistency
 */
export { ThemeEffect };
