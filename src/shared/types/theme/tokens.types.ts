
import { ThemeVariables } from './theme.types';

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

export interface ThemeToken {
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
}
