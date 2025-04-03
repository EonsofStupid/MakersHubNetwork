export interface Theme {
  id: string;
  name: string;
  description?: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  effects: ThemeEffects;
  components: ThemeComponents;
  context: ThemeContext;
}

export type ThemeContext = 'site' | 'admin' | 'chat';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  foreground: string;
  accent?: string;
  muted?: ThemeColor;
  card?: ThemeColor;
  border?: string;
  [key: string]: any;
}

export interface ThemeColor {
  background?: string;
  foreground?: string;
  [key: string]: any;
}

export interface ThemeTypography {
  fontFamily?: {
    body?: string;
    heading?: string;
    mono?: string;
  };
  fontSize?: {
    xs?: string;
    sm?: string;
    base?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
  };
  fontWeight?: {
    light?: number;
    normal?: number;
    medium?: number;
    bold?: number;
  };
}

export interface ThemeEffects {
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
  };
  gradients?: {
    primary?: string;
    secondary?: string;
  };
  animations?: {
    duration?: {
      fast?: string;
      normal?: string;
      slow?: string;
    };
    keyframes?: Record<string, string>;
  };
}

export interface ThemeComponents {
  button?: ComponentTokens;
  card?: ComponentTokens;
  input?: ComponentTokens;
  nav?: ComponentTokens;
  userMenu?: ComponentTokens;
  adminPanel?: ComponentTokens;
  [key: string]: ComponentTokens | undefined;
}

export interface ComponentTokens {
  base?: string;
  variants?: Record<string, string>;
  sizes?: Record<string, string>;
  [key: string]: any;
}

export interface ThemeToken {
  id: string;
  path: string;
  value: string;
  theme_id: string;
  context: ThemeContext;
}

export interface ThemeOptions {
  context?: ThemeContext;
  defaultTheme?: string;
}
