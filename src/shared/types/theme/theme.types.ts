
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
  effectColor?: string;
  effectSecondary?: string;
  effectTertiary?: string;
  [key: string]: string | undefined; // Add index signature for flexible theme variables
}

export interface Theme {
  id: string;
  name: string;
  description?: string;
  isDark?: boolean;
  status: 'active' | 'draft' | 'archived';
  context: 'site' | 'admin' | 'app' | 'chat';
  variables: ThemeVariables;
  designTokens: DesignTokens;
  componentTokens?: ComponentTokens;
  isSystem?: boolean;
  tokens?: ThemeToken[];
  components?: ThemeComponent[];
}

export interface ThemeToken {
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
}

export interface ThemeComponent {
  component_name: string;
  styles: Record<string, any>;
  context?: string;
  description?: string;
}

export interface DesignTokens {
  colors: Record<string, string>;
  typography?: Record<string, any>;
  spacing?: Record<string, string>;
  animations?: Record<string, string>;
  [key: string]: Record<string, any> | undefined;
}

export interface ComponentTokens {
  [key: string]: Record<string, any>;
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
  variables: ThemeVariables;
  theme: Theme | null;
  isLoaded: boolean;
  animations?: Record<string, string>;
}

export interface ThemeStoreActions {
  setThemes: (themes: Theme[]) => void;
  setActiveTheme: (themeId: string) => void;
  setDesignTokens: (tokens: DesignTokens) => void;
  setComponentTokens: (tokens: ComponentTokens) => void;
  fetchThemes: () => Promise<void>;
  createTheme: (theme: Theme) => Promise<void>;
  updateTheme: (theme: Theme) => Promise<void>;
  deleteTheme: (themeId: string) => Promise<void>;
  resetTheme: () => void;
}
