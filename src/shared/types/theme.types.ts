
import { ThemeLogDetails } from '@/shared/types/shared.types';

// Theme status enum
export enum ThemeStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}

// Theme context enum
export enum ThemeContext {
  SITE = 'SITE',
  ADMIN = 'ADMIN',
  APP = 'APP'
}

// Theme base interface
export interface Theme {
  id: string;
  name: string;
  description?: string;
  status: ThemeStatus;
  context: ThemeContext;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  variables?: Record<string, string>;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Theme token interface
export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
}

// Design tokens interface
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

// Component tokens interface
export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

// Theme state interface
export interface ThemeState {
  themes: Theme[];
  activeThemeId: string | null;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading: boolean;
  error: string | null;
}
