
export enum ThemeStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
  PUBLISHED = 'published'
}

export enum ThemeContext {
  SITE = 'site',
  ADMIN = 'admin',
  CHAT = 'chat',
  USER = 'user'
}

export interface DesignTokens {
  colors?: Record<string, string>;
  typography?: any;
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

export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

export interface Theme {
  id: string;
  name: string;
  label?: string;
  description?: string;
  isDark: boolean;
  status?: ThemeStatus;
  context?: ThemeContext;
  variables?: Record<string, string>;
  designTokens?: DesignTokens;
  componentTokens?: ComponentTokens;
  metadata?: Record<string, any>;
}

export interface ThemeEffect {
  type: string;
  intensity: number;
  color?: string;
  enabled?: boolean;
  [key: string]: any;
}

export interface ThemeState {
  activeThemeId: string | null;
  isDark: boolean;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  designTokens: DesignTokens;
  componentTokens: ComponentTokens;
  isLoading?: boolean;
  error?: string | null;
  themes?: Theme[];
  theme?: Theme | null;
  isLoaded?: boolean;
  variables?: Record<string, string>;
  componentStyles?: Record<string, Record<string, string>>;
  animations?: Record<string, any>;
  effects: ThemeEffect[];
}

export interface ThemeStoreActions {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  setEffects: (effects: ThemeEffect[]) => void;
  setVariables: (variables: Record<string, string>) => void;
}
