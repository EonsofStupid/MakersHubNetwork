
import { ThemeEffectType } from '../shared.types';
import { ThemeEffect } from '../theme/effects.types';

export interface MorphEffect extends Omit<ThemeEffect, 'intensity'> {
  type: ThemeEffectType.MORPH;
  intensity: number; // Make it required, not optional
}

/**
 * Theme interface
 */
export interface Theme {
  id: string;
  name: string;
  description?: string;
  designTokens: DesignTokens;
  componentTokens?: ComponentTokens;
  version: number;
  status: ThemeStatus;
  isSystem?: boolean;
  isDefault?: boolean;
  context: ThemeContext;
}

/**
 * Theme status options
 */
export type ThemeStatus = 'draft' | 'published' | 'archived';

/**
 * Theme context options (scope)
 */
export type ThemeContext = 'site' | 'admin' | 'app' | 'chat';

/**
 * Design tokens map
 */
export interface DesignTokens {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  shadows: Record<string, string>;
  radii: Record<string, string>;
  zIndices: Record<string, string | number>;
  effects: Record<string, ThemeEffect>;
  [key: string]: Record<string, any>;
}

/**
 * Component tokens map
 */
export interface ComponentTokens {
  button?: Record<string, any>;
  card?: Record<string, any>;
  input?: Record<string, any>;
  modal?: Record<string, any>;
  [key: string]: Record<string, any> | undefined;
}

/**
 * Theme token structure
 */
export interface ThemeToken {
  token_name: string;
  token_value: string;
  name?: string;
  value?: string;
  category: string;
  fallback_value?: string;
  description?: string;
}

/**
 * Theme variables structure
 */
export interface ThemeVariables {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  radii: Record<string, string>;
  shadows: Record<string, string>;
  [key: string]: Record<string, string>;
}

/**
 * Theme component structure
 */
export interface ThemeComponent {
  id: string;
  component_name: string;
  styles: Record<string, any>;
  context: ThemeContext;
  description?: string;
  theme_id?: string;
}

/**
 * Theme store state
 */
export interface ThemeState {
  activeTheme: Theme | null;
  themes: Theme[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

/**
 * Theme store actions
 */
export interface ThemeStoreActions {
  setActiveTheme: (theme: Theme) => void;
  setThemes: (themes: Theme[]) => void;
  addTheme: (theme: Theme) => void;
  updateTheme: (id: string, updates: Partial<Theme>) => void;
  removeTheme: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initialize: () => Promise<void>;
}
