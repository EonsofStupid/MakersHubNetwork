
import { 
  Theme as SharedTheme, 
  ThemeEffect as SharedThemeEffect,
  ThemeComponent as SharedThemeComponent,
  ThemeEffectType
} from '@/shared/types/shared.types';

export type Theme = SharedTheme;
export type ThemeEffect = SharedThemeEffect;
export type ThemeComponent = SharedThemeComponent;
export { ThemeEffectType };

export interface ThemeToken {
  id: string;
  token_name: string;
  token_value: string;
  category: string;
  description?: string;
}

export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}
