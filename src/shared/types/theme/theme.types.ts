
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
  metadata?: Record<string, any>;
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
  effectColor?: string;
  effectSecondary?: string;
  effectTertiary?: string;
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

