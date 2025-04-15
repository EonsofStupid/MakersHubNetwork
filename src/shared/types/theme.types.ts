
import { ThemeEffectType } from './shared.types';

// Theme effect interface
export interface ThemeEffect {
  type: ThemeEffectType;
  intensity?: number;
  enabled: boolean;
}

// Theme component tokens
export interface ComponentTokens {
  [componentName: string]: Record<string, string>;
}

// Theme interface
export interface Theme {
  id: string;
  name: string;
  tokens: Record<string, string>;
  components?: ComponentTokens;
}

export interface ThemeToken {
  name: string;
  value: string;
  category: string;
}

export interface ThemeComponent {
  name: string;
  tokens: Record<string, string>;
}

// Re-exporting for backward compatibility
export type { ThemeEffect, ComponentTokens, Theme, ThemeToken, ThemeComponent };
